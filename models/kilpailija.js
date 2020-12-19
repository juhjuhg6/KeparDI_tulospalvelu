const mongoose = require('mongoose')
const Schema = mongoose.Schema

const KilpailijaSchema = new Schema({
  nimi: String,
  kilpailut: {type: Map, of: {
    lahtoaika: Date,
    maaliaika: Date,
    muuTulos: String, // DNS/DNF/DSQ
    pisteet: {type: Number, default: 0}
  }}
})

module.exports = Kilpailija = mongoose.model('kilpailija', KilpailijaSchema)