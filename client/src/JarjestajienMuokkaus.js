import React, { useRef } from 'react'
import axios from 'axios'

function JärjestäjienMuokkaus({ kilpailu, setKilpailu, aktiivinenKausi }) {
  const järjestäjänNimiInput = useRef(null)

  function lisääJärjestäjä() {
    const nimi = järjestäjänNimiInput.current.value
    järjestäjänNimiInput.current.value = ''
    axios.post(`api/jarjestajat/${aktiivinenKausi.id}/${kilpailu._id}`, { nimi: nimi })
      .then(vastaus => {
        setKilpailu(vastaus.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  function poistaJärjestäjä(järjestäjäId) {
    axios.delete(`api/jarjestajat/${aktiivinenKausi.id}/${kilpailu._id}/${järjestäjäId}`)
      .then(vastaus => {
        setKilpailu(vastaus.data)
      })
      .catch(err => {
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
            <td><button onClick={() => poistaJärjestäjä(järjestäjä._id)} className='btn-red'>Poista järjestäjä</button></td>
          </tr>)}
        </tbody>
      </table>

      <h4>Lisää järjestäjä:</h4>
      <label htmlFor='järjestäjänNimi'>Nimi:</label>
      <input ref={järjestäjänNimiInput} id='järjestäjänNimi' type='text' className='nimi'/>
      <button onClick={lisääJärjestäjä} className='btn-green'>Tallenna</button>
    </>
  )
}

export default JärjestäjienMuokkaus