const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Sarja = require('./sarja.js')
const Maaliintulo = require('./maaliintulo.js')

const KilpailuSchema = new Schema({
  nimi: {type: String, required: true},
  pvm: {type: Date, required: true},
  sarjat: [Sarja],
  maaliintulot: [Maaliintulo],
  jarjestajat: [String]
})

module.exports = KilpailuSchema