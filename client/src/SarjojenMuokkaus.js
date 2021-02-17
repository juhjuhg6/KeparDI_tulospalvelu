import React, { useState, useRef } from 'react'
import axios from 'axios'

function SarjojenMuokkaus({ kilpailu, setKilpailu, aktiivinenKausi }) {
  const [muokattavaSarja, setMuokattavaSarja] = useState()

  const muokattavanSarjanNimiInput = useRef(null)
  const muokattavanSarjanLasketaanPisteetCheckbox = useRef(null)
  const uudenSarjanNimiInput = useRef(null)
  const uudenSarjanLasketaanPisteetCheckbox = useRef(null)

  function lisääSarja() {
    let pyyntöBody = { nimi: uudenSarjanNimiInput.current.value }
    pyyntöBody.lasketaanPisteet = uudenSarjanLasketaanPisteetCheckbox.current.checked
    uudenSarjanNimiInput.current.value = ''
    uudenSarjanLasketaanPisteetCheckbox.current.checked = true

    axios.post(`api/sarjat/${aktiivinenKausi.id}/${kilpailu._id}`, pyyntöBody)
      .then(vastaus => {
        setKilpailu(vastaus.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  function muokkaaSarjaa(sarjaId) {
    setMuokattavaSarja(null)
    let pyyntöBody = {}
    if (muokattavanSarjanNimiInput.current.value) pyyntöBody.nimi = muokattavanSarjanNimiInput.current.value
    pyyntöBody.lasketaanPisteet = muokattavanSarjanLasketaanPisteetCheckbox.current.checked

    axios.put(`api/sarjat/${aktiivinenKausi.id}/${kilpailu._id}/${sarjaId}`, pyyntöBody)
      .then(vastaus => {
        setKilpailu(vastaus.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  function poistaSarja(sarjaId) {
    axios.delete(`api/sarjat/${aktiivinenKausi.id}/${kilpailu._id}/${sarjaId}`)
      .then(vastaus => {
        setKilpailu(vastaus.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div>
      <h4>Sarjat</h4>
      <table>
        <thead>
          <tr>
            <th>Nimi</th><th>Lasketaan pisteet</th><th></th>
          </tr>
        </thead>
        <tbody>
          {kilpailu.sarjat.map(sarja => <tr key={sarja._id}>
            {muokattavaSarja !== sarja._id
              ? <>
                <td className='nimi'>{sarja.nimi}</td>
                <td>{sarja.lasketaanPisteet ? 'kyllä' : 'ei'}</td>
                <td>
                  <button onClick={() => setMuokattavaSarja(sarja._id)} className='btn-yellow'>Muokkaa sarjaa</button>
                  <button onClick={() => poistaSarja(sarja._id)} className='btn-red'>Poista sarja</button>
                </td>
              </> : <>
                <td><input ref={muokattavanSarjanNimiInput} type='text' placeholder={sarja.nimi}
                  className='nimi' /></td>
                <td>
                  <input ref={muokattavanSarjanLasketaanPisteetCheckbox} type='checkbox' id='muokattavanLasketaanPisteet'
                    defaultChecked={sarja.lasketaanPisteet} />
                  <label htmlFor='muokattavanLasketaanPisteet'>Lasketaan pisteet</label>
                </td>
                <td>
                  <button onClick={() => setMuokattavaSarja(null)} className='btn-yellow'>Peruuta</button>
                  <button onClick={() => muokkaaSarjaa(sarja._id)} className='btn-green'>Tallenna</button>
                </td>
              </>}
          </tr>)}
        </tbody>
      </table>

      <h4>Lisää sarja:</h4>
      <label htmlFor='sarjanNimi'>Nimi:</label>
      <input ref={uudenSarjanNimiInput} id='sarjanNimi' type='text' className='nimi' />
      <input ref={uudenSarjanLasketaanPisteetCheckbox} id='lasketaanPisteet' type='checkbox' defaultChecked={true} />
      <label htmlFor='lasketaanPisteet'>Lasketaan pisteet</label>
      <button onClick={lisääSarja} className='btn-green'>Tallenna</button>
    </div>
  )
}

export default SarjojenMuokkaus