import React, { useState, useRef, useContext } from 'react'
import Context from '../Context'
import jwtIsValid from '../helpers/jwtIsValid'
import axios from 'axios'

function JärjestäjienMuokkaus() {
  const { kilpailu, setKilpailu, aktiivinenKausi, setKirjauduttu } = useContext(Context)

  const [vahvistaPoisto, setVahvistaPoisto] = useState() //poistettavan järjestäjän id
  const [poistetaan, setPoistetaan] = useState() //poistettavan järjestäjän id

  const järjestäjänNimiInput = useRef(null)

  function lisääJärjestäjä() {
    const nimi = järjestäjänNimiInput.current.value
    järjestäjänNimiInput.current.value = ''

    if (!jwtIsValid()) {
      localStorage.removeItem('jwt')
      axios.defaults.headers['Authorization'] = null
      setKirjauduttu(false)
      return
    }

    axios.post(`/api/jarjestajat/${aktiivinenKausi.id}/${kilpailu._id}`, { nimi: nimi })
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

  function poistaJärjestäjä(järjestäjäId) {
    setPoistetaan(järjestäjäId)

    if (!jwtIsValid()) {
      localStorage.removeItem('jwt')
      axios.defaults.headers['Authorization'] = null
      setKirjauduttu(false)
      return
    }

    axios.delete(`/api/jarjestajat/${aktiivinenKausi.id}/${kilpailu._id}/${järjestäjäId}`)
      .then(vastaus => {
        setKilpailu(vastaus.data)
        setPoistetaan(null)
        setVahvistaPoisto(null)
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

  return(
    <>
    <h4>Järjestäjät</h4>
      <table>
        <thead>
          <tr><th>Nimi</th><th></th></tr>
        </thead>
        <tbody>
          {kilpailu.jarjestajat.map(järjestäjä => <tr key={järjestäjä._id}>
            <td className='nimi'>{järjestäjä.nimi}</td>
            <td>
              {vahvistaPoisto !== järjestäjä._id
                ? 
                  <button onClick={() => setVahvistaPoisto(järjestäjä._id)} className='btn-red'>Poista</button>
                :
                  poistetaan !== järjestäjä._id
                    ?
                      <>
                        <button onClick={() => setVahvistaPoisto(null)} className='btn-yellow'>Peruuta</button>
                        <button onClick={() => poistaJärjestäjä(järjestäjä._id)} className='btn-red'>Vahvista poisto</button>
                      </>
                    :
                      'Poistetaan...'
              }
            </td>
          </tr>)}
        </tbody>
      </table>
      <br/>

      <h4>Lisää järjestäjä:</h4>
      <div style={{ display: 'inline-block' }}>
        <label htmlFor='järjestäjänNimi'>Nimi:</label>
        <input ref={järjestäjänNimiInput} id='järjestäjänNimi' type='text' className='nimi'/>
      </div>
      <div style={{ display: 'inline-block' }}>
        <button onClick={lisääJärjestäjä} className='btn-green'>Tallenna</button>
      </div>
    </>
  )
}

export default JärjestäjienMuokkaus