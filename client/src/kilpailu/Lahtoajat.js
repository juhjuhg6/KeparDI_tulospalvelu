import React, { useEffect, useState, useContext } from 'react'
import moment from 'moment'
import Context from '../Context'
import Lähtöaika from './Lahtoaika'
import UusiKilpailija from './UusiKilpailija'

function Lähtöajat() {
  const { kilpailu, kirjauduttu } = useContext(Context)

  const [kilpailijanLisäys, setKilpailijanLisäys] = useState(false)
  const [momentFormat, setMomentFormat] = useState('HH.mm')
  
  useEffect(() => {
    let format = 'HH.mm'
    kilpailu.sarjat.forEach(sarja => {
      if (sarja.kilpailijat.some(kilpailija => {
        if (kilpailija.kilpailut[kilpailu._id].lahtoaika) {
          const lähtöaika = moment(kilpailija.kilpailut[kilpailu._id].lahtoaika)
          return lähtöaika.seconds() !== 0
        } else return false
      })) {
        return format = 'HH.mm.ss'
      }
    })
    setMomentFormat(format)
  }, [kilpailu])

  return (
    <div>
      {kirjauduttu
        ? !kilpailijanLisäys
            ? <button onClick={() => setKilpailijanLisäys(true)} className='btn-yellow'>Lisää kilpailija</button>
            : <UusiKilpailija setKilpailijanLisäys={setKilpailijanLisäys} />
        : <></>
      }
      <div className='flex-container'><div className='table-container'>
        {kilpailu.sarjat
        ? kilpailu.sarjat.map(sarja => <div key={sarja._id}>
            <h4>{sarja.nimi}</h4>
            <table>
              <thead>
                <tr>
                  <th>Nimi</th><th>Lähtöaika</th>
                  {kirjauduttu ? <th></th> : <></>}
                </tr>
              </thead>
              <tbody>
                {sarja.kilpailijat.map(kilpailija => <Lähtöaika  key={kilpailija._id}
                  kilpailija={kilpailija} sarja={sarja} momentFormat={momentFormat} />)}
              </tbody>
            </table>
          </div>)
        : <></>}
      </div>
    </div></div>
  )
}

export default Lähtöajat