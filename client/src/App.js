import React, { useState, useEffect } from 'react'
import axios from 'axios'
import KilpailunValinta from './KilpailunValinta'
import Kilpailu from './Kilpailu'
import LisääKausiTaiKilpailu from './LisaaKausiTaiKilpailu'
import Kokonaispisteet from './Kokonaispisteet'

function App() {
  const [kausienJaKilpailujenNimet, setKausienJaKilpailujenNimet] = useState([])
  const [aktiivinenKausi, setAktiivinenKausi] = useState({})
  const [aktiivinenKilpailu, setAktiivinenKilpailu] = useState()
  const [kilpailu, setKilpailu] = useState({})
  const [kilpailuHaettu, setKilpailuHaettu] = useState(false)

  useEffect(() => {
    päivitäKausienJaKilpailujenNimet()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (!aktiivinenKausi.id) return

    setAktiivinenKilpailu('Kokonaispisteet')
  }, [aktiivinenKausi])

  useEffect(() => {
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
    <div className="App">
      <KilpailunValinta
        kausienJaKilpailujenNimet={kausienJaKilpailujenNimet}
        aktiivinenKausi={aktiivinenKausi} setAktiivinenKausi={setAktiivinenKausi}
        setAktiivinenKilpailu={setAktiivinenKilpailu}
      />
      <LisääKausiTaiKilpailu aktiivinenKausi={aktiivinenKausi}
        päivitäKausienJaKilpailujenNimet={päivitäKausienJaKilpailujenNimet} />
      <h2>{aktiivinenKausi.nimi}</h2>
      {aktiivinenKilpailu === 'Kokonaispisteet'
      ? <Kokonaispisteet aktiivinenKausi={aktiivinenKausi} kausienJaKilpailujenNimet={kausienJaKilpailujenNimet} />
      : <></>}
      {kilpailuHaettu
      ? <Kilpailu aktiivinenKausi={aktiivinenKausi} kilpailu={kilpailu} setKilpailu={setKilpailu}
        päivitäKausienJaKilpailujenNimet={päivitäKausienJaKilpailujenNimet} />
      : <></>}
    </div>
  )
}

export default App;