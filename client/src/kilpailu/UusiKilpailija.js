import React, { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import Context from '../Context'
import jwtIsValid from '../helpers/jwtIsValid'

function UusiKilpailija({ setKilpailijanLisäys }) {
  const { kilpailu, setKilpailu, aktiivinenKausi, setKirjauduttu } = useContext(Context)

  const [tallentaa, setTallentaa] = useState(false)

  const nimiInput = useRef(null)
  const sarjaSelect = useRef(null)

  useEffect(() => {
    setKirjauduttu(jwtIsValid())

    return () => setKilpailijanLisäys(false)
    // eslint-disable-next-line
  }, [])

  function tallennaKilpailija() {
    if (!jwtIsValid()) {
      localStorage.removeItem('jwt')
      axios.defaults.headers['Authorization'] = null
      setKirjauduttu(false)
      return
    }
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
      <div>
        <label htmlFor='nimi'>Nimi:</label>
        <input ref={nimiInput} type='text' id='nimi' className='nimi'/>
      </div>
      <div>
        <label htmlFor='sarja'>Sarja:</label>
        <select ref={sarjaSelect} id='sarja'>
          {kilpailu.sarjat.map(sarja => <option key={sarja._id} value={sarja._id}>{sarja.nimi}</option>)}
        </select>
      </div>
      {tallentaa
      ? 'Talennetaan...'
      : <>
      <button onClick={() => setKilpailijanLisäys(false)} className='btn-yellow'>Peruuta</button>
      <button onClick={tallennaKilpailija} className='btn-green'>Tallenna</button>
      </>}
    </div>
  )
}

export default UusiKilpailija