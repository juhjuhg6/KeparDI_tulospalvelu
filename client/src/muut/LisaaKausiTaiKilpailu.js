import React, { useState, useRef, useContext } from 'react'
import axios from 'axios'
import moment from 'moment'
import Context from '../Context'
import jwtIsValid from '../helpers/jwtIsValid'

function LisääKausiTaiKilpailu({ päivitäKausienJaKilpailujenNimet }) {
  const { aktiivinenKausi, setKirjauduttu } = useContext(Context)
  const [lisättävä, setLisättävä] = useState('')

  const nimiInput = useRef(null)
  const pvmInput = useRef(null)
  const ilmoittautuminenInput = useRef(null)
  const cupOsakilpailuInput = useRef(null)

  function tallenna() {
    let pyyntöUrl
    let pyyntöBody
    if (lisättävä === 'kausi') {
      pyyntöUrl = '/api/kaudet'
      if (!nimiInput.current.value) return
      pyyntöBody = {nimi: nimiInput.current.value}
    } else if (lisättävä === 'kilpailu') {
      pyyntöUrl = `/api/kilpailut/${aktiivinenKausi.id}`
      if (!nimiInput.current.value || !pvmInput.current.value) return
      pyyntöBody = {nimi: nimiInput.current.value, pvm: moment(pvmInput.current.value, 'DD.MM.YYYY'),
        ilmoittautuminenDl: moment(ilmoittautuminenInput.current.value, 'DD.MM.YYYY HH.mm'),
        cupOsakilpailu: cupOsakilpailuInput.current.checked}
    } else {
      return
    }

    setLisättävä('')

    if (!jwtIsValid()) {
      localStorage.removeItem('jwt')
      axios.defaults.headers['Authorization'] = null
      setKirjauduttu(false)
      return
    }

    axios.post(pyyntöUrl, pyyntöBody)
      .then(vastaus => {
        päivitäKausienJaKilpailujenNimet()
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
      {!lisättävä
        ?
          <>
            <button onClick={() => setLisättävä('kausi')} className='btn-yellow'>Lisää kausi</button>
            <button onClick={() => setLisättävä('kilpailu')} className='btn-yellow'>Lisää kilpailu</button>
          </>
        :
          <>
            <label htmlFor='nimi'>Nimi:</label>
            <input ref={nimiInput} id='nimi' type='text' className='nimi'/>
            {lisättävä === 'kilpailu' &&
              <>
                <div style={{ display: 'inline-block' }}>
                  <label htmlFor='pvm'>Päivämäärä:</label>
                  <input ref={pvmInput} id='pvm' type='text' placeholder='pp.kk.vvvv' className='input-pvm'/>
                </div>
                <div style={{ display: 'inline-block' }}>
                  <label htmlFor='ilmoPvm'>Ilmoittautuminen DL:</label>
                  <input ref={ilmoittautuminenInput} id='ilmoPvm' type='text' placeholder='pp.kk.vvvv hh.mm'
                    style={{ width: '13rem' }}/>
                </div>
                <div style={{ display: 'inline-block' }}>
                  <label htmlFor='cupOsakilpailuCheckbox'>Cup-osakilpailu:</label>
                  <input ref={cupOsakilpailuInput} id='cupOsakilpailuCheckbox' type='checkbox'
                    defaultChecked={true}/>
                </div>
              </>
            }
            <div>
              <button onClick={() => setLisättävä('')} className='btn-yellow'>Peruuta</button>
              <button onClick={tallenna} className='btn-green'>Tallenna</button>
            </div>
          </>
      }
    </div>
  )
}

export default LisääKausiTaiKilpailu