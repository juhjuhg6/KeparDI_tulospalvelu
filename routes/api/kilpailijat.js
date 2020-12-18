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

// lisää kilpailija sarjaan
router.post('/:kausiId/:kilpailuId/:sarjaId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe lisättäessä kilpailijaa.')

    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
    if (!kilpailu) return handleError(err, res, 'Virheellinen kilpailuId.')
    const sarja = kilpailu.sarjat.id(req.params.sarjaId)
    if (!sarja) return handleError(err, res, 'Virheellinen sarjaId.')

    Kilpailija.findOne({nimi: req.body.nimi}, (err, kilpailija) => {
      if (err) return handleError(err, res, 'Virhe lisättäessä kilpailijaa.')

      if (!kilpailija) {
        const uusiKilpailija = new Kilpailija(req.body)
        uusiKilpailija.kilpailut = new Map()
        uusiKilpailija.kilpailut.set(req.params.kilpailuId, req.body.kilpailudata)

        uusiKilpailija.save((err, kilpailija) => {
          if (err) return handleError(err, res, 'Virhe lisättäessä kilpailijaa.')

          sarja.kilpailijat.push(kilpailija._id)
          kausi.save(err => {
            if (err) return handleError(err, res, 'Virhe lisättäessä kilpailijaa.')

            lähetäVastaus(JSON.parse(JSON.stringify(kilpailu)), res)
          })
        })
      } else {
        // tarkistetaan onko kilpailija jo jossain kilpailun sarjassa
        const kilpailijaJoKilpailussa = function() {
          let found = false
          kilpailu.sarjat.forEach(sarja => {
            if (sarja.kilpailijat.some(k => k === kilpailija._id.toString())) {
              found = true
            }
          })
          return found
        }
        if (kilpailijaJoKilpailussa()) return handleError(err, res, 'Kilpailija on jo kilpailussa.')

        sarja.kilpailijat.push(kilpailija._id)

        kilpailija.kilpailut.set(req.params.kilpailuId, req.body.kilpailudata)

        kilpailija.save(err => {
          if (err) return handleError(err, res, 'Virhe lisättäessä kilpailijaa.')
          
          kausi.save(err => {
            if (err) return handleError(err, res, 'Virhe lisättäessä kilpailijaa.')

            lähetäVastaus(JSON.parse(JSON.stringify(kilpailu)), res)
          })
        })
      }
    })
  })
})

// muokkaa kilpailijan kilpailudataa
router.put('/:kausiId/:kilpailuId/:sarjaId/:kilpailijaId', (req, res) => {
  Kilpailija.findById(req.params.kilpailijaId, (err, kilpailija) => {
    if (err) return handleError(err, res, 'Virhe muokattaessa kilpailijan kilpailudataa.')

    kilpailudata = kilpailija.kilpailut.get(req.params.kilpailuId)
    if (!kilpailudata) return handleError(err, res, 'Virheellinen kilpailuId.')

    if (req.body.lahtoaika) {
      kilpailudata.lahtoaika = req.body.lahtoaika
    }
    if (req.body.maaliaika) {
      kilpailudata.maaliaika = req.body.maaliaika
    }
    if (req.body.muuTulos) {
      kilpailudata.muuTulos = req.body.muuTulos
    }

    kilpailija.kilpailut.set(req.params.kilpailuId, kilpailudata)

    kilpailija.save((err, kilpailija) => {
      if (err) return handleError(err, res, 'Virhe muokattaessa kilpailijan kilpailudataa.')

      lähetäVastaus(JSON.parse(JSON.stringify(kilpailu)), res)
    })
  })
})

// poista kilpailija kilpailusta
router.delete('/:kausiId/:kilpailuId/:sarjaId/:kilpailijaId', (req, res) => {
  Kilpailija.findById(req.params.kilpailijaId, (err, kilpailija) => {
    if (err) return handleError(err, res, 'Virhe poistettaessa kilpailijaa kilpailusta.')

    kilpailija.kilpailut.delete(req.params.kilpailuId)

    kilpailija.save(err => {
      if (err) return handleError(err, res, 'Virhe poistettaessa kilpailijaa kilpailusta.')

      Kausi.findById(req.params.kausiId, (err, kausi) => {
        if (err) return handleError(err, res, 'Virhe poistettaessa kilpailijaa kilpailusta.')
    
        const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
        if (!kilpailu) return handleError(err, res, 'Virheellinen kilpailuId.')
        const sarja = kilpailu.sarjat.id(req.params.sarjaId)
        if (!sarja) return handleError(err, res, 'Virheellinen sarjaId.')
    
        const spliceIndex = sarja.kilpailijat.indexOf(req.params.kilpailijaId)
        if (spliceIndex === -1) return handleError(err, res, 'Virheellinen kilpailijaId.')
        sarja.kilpailijat.splice(spliceIndex, 1)
    
        kausi.save(err => {
          if (err) return handleError(err, res, 'Virhe poistettaessa kilpailijaa kilpailusta.')

          lähetäVastaus(JSON.parse(JSON.stringify(kilpailu)), res)
        })
      })
    })
  })
})

module.exports = router