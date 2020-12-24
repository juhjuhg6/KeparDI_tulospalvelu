import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

function UusiKilpailija({aktiivinenKausi, kilpailu, setKilpailu, setKilpailijanLisäys}) {
  const [tallentaa, setTallentaa] = useState(false)
  const nimiInput = useRef(null)
  const sarjaSelect = useRef(null)

  useEffect(() => {
    return () => setKilpailijanLisäys(false)
  })

  function tallennaKilpailija() {
    if (!nimiInput.current.value) return
    setTallentaa(true)
    
    axios.post(`api/kilpailijat/${aktiivinenKausi.id}/${kilpailu._id}/${sarjaSelect.current.value}`,
      {nimi: nimiInput.current.value})
      .then(vastaus => {
        setKilpailu(vastaus.data)
        setKilpailijanLisäys(false)
        setTallentaa(false)
      })
  }

  return (
    <div>
      <label htmlFor='nimi'>Nimi:</label>
      <input ref={nimiInput} type='text' id='nimi'/>
      <label htmlFor='sarja'>Sarja:</label>
      <select ref={sarjaSelect} id='sarja'>
        {kilpailu.sarjat.map(sarja => <option key={sarja._id} value={sarja._id}>{sarja.nimi}</option>)}
      </select>
      {tallentaa
      ? 'Talennetaan...'
      : <>
      <button onClick={() => setKilpailijanLisäys(false)}>Peruuta</button>
      <button onClick={tallennaKilpailija}>Tallenna</button>
      </>}
    </div>
  )
}

export default UusiKilpailija