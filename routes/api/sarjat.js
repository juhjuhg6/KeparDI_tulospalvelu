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

const sekoitaLista = function (lista) {
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]]
  }
  return lista
}

// luo uusi sarja
router.post('/:kausiId/:kilpailuId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe haettaessa sarjoja.')

    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
    if (!kilpailu) return handleError(err, res, 'Virheellinen kilpailuId.')

    kilpailu.tuloksiaMuutettuViimeksi = new Date()

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

    kilpailu.tuloksiaMuutettuViimeksi = new Date()

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

// arvo ja aseta lähtöajat sarjalle
router.put('/lahtoajat/:kausiId/:kilpailuId/:sarjaId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe asetettaessa lähtöaikoja.')

    if (!req.body.ensimmäinenLähtöaika) {
      return handleError(err, res, 'Ensimmäistä lähtöaikaa ei ole määritetty.')
    }

    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
    if (!kilpailu) return handleError(err, res, 'Virheellinen kilpailuId.')
    const sarja = kilpailu.sarjat.id(req.params.sarjaId)
    if (!sarja) return handelError(err, res, 'Virheellinen sarjaId.')

    kilpailu.tuloksiaMuutettuViimeksi = new Date()

    Kilpailija.find({ '_id': { $in: sarja.kilpailijat } }, (err, kilpailijat) => {
      if (err) return handleError(err, res, 'Virhe asetettaessa lähtöaikoja.')

      const ensimmäinenLähtöaika = Date.parse(req.body.ensimmäinenLähtöaika)
      const lähtöväli = parseInt(req.body.lähtöväli)

      kilpailijat = sekoitaLista(kilpailijat)

      let promises = []

      for (let i = 0; i < kilpailijat.length; i++) {
        const kilpailija = kilpailijat[i]

        let kilpailudata = kilpailija.kilpailut.get(kilpailu._id.toString())
        kilpailudata.lahtoaika = new Date(ensimmäinenLähtöaika + i * lähtöväli || ensimmäinenLähtöaika)
        kilpailija.kilpailut.set(kilpailu._id.toString(), kilpailudata)

        promises.push(kilpailija.save())
      }

      Promise.all(promises)
        .then(() => {
          kausi.save(err => {
            if (err) return handleError(err, res, 'Virhe asetettaessa lähtöaikoja.')

            lähetäVastaus(JSON.parse(JSON.stringify(kilpailu)), res)
          })
        })
        .catch(err => handleError(err, res, 'Virhe asetettaessa lähtöaikoja.'))
    })
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

    kilpailu.tuloksiaMuutettuViimeksi = new Date()

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