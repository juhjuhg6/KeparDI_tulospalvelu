const express = require('express')
const router = express.Router()

const Kausi = require('../../models/kausi.js')
const kilpailija = require('../../models/kilpailija.js')
const Kilpailija = require('../../models/kilpailija.js')

const handleError = function (err, res, message) {
  console.log('\n', message)
  console.log(err)
  res.status(500).send(message)
}

const kilpailijanPisteet = function (voittoAika, kilpailijanAika) {
  pisteet = Math.round(2000 - 1000*kilpailijanAika/voittoAika)
  if (pisteet < 1) return 1
  return pisteet
}

const päivitäKilpailunPisteet = function (kilpailu) {
  kilpailu.sarjat.forEach(sarja => {
    Kilpailija.find({'_id': {$in: sarja.kilpailijat}}, (err, kilpailijat) => {
      if (err) return handleError(err, res, 'Virhe päivitettäessä pisteitä.')

      let kilpailijoidenAjat = []
      let voittoAika
      kilpailijat.forEach(kilpailija => {
        const kilpailudata = kilpailija.kilpailut.get(kilpailu._id.toString())
        if (!kilpailudata.muuTulos && kilpailudata.lahtoaika && kilpailudata.maaliaika) {
          const kilpailijanAika = kilpailudata.maaliaika - kilpailudata.lahtoaika
          kilpailijoidenAjat.push({id: kilpailija._id, aika: kilpailijanAika})

          if (!voittoAika) {
            voittoAika = kilpailijanAika
          } else if (kilpailijanAika < voittoAika) {
            voittoAika = kilpailijanAika
          }
        }
      })

      kilpailijoidenAjat.forEach(kilpailijanAika => {
        Kilpailija.findById(kilpailijanAika.id, (err, kilpailija) => {
          if (err) return handleError(err, res, 'Virhe päivitettäessä pisteitä.')

          let kilpailudata = kilpailija.kilpailut.get(kilpailu._id.toString())
          kilpailudata.pisteet = kilpailijanPisteet(voittoAika, kilpailijanAika.aika)
          kilpailija.kilpailut.set(kilpailu._id.toString(), kilpailudata)

          kilpailija.save(err => {
            if (err) handleError(err, res, 'Virhe päivitettäessä pisteitä.')
          })
        })
      })
    })
  })
}

// päivitä kauden kaikkien kilpailujen pisteet
router.get('/:kausiId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe päivitettäessä pisteitä.')

    kausi.kilpailut.forEach(kilpailu => {
      päivitäKilpailunPisteet(kilpailu)
    })

    let kaikkiKilpailijat = []
    kausi.kilpailut.forEach(kilpailu => {
      kilpailu.sarjat.forEach(sarja => {
        kaikkiKilpailijat = kaikkiKilpailijat.concat(sarja.kilpailijat)
      })
    })

    Kilpailija.find({'_id': {$in: kaikkiKilpailijat}}, (err, kilpailijat) => {
      if (err) return handleError(err, res, 'Virhe päivitettäessä pisteitä.')

      res.json(kilpailijat)
    })
  })
})

// päivitä kilpailun pisteet
router.get('/:kausiId/:kilpailuId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe päivitettäessä kilpailun pisteitä.')

    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
    if (!kilpailu) return handleError(err, res, 'Virheellinen kilpiuId.')

    päivitäKilpailunPisteet(kilpailu)

    let kaikkiKilpailijat = []
    kilpailu.sarjat.forEach(sarja => {
      kaikkiKilpailijat = kaikkiKilpailijat.concat(sarja.kilpailijat)
    })

    Kilpailija.find({'_id': {$in: kaikkiKilpailijat}}, (err, kilpailijat) => {
      if (err) return handleError(err, res, 'Virhe päivitettäessä kilpailun pisteitä.')

      res.json(kilpailijat)
    })
  })
})

module.exports = router