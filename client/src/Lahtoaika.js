import React, { useState, useRef } from 'react'
import axios from 'axios'
import moment from 'moment'

function Lähtöaika({aktiivinenKausi, kilpailija, kilpailu, setKilpailu, sarja, momentFormat}) {
  const [muokkaus, setMuokkaus] = useState(false)
  const [tallentaa, setTallentaa] = useState(false)

  const aikaInput = useRef(null)

  function lähtöaikaStr() {
    if (kilpailija.kilpailut[kilpailu._id].lahtoaika) {
      return moment(kilpailija.kilpailut[kilpailu._id].lahtoaika).format(momentFormat)
    } else {
      return ''
    }
  }

  function muokkaaLähtöaikaa() {
    setTallentaa(true)
    
    let lähtöaika
    if (aikaInput.current.value) {
      const asetettavaLähtöaika = moment(aikaInput.current.value, 'HH.mm.ss')
      lähtöaika = moment(kilpailu.pvm)
      lähtöaika.hours(asetettavaLähtöaika.hours())
      lähtöaika.minutes(asetettavaLähtöaika.minutes())
      lähtöaika.seconds(asetettavaLähtöaika.seconds())
    } else {
      lähtöaika = null
    }
    
    axios.put(`api/kilpailijat/${aktiivinenKausi.id}/${kilpailu._id}/${sarja._id}/${kilpailija._id}`,
      {lahtoaika: lähtöaika})
      .then(vastaus => {
        setKilpailu(vastaus.data)
        setMuokkaus(false)
        setTallentaa(false)
      })
      .catch(err => {
        console.log(err)
      })
  }

  function poistaKilpailija() {
    axios.delete(`api/kilpailijat/${aktiivinenKausi.id}/${kilpailu._id}/${sarja._id}/${kilpailija._id}`)
      .then(vastaus => {
        setKilpailu(vastaus.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  return(
    <tr>
      <td>{kilpailija.nimi}</td>
      {!muokkaus
      ? <>
      <td>{lähtöaikaStr()}</td>
      <td>
        <button onClick={() => setMuokkaus(true)}>Muuta lähtöaikaa</button>
        <button onClick={poistaKilpailija}>Poista</button>
      </td>
      </> : <>
      <td><input ref={aikaInput} type='text' placeholder={lähtöaikaStr()} /></td>
      <td>
        {tallentaa
        ? 'Tallennetaan...'
        : <>
        <button onClick={() => setMuokkaus(false)}>Peruuta</button>
        <button onClick={muokkaaLähtöaikaa}>Tallenna</button>
        </>}
      </td>
      </>}
    </tr>
  )
}

export default Lähtöaika