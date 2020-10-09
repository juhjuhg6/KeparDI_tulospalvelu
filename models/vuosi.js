const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Kilpailu = require('kilpailu.js')

const VuosiSchema = new Schema({
  vuosi: Number,
  kilpailijat: [{nimi: String, pisteet: [Number]}],
  kilpailut: {type: Map, of: Kilpailu}
})