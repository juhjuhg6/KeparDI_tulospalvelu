const express = require('express')
const router = express.Router()

const Kausi = require('../../models/kausi.js')

const handleError = function (err, res, message) {
  console.log('\n', message)
  console.log(err)
  res.status(500).send(message)
}

// hae kauden kilpailujen nimet
router.get('/:kausiId/nimet', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe haettaessa kausien nimiä.')
    
    let kilpailujenNimet = []
    kausi.kilpailut.forEach(kilpailu => kilpailujenNimet.push({id: kilpailu._id, nimi: kilpailu.nimi, pvm: kilpailu.pvm}))
    res.json(kilpailujenNimet)
  })
})

// hae kilpailu
router.get('/:kausiId/:kilpailuId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe haettaessa kilpailua.')
    
    res.json(kausi.kilpailut.id(req.params.kilpailuId))
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

    kausi.tuloksiaPaivitettyViimeksi = new Date()

    kausi.save(err => {
      if (err) return handleError(err, res, 'Virhe luotaessa uutta kilpailua.')

      res.json(kausi)
    })
  })
})

// muokkaa kilpailua
router.put('/:kausiId/:kilpailuId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe muokatessa kilpailua.')
    
    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)

    if (req.body.nimi) {
      if (!kausi.kilpailut.some(k => k.nimi === req.body.nimi)) {
        kilpailu.nimi = req.body.nimi
      }
    }

    if (req.body.pvm) {
      kilpailu.pvm = req.body.pvm
    }

    if (req.body.sarjat) {
      req.body.sarjat.forEach(sarja => {
        if (sarja.id) {
          if (sarja.poista) {
            kilpailu.sarjat.id(sarja.id).remove()
          } else {
            // muokkaa sarjaa
            const s = kilpailu.sarjat.id(sarja.id)
            if (sarja.nimi) {
              s.nimi = sarja.nimi
            }
            if (sarja.lasketaanPisteet !== undefined) {
              s.lasketaanPisteet = sarja.lasketaanPisteet
            }
          }
        } else {
          // lisää uusi sarja
          if (!kilpailu.sarjat.some(s => s.nimi === sarja.nimi)) {
            kilpailu.sarjat.push(sarja)
          }
        }
      })
    }

    if (req.body.jarjestajat) {
      req.body.jarjestajat.forEach(jarjestaja => {
        if (jarjestaja.lisaa) {
          if (!kilpailu.jarjestajat.includes(jarjestaja.nimi)) {
            kilpailu.jarjestajat.push(jarjestaja.nimi)
          }
        } else {
          const spliceIndex = kilpailu.jarjestajat.indexOf(jarjestaja.nimi)
          kilpailu.jarjestajat.splice(spliceIndex, 1)
        }
      })
    }

    kausi.tuloksiaPaivitettyViimeksi = new Date()

    kausi.save(err => {
      if (err) return handleError(err, res, 'Virhe muokatessa kilpailua.')
      
      res.json(kilpailu)
    })
  })
})

// poista kilpailu
router.delete('/:kausiId/:kilpailuId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe poistettaessa kilpailua.')

    kausi.kilpailut.id(req.params.kilpailuId).remove()

    kausi.tuloksiaPaivitettyViimeksi = new Date()

    kausi.save(err => {
      if (err) return handleError(err, res, 'Virhe poistettaessa kilpailua.')

      res.json(kausi)
    })
  })
})

module.exports = router