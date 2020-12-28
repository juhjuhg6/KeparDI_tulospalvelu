import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import moment from 'moment'
import Maaliintulo from './Maaliintulo.js'

function Maaliintulot({aktiivinenKausi, kilpailu, setKilpailu}) {
  const [aika, setAika] = useState(moment())

  const nimiInput = useRef(null)
  const aikaInput = useRef(null)

  useEffect(() => {
    const ajastin = setInterval(() => setAika(moment()), 1000)

    return () => clearInterval(ajastin)
  })

  function asetaMaaliaika() {
    aikaInput.current.value = moment().format('HH.mm.ss')
  }

  function lisääMaaliintulo() {
    const kilpailija = kilpailu.kaikkiKilpailijat.find(k => k.nimi === nimiInput.current.value)
    const maaliintuloaika = moment(aikaInput.current.value, 'HH.mm.ss')
    let pyyntö = {}
    if (kilpailija) pyyntö.kilpailija = kilpailija.id
    if (maaliintuloaika) pyyntö.maaliintuloaika = maaliintuloaika

    axios.post(`api/maaliintulot/${aktiivinenKausi.id}/${kilpailu._id}`, pyyntö)
      .then(vastaus => {
        setKilpailu(vastaus.data)
      })
      .catch(err => {
        console.log(err)
      })
    
    nimiInput.current.value = ''
    aikaInput.current.value = ''
  }

  return (
    <div>
      <p>Uusi maaliintulo:</p>
      <label htmlFor='nimi'>Nimi:</label>
      <input ref={nimiInput} id='nimi'/>
      <label htmlFor='maaliintuloaika'>Maaliintuloaika:</label>
      <input ref={aikaInput} id='maaliintuloaika' placeholder={aika.format('HH.mm.ss')}/>
      <button onClick={asetaMaaliaika}>Nyt</button>
      <button onClick={lisääMaaliintulo}>Tallenna uusi maaliintulo</button>
      <table>
        <thead>
          <tr><th>Nimi</th><th>Maaliintuloaika</th></tr>
        </thead>
        <tbody>
          {kilpailu.maaliintulot.map(maaliintulo => <Maaliintulo key={maaliintulo._id}
            maaliintulo={maaliintulo} aktiivinenKausi={aktiivinenKausi}
            kilpailu={kilpailu} setKilpailu={setKilpailu} />)}
        </tbody>
      </table>
    </div>
  )
}

export default Maaliintulot