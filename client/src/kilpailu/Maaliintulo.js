import React, { useState, useRef, useContext } from 'react'
import axios from 'axios'
import moment from 'moment'
import Context from '../Context'
import jwtIsValid from '../helpers/jwtIsValid'

function Maaliintulo({ maaliintulo }) {
  const { aktiivinenKausi, kilpailu, setKilpailu, setKirjauduttu } = useContext(Context)
  
  const [muokkaus, setMuokkaus] = useState(false)
  const [tallentaa, setTallentaa] = useState(false)
  const [vahvistaPoisto, setVahvistaPoisto] = useState(false)
  const [poistetaan, setPoistetaan] = useState(false)

  const nimiInput = useRef(null)
  const aikaInput = useRef(null)
  const muuTulosSelect = useRef(null)

  function maaliaikaStr() {
    if (maaliintulo.maaliintuloaika) {
      return moment(maaliintulo.maaliintuloaika).format('HH.mm.ss')
    } else {
      return ''
    }
  }

  function kilpailijanNimi(kilpailijaId) {
    if (kilpailijaId) {
      return kilpailu.kaikkiKilpailijat.find(k => k.id === kilpailijaId).nimi
    } else {
      return ''
    }
  }

  function muokkaaMaaliaikaa() {
    if (!jwtIsValid()) {
      localStorage.removeItem('jwt')
      axios.defaults.headers['Authorization'] = null
      setKirjauduttu(false)
      return
    }

    setTallentaa(true)
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
    if (maaliintuloaika) {
      pyyntö.maaliintuloaika = maaliintuloaika
    } else {
      pyyntö.maaliintuloaika = ''
    }
    pyyntö.muuTulos = muuTulosSelect.current.value

    axios.put(`/api/maaliintulot/${aktiivinenKausi.id}/${kilpailu._id}/${maaliintulo._id}`, pyyntö)
      .then(vastaus => {
        setKilpailu(vastaus.data)
        setMuokkaus(false)
        setTallentaa(false)
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

  function asetaMaaliintuloaika() {
    if (!jwtIsValid()) {
      localStorage.removeItem('jwt')
      axios.defaults.headers['Authorization'] = null
      setKirjauduttu(false)
      return
    }

    setTallentaa(true)

    const asetettavaMaaliintuloaika = moment()
    let pyyntö = JSON.parse(JSON.stringify(maaliintulo))
    pyyntö.maaliintuloaika = moment(kilpailu.pvm)
    pyyntö.maaliintuloaika.hours(asetettavaMaaliintuloaika.hours())
    pyyntö.maaliintuloaika.minutes(asetettavaMaaliintuloaika.minutes())
    pyyntö.maaliintuloaika.seconds(asetettavaMaaliintuloaika.seconds())

    axios.put(`/api/maaliintulot/${aktiivinenKausi.id}/${kilpailu._id}/${maaliintulo._id}`, pyyntö)
      .then(vastaus => {
        setKilpailu(vastaus.data)
        setTallentaa(false)
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

  function poistaMaaliaika() {
    setPoistetaan(true)

    if (!jwtIsValid()) {
      localStorage.removeItem('jwt')
      axios.defaults.headers['Authorization'] = null
      setKirjauduttu(false)
      return
    }

    axios.delete(`/api/maaliintulot/${aktiivinenKausi.id}/${kilpailu._id}/${maaliintulo._id}`)
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
    <tr>
      {!muokkaus
        ?
          <>
            <td className='nimi'>
              {maaliintulo.kilpailija 
                ? kilpailijanNimi(maaliintulo.kilpailija)
                : maaliintulo.nimi}
            </td>
            <td>
              {maaliintulo.maaliintuloaika
                ?
                  maaliaikaStr()
                :
                  !tallentaa
                    ? <button onClick={asetaMaaliintuloaika} className='btn-green'>Maalissa</button>
                    : 'Tallentaa...'
              }
            </td>
            <td>{maaliintulo.muuTulos}</td>
            <td>
              {!vahvistaPoisto
                ?
                  <>
                    <button onClick={() => setMuokkaus(true)} className='btn-yellow'>Muokkaa</button>
                    <button onClick={() => setVahvistaPoisto(true)} className='btn-red'>Poista</button>
                  </>
                :
                  !poistetaan
                    ?
                      <>
                        <button onClick={() => setVahvistaPoisto(false)} className='btn-yellow'>Peruuta</button>
                        <button onClick={poistaMaaliaika} className='btn-red'>Vahvista poisto</button>
                      </>
                    :
                      'Poistetaan...'
              }
            </td>
          </>
        :
          <>
            <td><input ref={nimiInput} type='text'
              defaultValue={maaliintulo.kilpailija ? kilpailijanNimi(maaliintulo.kilpailija) : maaliintulo.nimi}
              className='nimi' /></td>
            <td>
              <input ref={aikaInput} type='text' defaultValue={maaliaikaStr()} className='input-aika' />
              <button onClick={() => aikaInput.current.value = moment().format('HH.mm.ss')} className='btn-yellow'>Nyt</button>
            </td>
            <td>
              <select ref={muuTulosSelect} id='muuTulos' defaultValue={maaliintulo.muuTulos}>
                <option></option>
                <option value='DNS'>DNS</option>
                <option value='DNF'>DNF</option>
                <option value='DSQ'>DSQ</option>
              </select>
            </td>
            <td>
              {tallentaa
                ?
                  'Tallennetaan...'
                :
                  <>
                    <button onClick={() => setMuokkaus(false)} className='btn-yellow'>Peruuta</button>
                    <button onClick={muokkaaMaaliaikaa} className='btn-green'>Tallenna</button>
                  </>
              }
            </td>
          </>
      }
    </tr>
  )
}

export default Maaliintulo