const express = require('express')
const router = express.Router()

const authorize = require('../../authorize.js')
const Kausi = require('../../models/kausi.js')
const Kilpailija = require('../../models/kilpailija.js')
const lähetäVastaus = require('./vastaus.js')

const handleError = function (err, res, message) {
  console.log('\n', message)
  console.log(err)
  res.status(500).send(message)
}

// hae kilpailu
router.get('/:kausiId/:kilpailuId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe haettaessa kilpailua.')

    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
    if (!kilpailu) return handleError(err, res, 'Virheellinen kilpailuId.')
    
    lähetäVastaus(JSON.parse(JSON.stringify(kilpailu)), res)
  })
})

// luo uusi kilpailu
router.post('/:kausiId', authorize, (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe luotaessa uutta kilpailua.')
    
    if (kausi.kilpailut.some(kilpailu => kilpailu.nimi === req.body.nimi)) {
      res.status(400).send('Nimi käytetty jo toisessa kilpailussa. Valitse toinen nimi.')
      return
    }

    kausi.kilpailut.push(req.body)

    kausi.save(err => {
      if (err) return handleError(err, res, 'Virhe luotaessa uutta kilpailua.')

      lähetäVastaus(JSON.parse(JSON.stringify(kausi.kilpailut[kausi.kilpailut.length-1])), res)
    })
  })
})

// muokkaa kilpailua
router.put('/:kausiId/:kilpailuId', authorize, (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe muokatessa kilpailua.')
    
    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
    if (!kilpailu) return handleError(err, res, 'Virheellinen kilpailijaId.')

    if (req.body.nimi) {
      if (!kausi.kilpailut.some(k => k.nimi === req.body.nimi)) {
        kilpailu.nimi = req.body.nimi
      }
    }

    if (req.body.ilmoittautuminenDl) {
      kilpailu.ilmoittautuminenDl = req.body.ilmoittautuminenDl
    }

    if (typeof req.body.cupOsakilpailu === 'boolean') {
      kilpailu.cupOsakilpailu = req.body.cupOsakilpailu
      kilpailu.tuloksiaMuutettuViimeksi = new Date()
    }

    if (typeof req.body.sijoituksetPisteidenPerusteella === 'boolean') {
      kilpailu.sijoituksetPisteidenPerusteella = req.body.sijoituksetPisteidenPerusteella
    }

    const tallenna = function () {
      kausi.save(err => {
        if (err) return handleError(err, res, 'Virhe muokatessa kilpailua.')

        lähetäVastaus(JSON.parse(JSON.stringify(kilpailu)), res)
      })
    }

    if (req.body.pvm) {
      const vanhaPvm = kilpailu.pvm
      kilpailu.pvm = req.body.pvm

      // muutetaan maaliintulot vastaamaan uutta päivämäärää
      kilpailu.maaliintulot.forEach(maaliintulo => {
        if (maaliintulo.maaliintuloaika) {
          let uusiPvm = new Date()
          uusiPvm.setTime(Date.parse(req.body.pvm))
          let pvmErotus = uusiPvm - vanhaPvm

          maaliintulo.maaliintuloaika = maaliintulo.maaliintuloaika.getTime() + pvmErotus
        }
      })

      // muutetaan kilpailijoiden lähtöajat ja maaliajat vastaamaan uutta päivämäärää
      let kilpailijaIdt = []
      kilpailu.sarjat.forEach(sarja => kilpailijaIdt = kilpailijaIdt.concat(sarja.kilpailijat))

      Kilpailija.find({'_id': {$in: kilpailijaIdt}}, (err, kilpailijat) => {
        if (err) return handleError(err, res, 'Virhe päivittäessä kilpailijoiden lähtöaikoja.')

        const päivitäLähtoaika = function (i) {
          let kilpailija = kilpailijat[i]
          if (!kilpailija) {
            return tallenna()
          }
          
          let uusiPvm = new Date()
          uusiPvm.setTime(Date.parse(req.body.pvm))
          let pvmErotus = uusiPvm - vanhaPvm

          let kilpailudata = kilpailija.kilpailut.get(kilpailu._id.toString())
          if (kilpailudata.lahtoaika) {
            kilpailudata.lahtoaika = kilpailudata.lahtoaika.getTime() + pvmErotus
          }
          if (kilpailudata.maaliaika) {
            kilpailudata.maaliaika = kilpailudata.maaliaika.getTime() + pvmErotus
          }
          kilpailija.kilpailut.set(kilpailu._id.toString(), kilpailudata)
          
          kilpailija.save(err => {
            if (err) return handleError(err, res, 'Virhe päivitettäessä lähtöaikoja.')

            päivitäLähtoaika(i+1)
          })
        }

        päivitäLähtoaika(0)
      })
    } else {
      tallenna()
    }
  })
})

// poista kilpailu
router.delete('/:kausiId/:kilpailuId', authorize, (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe poistettaessa kilpailua.')

    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
    if (!kilpailu) return handleError(err, res, 'Virheellinen kilpailuId.')

    // poista tulokset kilpailijoilta
    let kilpailijaIdt = []
    kilpailu.sarjat.forEach(sarja => kilpailijaIdt = kilpailijaIdt.concat(sarja.kilpailijat))
    Kilpailija.find({_id: {$in: kilpailijaIdt}}, (err, kilpailijat) => {
      if (err) return handleError(err, res, 'Virhe poistettaessa kilpailun tuloksia kilpailijoilta.')

      kilpailijat.forEach(kilpailija => kilpailija.kilpailut.delete(kilpailu._id))
    })

    kilpailu.remove()

    kausi.save(err => {
      if (err) return handleError(err, res, 'Virhe poistettaessa kilpailua.')

      res.json(kausi)
    })
  })
})

module.exports = router