const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SarjaSchema = new Schema({
  nimi: {type: String, required: true},
  lasketaanPisteet: {type: Boolean, default: true},
  manuaalisetPisteet: [{nimi: String, pisteet: Number}],
  kilpailijat: [String] // kilpailijaId:t
})

module.exports = SarjaSchema