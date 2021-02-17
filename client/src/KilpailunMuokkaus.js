import React, { useState, useRef } from 'react'
import axios from 'axios'
import moment from 'moment'
import ManuaalisetPisteet from './ManuaalisetPisteet'

function KilpailunMuokkaus({ aktiivinenKausi, kilpailu, setKilpailu, päivitäKausienJaKilpailujenNimet }) {
  const [kilpailunMuokkaus, setKilpailunMuokkaus] = useState(false)
  const [sarjojenMuokkaus, setSarjojenMuokkaus] = useState(false)
  const [järjestäjienMuokkaus, setJärjestäjienMuokkaus] = useState(false)
  const [pisteidenMuokkaus, setPisteidenMuokkaus] = useState(false)
  const [muokattavaSarja, setMuokattavaSarja] = useState()
  const [uudetManuaalisetPisteet, setUudetManuaalisetPisteet] = useState({...kilpailu.manuaalisetPisteet})

  const kilpailunNimiInput = useRef(null)
  const pvmInput = useRef(null)
  const uudenSarjanNimiInput = useRef(null)
  const uudenSarjanLasketaanPisteetCheckbox = useRef(null)
  const muokattavanSarjanNimiInput = useRef(null)
  const muokattavanSarjanLasketaanPisteetCheckbox = useRef(null)
  const järjestäjänNimiInput = useRef(null)

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
        setKilpailu(vastaus.data)
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

  function lisääJärjestäjä() {
    const nimi = järjestäjänNimiInput.current.value
    järjestäjänNimiInput.current.value = ''
    axios.post(`api/jarjestajat/${aktiivinenKausi.id}/${kilpailu._id}`, {nimi: nimi})
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

  function asetaManuaalisetPisteet() {
    setPisteidenMuokkaus(false)
    axios.post(`api/manuaalisetpisteet/${aktiivinenKausi.id}/${kilpailu._id}`,
      {manuaalisetPisteet: uudetManuaalisetPisteet})
      .then(vastaus => {
        setKilpailu(vastaus.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  function poistaManuaalisetPisteet() {
    setPisteidenMuokkaus(false)
    axios.delete(`api/manuaalisetpisteet/${aktiivinenKausi.id}/${kilpailu._id}`)
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
          <button onClick={() => setKilpailunMuokkaus(true)} className='btn-yellow'>Muokkaa kilpailua</button>
        </> : <>
          <label htmlFor='nimi'>Nimi:</label>
          <input ref={kilpailunNimiInput} id='nimi' type='text' placeholder={kilpailu.nimi} className='nimi' />
          <label htmlFor='pvm'>Päviämäärä:</label>
          <input ref={pvmInput} id='pvm' type='text' placeholder={moment(kilpailu.pvm).format('DD.MM.YYYY')}
          className='input-pvm' />
          <button onClick={() => tyhjennäTekstit()} className='btn-yellow'>Tyhjennä</button>
          <button onClick={päivitäKilpailu} className='btn-green'>Tallenna</button><br />

          {!sarjojenMuokkaus
            ? !järjestäjienMuokkaus && !pisteidenMuokkaus
              ? <button onClick={() => setSarjojenMuokkaus(true)} className='btn-yellow'>Muokkaa sarjoja</button>
              : <></>
            : <>
              <button onClick={() => setSarjojenMuokkaus(false)} className='btn-yellow'>Päätä sarjojen muokkaus</button>
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
            </>}

            {!järjestäjienMuokkaus
            ? !sarjojenMuokkaus && !pisteidenMuokkaus
              ? <button onClick={() => setJärjestäjienMuokkaus(true)} className='btn-yellow'>Muokkaa järjestäjiä</button>
              : <></>
            : <>
              <button onClick={() => setJärjestäjienMuokkaus(false)} className='btn-yellow'>Päätä järjestäjien muokkaus</button>
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
              <label htmlFor='järjestäjänNimi'>Nimi:</label>
              <input ref={järjestäjänNimiInput} id='järjestäjänNimi' type='text' className='nimi'/>
              <button onClick={lisääJärjestäjä} className='btn-green'>Tallenna</button>
            </>}
            
            {!pisteidenMuokkaus
            ? !sarjojenMuokkaus && !järjestäjienMuokkaus
              ? <button onClick={() => setPisteidenMuokkaus(true)} className='btn-yellow'>Aseta manuaaliset pisteet</button>
              : <></>
            : <>
              <table>
                <thead>
                  <tr><th>Nimi</th><th>Pisteet</th><th></th></tr>
                </thead>
                <tbody>
                {kilpailu.kaikkiKilpailijat.map(kilpailija => <ManuaalisetPisteet key={kilpailija.id} kilpailija={kilpailija}
                  nykyisetPisteet={kilpailu.manuaalisetPisteet[kilpailija.id]} uudetManuaalisetPisteet={uudetManuaalisetPisteet}
                  setUudetManuaalisetPisteet={setUudetManuaalisetPisteet} />)}
                </tbody>
              </table>

              <button onClick={() => setPisteidenMuokkaus(false)} className='btn-yellow'>Peruuta</button>
              <button onClick={poistaManuaalisetPisteet} className='btn-red'>Poista kaikki manuaaliset pisteet</button>
              <button onClick={asetaManuaalisetPisteet} className='btn-green'>Tallenna</button>
            </>}
          
          <br/>
          <button onClick={poistaKilpailu} className='btn-red'>Poista kilpailu</button>
          <button onClick={() => setKilpailunMuokkaus(false)} className='btn-yellow'>Lopeta kilpailun muokkaus</button>
        </>}
    </div>
  )
}

export default KilpailunMuokkaus