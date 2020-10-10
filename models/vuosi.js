const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Kilpailu = require('./kilpailu.js')

const VuosiSchema = new Schema({
  vuosi: Number,
  kilpailijoidenPisteet: [{nimi: String, pisteet: {type: Map, of: Number}}],
  kilpailut: [Kilpailu]
})