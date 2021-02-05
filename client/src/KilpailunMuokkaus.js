import React, { useState, useRef } from 'react'
import axios from 'axios'
import moment from 'moment'

function KilpailunMuokkaus({ aktiivinenKausi, kilpailu, setKilpailu, päivitäKausienJaKilpailujenNimet }) {
  const [kilpailunMuokkaus, setKilpailunMuokkaus] = useState(false)
  const [sarjojenMuokkaus, setSarjojenMuokkaus] = useState(false)
  const [muokattavaSarja, setMuokattavaSarja] = useState()

  const kilpailunNimiInput = useRef(null)
  const pvmInput = useRef(null)
  const uudenSarjanNimiInput = useRef(null)
  const uudenSarjanLasketaanPisteetCheckbox = useRef(null)
  const muokattavanSarjanNimiInput = useRef(null)
  const muokattavanSarjanLasketaanPisteetCheckbox = useRef(null)

  function tyhjennäTekstit() {
    kilpailunNimiInput.current.value = ''
    pvmInput.current.value = ''
  }

  function päivitäKilpailu() {
    let pyyntöBody = {}
    if (kilpailunNimiInput.current.value) pyyntöBody.nimi = kilpailunNimiInput.current.value
    if (pvmInput.current.value) pyyntöBody.pvm = moment(pvmInput.current.value, 'DD.MM.YYYY')

    axios.put(`api/kilpailut/${aktiivinenKausi.id}/${kilpailu._id}`, pyyntöBody)
      .then(vastaus => {
        setKilpailu(null)
      })
      .catch(err => {
        console.log(err)
      })

    setKilpailunMuokkaus(false)
  }

  function poistaKilpailu() {
    setKilpailunMuokkaus(false)
    axios.delete(`api/kilpailut/${aktiivinenKausi.id}/${kilpailu._id}`)
      .then(vastaus => {
        päivitäKausienJaKilpailujenNimet()
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

  return (
    <div>
      {!kilpailunMuokkaus
        ? <>
          <button onClick={() => setKilpailunMuokkaus(true)}>Muokkaa kilpailua</button>
        </> : <>
          <label htmlFor='nimi'>Nimi:</label>
          <input ref={kilpailunNimiInput} id='nimi' type='text' placeholder={kilpailu.nimi} />
          <label htmlFor='pvm'>Päviämäärä:</label>
          <input ref={pvmInput} id='pvm' type='text' placeholder={moment(kilpailu.pvm).format('DD.MM.YYYY')} />
          <button onClick={() => tyhjennäTekstit()}>Tyhjennä</button>
          <button onClick={päivitäKilpailu}>Tallenna</button><br />

          {!sarjojenMuokkaus
            ? <>
              <button onClick={() => setSarjojenMuokkaus(true)}>Muokkaa sarjoja</button>
            </> : <>
              <button onClick={() => setSarjojenMuokkaus(false)}>Päätä sarjojen muokkaus</button>
              <h5>Sarjat:</h5>
              <table>
                <thead>
                  <tr>
                    <th>Nimi</th><th>Lasketaan pisteet</th>
                  </tr>
                </thead>
                <tbody>
                  {kilpailu.sarjat.map(sarja => <tr key={sarja._id}>
                    {muokattavaSarja !== sarja._id
                      ? <>
                        <td>{sarja.nimi}</td>
                        <td>{sarja.lasketaanPisteet ? 'kyllä' : 'ei'}</td>
                        <td>
                          <button onClick={() => setMuokattavaSarja(sarja._id)}>Muokkaa sarjaa</button>
                          <button onClick={() => poistaSarja(sarja._id)}>Poista sarja</button>
                        </td>
                      </> : <>
                        <td><input ref={muokattavanSarjanNimiInput} type='text' placeholder={sarja.nimi} /></td>
                        <td>
                          <input ref={muokattavanSarjanLasketaanPisteetCheckbox} type='checkbox' id='muokattavanLasketaanPisteet'
                            defaultChecked={sarja.lasketaanPisteet} />
                          <label htmlFor='muokattavanLasketaanPisteet'>Lasketaan pisteet</label>
                        </td>
                        <td>
                          <button onClick={() => setMuokattavaSarja(null)}>Peruuta</button>
                          <button onClick={() => muokkaaSarjaa(sarja._id)}>Tallenna</button>
                        </td>
                      </>}
                  </tr>)}
                </tbody>
              </table>

              <h5>Lisää sarja:</h5>
              <label htmlFor='sarjanNimi'>Nimi:</label>
              <input ref={uudenSarjanNimiInput} id='sarjanNimi' type='text' />
              <input ref={uudenSarjanLasketaanPisteetCheckbox} id='lasketaanPisteet' type='checkbox' defaultChecked={true} />
              <label htmlFor='lasketaanPisteet'>Lasketaan pisteet</label>
              <button onClick={lisääSarja}>Tallenna</button>
            </>}
          
          <button onClick={poistaKilpailu}>Poista kilpailu</button>
          <button onClick={() => setKilpailunMuokkaus(false)}>Lopeta kilpailun muokkaus</button>
        </>}
    </div>
  )
}

export default KilpailunMuokkaus