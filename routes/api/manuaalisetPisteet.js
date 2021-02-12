const express = require('express')
const router = express.Router()

const Kausi = require('../../models/kausi.js')
const lähetäVastaus = require('./vastaus.js')

const handleError = function (err, res, message) {
  console.log('\n', message)
  console.log(err)
  res.status(500).send(message)
}

// aseta kilpailun manuaaliset pisteet
router.post('/:kausiId/:kilpailuId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe päivitettäessä manuaalisia pisteitä.')
    
    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
    if (!kilpailu) return handleError(err, res, 'Virheellinen kilpailuId.')

    kilpailu.manuaalisetPisteet = req.body.manuaalisetPisteet
    
    kausi.save(err => {
      if (err) handleError(err, res, 'Virhe tallennettaessa manuaalisia pisteitä.')
      
      lähetäVastaus(JSON.parse(JSON.stringify(kilpailu)), res)
    })
  })
})

// poista kilpailun kaikki manuaaliset pisteet
router.delete('/:kausiId/:kilpailuId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe päivitettäessä manuaalisia pisteitä.')
    
    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
    if (!kilpailu) return handleError(err, res, 'Virheellinen kilpailuId.')
    
    kilpailu.manuaalisetPisteet = new Map()

    kausi.save(err => {
      if (err) handleError(err, res, 'Virhe tallennettaessa manuaalisia pisteitä.')
      
      lähetäVastaus(JSON.parse(JSON.stringify(kilpailu)), res)
    })
  })
})

module.exports = router