import React, { useState, useRef } from 'react'
import axios from 'axios'
import moment from 'moment'

function Lähtöaika({aktiivinenKausi, kilpailija, kilpailu, setKilpailu, sarja}) {
  const [muokkaus, setMuokkaus] = useState(false)

  const aikaInput = useRef(null)

  function lähtöaikaStr() {
    if (kilpailija.kilpailut[kilpailu._id].lahtoaika) {
      return moment(kilpailija.kilpailut[kilpailu._id].lahtoaika).format('HH.mm')
    } else {
      return ''
    }
  }

  function muokkaaLähtöaikaa() {
    const lähtöaika = moment(aikaInput.current.value, 'HH.mm')
    axios.put(`api/kilpailijat/${aktiivinenKausi.id}/${kilpailu._id}/${sarja._id}/${kilpailija._id}`,
      {lahtoaika: lähtöaika.add(kilpailu.pvm)})
      .then(vastaus => {
        setKilpailu(vastaus.data)
      })
      .catch(err => {
        console.log(err)
      })
    setMuokkaus(false)
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
        <button onClick={() => setMuokkaus(false)}>Peruuta</button>
        <button onClick={muokkaaLähtöaikaa}>Tallenna</button>
      </td>
      </>}
    </tr>
  )
}

export default Lähtöaika