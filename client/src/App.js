import React, { useState, useEffect } from 'react'
import { Route } from 'react-router-dom'
import axios from 'axios'
import Context from './Context'
import jwtIsValid from './helpers/jwtIsValid'
import Header from './muut/Header'
import Kilpailu from './kilpailu/Kilpailu'
import Kokonaispisteet from './muut/Kokonaispisteet'
import Ohjeet from './ohjeet/Ohjeet'

function App(props) {
  const [kirjauduttu, setKirjauduttu] = useState(false)
  const [kausienJaKilpailujenNimet, setKausienJaKilpailujenNimet] = useState([])
  const [aktiivinenKausi, setAktiivinenKausi] = useState({})
  const [kilpailu, setKilpailu] = useState({})
  const [kilpailuHaettu, setKilpailuHaettu] = useState(false)
  const [valikkoAuki, setValikkoAuki] = useState(false)

  useEffect(() => {
    päivitäKausienJaKilpailujenNimet()
    setKirjauduttu(jwtIsValid())
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    setKilpailuHaettu(false)
    if (kirjauduttu) setKirjauduttu(jwtIsValid())

    const kausi = kausienJaKilpailujenNimet.find(k => k.nimi === props.match.params.kausiNimi)

    if (kausi) {
      setAktiivinenKausi(kausi)
    } else {
      if (kausienJaKilpailujenNimet.length) {
        setAktiivinenKausi(kausienJaKilpailujenNimet[0])
      }
    }

    // eslint-disable-next-line
  }, [kausienJaKilpailujenNimet, props.match.params.kausiNimi])

  useEffect(() => {
    if (!aktiivinenKausi.kilpailut) return

    const uusiKilpailu = aktiivinenKausi.kilpailut.find(k => k.nimi === props.match.params.kilpailuNimi)

    if (uusiKilpailu) {
      axios.get(`/api/kilpailut/${aktiivinenKausi.id}/${uusiKilpailu.id}`)
        .then(vastaus => {
          setKilpailu(vastaus.data)
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      setKilpailu('KeparDI-cup pisteet')
    }

    // eslint-disable-next-line
  }, [aktiivinenKausi])

  useEffect(() => {
    setKilpailuHaettu(false)
    if (!aktiivinenKausi.kilpailut) return

    const uusiKilpailu = aktiivinenKausi.kilpailut.find(k => k.nimi === props.match.params.kilpailuNimi)

    if (uusiKilpailu) {
      axios.get(`/api/kilpailut/${aktiivinenKausi.id}/${uusiKilpailu.id}`)
        .then(vastaus => {
          setKilpailu(vastaus.data)
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      setKilpailu('KeparDI-cup pisteet')
    }

    // eslint-disable-next-line
  }, [props.match.params.kilpailuNimi])

  useEffect(() => {
    if (kilpailu._id) {
      setKilpailuHaettu(true)
    }
  }, [kilpailu])

  function päivitäKausienJaKilpailujenNimet() {
    axios.get('/api/kaudet/nimet')
      .then(vastaus => {
        let kaudet = vastaus.data

        kaudet.sort((a, b) => {
          if (a.nimi < b.nimi) return 1
          if (a.nimi > b.nimi) return -1
          return 0
        })
        
        kaudet.forEach(kausi => {
          kausi.kilpailut.sort((a, b) => {
            if (new Date(a.pvm) < new Date(b.pvm)) return 1
            if (new Date(a.pvm) > new Date(b.pvm)) return -1
            return 0
          })
        })
        
        setKausienJaKilpailujenNimet(kaudet)
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <Context.Provider value={{ kilpailu, setKilpailu, aktiivinenKausi, kirjauduttu, setKirjauduttu }}>
      <Header kausienJaKilpailujenNimet={kausienJaKilpailujenNimet} valikkoAuki={valikkoAuki}
        setValikkoAuki={setValikkoAuki} päivitäKausienJaKilpailujenNimet={päivitäKausienJaKilpailujenNimet} />

      {!valikkoAuki && <Route path={`${process.env.PUBLIC_URL}/ohjeet`} component={Ohjeet} />}

      {props.match.params.kausiNimi !== 'ohjeet' &&
        <div style={valikkoAuki ? {visibility: 'hidden', height: '0'} : {visibility: 'visible'}}>
          {kilpailu === 'KeparDI-cup pisteet' &&
            <Kokonaispisteet kausienJaKilpailujenNimet={kausienJaKilpailujenNimet} />
          }
          {kilpailuHaettu &&
            <Kilpailu päivitäKausienJaKilpailujenNimet={päivitäKausienJaKilpailujenNimet} />
          }
        </div>
      }
    </Context.Provider>
  )
}

export default App;