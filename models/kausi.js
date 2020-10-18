const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Kilpailu = require('./kilpailu.js')

const KausiSchema = new Schema({
  nimi: {type: String, required: true, unique: true},
  tuloksiaMuutettuViimeksi: {type: Date, required: true, default: Date.now},
  pisteetPaivitettyViimeksi: {type: Date, required: true, default: Date.now},
  kilpailijoidenPisteet: [{nimi: String, pisteet: {type: Map, of: Number}}],
  kilpailut: [Kilpailu]
})

module.exports = Kausi = mongoose.model('kausi', KausiSchema)