const express = require('express')
const router = express.Router()

const Kausi = require('../models/kausi.js')
const Kilpailu = require('../models/kilpailu.js')

const handleError = function (err, res, message) {
  console.log('\n', message)
  console.log(err)
  res.status(500).send(message)
}

// hae kaudet
router.get('/kaudet/', (req, res) => {
  Kausi.find({}, (err, kaudet) => {
    if (err) return handleError(err, res, 'Virhe haettaessa kausia.')

    res.json(kaudet)
  })
})

// hae kausien nimet
router.get('/kaudet/nimet', (req, res) => {
  Kausi.find({}, (err, kaudet) => {
    if (err) return handleError(err, res, 'Virhe haettaessa kausien nimiä.')
    
    let kausienNimet = []
    kaudet.forEach(kausi => kausienNimet.push({id: kausi._id, nimi: kausi.nimi}))
    res.json(kausienNimet)
  })
})

// hae kausi
router.get('/kaudet/:kausiId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe haettaessa kautta.')
    
    res.json(kausi)
  })
})

// luo uusi kausi
router.post('/kaudet/', (req, res) => {
  const uusiKausi = new Kausi({nimi: req.body.nimi})

  uusiKausi.save((err, kausi) => {
    if (err) return handleError(err, res, 'Virhe luotaessa uutta kautta.')
    
    res.json(kausi)
  })
})

// muuta kauden nimeä
router.put('/kaudet/:kausiId', (req, res) => {
  Kausi.findByIdAndUpdate(req.params.kausiId, {nimi} = req.body, {new: true}, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe muutettaessa kauden nimeä.')
    
    res.json(kausi)
  })
})

// poista kausi
router.delete('/kaudet/:kausiId', (req, res) => {
  Kausi.findByIdAndDelete(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe poistettaessa kautta.')

    res.json(kausi)
  })
})

// hae kauden kilpailujen nimet
router.get('/kilpailut/:kausiId/nimet', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe haettaessa kausien nimiä.')
    
    let kilpailujenNimet = []
    kausi.kilpailut.forEach(kilpailu => kilpailujenNimet.push({id: kilpailu._id, nimi: kilpailu.nimi}))
    res.json(kilpailujenNimet)
  })
})

// hae kilpailu
router.get('/kilpailut/:kausiId/:kilpailuId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe haettaessa kilpailua.')
    
    res.json(kausi.kilpailut.id(req.params.kilpailuId))
  })
})

// luo uusi kilpailu
router.post('/kilpailut/:kausiId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe luotaessa uutta kilpailua.')
    
    if (kausi.kilpailut.some(kilpailu => kilpailu.nimi === req.body.nimi)) {
      res.status(400).send('Nimi käytetty jo toisessa kilpailussa. Valitse toinen nimi.')
      return
    }

    kausi.kilpailut.push({
      nimi: req.body.nimi,
      sarjat: req.body.sarjat,
      jarjestajat: req.body.jarjestajat
    })

    kausi.save(err => {
      if (err) return handleError(err, res, 'Virhe luotaessa uutta kilpailua.')

      res.json(kausi)
    })
  })
})

// muokkaa kilpailua
router.put('/kilpailut/:kausiId/:kilpailuId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe muokatessa kilpailua.')
    
    const kilpailu = kausi.kilpailut.id(req.params.kilpailuId)

    if (req.body.nimi) {
      if (!kausi.kilpailut.some(k => k.nimi === req.body.nimi)) {
        kilpailu.nimi = req.body.nimi
      }
    }

    if (req.body.sarjat) {
      req.body.sarjat.forEach(sarja => {
        if (sarja.id) {
          if (sarja.poista) {
            kilpailu.sarjat.id(sarja.id).remove()
          } else {
            // muokkaa sarjaa
            const s = kilpailu.sarjat.id(sarja.id)
            if (sarja.nimi) {
              s.nimi = sarja.nimi
            }
            if (sarja.lasketaanPisteet !== undefined) {
              s.lasketaanPisteet = sarja.lasketaanPisteet
            }
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
      
      res.json(kilpailu)
    })
  })
})

// poista kilpailu
router.delete('/kilpailut/:kausiId/:kilpailuId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe poistettaessa kilpailua.')

    kausi.kilpailut.id(req.params.kilpailuId).remove()
    kausi.save(err => {
      if (err) return handleError(err, res, 'Virhe poistettaessa kilpailua.')

      res.json(kausi)
    })
  })
})

// lisää uusi kilpailija
router.post('/kilpailijat/:kausiId/:kilpailuId/:sarjaId', (req, res) => {
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
router.put('/kilpailijat/:kausiId/:kilpailuId/:sarjaId/:kilpailijaId', (req, res) => {
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
router.delete('/kilpailijat/:kausiId/:kilpailuId/:sarjaId/:kilpailijaId', (req, res) => {
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

// lisää maaliintulo
router.post('/maaliintulot/:kausiId/:kilpailuId', (req, res) => {
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

    kausi.save(err => {
      if (err) return handleError(err, res, 'Virhe lisättäessä maaliintuloa.')

      res.json(kilpailu)
    })
  })
})

// muokkaa maaliintuloa
router.put('/maaliintulot/:kausiId/:kilpailuId/:maaliintuloId', (req, res) => {
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

    kausi.save(err => {
      if (err) return handleError(err, res, 'Virhe muokattaessa maaliintuloa.')

      res.json(kilpailu)
    })
  })
})

// poista maaliintulo
router.delete('/maaliintulot/:kausiId/:kilpailuId/:maaliintuloId', (req, res) => {
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

    kausi.save(err => {
      if (err) return handleError(err, res, 'Virhe poistettaessa maaliintuloa.')

      res.json(kilpailu)
    })
  })
})

module.exports = router