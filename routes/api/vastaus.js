const Kilpailija = require('../../models/kilpailija.js')

const handleError = function (err, res, message) {
  console.log('\n', message)
  console.log(err)
  res.status(500).send(message)
}

module.exports = function (kilpailu, res) {
  const haeJärjestäjät = function () {
    Kilpailija.find({'_id': {$in: kilpailu.jarjestajat}}, (err, järjestäjät) => {
      if (err) handleError(err, res, 'Virhe luotaessa vastausta.')

      järjestäjät.forEach(järjestäjä => {
        const kilpailudata = järjestäjä.kilpailut.get(kilpailu._id.toString())
        järjestäjä.kilpailut.clear()
        järjestäjä.kilpailut.set(kilpailu._id.toString(), kilpailudata)
      })

      kilpailu.jarjestajat = järjestäjät

      haeSarjanKilpailijat(0)
    })
  }

  const haeSarjanKilpailijat = function (i) {
    const sarja = kilpailu.sarjat[i]
    if (!sarja) {
      return lähetäVastaus()
    }

    Kilpailija.find({'_id': {$in: sarja.kilpailijat}}, (err, kilpailijat) => {
      if (err) handleError(err, res, 'Virhe luotaessa vastausta.')
      
      kilpailijat.forEach(kilpailija => {
        const kilpailudata = kilpailija.kilpailut.get(kilpailu._id.toString())
        kilpailija.kilpailut.clear()
        kilpailija.kilpailut.set(kilpailu._id.toString(), kilpailudata)
      })

      kilpailu.sarjat[i].kilpailijat = kilpailijat

      haeSarjanKilpailijat(i+1)
    })
  }

  const lähetäVastaus = function () {
    res.send(kilpailu)
  }

  haeJärjestäjät()
} 