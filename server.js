const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const PORT = process.env.PORT || 3001

// middleware
app.use(express.json())

// yhteys tietokantaan
const db = process.env.MONGODB_URI
mongoose
  .connect(db, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => console.log('Yhdistetty tietokantaan.'))
  .catch(err => console.log(`Virhe tietokantaan yhdistämisessä: ${err}`))

// routes
app.use('/api/kaudet/', require('./routes/api/kaudet.js'))
app.use('/api/kilpailut/', require('./routes/api/kilpailut.js'))
app.use('/api/maaliintulot/', require('./routes/api/maaliintulot.js'))
app.use('/api/sarjat/', require('./routes/api/sarjat.js'))
app.use('/api/kilpailijat/', require('./routes/api/kilpailijat.js'))
app.use('/api/jarjestajat/', require('./routes/api/jarjestajat.js'))
app.use('/api/pisteet/', require('./routes/api/pisteet.js'))
app.use('/api/manuaalisetpisteet/', require('./routes/api/manuaalisetPisteet.js'))

app.use(express.static('client/build'))
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')))

app.listen(PORT, () => console.log(`Sovellus käynnissä portissa ${PORT}.`))