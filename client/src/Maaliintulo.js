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
    const kilpailija = kilpailu.kaikkiKilpailijat.find(k => nimiInput.current.value === k.nimi)
    const maaliintuloaika = moment(aikaInput.current.value, 'HH.mm.ss')

    axios.put(`api/maaliintulot/${aktiivinenKausi.id}/${kilpailu._id}/${maaliintulo._id}`,
      {kilpailija: kilpailija ? kilpailija.id : null, maaliintuloaika: maaliintuloaika})
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
      <td>{kilpailijanNimi(maaliintulo.kilpailija)}</td>
      <td>{maaliaikaStr()}</td>
      <td>
        <button onClick={() => setMuokkaus(true)}>Muokkaa</button>
        <button onClick={poistaMaaliaika}>Poista</button>
      </td>
      </> : <>
      <td><input ref={nimiInput} type='text' defaultValue={kilpailijanNimi(maaliintulo.kilpailija)} /></td>
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