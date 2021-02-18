import React, { useState, useEffect, useContext } from 'react'
import Context from '../Context'
import jwtIsValid from '../helpers/jwtIsValid'
import Lähtöajat from './Lahtoajat'
import Maaliintulot from './Maaliintulot'
import Tulokset from './Tulokset'
import KilpailunMuokkaus from '../kilpailunMuokkaus/KilpailunMuokkaus'

function Kilpailu({ päivitäKausienJaKilpailujenNimet }) {
  const { kilpailu, kirjauduttu, setKirjauduttu } = useContext(Context)

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
            <br/><br/>
          </> : <></>}

          <button onClick={() => setNäytettäväData('lähtöajat')}
          className={näytettäväData === 'lähtöajat' ? 'btn-selected' : 'btn-yellow'}>Lähtöajat</button>
          {kirjauduttu
          ? <button onClick={() => setNäytettäväData('maaliintulot')}
              className={näytettäväData === 'maaliintulot' ? 'btn-selected' : 'btn-yellow'}>Ajanotto</button>
          : <></>}
          <button onClick={() => setNäytettäväData('tulokset')}
            className={näytettäväData === 'tulokset' ? 'btn-selected' : 'btn-yellow'}>Tulokset</button>
          <br/><br/>

          {näytettäväData === 'lähtöajat' ? <Lähtöajat /> : <></>}
          {näytettäväData === 'maaliintulot' ? <Maaliintulot /> : <></>}
          {näytettäväData === 'tulokset' ? <Tulokset /> : <></>}
        </> : 
          kirjauduttu
          ? <KilpailunMuokkaus päivitäKausienJaKilpailujenNimet={päivitäKausienJaKilpailujenNimet}
              kilpailunMuokkaus={kilpailunMuokkaus} setKilpailunMuokkaus={setKilpailunMuokkaus} />
          : <></>
      }
    </div>
  )
}

export default Kilpailu