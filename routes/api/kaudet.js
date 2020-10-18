const express = require('express')
const router = express.Router()

const Kausi = require('../../models/kausi.js')

const handleError = function (err, res, message) {
  console.log('\n', message)
  console.log(err)
  res.status(500).send(message)
}

// hae kaudet
router.get('/', (req, res) => {
  Kausi.find({}, (err, kaudet) => {
    if (err) return handleError(err, res, 'Virhe haettaessa kausia.')

    res.json(kaudet)
  })
})

// hae kausien nimet
router.get('/nimet', (req, res) => {
  Kausi.find({}, (err, kaudet) => {
    if (err) return handleError(err, res, 'Virhe haettaessa kausien nimiä.')
    
    let kausienNimet = []
    kaudet.forEach(kausi => kausienNimet.push({id: kausi._id, nimi: kausi.nimi}))
    res.json(kausienNimet)
  })
})

// hae kausi
router.get('/:kausiId', (req, res) => {
  Kausi.findById(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe haettaessa kautta.')
    
    res.json(kausi)
  })
})

// luo uusi kausi
router.post('/', (req, res) => {
  const uusiKausi = new Kausi({nimi: req.body.nimi})

  uusiKausi.save((err, kausi) => {
    if (err) return handleError(err, res, 'Virhe luotaessa uutta kautta.')
    
    res.json(kausi)
  })
})

// muuta kauden nimeä
router.put('/:kausiId', (req, res) => {
  Kausi.findByIdAndUpdate(req.params.kausiId, {nimi} = req.body, {new: true}, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe muutettaessa kauden nimeä.')
    
    res.json(kausi)
  })
})

// poista kausi
router.delete('/:kausiId', (req, res) => {
  Kausi.findByIdAndDelete(req.params.kausiId, (err, kausi) => {
    if (err) return handleError(err, res, 'Virhe poistettaessa kautta.')

    res.json(kausi)
  })
})

module.exports = router