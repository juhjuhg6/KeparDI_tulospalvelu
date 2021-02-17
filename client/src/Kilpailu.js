import React, { useState } from 'react'
import Lähtöajat from './Lahtoajat'
import Maaliintulot from './Maaliintulot'
import Tulokset from './Tulokset'
import KilpailunMuokkaus from './KilpailunMuokkaus'

function Kilpailu({aktiivinenKausi, kilpailu, setKilpailu, päivitäKausienJaKilpailujenNimet}) {
  const [näytettäväData, setNäytettäväData] = useState('lähtöajat')

  return(
    <div>
      <h3>{kilpailu.nimi}</h3>
      <KilpailunMuokkaus aktiivinenKausi={aktiivinenKausi} kilpailu={kilpailu} setKilpailu={setKilpailu}
        päivitäKausienJaKilpailujenNimet={päivitäKausienJaKilpailujenNimet} />
      <button onClick={() => setNäytettäväData('lähtöajat')}
      className='btn-yellow'>Lähtöajat</button>
      <button onClick={() => setNäytettäväData('maaliintulot')}
      className='btn-yellow'>Ajanotto</button>
      <button onClick={() => setNäytettäväData('tulokset')}
      className='btn-yellow'>Tulokset</button>

      {näytettäväData === 'lähtöajat' ? <Lähtöajat aktiivinenKausi={aktiivinenKausi}
        kilpailu={kilpailu} setKilpailu={setKilpailu} /> : <></>}
      {näytettäväData === 'maaliintulot' ? <Maaliintulot aktiivinenKausi={aktiivinenKausi}
        kilpailu={kilpailu} setKilpailu={setKilpailu} /> : <></>}
      {näytettäväData === 'tulokset' ? <Tulokset aktiivinenKausi={aktiivinenKausi}
        kilpailu={kilpailu} setKilpailu={setKilpailu} /> : <></>}
    </div>
  )
}

export default Kilpailu