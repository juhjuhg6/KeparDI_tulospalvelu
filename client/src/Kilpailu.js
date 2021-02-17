import React, { useState } from 'react'
import Lähtöajat from './Lahtoajat'
import Maaliintulot from './Maaliintulot'
import Tulokset from './Tulokset'
import KilpailunMuokkaus from './KilpailunMuokkaus'

function Kilpailu({aktiivinenKausi, kilpailu, setKilpailu, päivitäKausienJaKilpailujenNimet}) {
  const [näytettäväData, setNäytettäväData] = useState('lähtöajat')
  const [kilpailunMuokkaus, setKilpailunMuokkaus] = useState(false)

  return(
    <div>
      <h3>{kilpailu.nimi}</h3>

      {!kilpailunMuokkaus
        ? <>
          <button onClick={() => setKilpailunMuokkaus(true)} className='btn-yellow'>Muokkaa kilpailua</button>
          <br/>

          <button onClick={() => setNäytettäväData('lähtöajat')}
          className={näytettäväData === 'lähtöajat' ? 'btn-selected' : 'btn-yellow'}>Lähtöajat</button>
          <button onClick={() => setNäytettäväData('maaliintulot')}
            className={näytettäväData === 'maaliintulot' ? 'btn-selected' : 'btn-yellow'}>Ajanotto</button>
          <button onClick={() => setNäytettäväData('tulokset')}
            className={näytettäväData === 'tulokset' ? 'btn-selected' : 'btn-yellow'}>Tulokset</button>

          {näytettäväData === 'lähtöajat' ? <Lähtöajat aktiivinenKausi={aktiivinenKausi}
            kilpailu={kilpailu} setKilpailu={setKilpailu} /> : <></>}
          {näytettäväData === 'maaliintulot' ? <Maaliintulot aktiivinenKausi={aktiivinenKausi}
            kilpailu={kilpailu} setKilpailu={setKilpailu} /> : <></>}
          {näytettäväData === 'tulokset' ? <Tulokset aktiivinenKausi={aktiivinenKausi}
            kilpailu={kilpailu} setKilpailu={setKilpailu} /> : <></>}
        </> : <>
          <KilpailunMuokkaus aktiivinenKausi={aktiivinenKausi} kilpailu={kilpailu} setKilpailu={setKilpailu}
            päivitäKausienJaKilpailujenNimet={päivitäKausienJaKilpailujenNimet}
            kilpailunMuokkaus={kilpailunMuokkaus} setKilpailunMuokkaus={setKilpailunMuokkaus} />
        </>
      }
    </div>
  )
}

export default Kilpailu