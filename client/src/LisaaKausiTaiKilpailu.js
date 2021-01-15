import React, { useState, useRef } from 'react'
import axios from 'axios'
import moment from 'moment'

function LisääKausiTaiKilpailu({aktiivinenKausi, päivitäKausienJaKilpailujenNimet}) {
  const [lisättävä, setLisättävä] = useState('')

  const nimiInput = useRef(null)
  const pvmInput = useRef(null)

  function tallenna() {
    let pyyntöUrl
    let pyyntöBody
    if (lisättävä === 'kausi') {
      pyyntöUrl = 'api/kaudet'
      if (!nimiInput.current.value) return
      pyyntöBody = {nimi: nimiInput.current.value}
    } else if (lisättävä === 'kilpailu') {
      pyyntöUrl = `api/kilpailut/${aktiivinenKausi.id}`
      if (!nimiInput.current.value || !pvmInput.current.value) return
      pyyntöBody = {nimi: nimiInput.current.value, pvm: moment(pvmInput.current.value, 'DD.MM.YYYY')}
    } else {
      return
    }

    axios.post(pyyntöUrl, pyyntöBody)
      .then(vastaus => {
        päivitäKausienJaKilpailujenNimet()
      })
      .catch(err => {
        console.log(err)
      })

    
    setLisättävä('')
  }

  return (
    <div>
      {!lisättävä
      ? <>
        <button onClick={() => setLisättävä('kausi')}>Lisää kausi</button>
        <button onClick={() => setLisättävä('kilpailu')}>Lisää kilpailu</button>
      </> : <>
        <label htmlFor='nimi'>Nimi:</label>
        <input ref={nimiInput} id='nimi' type='text'/>
        {lisättävä === 'kilpailu'
        ? <>
          <label htmlFor='pvm'>Päivämäärä:</label>
          <input ref={pvmInput} id='pvm' type='text' placeholder='pp.kk.vvvv'/>
        </> : <></>}
        <button onClick={() => setLisättävä('')}>Peruuta</button>
        <button onClick={tallenna}>Tallenna</button>
      </>}
    </div>
  )
}

export default LisääKausiTaiKilpailu