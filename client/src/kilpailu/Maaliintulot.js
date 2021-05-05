import React, { useEffect, useState, useRef, useContext } from 'react'
import axios from 'axios'
import moment from 'moment'
import Context from '../Context'
import jwtIsValid from '../helpers/jwtIsValid'
import Maaliintulo from './Maaliintulo.js'

function Maaliintulot() {
  const { kilpailu, setKilpailu, aktiivinenKausi, kirjauduttu, setKirjauduttu } = useContext(Context)

  const [aika, setAika] = useState(moment())
  const [muuTulosSarake, setMuuTulosSarake] = useState(false)

  const nimiInput = useRef(null)
  const aikaInput = useRef(null)
  const muuTulosSelect = useRef(null)
  const kilpailijaLista = useRef(null)

  useEffect(() => {
    const ajastin = setInterval(() => setAika(moment()), 1000)

    return () => clearInterval(ajastin)
  }, [])
  
  useEffect(() => {
    if (kilpailu.maaliintulot.some(maaliintulo => maaliintulo.muuTulos)) {
      setMuuTulosSarake(true)
    } else {
      setMuuTulosSarake(false)
    }
  }, [kilpailu])

  function asetaMaaliaika() {
    aikaInput.current.value = moment().format('HH.mm.ss')
  }

  function lisääMaaliintulo() {
    const kilpailija = kilpailu.kaikkiKilpailijat.find(k => k.nimi === nimiInput.current.value)
    let maaliintuloaika

    if (aikaInput.current.value !== '') {
      const asetettavaMaaliintuloaika = moment(aikaInput.current.value, 'HH.mm.ss')
      maaliintuloaika = moment(kilpailu.pvm)
      maaliintuloaika.hours(asetettavaMaaliintuloaika.hours())
      maaliintuloaika.minutes(asetettavaMaaliintuloaika.minutes())
      maaliintuloaika.seconds(asetettavaMaaliintuloaika.seconds())
    }

    let pyyntö = {}
    
    if (kilpailija) {
      pyyntö.kilpailija = kilpailija.id
    } else {
      pyyntö.nimi = nimiInput.current.value
    }
    if (maaliintuloaika) pyyntö.maaliintuloaika = maaliintuloaika
    pyyntö.muuTulos = muuTulosSelect.current.value

    nimiInput.current.value = ''
    aikaInput.current.value = ''
    muuTulosSelect.current.value = ''

    if (!jwtIsValid()) {
      localStorage.removeItem('jwt')
      axios.defaults.headers['Authorization'] = null
      setKirjauduttu(false)
      return
    }

    axios.post(`/api/maaliintulot/${aktiivinenKausi.id}/${kilpailu._id}`, pyyntö)
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

  function päivitäKilpailijaLista() {
    const kilpailijat = kilpailijaLista.current.getElementsByTagName('li')
    for (const kilpailija of kilpailijat) {
      const filter = nimiInput.current.value.toLowerCase()
      if (kilpailija.textContent.toLowerCase().indexOf(filter) > -1) {
        kilpailija.style.display = 'block'
      } else {
        kilpailija.style.display = 'none'
      }
    }
  }

  function joo(e) {
    nimiInput.current.value = e.target.textContent
  }

  function kilpailijanNimi(kilpailijaId) {
    const kilpailija = kilpailu.kaikkiKilpailijat.find(k => k.id === kilpailijaId)
    if (kilpailija) return kilpailija.nimi
    return null
  }

  if (!kirjauduttu) return(<></>)

  return (
    <div>
      <p>Uusi maaliintulo:</p>
      <div>
        <label htmlFor='nimi'>Nimi:</label>
        <div className='maaliintulo-nimi-input-container'>
          <input ref={nimiInput} id='nimi' className='nimi maaliintulo-nimi-input'
            onChange={() => päivitäKilpailijaLista()} onClick={() => päivitäKilpailijaLista()}/>
          <ul ref={kilpailijaLista} className='input-dropdown'>
            {kilpailu.kaikkiKilpailijat.map(kilpailija => <li key={kilpailija.id}
              className='input-dropdown-item' onClick={(e) => joo(e)}>{kilpailija.nimi}</li>)}
          </ul>
        </div>
      </div>
      <div>
        <label htmlFor='maaliintuloaika'>Maaliintuloaika:</label>
        <input ref={aikaInput} id='maaliintuloaika' placeholder={aika.format('HH.mm.ss')} className='input-aika'/>
        <button onClick={asetaMaaliaika} className='btn-yellow'>Nyt</button>
      </div>
      <div>
        <label htmlFor='muuTulos'>Muu tulos:</label>
        <select ref={muuTulosSelect} id='muuTulos'>
          <option></option>
          <option value='DNS'>DNS</option>
          <option value='DNF'>DNF</option>
          <option value='DSQ'>DSQ</option>
        </select>
      </div>
      <button onClick={lisääMaaliintulo} className='btn-green'>Tallenna uusi maaliintulo</button>
      <div className='flex-container'><div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>Nimi</th><th>Maaliintuloaika</th>
              {muuTulosSarake ? <th>Muu tulos</th> : <th></th>}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {kilpailu.maaliintulot.sort((a, b) => {
              if (!a.kilpailija) return 1
              if (!b.kilpailija) return -1
              if (kilpailijanNimi(a.kilpailija) < kilpailijanNimi(b.kilpailija)) return -1
              if (kilpailijanNimi(a.kilpailija) > kilpailijanNimi(b.kilpailija)) return 1
              return 0
            }).map(maaliintulo => <Maaliintulo key={maaliintulo._id}
              maaliintulo={maaliintulo} />)}
          </tbody>
        </table>
      </div></div>
    </div>
  )
}

export default Maaliintulot