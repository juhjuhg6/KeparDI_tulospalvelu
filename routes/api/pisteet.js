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

const kilpailijanPisteet = function (voittoAika, kilpailijanAika) {
  pisteet = Math.round(2000 - 1000*kilpailijanAika/voittoAika)
  if (pisteet < 1) return 1
  return pisteet
}

const päivitäKilpailunPisteet = function (kilpailu, pakotaPistelasku, seuraava) {
  if (!kilpailu.sarjat.length) {
    return seuraava()
  }

  if (pakotaPistelasku !== 'true' && kilpailu.tuloksiaMuutettuViimeksi && kilpailu.pisteetPäivitettyViimeksi) {
    if (kilpailu.tuloksiaMuutettuViimeksi < kilpailu.pisteetPäivitettyViimeksi) {
      return seuraava()
    }
  }

  const sarjanPisteet = function (i) {
    const sarja = kilpailu.sarjat[i]
    if (!sarja || !sarja.lasketaanPisteet) {
      if (kilpailu.jarjestajat.length) {
        return päivitäJärjestäjienPisteet(kilpailu, seuraava)
      }
      return seuraava()
    }

    Kilpailija.find({'_id': {$in: sarja.kilpailijat}}, (err, kilpailijat) => {
      if (err) return handleError(err, res, 'Virhe päivitettäessä pisteitä.')

      if (!kilpailijat.length) return seuraava()

      let kilpailijoidenAjat = []
      let voittoAika
      const haeKilpailijoidenAjat = function (i) {
        const kilpailija = kilpailijat[i]
        if (!kilpailija) {
          return asetaPisteet(0)
        }
        const kilpailudata = kilpailija.kilpailut.get(kilpailu._id.toString())
        if (!kilpailudata.muuTulos && kilpailudata.lahtoaika && kilpailudata.maaliaika) {
          const kilpailijanAika = kilpailudata.maaliaika - kilpailudata.lahtoaika
          kilpailijoidenAjat.push({id: kilpailija._id, aika: kilpailijanAika})

          if (!voittoAika) {
            voittoAika = kilpailijanAika
          } else if (kilpailijanAika < voittoAika) {
            voittoAika = kilpailijanAika
          }
          return haeKilpailijoidenAjat(i+1)
        } else {
          if (kilpailu.manuaalisetPisteet.get(kilpailija._id.toString())) {
            kilpailudata.pisteet = kilpailu.manuaalisetPisteet.get(kilpailija._id.toString())
          } else if (kilpailudata.muuTulos === 'DNF') {
            kilpailudata.pisteet = 1
          } else {
            kilpailudata.pisteet = 0
          }
          
          kilpailija.kilpailut.set(kilpailu._id.toString(), kilpailudata)

          kilpailija.save(err => {
            if (err) return handleError(err, res, 'Virhe muutettaessa kilpailijan pisteitä.')

            haeKilpailijoidenAjat(i+1)
          })
        }
      }

      const asetaPisteet = function (j) {
        const kilpailijanAika = kilpailijoidenAjat[j]
        if (!kilpailijanAika) {
          return sarjanPisteet(i+1)
        }

        let kilpailija = kilpailijat.find(k => k._id === kilpailijanAika.id)
        let kilpailudata = kilpailija.kilpailut.get(kilpailu._id.toString())
        
        if (kilpailu.manuaalisetPisteet.get(kilpailija._id.toString())) {
          kilpailudata.pisteet = kilpailu.manuaalisetPisteet.get(kilpailija._id.toString())
        } else {
          kilpailudata.pisteet = kilpailijanPisteet(voittoAika, kilpailijanAika.aika)
        }

        kilpailija.kilpailut.set(kilpailu._id.toString(), kilpailudata)

        kilpailija.save(err => {
          if (err) handleError(err, res, 'Virhe päivitettäessä pisteitä.')

          return asetaPisteet(j+1)
        })
      }

      haeKilpailijoidenAjat(0)
    })
  }

  sarjanPisteet(0)
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
  
      const asetaPisteet = function(i) {
        järjestäjä = järjestäjät[i]
        if (!järjestäjä) {
          return seuraava()
        }

        let kilpailudata = järjestäjä.kilpailut.get(kilpailu._id.toString())

        if (kilpailu.manuaalisetPisteet.get(järjestäjä._id.toString())) {
          kilpailudata.pisteet = kilpailu.manuaalisetPisteet.get(järjestäjä._id.toString())
        } else {
          kilpailudata.pisteet = järjestäjienPisteet
        }

        järjestäjä.kilpailut.set(kilpailu._id.toString(), kilpailudata)
  
        järjestäjä.save(err => {
          if (err) return handleError(err, res, 'Virhe päivitettäessä järjestäjien pisteitä.')

          return asetaPisteet(i+1)
        })
      }
  
      asetaPisteet(0)
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
          parhaatPisteet.sort((a, b) => b - a)
        } else if (pisteet > parhaatPisteet[parhaatPisteet.length-1]) {
          parhaatPisteet.pop()
          parhaatPisteet.push(pisteet)
          parhaatPisteet.sort((a, b) => b - a)
        }
      })

      const keskiarvo = parhaatPisteet.reduce((sum, num) => sum + num, 0) / parhaatPisteet.length
      if (keskiarvo > järjestäjienPisteet) {
        järjestäjienPisteet = Math.round(keskiarvo)
      }

      if (i === suurimmatSarjat.length-1) {
        return asetaJärjestäjienPisteet()
      }
    })
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
      if (kilpailu) {
        i++
        päivitäKilpailunPisteet(kilpailu, req.query.pakotaPistelasku, kilpailunPisteet)
        
        kilpailu.pisteetPäivitettyViimeksi = new Date()
      } else {
        kausi.save()
        vastaus()
      }
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

    päivitäKilpailunPisteet(kilpailu, req.query.pakotaPistelasku, () => lähetäVastaus(JSON.parse(JSON.stringify(kilpailu)), res))

    kilpailu.pisteetPäivitettyViimeksi = new Date()

    kausi.save()
  })
})

module.exports = router