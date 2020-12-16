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

const päivitäKilpailunPisteet = function (kilpailu, seuraava) {
  kilpailu.sarjat.map(sarja => {
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

      const asetaPisteet = function (i) {
        const kilpailijanAika = kilpailijoidenAjat[i]
        let kilpailija = kilpailijat.find(k => k._id === kilpailijanAika.id)
        let kilpailudata = kilpailija.kilpailut.get(kilpailu._id.toString())
        kilpailudata.pisteet = kilpailijanPisteet(voittoAika, kilpailijanAika.aika)
        kilpailija.kilpailut.set(kilpailu._id.toString(), kilpailudata)

        kilpailija.save(err => {
          if (err) handleError(err, res, 'Virhe päivitettäessä pisteitä.')

          if (i === kilpailijoidenAjat.length-1) {
            return päivitäJärjestäjienPisteet(kilpailu, seuraava)
          }
          return asetaPisteet(i+1)
        })
      }

      asetaPisteet(0)
    })
  })
}

const päivitäJärjestäjienPisteet = function (kilpailu, seuraava) {
  // lasketaan suurimman sarjan viiden parhaan pisteistä keskiarvo tai jos useampi yhtä suuri
  // sarja, niin valitaan sarja, josta tulee parhaat pisteet
  let suurimmatSarjat = []

  kilpailu.sarjat.forEach(sarja => {
    if (!suurimmatSarjat.length || sarja.kilpailijat.length === suurimmatSarjat[0].kilpailijat.length) {
      suurimmatSarjat.push(sarja)
    } else if (sarja.kilpailijat.length > suurimmatSarjat[0].kilpailijat.length) {
      suurimmatSarjat = []
      suurimmatSarjat.push(sarja)
    }
  })

  let järjestäjienPisteet = 0

  const asetaJärjestäjienPisteet = function () {
    Kilpailija.find({'_id': {$in: kilpailu.jarjestajat}}, (err, järjestäjät) => {
      if (err) return console.log(err)
  
      const asetaPisteet = function(i, seuraava) {
        järjestäjä = järjestäjät[i]
        let kilpailudata = järjestäjä.kilpailut.get(kilpailu._id.toString())
        kilpailudata.pisteet = järjestäjienPisteet
        järjestäjä.kilpailut.set(kilpailu._id.toString(), kilpailudata)
  
        järjestäjä.save(err => {
          if (err) return handleError(err, res, 'Virhe päivitettäessä järjestäjien pisteitä.')
  
          if (i === järjestäjät.length-1) {
            return seuraava()
          }
          return asetaPisteet(i+1, seuraava)
        })
      }
  
      asetaPisteet(0, seuraava)
    })
  }

  const laskeJärjestäjienPisteet = function (i) {
    const sarja = suurimmatSarjat[i]

    Kilpailija.find({'_id': {$in: sarja.kilpailijat}}, (err, kilpailijat) => {
      if (err) handleError(err, res, 'Virhe päivitettäessä järjestäjien pisteitä.')

      let parhaatPisteet = []

      kilpailijat.forEach(kilpailija => {
        const pisteet = kilpailija.kilpailut.get(kilpailu._id.toString()).pisteet
        if (parhaatPisteet.length < 5) {
          parhaatPisteet.push(pisteet)
          parhaatPisteet.sort()
        } else if (pisteet > parhaatPisteet[0]) {
          parhaatPisteet.slice(0, 1)
          parhaatPisteet.push(pisteet)
          parhaatPisteet.sort()
        }
      })

      const keskiarvo = parhaatPisteet.reduce((sum, num) => sum + num, 0) / parhaatPisteet.length
      if (keskiarvo > järjestäjienPisteet) {
        järjestäjienPisteet = Math.round(keskiarvo)
      }
    })

    if (i === suurimmatSarjat.length-1) {
      return asetaJärjestäjienPisteet()
    }
  }

  laskeJärjestäjienPisteet(0)
}

// päivitä kauden kaikkien kilpailujen pisteet
router.get('/:kausiId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe päivitettäessä pisteitä.')

    const vastaus = function () {
      let kaikkiKilpailijat = []
      kausi.kilpailut.forEach(kilpailu => {
        kilpailu.sarjat.forEach(sarja => {
          kaikkiKilpailijat = kaikkiKilpailijat.concat(sarja.kilpailijat)
        })

        kaikkiKilpailijat = kaikkiKilpailijat.concat(kilpailu.jarjestajat)
      })

      Kilpailija.find({'_id': {$in: kaikkiKilpailijat}}, (err, kilpailijat) => {
        if (err) return handleError(err, res, 'Virhe päivitettäessä pisteitä.')

        res.json(kilpailijat)
      })
    }

    let i = 0
    const kilpailunPisteet = function () {
      const kilpailu = kausi.kilpailut[i]
      if (i === kausi.kilpailut.length-1) {
        i++
        return päivitäKilpailunPisteet(kilpailu, kilpailunPisteet)
      }
      return vastaus()
    }

    kilpailunPisteet()
  })
})

// päivitä kilpailun pisteet
router.get('/:kausiId/:kilpailuId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe päivitettäessä kilpailun pisteitä.')

    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
    if (!kilpailu) return handleError(err, res, 'Virheellinen kilpiuId.')

    const vastaus = function () {
      let kaikkiKilpailijat = []
      kilpailu.sarjat.forEach(sarja => {
        kaikkiKilpailijat = kaikkiKilpailijat.concat(sarja.kilpailijat)
      })

      kaikkiKilpailijat = kaikkiKilpailijat.concat(kilpailu.jarjestajat)

      Kilpailija.find({'_id': {$in: kaikkiKilpailijat}}, (err, kilpailijat) => {
        if (err) return handleError(err, res, 'Virhe päivitettäessä kilpailun pisteitä.')

        res.json(kilpailijat)
      })
    }

    päivitäKilpailunPisteet(kilpailu, vastaus)
  })
})

module.exports = router