import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Context from '../Context'

function Kokonaispisteet({ kausienJaKilpailujenNimet }) {
  const { aktiivinenKausi } = useContext(Context)

  const [pisteet, setPisteet] = useState()

  useEffect(() => {
    let komponenttiKiinnitetty = true
    setPisteet(false)
    if (!aktiivinenKausi) return
    axios.get(`/api/pisteet/${aktiivinenKausi.id}`)
      .then(vastaus => {
        if (komponenttiKiinnitetty) {
          valmistelePisteet(vastaus.data)
        }
      })
      .catch(err => {
        console.log(err)
      })
    
    return () => komponenttiKiinnitetty = false
    // eslint-disable-next-line
  }, [aktiivinenKausi])

  function valmistelePisteet(valmisteltavatPisteet) {
    valmisteltavatPisteet.forEach(kilpailija => {
      let kokonaispisteet = 0
      const kilpailut = kausienJaKilpailujenNimet.find(kausi => kausi.id === aktiivinenKausi.id).kilpailut
      for (const kilpailu in kilpailija.kilpailut) {
        if (kilpailut.some(k => k.id === kilpailu)) {
          kokonaispisteet += kilpailija.kilpailut[kilpailu].pisteet
        }
      }
      kilpailija.kokonaispisteet = kokonaispisteet
    })
    valmisteltavatPisteet.sort((a, b) => b.kokonaispisteet - a.kokonaispisteet)
    setPisteet(valmisteltavatPisteet)
  }

  return(
    <div>
      <h3>{aktiivinenKausi.nimi}</h3>
      <h3>Kokonaispisteet</h3>
      {pisteet
      ?
      <table>
        <thead>
          <tr>
            <th>Nimi</th>
            {kausienJaKilpailujenNimet.find(kausi => kausi.id === aktiivinenKausi.id).kilpailut.map(kilpailu =>
              <th key={kilpailu.id}><Link className='th-kilpailun-nimi'>{kilpailu.nimi}</Link></th>)}
            <th>Kokonaispisteet</th>
          </tr>
        </thead>
        <tbody>
          {pisteet.map(kilpailija => <tr key={kilpailija._id}>
            <td>{kilpailija.nimi}</td>
            {kausienJaKilpailujenNimet.find(kausi => kausi.id === aktiivinenKausi.id).kilpailut.map(kilpailu =>
                kilpailija.kilpailut[kilpailu.id]
                ? <td key={kilpailu.id} className='td-pisteet'
                  style={{ backgroundColor: `rgb(255, ${230 + (25 * (1 - kilpailija.kilpailut[kilpailu.id].pisteet / 1000))}, ${51 + (204 * (1 - kilpailija.kilpailut[kilpailu.id].pisteet / 1000))})` }}>
                    {kilpailija.kilpailut[kilpailu.id].pisteet}
                  </td>
                : <td key={kilpailu.id} className='td-pisteet' style={{backgroundColor: 'white'}}>0</td>
            )}
            <td>{kilpailija.kokonaispisteet}</td>
          </tr>)}
        </tbody>
      </table>
      : <>Lasketaan pisteitä...</>}
    </div>
  )
}

export default Kokonaispisteet