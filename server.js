const express = require('express')
const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const PORT = process.env.PORT || 3000

// middleware
app.use(express.json())

// yhteys tietokantaan
const db = process.env.MONGODB_URI
mongoose
  .connect(db, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => console.log('Yhdistetty tietokantaan.'))
  .catch(err => console.log(`Virhe tietokantaan yhdistämisessä: ${err}`))

app.get('/', (req, res) => {
  res.send('Hello, World!')
})

// routes
app.use('/api/kaudet/', require('./routes/api/kaudet.js'))
app.use('/api/kilpailut/', require('./routes/api/kilpailut.js'))
app.use('/api/maaliintulot/', require('./routes/api/maaliintulot.js'))
app.use('/api/sarjat/', require('./routes/api/sarjat.js'))
app.use('/api/kilpailijat/', require('./routes/api/kilpailijat.js'))

app.listen(PORT, () => console.log(`Sovellus käynnissä portissa ${PORT}.`))