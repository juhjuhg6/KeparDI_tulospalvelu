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

    kilpailijat.forEach(kilpailija => {
      let kilpailijaVastaus = {_id: kilpailija._id, nimi: kilpailija.nimi}
      kilpailijaVastaus.kilpailuTiedot = kilpailija.kilpailut.get(kilpailu._id.toString())
      vastaus.push(kilpailijaVastaus)
    })
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
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe haettaessa kilpailua.')

    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
    const kilpailijat = haeKilpailijat(kilpailu)

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

    if (req.body.nimi) {
      if (!kausi.kilpailut.some(k => k.nimi === req.body.nimi)) {
        kilpailu.nimi = req.body.nimi
      }
    }

    if (req.body.pvm) {
      kilpailu.pvm = req.body.pvm
    }

    if (req.body.sarjat) {
      req.body.sarjat.forEach(sarja => {
        if (sarja.id) {
          if (sarja.poista) {
            const sarja = kilpailu.sarjat.id(sarja.id)

            // poista kilpailun tulokset sarjan kilpailijoilta
            Kilpailija.find({_id: {$in: sarja.kilpailijat}}, (err, kilpailijat) => {
              kilpailijat.forEach(kilpailija => kilpailija.kilpailut.delete(kilpailu._id))
            })

            sarja.remove()
          } else {
            // muokkaa sarjaa
            kilpailu.sarjat.id(sarja.id).set({nimi: sarja.nimi, lasketaanPisteet: sarja.lasketaanPisteet})
          }
        } else {
          // lisää uusi sarja
          if (!kilpailu.sarjat.some(s => s.nimi === sarja.nimi)) {
            kilpailu.sarjat.push(sarja)
          }
        }
      })
    }

    if (req.body.jarjestajat) {
      req.body.jarjestajat.forEach(jarjestaja => {
        if (jarjestaja.lisaa) {
          if (!kilpailu.jarjestajat.includes(jarjestaja.nimi)) {
            kilpailu.jarjestajat.push(jarjestaja.nimi)
          }
        } else {
          const spliceIndex = kilpailu.jarjestajat.indexOf(jarjestaja.nimi)
          kilpailu.jarjestajat.splice(spliceIndex, 1)
        }
      })
    }

    kausi.save(err => {
      if (err) return handleError(err, res, 'Virhe muokatessa kilpailua.')

      const kilpailijat = haeKilpailijat(kilpailu)
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

// lisää kilpailija sarjaan
router.post('/kilpailijat/:kausiId/:kilpailuId/:sarjaId', (req, res) => {
  let kilpailijaId

  Kilpailija.findById(req.body.kilpailijaId, (err, kilpailija) => {
    if (err) return handleError(err, res, 'Virhe haettaessa kilpailijaa.')

    if (kilpailija) {
      kilpailijaId = kilpailija._id
      lisääKilpailijaSarjaan(kilpailijaId)
    } else {
      // kilpailijaa ei ole tietokannassa, joten luodaan se
      const uusiKilpailija = new Kilpailija({nimi: req.body.nimi})
      uusiKilpailija.kilpailut = new Map()
      if (req.body.lahtoaika) {
        uusiKilpailija.kilpailut.set(req.params.kilpailuId, req.body)
      }

      uusiKilpailija.save((err, kilpailija) => {
        if (err) return handleError(err, res, 'Virhe lisättäessä kilpailijaa.')

        kilpailijaId = kilpailija.id
        lisääKilpailijaSarjaan(kilpailijaId)
      })
    }
  })

  const lisääKilpailijaSarjaan = function(kilpailijaId) {
    Kausi.findById(req.params.kausiId, (err, kausi) => {
      const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
      const sarja = kilpailu.sarjat.id(req.params.sarjaId)

      sarja.kilpailijat.push(kilpailijaId)

      kausi.save(async err => {
        if (err) return handleError(err, res, 'Virhe lisättäessä kilpailijaa kauteen.')

        const kilpailijat = await haeKilpailijat(kilpailu)  
        if (!kilpailijat) return handleError(err, res, 'Virhe haettaessa kilpailijoita.')

        res.json({kilpailu: kilpailu, kilpailijat: kilpailijat})
      })
    })
  }
})

// muuta kilpailijan lähtöaikaa
router.put('/kilpailijat/:kausiId/:kilpailuId/:kilpailijaId', (req, res) => {
  Kilpailija.findById(req.params.kilpailijaId, (err, kilpailija) => {
    if (err) return handleError(err, res, 'Virhe muutettaessa kilpailijan lähtöaikaa.')

    kilpailija.kilpailut.get(req.params.kilpailuId.toString()).lahtoaika = req.body.lahtoaika

    let kilpailu
    Kausi.findById(req.params.kausiId, (err, kausi) => kilpailu = kausi.kilpailut.id(req.params.kilpailuId))

    kilpailija.save(err => {
      if (err) return handleError(err, res, 'Virhe muutettaessa kilpailijan lähtöaikaa.')

      res.json(haeKilpailijat(kilpailu))
    })
  })
})

// poista kilpailija kilpailusta
router.delete('/kilpailijat/:kausiId/:kilpailuId/:sarjaId/:kilpailijaId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe poistettaessa kilpailijaa kilpailusta.')

    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)
    const sarja = kilpailu.sarjat.id(req.params.sarjaId)

    const spliceIndex = sarja.kilpailijat.find(kilpailija => kilpailija === req.params.kilpailijaId)
    sarja.kilpailijat.splice(spliceIndex, 1)

    // poista kilpailun tulokset kilpailijalta
    Kilpailija.findById(req.params.kilpailijaId, (err, kilpailija) => {
      if (err) return handleError(err, res, 'Virhe poistettaessa kilpailun tuloksia kilpailijalta.')

      kilpailija.kilpailut.delete(req.params.kilpailuId)
    })

    kausi.save(err => {
      if (err) return handleError(err, res, 'Virhe poistettaessa kilpailijaa kilpailusta.')

      res.json(kilpailu)
    })
  })
})

module.exports = router