import React, { useState } from 'react'
import Lähtöajat from './Lahtoajat'
import Maaliintulot from './Maaliintulot'
import KilpailunMuokkaus from './KilpailunMuokkaus'

function Kilpailu({aktiivinenKausi, kilpailu, setKilpailu, päivitäKausienJaKilpailujenNimet}) {
  const [näytettäväData, setNäytettäväData] = useState('lähtöajat')

  return(
    <div>
      <h3>{kilpailu.nimi}</h3>
      <KilpailunMuokkaus aktiivinenKausi={aktiivinenKausi} kilpailu={kilpailu} setKilpailu={setKilpailu}
        päivitäKausienJaKilpailujenNimet={päivitäKausienJaKilpailujenNimet} />
      <button onClick={() => setNäytettäväData('lähtöajat')}>Lähtöajat</button>
      <button onClick={() => setNäytettäväData('maaliintulot')}>Ajanotto</button>
      <button onClick={() => setNäytettäväData('tulokset')}>Tulokset</button>

      {näytettäväData === 'lähtöajat' ? <Lähtöajat aktiivinenKausi={aktiivinenKausi}
        kilpailu={kilpailu} setKilpailu={setKilpailu} /> : <></>}
      {näytettäväData === 'maaliintulot' ? <Maaliintulot aktiivinenKausi={aktiivinenKausi}
        kilpailu={kilpailu} setKilpailu={setKilpailu} /> : <></>}
      {näytettäväData === 'tulokset' ? <p>tulokset</p> : <></>}
    </div>
  )
}

export default Kilpailu