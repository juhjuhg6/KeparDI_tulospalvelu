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

// lisää järjestäjä kilpailuun
router.post('/:kausiId/:kilpailuId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe lisättäessä järjestäjää.')

    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
    if (!kilpailu) return handleError(err, res, 'Virheellinen kilpailuId.')

    Kilpailija.findOne({nimi: req.body.nimi}, (err, kilpailija) => {
      if (err) handleError(err, res, 'Virhe lisättäessä järjestäjää.')

      if (!kilpailija) {
        const uusiKilpailija = new Kilpailija(req.body)
        uusiKilpailija.kilpailut = new Map()
        uusiKilpailija.kilpailut.set(req.params.kilpailuId, {})

        uusiKilpailija.save((err, kilpailija) => {
          if (err) return handleError(err, res, 'Virhe lisättäessä järjestäjää.')

          kilpailu.jarjestajat.push(kilpailija._id)
          kausi.save(err => {
            if (err) return handleError(err, res, 'Virhe lisättäessä järjestäjää.')

            lähetäVastaus(JSON.parse(JSON.stringify(kilpailu)), res)
          })
        })
      } else {
        // tarkistetaan onko järjestäjä jo kilpailun järjestäjänä
        if (kilpailu.jarjestajat.some(jarjestaja => jarjestaja === kilpailija._id.toString())) {
          return handleError(err, res, 'Kyseinen henkilö on jo järjestäjänä kilpailussa.')
        }

        kilpailu.jarjestajat.push(kilpailija._id)
        kausi.save(err => {
          if (err) return handleError(err, res, 'Virhe lisättäessä järjestäjää.')

          kilpailija.kilpailut.set(req.params.kilpailuId, {})
  
          kilpailija.save(err => {
            if (err) return handleError(err, res, 'Virhe lisättäessä järjestäjää.')
          })

          lähetäVastaus(JSON.parse(JSON.stringify(kilpailu)), res)
        })
      }
    })
  })
})

// poista järjestäjä kilpailusta
router.delete('/:kausiId/:kilpailuId/:jarjestajaId', (req, res) => {
  const poistaKilpailuKilpailijalta = function(kilpailu) {
    Kilpailija.findById(req.params.jarjestajaId, (err, kilpailija) => {
      if (err) return err

      kilpailija.kilpailut.delete(req.params.kilpailuId)

      kilpailija.save(err => {
        if (err) return err

        lähetäVastaus(JSON.parse(JSON.stringify(kilpailu)), res)
      })
    })
  }

  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe poistettaessa järjestäjää.')

    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
    if (!kilpailu) return handleError(err, res, 'Virheellinen kilpailuId.')

    const spliceIndex = kilpailu.jarjestajat.indexOf(req.params.jarjestajaId)
    if (spliceIndex === -1) return handleError(err, res, 'Virheellinen jarjestajaId.')
    kilpailu.jarjestajat.splice(spliceIndex, 1)

    kausi.save(err => {
      if (err) return handleError(err, res, 'Virhe poistettaessa järjestäjää.')

      poistaKilpailuKilpailijalta(kilpailu)
    })
  })
})

module.exports = router