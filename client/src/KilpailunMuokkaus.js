import React, { useState, useRef } from 'react'
import axios from 'axios'
import moment from 'moment'
import SarjojenMuokkaus from './SarjojenMuokkaus'
import JärjestäjienMuokkaus from './JarjestajienMuokkaus'
import ManuaalistenPisteidenMuokkaus from './ManuaalistenPisteidenMuokkaus'

function KilpailunMuokkaus({ aktiivinenKausi, kilpailu, setKilpailu, päivitäKausienJaKilpailujenNimet,
  kilpailunMuokkaus, setKilpailunMuokkaus }) {
  const [muokattava, setMuokattava] = useState(null)

  const kilpailunNimiInput = useRef(null)
  const pvmInput = useRef(null)

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

  function asetaMuokattava(asetettava) {
    if (muokattava === asetettava) {
      setMuokattava(null)
    } else {
      setMuokattava(asetettava)
    }
  }

  return (
    <div>
      <button onClick={() => setKilpailunMuokkaus(false)} className='btn-yellow'>Lopeta kilpailun muokkaus</button>
      <br />

      <label htmlFor='nimi'>Nimi:</label>
      <input ref={kilpailunNimiInput} id='nimi' type='text' placeholder={kilpailu.nimi} className='nimi' />
      <label htmlFor='pvm'>Päviämäärä:</label>
      <input ref={pvmInput} id='pvm' type='text' placeholder={moment(kilpailu.pvm).format('DD.MM.YYYY')}
      className='input-pvm' />
      <button onClick={() => tyhjennäTekstit()} className='btn-yellow'>Tyhjennä</button>
      <button onClick={päivitäKilpailu} className='btn-green'>Tallenna</button><br />
      <button onClick={poistaKilpailu} className='btn-red'>Poista kilpailu</button>
      <br />

      <button onClick={() => asetaMuokattava('sarjat')} className='btn-yellow'>Muokkaa sarjoja</button>
      <button onClick={() => asetaMuokattava('järjestäjät')} className='btn-yellow'>Muokkaa järjestäjiä</button>
      <button onClick={() => asetaMuokattava('pisteet')} className='btn-yellow'>Muokkaa manuaalisia pisteitä</button>

      {muokattava === 'sarjat'
        ? <SarjojenMuokkaus kilpailu={kilpailu} setKilpailu={setKilpailu} aktiivinenKausi={aktiivinenKausi} />
        : <></>
      }

      {muokattava === 'järjestäjät'
        ? <JärjestäjienMuokkaus kilpailu={kilpailu} setKilpailu={setKilpailu} aktiivinenKausi={aktiivinenKausi} />
        : <></>
      }

      {muokattava === 'pisteet'
        ? <ManuaalistenPisteidenMuokkaus kilpailu={kilpailu} setKilpailu={setKilpailu} aktiivinenKausi={aktiivinenKausi} />
        : <></>
      }
    </div>
  )
}

export default KilpailunMuokkaus