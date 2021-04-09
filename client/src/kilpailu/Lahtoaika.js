import React, { useState, useRef, useContext } from 'react'
import axios from 'axios'
import moment from 'moment'
import Context from '../Context'
import jwtIsValid from '../helpers/jwtIsValid'

function Lähtöaika({ kilpailija, sarja, momentFormat }) {
  const { kilpailu, setKilpailu, aktiivinenKausi, kirjauduttu, setKirjauduttu } = useContext(Context)

  const [muokkaus, setMuokkaus] = useState(false)
  const [tallentaa, setTallentaa] = useState(false)
  const [vahvistaPoisto, setVahvistaPoisto] = useState(false)
  const [poistetaan, setPoistetaan] = useState(false)

  const aikaInput = useRef(null)

  function lähtöaikaStr() {
    if (kilpailija.kilpailut[kilpailu._id].lahtoaika) {
      return moment(kilpailija.kilpailut[kilpailu._id].lahtoaika).format(momentFormat)
    } else {
      return ''
    }
  }

  function muokkaaLähtöaikaa() {
    let lähtöaika
    if (aikaInput.current.value) {
      const asetettavaLähtöaika = moment(aikaInput.current.value, 'HH.mm.ss')
      lähtöaika = moment(kilpailu.pvm)
      lähtöaika.hours(asetettavaLähtöaika.hours())
      lähtöaika.minutes(asetettavaLähtöaika.minutes())
      lähtöaika.seconds(asetettavaLähtöaika.seconds())
    } else {
      lähtöaika = null
    }

    if (!jwtIsValid()) {
      localStorage.removeItem('jwt')
      axios.defaults.headers['Authorization'] = null
      setKirjauduttu(false)
      return
    }

    setTallentaa(true)
    
    axios.put(`/api/kilpailijat/${aktiivinenKausi.id}/${kilpailu._id}/${sarja._id}/${kilpailija._id}`,
      {lahtoaika: lähtöaika})
      .then(vastaus => {
        setKilpailu(vastaus.data)
        setMuokkaus(false)
        setTallentaa(false)
      })
      .catch(err => {
        if (err.response.status === 401) {
          setMuokkaus(false)
          setTallentaa(false)
          setKirjauduttu(false)
          localStorage.removeItem('jwt')
          axios.defaults.headers.common['Authorization'] = null
        }
        console.log(err)
      })
  }

  function poistaKilpailija() {
    setPoistetaan(true)
    
    if (!jwtIsValid()) {
      localStorage.removeItem('jwt')
      axios.defaults.headers['Authorization'] = null
      setKirjauduttu(false)
      return
    }

    axios.delete(`/api/kilpailijat/${aktiivinenKausi.id}/${kilpailu._id}/${sarja._id}/${kilpailija._id}`)
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

  return(
    <tr>
      <td className='nimi'>{kilpailija.nimi}</td>
      {!muokkaus || !kirjauduttu
      ? <>
      <td>{lähtöaikaStr()}</td>
      <td>
        {kirjauduttu
          ? !vahvistaPoisto
            ? <>
              <button onClick={() => setMuokkaus(true)} className='btn-yellow'>Muuta lähtöaikaa</button>
              <button onClick={() => setVahvistaPoisto(true)} className='btn-red'>Poista</button>
            </>
            : !poistetaan
              ? <>
                <button onClick={() => setVahvistaPoisto(false)} className='btn-yellow'>Peruuta</button>
                <button onClick={poistaKilpailija} className='btn-red'>Vahvista poisto</button>
              </>
              : 'Poistetaan...'
          : <></>
        }
      </td>
      </> : <>
      <td><input ref={aikaInput} type='text' placeholder={lähtöaikaStr()} className='input-aika' /></td>
      <td>
        {tallentaa
        ? 'Tallennetaan...'
        : <>
        <button onClick={() => setMuokkaus(false)} className='btn-yellow'>Peruuta</button>
        <button onClick={muokkaaLähtöaikaa} className='btn-green'>Tallenna</button>
        </>}
      </td>
      </>}
    </tr>
  )
}

export default Lähtöaika