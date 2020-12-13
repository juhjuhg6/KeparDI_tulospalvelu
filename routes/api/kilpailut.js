const express = require('express')
const router = express.Router()

const Kausi = require('../../models/kausi.js')
const Kilpailija = require('../../models/kilpailija.js')

const handleError = function (err, res, message) {
  console.log('\n', message)
  console.log(err)
  res.status(500).send(message)
}

const haeKilpailijat = async function(kilpailu) {
  let kilpailijaIdt = []
  kilpailu.sarjat.forEach(sarja => kilpailijaIdt = kilpailijaIdt.concat(sarja.kilpailijat))

  let vastaus = []

  await Kilpailija.find({_id: {$in: kilpailijaIdt}}, (err, kilpailijat) => {
    if (err) return vastaus = false

    vastaus = kilpailijat
  })
  return vastaus
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
  Kausi.findById(req.params.kausiId, async (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe haettaessa kilpailua.')

    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
    if (!kilpailu) return handleError(err, res, 'Virheellinen kilpailuId.')
    const kilpailijat = await haeKilpailijat(kilpailu)

    if (!kilpailijat) return handleError(err, res, 'Virhe haettaessa kilpailijoita.')
    
    res.json({kilpailu: kilpailu, kilpailijat: kilpailijat})
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

      res.json(kausi)
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

    if (req.body.pvm) {
      kilpailu.pvm = req.body.pvm
    }

    kausi.save(async err => {
      if (err) return handleError(err, res, 'Virhe muokatessa kilpailua.')

      const kilpailijat = await haeKilpailijat(kilpailu)
      if (!kilpailijat) return handleError(err, res, 'Virhe haettaessa kilpailijoita.')
      
      res.json({kilpailu: kilpailu, kilpailijat: kilpailijat})
    })
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
    kilpailu.sarjat.forEach(sarja => kilpailijaIdt = kilpailijaIdt.concat(satja.kilpailijat))
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