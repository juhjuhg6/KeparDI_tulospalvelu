import React, { useRef, useContext } from 'react'
import axios from 'axios'
import moment from 'moment'
import Context from '../Context'
import jwtIsValid from '../helpers/jwtIsValid'

function LähtöaikojenAsetus({ setLähtöaikojenMuokkaus }) {
  const { kilpailu, setKilpailu, aktiivinenKausi, setKirjauduttu } = useContext(Context)

  const lähtöaikaInput = useRef(null)
  const lähtöväliInput = useRef(null)
  const sarjaSelect = useRef(null)

  function asetaLähtöajat() {
    if (!lähtöaikaInput.current.value) return
    setLähtöaikojenMuokkaus(false)

    const sarjaId = sarjaSelect.current.value

    const asetettavaLähtöaika = moment(lähtöaikaInput.current.value, 'HH.mm.ss')
    let ensimmäinenLähtöaika = moment(kilpailu.pvm)
    ensimmäinenLähtöaika.hours(asetettavaLähtöaika.hours())
    ensimmäinenLähtöaika.minutes(asetettavaLähtöaika.minutes())
    ensimmäinenLähtöaika.seconds(asetettavaLähtöaika.seconds())
    const lähtöväli = moment(lähtöväliInput.current.value, 'mm.ss').minutes()*60*1000
      + moment(lähtöväliInput.current.value, 'mm.ss').seconds() * 1000

    if (!jwtIsValid()) {
      localStorage.removeItem('jwt')
      axios.defaults.headers['Authorization'] = null
      setKirjauduttu(false)
      return
    }

    axios.put(`/api/sarjat/lahtoajat/${aktiivinenKausi.id}/${kilpailu._id}/${sarjaId}`,
      { ensimmäinenLähtöaika, lähtöväli })
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
    <div>
      <div style={{ display: 'inline-block' }}>
        <label htmlFor='ensimmäinenLähtö'>Ensimmäinen lähtö:</label>
        <input ref={lähtöaikaInput} type='text' id='ensimmäinenLähtö' className='input-aika'
          placeholder='hh.mm.ss' />
      </div>
      <div style={{ display: 'inline-block' }}>
        <label htmlFor='lähtöväli'>Lähtöväli:</label>
        <input ref={lähtöväliInput} type='text' id='lähtöväli' className='input-aika'
          placeholder='mm.ss' />
      </div>
      <div style={{ display: 'inline-block' }}>
        <label htmlFor='sarja'>Sarja:</label>
        <select ref={sarjaSelect} id='sarja'>
          {kilpailu.sarjat.map(sarja => <option key={sarja._id} value={sarja._id}>{sarja.nimi}</option>)}
        </select>
      </div>
      <div>
        <button onClick={() => setLähtöaikojenMuokkaus(false)} className='btn-yellow'>Peruuta</button>
        <button onClick={asetaLähtöajat} className='btn-green'>Tallenna</button>
      </div>
    </div>
  )
}

export default LähtöaikojenAsetus