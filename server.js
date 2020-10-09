const express = require('express')
const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const PORT = process.env.PORT || 3000

// yhteys tietokantaan
const db = process.env.MONGODB_URI
mongoose
  .connect(db, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => console.log('Yhdistetty tietokantaan.'))
  .catch(err => console.log(`Virhe tietokantaan yhdistämisessä: ${err}`))

app.get('/', (req, res) => {
  res.send('Hello, World!')
})

app.listen(PORT, () => console.log(`Sovellus käynnissä portissa ${PORT}.`))