import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import moment from 'moment'
import Maaliintulo from './Maaliintulo.js'

function Maaliintulot({aktiivinenKausi, kilpailu, setKilpailu}) {
  const [aika, setAika] = useState(moment())
  const [muuTulosSarake, setMuuTulosSarake] = useState(false)

  const nimiInput = useRef(null)
  const aikaInput = useRef(null)
  const muuTulosSelect = useRef(null)

  useEffect(() => {
    const ajastin = setInterval(() => setAika(moment()), 1000)

    return () => clearInterval(ajastin)
  }, [])
  
  useEffect(() => {
    if (kilpailu.maaliintulot.some(maaliintulo => maaliintulo.muuTulos)) {
      setMuuTulosSarake(true)
    } else {
      setMuuTulosSarake(false)
    }
  }, [kilpailu])

  function asetaMaaliaika() {
    aikaInput.current.value = moment().format('HH.mm.ss')
  }

  function lisääMaaliintulo() {
    const kilpailija = kilpailu.kaikkiKilpailijat.find(k => k.nimi === nimiInput.current.value)
    let maaliintuloaika

    if (aikaInput.current.value !== '') {
      const asetettavaMaaliintuloaika = moment(aikaInput.current.value, 'HH.mm.ss')
      maaliintuloaika = moment(kilpailu.pvm)
      maaliintuloaika.hours(asetettavaMaaliintuloaika.hours())
      maaliintuloaika.minutes(asetettavaMaaliintuloaika.minutes())
      maaliintuloaika.seconds(asetettavaMaaliintuloaika.seconds())
    }

    let pyyntö = {}
    
    if (kilpailija) {
      pyyntö.kilpailija = kilpailija.id
    } else {
      pyyntö.nimi = nimiInput.current.value
    }
    if (maaliintuloaika) pyyntö.maaliintuloaika = maaliintuloaika
    pyyntö.muuTulos = muuTulosSelect.current.value

    axios.post(`api/maaliintulot/${aktiivinenKausi.id}/${kilpailu._id}`, pyyntö)
      .then(vastaus => {
        setKilpailu(vastaus.data)
      })
      .catch(err => {
        console.log(err)
      })
    
    nimiInput.current.value = ''
    aikaInput.current.value = ''
    muuTulosSelect.current.value = ''
  }

  return (
    <div>
      <p>Uusi maaliintulo:</p>
      <label htmlFor='nimi'>Nimi:</label>
      <input ref={nimiInput} id='nimi'/>
      <label htmlFor='maaliintuloaika'>Maaliintuloaika:</label>
      <input ref={aikaInput} id='maaliintuloaika' placeholder={aika.format('HH.mm.ss')}/>
      <button onClick={asetaMaaliaika}>Nyt</button>
      <label htmlFor='muuTulos'>Muu tulos:</label>
      <select ref={muuTulosSelect} id='muuTulos'>
        <option></option>
        <option value='DNS'>DNS</option>
        <option value='DNF'>DNF</option>
        <option value='DSQ'>DSQ</option>
      </select>
      <button onClick={lisääMaaliintulo}>Tallenna uusi maaliintulo</button>
      <table>
        <thead>
          <tr>
            <th>Nimi</th><th>Maaliintuloaika</th>
            {muuTulosSarake ? <th>Muu tulos</th> : <></>}
          </tr>
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