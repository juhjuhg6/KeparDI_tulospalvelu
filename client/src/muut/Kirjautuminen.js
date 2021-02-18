import React, { useState, useRef, useContext } from 'react'
import axios from 'axios'
import Context from '../Context'

function Kirjautuminen() {
  const { kirjauduttu, setKirjauduttu } = useContext(Context)

  const [kirjautuminen, setKirjautuminen] = useState(false)

  const salasanaInput = useRef(null)

  function kirjaudu() {
    setKirjautuminen(false)

    axios.post('/login', {salasana: salasanaInput.current.value})
      .then(vastaus => {
        localStorage.setItem('jwt', vastaus.data.token)
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt')
        setKirjauduttu(true)
      })
      .catch(err => {
        console.log(err)
      })
    
    salasanaInput.current.value = ''
  }

  function poistaJwt() {
    setKirjauduttu(false)
    localStorage.removeItem('jwt')
  }

  return (
    <div>
      <br/>
      {kirjauduttu
      ? <button onClick={poistaJwt} className='btn-red'>Kirjaudu ulos</button>
      : kirjautuminen
        ? <>
          <label htmlFor='salasana'>Admin salasana</label>
          <input ref={salasanaInput} id='salasana' type='text' className='nimi'/>
          <button onClick={kirjaudu} className='btn-green'>Kirjaudu</button>
        </>
        : <button onClick={() => setKirjautuminen(true)} className='btn-yellow'>Kirjaudu</button>
      }
    </div>
  )
}

export default Kirjautuminen