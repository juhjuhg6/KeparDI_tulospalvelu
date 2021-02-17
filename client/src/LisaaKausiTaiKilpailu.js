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
        <button onClick={() => setLisättävä('kausi')} className='btn-yellow'>Lisää kausi</button>
        <button onClick={() => setLisättävä('kilpailu')} className='btn-yellow'>Lisää kilpailu</button>
      </> : <>
        <label htmlFor='nimi'>Nimi:</label>
        <input ref={nimiInput} id='nimi' type='text' className='nimi'/>
        {lisättävä === 'kilpailu'
        ? <>
          <label htmlFor='pvm'>Päivämäärä:</label>
          <input ref={pvmInput} id='pvm' type='text' placeholder='pp.kk.vvvv' className='input-pvm'/>
        </> : <></>}
        <button onClick={() => setLisättävä('')} className='btn-yellow'>Peruuta</button>
        <button onClick={tallenna} className='btn-green'>Tallenna</button>
      </>}
    </div>
  )
}

export default LisääKausiTaiKilpailu