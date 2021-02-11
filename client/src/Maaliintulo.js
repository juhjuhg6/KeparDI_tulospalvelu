import React, { useState, useRef } from 'react'
import axios from 'axios'
import moment from 'moment'

function Maaliintulo({maaliintulo, aktiivinenKausi, kilpailu, setKilpailu}) {
  const [muokkaus, setMuokkaus] = useState(false)
  const [tallentaa, setTallentaa] = useState(false)

  const nimiInput = useRef(null)
  const aikaInput = useRef(null)

  function maaliaikaStr() {
    if (maaliintulo.maaliintuloaika) {
      return moment(maaliintulo.maaliintuloaika).format('HH.mm.ss')
    } else {
      return ''
    }
  }

  function kilpailijanNimi(kilpailijaId) {
    if (kilpailijaId) {
      return kilpailu.kaikkiKilpailijat.find(k => k.id === kilpailijaId).nimi
    } else {
      return ''
    }
  }

  function muokkaaMaaliaikaa() {
    setTallentaa(true)
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
    if (maaliintuloaika) {
      pyyntö.maaliintuloaika = maaliintuloaika
    } else {
      pyyntö.maaliintuloaika = ''
    }

    axios.put(`api/maaliintulot/${aktiivinenKausi.id}/${kilpailu._id}/${maaliintulo._id}`, pyyntö)
      .then(vastaus => {
        setKilpailu(vastaus.data)
        setMuokkaus(false)
        setTallentaa(false)
      })
      .catch(err => {
        console.log(err)
      })
  }

  function poistaMaaliaika() {
    axios.delete(`api/maaliintulot/${aktiivinenKausi.id}/${kilpailu._id}/${maaliintulo._id}`)
      .then(vastaus => {
        setKilpailu(vastaus.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <tr>
      {!muokkaus
      ? <>
      <td>
        {maaliintulo.kilpailija 
          ? kilpailijanNimi(maaliintulo.kilpailija)
          : maaliintulo.nimi}
      </td>
      <td>{maaliaikaStr()}</td>
      <td>
        <button onClick={() => setMuokkaus(true)}>Muokkaa</button>
        <button onClick={poistaMaaliaika}>Poista</button>
      </td>
      </> : <>
      <td><input ref={nimiInput} type='text' defaultValue={maaliintulo.kilpailija
        ? kilpailijanNimi(maaliintulo.kilpailija) : maaliintulo.nimi} /></td>
      <td><input ref={aikaInput} type='text' defaultValue={maaliaikaStr()} /></td>
      <td>
        {tallentaa
        ? 'Tallennetaan...'
        : <>
        <button onClick={() => setMuokkaus(false)}>Peruuta</button>
        <button onClick={muokkaaMaaliaikaa}>Tallenna</button>
        </>}
      </td>
      </>}
    </tr>
  )
}

export default Maaliintulo