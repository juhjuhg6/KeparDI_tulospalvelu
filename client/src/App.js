import React, { useState, useEffect } from 'react'
import axios from 'axios'
import KilpailunValinta from './KilpailunValinta'
import Kilpailu from './Kilpailu'

function App() {
  const [kausienJaKilpailujenNimet, setKausienJaKilpailujenNimet] = useState([])
  const [aktiivinenKausi, setAktiivinenKausi] = useState({})
  const [aktiivinenKilpailu, setAktiivinenKilpailu] = useState({})
  const [kilpailu, setKilpailu] = useState({})

  useEffect(() => {
    axios.get('/api/kaudet/nimet')
      .then(vastaus => {
        let nimet = vastaus.data
        nimet.sort((a, b) => {
          if (a.nimi < b.nimi) return 1
          if (a.nimi > b.nimi) return -1
          return 0
        })
        setKausienJaKilpailujenNimet(nimet)
        setAktiivinenKausi(nimet[0])
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    if (!aktiivinenKausi.id) return

    setAktiivinenKilpailu(aktiivinenKausi.kilpailut[0])
  }, [aktiivinenKausi])

  useEffect(() => {
    if (!aktiivinenKilpailu.id || !aktiivinenKausi.id) return

    axios.get(`api/kilpailut/${aktiivinenKausi.id}/${aktiivinenKilpailu.id}`)
      .then(vastaus => {
        setKilpailu(vastaus.data)
      })
      .catch(err => {
        console.log(err)
      })
      // eslint-disable-next-line
  }, [aktiivinenKilpailu])

  return (
    <div className="App">
      <KilpailunValinta
        kausienJaKilpailujenNimet={kausienJaKilpailujenNimet}
        aktiivinenKausi={aktiivinenKausi} setAktiivinenKausi={setAktiivinenKausi}
        setAktiivinenKilpailu={setAktiivinenKilpailu}
      />
      <h2>{aktiivinenKausi.nimi}</h2>
      <Kilpailu aktiivinenKausi={aktiivinenKausi} kilpailu={kilpailu} setKilpailu={setKilpailu} />
    </div>
  )
}

export default App;