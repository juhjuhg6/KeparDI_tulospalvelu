/* Maaliintullessa kirjataan vain kipailijan nimi ja maaliintuloaika
maaliintuloaikoihin, joista maaliintuloajat voidaan päivittää
kilpailijoiden tietoihin erillisellä päivityksellä */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MaaliintuloSchema = new Schema({
  kilpailija: String, // kilpailijan id
  maaliintuloaika: Date
})

module.exports = MaaliintuloSchema