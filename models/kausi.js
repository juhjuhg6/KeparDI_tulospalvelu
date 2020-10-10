const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Kilpailu = require('./kilpailu.js')

const KausiSchema = new Schema({
  nimi: String,
  kilpailijoidenPisteet: [{nimi: String, pisteet: {type: Map, of: Number}}],
  kilpailut: [Kilpailu]
})

module.exports = Kausi = mongoose.model('kausi', KausiSchema)