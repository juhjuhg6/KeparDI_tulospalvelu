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
    if (!nimiInput.current.value) return

    setTallentaa(true)
    
    axios.post(`/api/kilpailijat/${aktiivinenKausi.id}/${kilpailu._id}/${sarjaSelect.current.value}`,
      {nimi: nimiInput.current.value})
      .then(vastaus => {
        setKilpailu(vastaus.data)
        setKilpailijanLisäys(false)
        setTallentaa(false)
      })
      .catch(err => {
        setKilpailijanLisäys(false)
        setTallentaa(false)
        if (err.response.status === 401) {
          setKirjauduttu(false)
          localStorage.removeItem('jwt')
          axios.defaults.headers.common['Authorization'] = null
        }
        console.log(err)
      })
  }

  return (
    <div>
      <div style={{ display: 'inline-block' }}>
        <label htmlFor='nimi'>Nimi:</label>
        <input ref={nimiInput} type='text' id='nimi' className='nimi'/>
      </div>
      <div style={{ display: 'inline-block' }}>
        <label htmlFor='sarja'>Sarja:</label>
        <select ref={sarjaSelect} id='sarja'>
          {kilpailu.sarjat.map(sarja => <option key={sarja._id} value={sarja._id}>{sarja.nimi}</option>)}
        </select>
      </div>
      {tallentaa
        ?
          'Talennetaan...'
        :
          <div>
            <button onClick={() => setKilpailijanLisäys(false)} className='btn-yellow'>Peruuta</button>
            <button onClick={tallennaKilpailija} className='btn-green'>Tallenna</button>
          </div>
      }
    </div>
  )
}

export default UusiKilpailija