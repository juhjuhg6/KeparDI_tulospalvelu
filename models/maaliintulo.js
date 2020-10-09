/* Maaliintullessa kirjataan vain kipailijan nimi ja maaliintuloaika
maaliintuloaikoihin, joista maaliintuloajat voidaan päivittää
kilpailijoiden tietoihin erillisellä päivityksellä */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MaaliintuloSchema = new Schema({
  nimi: String,
  maaliintuloaika: Date
})

module.exports = Maaliintulo = mongoose.model('maaliintulo', MaaliintuloSchema)