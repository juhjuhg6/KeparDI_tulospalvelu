const express = require('express')
const router = express.Router()

const Kausi = require('../../models/kausi.js')

const handleError = function (err, res, message) {
  console.log('\n', message)
  console.log(err)
  res.status(500).send(message)
}

// lisää maaliintulo
router.post('/:kausiId/:kilpailuId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe lisättäessä maaliintuloa.')

    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)

    if (kilpailu.maaliintulot.some(maaliintulo => maaliintulo.nimi === req.body.nimi)) {
      return res.status(400).send('Kilpailijalla on jo maaliaika')
    }

    kilpailu.maaliintulot.push(req.body)

    // aseta maaliintuloaika kyseiselle kilpailijalle
    if (req.body.nimi) {
      kilpailu.sarjat.forEach(sarja => {
        const kilpailija = sarja.kilpailijat.find(k => k.nimi === req.body.nimi)
        if (kilpailija) {
          kilpailija.maaliaika = req.body.maaliintuloaika
        }
      })
    }

    kausi.tuloksiaPaivitettyViimeksi = new Date()

    kausi.save(err => {
      if (err) return handleError(err, res, 'Virhe lisättäessä maaliintuloa.')

      res.json(kilpailu)
    })
  })
})

// muokkaa maaliintuloa
router.put('/:kausiId/:kilpailuId/:maaliintuloId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe muokattaessa maaliintuloa')

    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
    const maaliintulo = kilpailu.maaliintulot.id(req.params.maaliintuloId)

    if (kilpailu.maaliintulot.some(m => m.nimi === req.body.nimi && m.id !== req.params.maaliintuloId)) {
      return res.status(400).send('Kilpailijalla on jo maaliaika')
    }

    maaliintulo.set(req.body)

    // päivitä muuttunut maaliintuloaika kyseisen kilpailijan kohdalle
    if (req.body.maaliintuloaika) {
      kilpailu.sarjat.forEach(sarja => {
        const kilpailija = sarja.kilpailijat.find(k => k.nimi === req.body.nimi || k.nimi === maaliintulo.nimi)
        if (kilpailija) {
          kilpailija.maaliaika = req.body.maaliintuloaika
        }
      })
    }

    kausi.tuloksiaPaivitettyViimeksi = new Date()

    kausi.save(err => {
      if (err) return handleError(err, res, 'Virhe muokattaessa maaliintuloa.')

      res.json(kilpailu)
    })
  })
})

// poista maaliintulo
router.delete('/:kausiId/:kilpailuId/:maaliintuloId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Vithe poistettaessa maaliintuloa.')

    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
    const maaliintulo = kilpailu.maaliintulot.id(req.params.maaliintuloId)

    // poista maaliintuloaika kilpailijalta
    kilpailu.sarjat.forEach(sarja => {
      const kilpailija = sarja.kilpailijat.find(k => k.nimi === maaliintulo.nimi)
      if (kilpailija) {
        kilpailija.maaliintuloaika = null
      }
    })

    maaliintulo.remove()

    kausi.tuloksiaPaivitettyViimeksi = new Date()

    kausi.save(err => {
      if (err) return handleError(err, res, 'Virhe poistettaessa maaliintuloa.')

      res.json(kilpailu)
    })
  })
})

module.exports = router