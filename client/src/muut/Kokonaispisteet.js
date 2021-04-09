import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Context from '../Context'
import PisteidenLataus from './PisteidenLataus'

function Kokonaispisteet({ kausienJaKilpailujenNimet }) {
  const { aktiivinenKausi } = useContext(Context)

  const [pisteet, setPisteet] = useState()
  const [komponenttiKiinnitetty, setKomponenttiKiinnitetty] = useState(true)

  useEffect(() => {
    haePisteet(false)
    
    return () => setKomponenttiKiinnitetty(false)
    // eslint-disable-next-line
  }, [aktiivinenKausi])

  function haePisteet(pakotaPistelasku) {
    setPisteet(false)
    if (!aktiivinenKausi) return
    axios.get(`/api/pisteet/${aktiivinenKausi.id}`, {params: {pakotaPistelasku}})
      .then(vastaus => {
        if (komponenttiKiinnitetty) {
          valmistelePisteet(vastaus.data)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

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

  function soluVäri(pisteet) {
    return `rgb(255, ${ 230 + (25 * (1 - pisteet / 1000)) }, ${ 51 + (204 * (1 - pisteet / 1000)) })`
  }

  return(
    <div>
      <h3>{aktiivinenKausi.nimi}</h3>
      <h3>Kokonaispisteet</h3>
      {pisteet
        ?
          <>
            <table>
              <thead>
                <tr>
                  <th style={{ borderRight: '1px solid silver' }}>Nimi</th>
                  {kausienJaKilpailujenNimet.find(kausi => kausi.id === aktiivinenKausi.id).kilpailut.map(kilpailu =>
                    <th key={kilpailu.id} className='th-kilpailun-nimi'>
                      <Link to={`${process.env.PUBLIC_URL}/${aktiivinenKausi.nimi}/${kilpailu.nimi}`} className='a-kilpailun-nimi'>
                        {kilpailu.nimi}
                      </Link>
                    </th>
                  )}
                  <th style={{ borderLeft: '1px solid silver' }}>Kokonaispisteet</th>
                </tr>
              </thead>
              <tbody>
                {pisteet.map(kilpailija => <tr key={kilpailija._id}>
                  <td>{kilpailija.nimi}</td>
                  {kausienJaKilpailujenNimet.find(kausi => kausi.id === aktiivinenKausi.id).kilpailut.map(kilpailu =>
                    kilpailija.kilpailut[kilpailu.id]
                      ?
                        <td key={kilpailu.id} className='td-pisteet'
                          style={{ backgroundColor: soluVäri(kilpailija.kilpailut[kilpailu.id].pisteet) }}>
                          {kilpailija.kilpailut[kilpailu.id].pisteet}
                        </td>
                      :
                        <td key={kilpailu.id} className='td-pisteet' style={{backgroundColor: 'white'}}>0</td>
                  )}
                  <td>{kilpailija.kokonaispisteet}</td>
                </tr>)}
              </tbody>
            </table>

            <button onClick={() => haePisteet(true)} className='btn-yellow'>Päivitä pisteet</button>
          </>
        :
          <PisteidenLataus />
      }
    </div>
  )
}

export default Kokonaispisteet