const mongoose = require('mongoose')
const Schema = mongoose.Schema

const KilpailijaSchema = new Schema({
  nimi: String,
  lahtoaika: Date,
  maaliaika: Date,
  muuTulos: String // DNS/DNF/DSQ
})

module.exports = Kilpailija = mongoose.model('kilpailija', KilpailijaSchema)