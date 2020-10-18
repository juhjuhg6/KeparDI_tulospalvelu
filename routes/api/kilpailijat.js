const express = require('express')
const router = express.Router()

const Kausi = require('../../models/kausi.js')

const handleError = function (err, res, message) {
  console.log('\n', message)
  console.log(err)
  res.status(500).send(message)
}

// lisää uusi kilpailija
router.post('/:kausiId/:kilpailuId/:sarjaId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe lisättäessä kilpailijaa.')

    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
    const sarja = kilpailu.sarjat.id(req.params.sarjaId)

    if (sarja.kilpailijat.some(s => s.nimi === req.body.nimi)) {
      return res.status(400).send('Samanniminen kilpailija on jo lisätty. Kilpailijat tulee erottaa toisistaan nimen perusteella.')
    }

    sarja.kilpailijat.push(req.body)

    kausi.save(err => {
      if (err) return handleError(err, res, 'Virhe lisättäessä kilpailijaa.')
      
      res.json(kilpailu)
    })
  })
})

// muokkaa kilpailijaa
router.put('/:kausiId/:kilpailuId/:sarjaId/:kilpailijaId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe muokatessa kilpailijaa.')

    const kilpailu = kausi.kilpailut.id(req. params.kilpailuId)
    const sarja = kilpailu.sarjat.id(req.params.sarjaId)
    const kilpailija = sarja.kilpailijat.id(req.params.kilpailijaId)

    if (sarja.kilpailijat.some(s => s.nimi === req.body.nimi)) {
      delete req.body.nimi
    }

    kilpailija.set(req.body)

    kausi.save(err=> {
      if (err) return handleError(err, res, 'Virhe muokatessa kilpailijaa.')
      
      res.json(kilpailu)
    })
  })
})

// poista kilpailija
router.delete('/:kausiId/:kilpailuId/:sarjaId/:kilpailijaId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe poistettaessa kilpailijaa.')

    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
    const sarja = kilpailu.sarjat.id(req.params.sarjaId)
    sarja.kilpailijat.id(req.params.kilpailijaId).remove()

    kausi.save(err => {
      if (err) return handleError(err, res, 'Virhe muokatessa kilpailijaa.')
      
      res.json(kilpailu)
    })
  })
})

module.exports = router