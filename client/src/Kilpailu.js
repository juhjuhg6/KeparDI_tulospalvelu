import React, { useState, useEffect, useContext } from 'react'
import Context from './Context'
import jwtIsValid from './helpers/jwtIsValid'
import Lähtöajat from './Lahtoajat'
import Maaliintulot from './Maaliintulot'
import Tulokset from './Tulokset'
import KilpailunMuokkaus from './KilpailunMuokkaus'

function Kilpailu({aktiivinenKausi, kilpailu, setKilpailu, päivitäKausienJaKilpailujenNimet}) {
  const { kirjauduttu, setKirjauduttu } = useContext(Context)

  const [näytettäväData, setNäytettäväData] = useState('lähtöajat')
  const [kilpailunMuokkaus, setKilpailunMuokkaus] = useState(false)

  useEffect(() => {
    setKirjauduttu(jwtIsValid())
    // eslint-disable-next-line
  }, [näytettäväData, kilpailunMuokkaus])

  return(
    <div>
      <h3>{kilpailu.nimi}</h3>

      {!kilpailunMuokkaus
        ? <>
          {kirjauduttu
          ? <>
            <button onClick={() => setKilpailunMuokkaus(true)} className='btn-yellow'>Muokkaa kilpailua</button>
            <br/>
          </> : <></>}

          <button onClick={() => setNäytettäväData('lähtöajat')}
          className={näytettäväData === 'lähtöajat' ? 'btn-selected' : 'btn-yellow'}>Lähtöajat</button>
          {kirjauduttu
          ? <button onClick={() => setNäytettäväData('maaliintulot')}
              className={näytettäväData === 'maaliintulot' ? 'btn-selected' : 'btn-yellow'}>Ajanotto</button>
          : <></>}
          <button onClick={() => setNäytettäväData('tulokset')}
            className={näytettäväData === 'tulokset' ? 'btn-selected' : 'btn-yellow'}>Tulokset</button>

          {näytettäväData === 'lähtöajat' ? <Lähtöajat aktiivinenKausi={aktiivinenKausi}
            kilpailu={kilpailu} setKilpailu={setKilpailu} /> : <></>}
          {näytettäväData === 'maaliintulot' ? <Maaliintulot aktiivinenKausi={aktiivinenKausi}
            kilpailu={kilpailu} setKilpailu={setKilpailu} /> : <></>}
          {näytettäväData === 'tulokset' ? <Tulokset aktiivinenKausi={aktiivinenKausi}
            kilpailu={kilpailu} setKilpailu={setKilpailu} /> : <></>}
        </> : 
          kirjauduttu
          ? <KilpailunMuokkaus aktiivinenKausi={aktiivinenKausi} kilpailu={kilpailu} setKilpailu={setKilpailu}
              päivitäKausienJaKilpailujenNimet={päivitäKausienJaKilpailujenNimet}
              kilpailunMuokkaus={kilpailunMuokkaus} setKilpailunMuokkaus={setKilpailunMuokkaus} />
          : <></>
      }
    </div>
  )
}

export default Kilpailu