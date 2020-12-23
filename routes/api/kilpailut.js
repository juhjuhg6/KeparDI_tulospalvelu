const express = require('express')
const router = express.Router()

const Kausi = require('../../models/kausi.js')
const Kilpailija = require('../../models/kilpailija.js')
const lähetäVastaus = require('./vastaus.js')

const handleError = function (err, res, message) {
  console.log('\n', message)
  console.log(err)
  res.status(500).send(message)
}

const haeKilpailijatJaJärjestäjät = function(kilpailu, seuraava) {
  let kilpailijaIdt = []
  kilpailu.sarjat.forEach(sarja => kilpailijaIdt = kilpailijaIdt.concat(sarja.kilpailijat))

  let vastaus = {}

  Kilpailija.find({'_id': {$in: kilpailijaIdt}}, (err, kilpailijat) => {
    if (err) return vastaus = false

    kilpailijat.forEach(kilpailija => {
      // jätetään vastausta varten kilpailuihin vain kyseinen kilpailu
      const kilpailudata = kilpailija.kilpailut.get(kilpailu._id.toString())
      kilpailija.kilpailut.clear()
      kilpailija.kilpailut.set(kilpailu._id.toString(), kilpailudata)
    })

    vastaus.kilpailijat = kilpailijat

    Kilpailija.find({'_id': {$in: kilpailu.jarjestajat}}, (err, järjestäjät) => {
      if (err) return vastaus = false

      järjestäjät.forEach(järjestäjä => {
        // jätetään vastausta varten kilpailuihin vain kyseinen kilpailu
        const kilpailudata = järjestäjä.kilpailut.get(kilpailu._id.toString())
        järjestäjä.kilpailut.clear()
        järjestäjä.kilpailut.set(kilpailu._id.toString(), kilpailudata)
      })

      vastaus.järjestäjät = järjestäjät

      seuraava(vastaus)
    })
  })
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
router.post('/:kausiId', (req, res) => {
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
router.put('/:kausiId/:kilpailuId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe muokatessa kilpailua.')
    
    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
    if (!kilpailu) return handleError(err, res, 'Virheellinen kilpailijaId.')

    if (req.body.nimi) {
      if (!kausi.kilpailut.some(k => k.nimi === req.body.nimi)) {
        kilpailu.nimi = req.body.nimi
      }
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

      // muutetaan kilpailijoiden lähtöajat vastaamaan uutta päivämäärää
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
          if (!kilpailudata.lahtoaika) {
            päivitäLähtoaika(i+1)
          }
          kilpailudata.lahtoaika = kilpailudata.lahtoaika.getTime() + pvmErotus
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
router.delete('/:kausiId/:kilpailuId', (req, res) => {
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