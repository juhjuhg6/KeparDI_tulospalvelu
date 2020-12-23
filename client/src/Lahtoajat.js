import React from 'react'
import Lähtöaika from './Lahtoaika'

function Lähtöajat({aktiivinenKausi, kilpailu, setKilpailu}) {
  return (
    <div>
      {kilpailu.sarjat
      ? kilpailu.sarjat.map(sarja => <div key={sarja._id}>
          <h4>{sarja.nimi}</h4>
          <table>
            <thead><tr><th>Nimi</th><th>Lähtöaika</th></tr></thead>
            <tbody>
              {sarja.kilpailijat.map(kilpailija => <Lähtöaika  key={kilpailija._id}
                aktiivinenKausi={aktiivinenKausi} kilpailija={kilpailija}
                kilpailu={kilpailu} setKilpailu={setKilpailu} sarja={sarja} />)}
            </tbody>
          </table>
        </div>
        )
      : <></>}
    </div>
  )
}

export default Lähtöajat