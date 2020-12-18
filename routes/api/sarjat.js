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

// luo uusi sarja
router.post('/:kausiId/:kilpailuId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe haettaessa sarjoja.')

    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
    if (!kilpailu) return handleError(err, res, 'Virheellinen kilpailuId.')

    if (kilpailu.sarjat.some(sarja => sarja.nimi === req.body.nimi)) {
      res.status(400).send('Nimi käytetty jo toisessa sarjassa. Valitse toinen nimi.')
      return
    }

    kilpailu.sarjat.push(req.body)

    kausi.save(err => {
      if (err) return handleError(err, res, 'Virhe luotaessa uutta sarjaa.')

      lähetäVastaus(JSON.parse(JSON.stringify(kilpailu)), res)
    })
  })
})

// muokkaa sarjaa
router.put('/:kausiId/:kilpailuId/:sarjaId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe muokatessa sarjaa.')

    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
    if (!kilpailu) return handleError(err, res, 'Virheellinen kilpailuId.')
    const sarja = kilpailu.sarjat.id(req.params.sarjaId)
    if (!sarja) return handleError(err, res, 'Virheellinen sarjaId.')

    if (req.body.nimi) {
      sarja.nimi = req.body.nimi
    }
    if (req.body.manuaalisetPisteet) {
      sarja.manuaalisetPisteet = req.body.manuaalisetPisteet
    }

    const tallennaSarja = function () {
      kausi.save(err => {
        if (err) return handleError(err, res, 'Virhe muokatessa sarjaa.')

        lähetäVastaus(JSON.parse(JSON.stringify(kilpailu)), res)
      })
    }

    if (typeof req.body.lasketaanPisteet === 'boolean') {
      sarja.lasketaanPisteet = req.body.lasketaanPisteet

      if (typeof sarja.lasketaanPisteet === 'boolean' && sarja.lasketaanPisteet === false) {
        // poistetaan pisteet sarjan kilpailijoilta
        Kilpailija.find({'_id': {$in: sarja.kilpailijat}}, (err, kilpailijat) => {
          if (err) return handleError(err, res, 'Virhe poistettaessa pisteitä kilpailijoilta.')

          const poistaPisteet = function (i) {
            const kilpailija = kilpailijat[i]
            if (!kilpailija) {
              return tallennaSarja()
            }

            let kilpailudata = kilpailija.kilpailut.get(kilpailu._id.toString())
            kilpailudata.pisteet = 0
            kilpailija.kilpailut.set(kilpailu._id.toString(), kilpailudata)

            kilpailija.save((err, kilpailija) => {
              if (err) return handleError(err, res, 'Virhe poistettaessa pisteitä kilpailijoilta.')
              
              poistaPisteet(i+1)
            })
          }
          poistaPisteet(0)
        })
      } else {
        tallennaSarja()
      }
    } else {
      tallennaSarja()
    }
  })
})

// poista sarja
router.delete('/:kausiId/:kilpailuId/:sarjaId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe poistettaessa sarjaa.')

    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
    if (!kilpailu) return handleError(err, res, 'Virheellinen kilpailuId.')
    const sarja = kilpailu.sarjat.id(req.params.sarjaId)
    if (!sarja) return handleError(err, res, 'Virheellinen sarjaId.')

    const poistaSarja = function () {
      sarja.remove()

      kausi.save(err => {
        if (err) return handleError(err, res, 'Virhe poistettaessa sarjaa.')

        lähetäVastaus(JSON.parse(JSON.stringify(kilpailu)), res)
      })
    }

    // positetaan kilpailu kaikilta sarjan kilpailijoilta
    Kilpailija.find({_id: {$in: sarja.kilpailijat}}, (err, kilpailijat) => {
      if (err) return handleError(err, res, 'Virhe poistettaessa sarjaa.')

      const poistaKilpailuKilpailijalta = function (i) {
        const kilpailija = kilpailijat[i]
        if (!kilpailija) {
          return poistaSarja()
        }
        kilpailija.kilpailut.delete(kilpailu._id.toString())

        kilpailija.save(err => {
          poistaKilpailuKilpailijalta(i+1)
        })
      }
      poistaKilpailuKilpailijalta(0)
    })
  })
})

module.exports = router