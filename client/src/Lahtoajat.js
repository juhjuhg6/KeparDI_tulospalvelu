import React, { useEffect, useState } from 'react'
import moment from 'moment'
import Lähtöaika from './Lahtoaika'
import UusiKilpailija from './UusiKilpailija'

function Lähtöajat({aktiivinenKausi, kilpailu, setKilpailu}) {
  const [kilpailijanLisäys, setKilpailijanLisäys] = useState(false)
  const [momentFormat, setMomentFormat] = useState('HH.mm')
  
  useEffect(() => {
    kilpailu.sarjat.forEach(sarja => {
      if (sarja.kilpailijat.some(kilpailija => {
          const lähtöaika = moment(kilpailija.kilpailut[kilpailu._id].lahtoaika)
          return lähtöaika.seconds() !== 0
        })) {
        setMomentFormat('HH.mm.ss')
      } else {
        setMomentFormat('HH.mm')
      }
    })
  }, [kilpailu])

  return (
    <div>
      {!kilpailijanLisäys
      ? <button onClick={() => setKilpailijanLisäys(true)}>Lisää kilpailija</button>
      : <UusiKilpailija aktiivinenKausi={aktiivinenKausi} kilpailu={kilpailu}
          setKilpailu={setKilpailu} setKilpailijanLisäys={setKilpailijanLisäys} />}
      {kilpailu.sarjat
      ? kilpailu.sarjat.map(sarja => <div key={sarja._id}>
          <h4>{sarja.nimi}</h4>
          <table>
            <thead><tr><th>Nimi</th><th>Lähtöaika</th></tr></thead>
            <tbody>
              {sarja.kilpailijat.map(kilpailija => <Lähtöaika  key={kilpailija._id}
                aktiivinenKausi={aktiivinenKausi} kilpailija={kilpailija} kilpailu={kilpailu}
                setKilpailu={setKilpailu} sarja={sarja} momentFormat={momentFormat} />)}
            </tbody>
          </table>
        </div>
        )
      : <></>}
    </div>
  )
}

export default Lähtöajat