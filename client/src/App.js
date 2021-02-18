import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Context from './Context'
import jwtIsValid from './helpers/jwtIsValid'
import KilpailunValinta from './muut/KilpailunValinta'
import Kilpailu from './kilpailu/Kilpailu'
import LisääKausiTaiKilpailu from './muut/LisaaKausiTaiKilpailu'
import Kokonaispisteet from './muut/Kokonaispisteet'
import Kirjautuminen from './muut/Kirjautuminen'

function App() {
  const [kirjauduttu, setKirjauduttu] = useState(false)
  const [kausienJaKilpailujenNimet, setKausienJaKilpailujenNimet] = useState([])
  const [aktiivinenKausi, setAktiivinenKausi] = useState({})
  const [aktiivinenKilpailu, setAktiivinenKilpailu] = useState()
  const [kilpailu, setKilpailu] = useState({})
  const [kilpailuHaettu, setKilpailuHaettu] = useState(false)

  useEffect(() => {
    päivitäKausienJaKilpailujenNimet()
    setKirjauduttu(jwtIsValid())
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (kirjauduttu) setKirjauduttu(jwtIsValid())
    
    if (!aktiivinenKausi.id) return

    if (!aktiivinenKilpailu || !aktiivinenKausi.kilpailut.find(kilpailu => kilpailu.id === aktiivinenKilpailu.id)) {
      setAktiivinenKilpailu('Kokonaispisteet')
    }
    // eslint-disable-next-line
  }, [aktiivinenKausi])

  useEffect(() => {
    if (kirjauduttu) setKirjauduttu(jwtIsValid())

    if (aktiivinenKilpailu === 'Kokonaispisteet') setKilpailuHaettu(false)
    if (!aktiivinenKilpailu || !aktiivinenKausi || !aktiivinenKilpailu.id || !aktiivinenKausi.id) return
    setKilpailuHaettu(false)

    axios.get(`api/kilpailut/${aktiivinenKausi.id}/${aktiivinenKilpailu.id}`)
      .then(vastaus => {
        setKilpailu(vastaus.data)
        setKilpailuHaettu(true)
      })
      .catch(err => {
        console.log(err)
      })
      // eslint-disable-next-line
  }, [aktiivinenKilpailu])

  function päivitäKausienJaKilpailujenNimet() {
    axios.get('/api/kaudet/nimet')
      .then(vastaus => {
        let nimet = vastaus.data
        nimet.sort((a, b) => {
          if (a.nimi < b.nimi) return 1
          if (a.nimi > b.nimi) return -1
          return 0
        })
        setKausienJaKilpailujenNimet(nimet)
        if (Object.keys(aktiivinenKausi).length === 0) {
          setAktiivinenKausi(nimet[0])
        } else {
          const päivitettyAktiivinenKausi = nimet.find(kausi => kausi.id === aktiivinenKausi.id)
          setAktiivinenKausi(päivitettyAktiivinenKausi)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <Context.Provider value={{ kilpailu, setKilpailu, aktiivinenKausi, kirjauduttu, setKirjauduttu }}>
      <KilpailunValinta
          kausienJaKilpailujenNimet={kausienJaKilpailujenNimet}
          setAktiivinenKausi={setAktiivinenKausi}
          setAktiivinenKilpailu={setAktiivinenKilpailu}
        />

      {kirjauduttu
        ? <>
          <LisääKausiTaiKilpailu päivitäKausienJaKilpailujenNimet={päivitäKausienJaKilpailujenNimet} />
        </> : <></>}

      {aktiivinenKilpailu === 'Kokonaispisteet'
      ? <Kokonaispisteet kausienJaKilpailujenNimet={kausienJaKilpailujenNimet} />
      : <></>}
      {kilpailuHaettu
      ? <Kilpailu päivitäKausienJaKilpailujenNimet={päivitäKausienJaKilpailujenNimet} />
      : <></>}

      <Kirjautuminen />
    </Context.Provider>
  )
}

export default App;