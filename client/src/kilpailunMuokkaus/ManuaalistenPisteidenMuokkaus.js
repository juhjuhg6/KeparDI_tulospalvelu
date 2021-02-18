import React, { useState, useContext } from 'react'
import axios from 'axios'
import Context from '../Context'
import jwtIsValid from '../helpers/jwtIsValid'
import ManuaalisetPisteet from './ManuaalisetPisteet.js'

function ManuaalistenPisteidenMuokkaus({ setMuokattava }) {
  const { kilpailu, setKilpailu, aktiivinenKausi, setKirjauduttu } = useContext(Context)

  const [uudetManuaalisetPisteet, setUudetManuaalisetPisteet] = useState({ ...kilpailu.manuaalisetPisteet })

  function asetaManuaalisetPisteet() {
    if (!jwtIsValid()) {
      localStorage.removeItem('jwt')
      axios.defaults.headers['Authorization'] = null
      setKirjauduttu(false)
      return
    }

    setMuokattava('')

    axios.post(`api/manuaalisetpisteet/${aktiivinenKausi.id}/${kilpailu._id}`,
      { manuaalisetPisteet: uudetManuaalisetPisteet })

      .then(vastaus => {
        setKilpailu(vastaus.data)
      })
      .catch(err => {
        if (err.response.status === 401) {
          setKirjauduttu(false)
          localStorage.removeItem('jwt')
          axios.defaults.headers.common['Authorization'] = null
        }
        console.log(err)
      })
  }

  function poistaManuaalisetPisteet() {
    if (!jwtIsValid()) {
      localStorage.removeItem('jwt')
      axios.defaults.headers['Authorization'] = null
      setKirjauduttu(false)
      return
    }

    setMuokattava('')

    axios.delete(`api/manuaalisetpisteet/${aktiivinenKausi.id}/${kilpailu._id}`)
      .then(vastaus => {
        setKilpailu(vastaus.data)
      })
      .catch(err => {
        if (err.response.status === 401) {
          setKirjauduttu(false)
          localStorage.removeItem('jwt')
          axios.defaults.headers.common['Authorization'] = null
        }
        console.log(err)
      })
  }

  return (
    <>
    <h4>Manuaaliset pisteet</h4>
      <table>
        <thead>
          <tr><th>Nimi</th><th>Pisteet</th><th></th></tr>
        </thead>
        <tbody>
          {kilpailu.kaikkiKilpailijat.map(kilpailija => <ManuaalisetPisteet key={kilpailija.id}
            kilpailija={kilpailija} uudetManuaalisetPisteet={uudetManuaalisetPisteet}
            setUudetManuaalisetPisteet={setUudetManuaalisetPisteet} />)}
        </tbody>
      </table>

      <button onClick={poistaManuaalisetPisteet} className='btn-red'>Poista kaikki manuaaliset pisteet</button>
      <button onClick={asetaManuaalisetPisteet} className='btn-green'>Tallenna</button>
    </>
  )
}

export default ManuaalistenPisteidenMuokkaus