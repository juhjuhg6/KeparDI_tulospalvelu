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

// lisää maaliintulo
router.post('/:kausiId/:kilpailuId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe lisättäessä maaliintuloa.')

    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
    if (!kilpailu) return handleError(err, res, 'Virheellinen kilpailuId.')

    if (kilpailu.maaliintulot.some(maaliintulo => maaliintulo.kilpailija === req.body.kilpailija)) {
      return res.status(400).send('Kilpailijalla on jo maaliaika')
    }

    kilpailu.maaliintulot.push(req.body)

    kausi.save(err => {
      if (err) return handleError(err, res, 'Virhe lisättäessä maaliintuloa.')

      if (req.body.kilpailija && req.body.maaliintuloaika) {
        // päivitetään maaliaika kilpailijalle
        Kilpailija.findById(req.body.kilpailija, (err, kilpailija) => {
          if (err) return handleError(err, res, 'Virhe päivitettäessä maaliaikaa.')

          let kilpailudata = kilpailija.kilpailut.get(kilpailu._id.toString())
          kilpailudata.maaliaika = req.body.maaliintuloaika
          kilpailija.kilpailut.set(kilpailu._id.toString(), kilpailudata)

          kilpailija.save(err => {
            if (err) return handleError(err, res, 'Virhe päivitettäessä maaliaikaa kilpailijalle.')

            lähetäVastaus(JSON.parse(JSON.stringify(kilpailu)), res)
          })
        })
      } else {
        lähetäVastaus(JSON.parse(JSON.stringify(kilpailu)), res)
      }
    })
  })
})

// muokkaa maaliintuloa
router.put('/:kausiId/:kilpailuId/:maaliintuloId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe muokattaessa maaliintuloa')

    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
    if (!kilpailu) return handleError(err, res, 'Virheellinen kilpailuId.')
    const maaliintulo = kilpailu.maaliintulot.id(req.params.maaliintuloId)
    if (!maaliintulo) return handleError(err, res, 'Virheellinen maaliintuloId.')

    // jos kyseisellä kilpailijalla on jo toinen maaliintulo tallennettuna, niin poistetaan
    // kilpailija siitä maaliintulosta
    let kilpailijanToinenMaaliintulo = kilpailu.maaliintulot.find(m => m.kilpailija === req.body.kilpailija &&
      m.id !== req.params.maaliintuloId)
    if (kilpailijanToinenMaaliintulo) {
      kilpailijanToinenMaaliintulo.kilpailija = null
    }

    const edellinenKilpailija = maaliintulo.kilpailija
    maaliintulo.set(req.body)

    kausi.save(err => {
      if (err) return handleError(err, res, 'Virhe muokattaessa maaliintuloa.')

      const päivitäEdellinenKilpailija = function () {
        if (edellinenKilpailija && edellinenKilpailija !== maaliintulo.kilpailija) {
          Kilpailija.findById(edellinenKilpailija, (err, kilpailija) => {
            // poistetaan maaliintuloaika mahdolliselta edelliseltä kilpailijalta
            if (err) return handleError(err, res, 'Virhe päivitettäessä maaliintuloa.')

            let kilpailudata = kilpailija.kilpailut.get(kilpailu._id.toString())
            kilpailudata.maaliaika = null
            kilpailija.kilpailut.set(kilpailu._id.toString(), kilpailudata)

            kilpailija.save(err => {
              if (err) handleError(err, res, 'Virhe päivitettäessä maaliintuloaikaa.')
              
              päivitäKilpailija()
            })
          })
        } else {
          päivitäKilpailija()
        }
      }

      const päivitäKilpailija = function () {
        if (maaliintulo.kilpailija) {
          // päivitä maaliintuloaika kyseisen kilpailijan kohdalle
          Kilpailija.findById(maaliintulo.kilpailija, (err, kilpailija) => {
            if (err) return handleError(err, res, 'Virhe päivitettäessä maaliintuloa.')

            let kilpailudata = kilpailija.kilpailut.get(kilpailu._id.toString())
            kilpailudata.maaliaika = maaliintulo.maaliintuloaika
            kilpailija.kilpailut.set(kilpailu._id.toString(), kilpailudata)

            kilpailija.save(err => {
              if (err) handleError(err, res, 'Virhe päivitettäessä maaliintuloaikaa.')

              lähetäVastaus(JSON.parse(JSON.stringify(kilpailu)), res)
            })
          })
        } else {
          lähetäVastaus(JSON.parse(JSON.stringify(kilpailu)), res)
        }
      }

      päivitäEdellinenKilpailija()
    })
  })
})

// poista maaliintulo
router.delete('/:kausiId/:kilpailuId/:maaliintuloId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Vithe poistettaessa maaliintuloa.')

    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
    if (!kilpailu) return handleError(err, res, 'Virheellinen kilpailuId.')
    const maaliintulo = kilpailu.maaliintulot.id(req.params.maaliintuloId)
    if (!maaliintulo) return handleError(err, res, 'Virheellinen maaliintuloId.')

    const poistaMaaliintulo = function () {
      maaliintulo.remove()

      kausi.save(err => {
        if (err) return handleError(err, res, 'Virhe poistettaessa maaliintuloa.')

        lähetäVastaus(JSON.parse(JSON.stringify(kilpailu)), res)
      })
    }

    if (maaliintulo.kilpailija) {
      // poista maaliintulo kilpailijalta
      Kilpailija.findById(maaliintulo.kilpailija, (err, kilpailija) => {
        if (err) return handleError(err, res, 'Virhe poitettaessa maaliintuloa.')

        let kilpailudata = kilpailija.kilpailut.get(kilpailu._id.toString())
        kilpailudata.maaliaika = null
        kilpailija.kilpailut.set(kilpailu._id.toString(), kilpailudata)

        kilpailija.save((err, kilpailija) => {
          if (err) return handleError(err, res, 'Virhe poistettaessa maaliintuloa.')

          kilpailija.kilpailut.clear()
          kilpailija.kilpailut.set(kilpailu._id.toString(), kilpailudata)
          vastaus.kilpailijat = [kilpailija]

          poistaMaaliintulo()
        })
      })
    } else {
      poistaMaaliintulo()
    }
  })
})

module.exports = router