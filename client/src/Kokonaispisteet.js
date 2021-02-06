import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Kokonaispisteet({aktiivinenKausi, kausienJaKilpailujenNimet}) {
  const [pisteet, setPisteet] = useState()

  useEffect(() => {
    let komponenttiKiinnitetty = true
    setPisteet(false)
    if (!aktiivinenKausi) return
    axios.get(`api/pisteet/${aktiivinenKausi.id}`)
      .then(vastaus => {
        if (komponenttiKiinnitetty) {
          valmistelePisteet(vastaus.data)
        }
      })
      .catch(err => {
        console.log(err)
      })
    
    return () => komponenttiKiinnitetty = false
  }, [aktiivinenKausi])

  function valmistelePisteet(valmisteltavatPisteet) {
    valmisteltavatPisteet.forEach(kilpailija => {
      let kokonaispisteet = 0
      for (const kilpailu in kilpailija.kilpailut) {
        kokonaispisteet += kilpailija.kilpailut[kilpailu].pisteet
      }
      kilpailija.kokonaispisteet = kokonaispisteet
    })
    valmisteltavatPisteet.sort((a, b) => b.kokonaispisteet - a.kokonaispisteet)
    setPisteet(valmisteltavatPisteet)
  }

  return(
    <div>
      <h3>Kokonaispisteet</h3>
      {pisteet
      ?
      <table>
        <thead>
          <tr>
            <th>Nimi</th>
            {kausienJaKilpailujenNimet.find(kausi => kausi.id === aktiivinenKausi.id).kilpailut.map(kilpailu => <th key={kilpailu.id}>{kilpailu.nimi}</th>)}
            <th>Kokonaispisteet</th>
          </tr>
        </thead>
        <tbody>
          {pisteet.map(kilpailija => <tr key={kilpailija._id}>
            <td>{kilpailija.nimi}</td>
            {kausienJaKilpailujenNimet.find(kausi => kausi.id === aktiivinenKausi.id).kilpailut.map(kilpailu => <td key={kilpailu.id}>
              {kilpailija.kilpailut[kilpailu.id]
              ? kilpailija.kilpailut[kilpailu.id].pisteet
              : 0}
            </td>)}
            <td>{kilpailija.kokonaispisteet}</td>
          </tr>)}
        </tbody>
      </table>
      : <>Lasketaan pisteitä...</>}
    </div>
  )
}

export default Kokonaispisteet