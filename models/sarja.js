const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Kilpailija = require('./kilpailija.js')

const SarjaSchema = new Schema({
  nimi: {type: String, required: true},
  lasketaanPisteet: {type: Boolean, default: true},
  manuaalisetPisteet: [{nimi: String, pisteet: Number}],
  kilpailijat: [Kilpailija]
})

module.exports = SarjaSchema