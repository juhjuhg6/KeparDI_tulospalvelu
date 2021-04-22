import React from 'react'
import Ohje from './Ohje'
import { ohjelista } from './ohjelista'
import './ohjeet.css'

function Ohjeet() {
  return (
    ohjelista.map(ohje => <Ohje otsikko={ohje.otsikko} ohjeteksti={ohje.ohjeteksti} />)
  )
}

export default Ohjeet