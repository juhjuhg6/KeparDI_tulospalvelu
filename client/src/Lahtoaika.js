import React, { useState, useRef } from 'react'
import axios from 'axios'
import moment from 'moment'

function Lähtöaika({aktiivinenKausi, kilpailija, kilpailu, setKilpailu, sarja}) {
  const [muokkaus, setMuokkaus] = useState(false)

  const aikaInput = useRef(null)

  const lähtöaikaStr = moment(kilpailija.kilpailut[kilpailu._id.toString()].lahtoaika).format('HH.mm')

  function muokkaaLähtöaikaa() {
    const lähtöaika = moment(aikaInput.current.value, 'HH.mm')
    axios.put(`api/kilpailijat/${aktiivinenKausi.id.toString()}/${kilpailu._id.toString()}/${sarja._id.toString()}/${kilpailija._id.toString()}`,
      {lahtoaika: lähtöaika.add(kilpailu.pvm)})
      .then(vastaus => {
        setKilpailu(vastaus.data)
      })
      .catch(err => {
        console.log(err)
      })
    setMuokkaus(false)
  }

  return(
    <tr>
      <td>{kilpailija.nimi}</td>
      {!muokkaus
      ? <>
      <td>{lähtöaikaStr}</td>
      <td><button onClick={() => setMuokkaus(true)}>Muuta lähtöaikaa</button></td>
      </> : <>
      <td><input ref={aikaInput} type='text' placeholder={lähtöaikaStr} /></td>
      <td>
        <button onClick={() => setMuokkaus(false)}>Peruuta</button>
        <button onClick={muokkaaLähtöaikaa}>Tallenna</button>
      </td>
      </>}
    </tr>
  )
}

export default Lähtöaika