const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Kilpailija = require('kilpailija.js')
const Maaliintulo = require('maaliintulo.js')

const KilpailuSchema = new Schema({
  sarjat: {type: Map, of: [Kilpailija]},
  maaliintulot: [Maaliintulo],
  jarjestajat: [String]
})

module.exports = Kilpailu = mongoose.model('kilpailu', KilpailuSchema)