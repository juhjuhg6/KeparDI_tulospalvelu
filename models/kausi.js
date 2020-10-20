const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Kilpailu = require('./kilpailu.js')

const KausiSchema = new Schema({
  nimi: {type: String, required: true, unique: true},
  kilpailut: [Kilpailu]
})

module.exports = Kausi = mongoose.model('kausi', KausiSchema)