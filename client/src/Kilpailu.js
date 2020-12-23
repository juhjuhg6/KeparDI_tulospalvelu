import React, { useState } from 'react'
import Lähtöajat from './Lahtoajat'

function Kilpailu({aktiivinenKausi, kilpailu, setKilpailu}) {
  const [näytettäväData, setNäytettäväData] = useState('lähtöajat')

  return(
    <div>
      <h3>{kilpailu.nimi}</h3>
      <button onClick={() => setNäytettäväData('lähtöajat')}>Lähtöajat</button>
      <button onClick={() => setNäytettäväData('maaliintulot')}>Ajanotto</button>
      <button onClick={() => setNäytettäväData('tulokset')}>Tulokset</button>

      {näytettäväData === 'lähtöajat' ? <Lähtöajat aktiivinenKausi={aktiivinenKausi}
        kilpailu={kilpailu} setKilpailu={setKilpailu} /> : <></>}
      {näytettäväData === 'maaliintulot' ? <p>ajanotto</p> : <></>}
      {näytettäväData === 'tulokset' ? <p>tulokset</p> : <></>}
    </div>
  )
}

export default Kilpailu