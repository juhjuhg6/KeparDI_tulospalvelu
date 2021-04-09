import React, { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import moment from 'moment'
import Context from '../Context'
import Tulos from './Tulos'
import PisteidenLataus from '../muut/PisteidenLataus'

function Tulokset() {
  const { kilpailu, setKilpailu, aktiivinenKausi } = useContext(Context)

  const [pisteetLaskettu, setPisteetLaskettu] = useState(false)
  const [komponenttiKiinnitetty, setKomponenttiKiinnitetty] = useState(true)

  const muokattuKilpailu = useRef(null)

  useEffect(() => {
    haePisteet(false)

    return (() => setKomponenttiKiinnitetty(false))
    // eslint-disable-next-line
  }, [])

  function haePisteet(pakotaPistelasku) {
    setPisteetLaskettu(false)
    axios.get(`/api/pisteet/${aktiivinenKausi.id}/${kilpailu._id}`, {params: {pakotaPistelasku}})
      .then(vastaus => {
        if (!komponenttiKiinnitetty) return
        
        const kilpailu = vastaus.data
        setKilpailu(kilpailu)

        kilpailu.sarjat.forEach(sarja => {
          if (Object.keys(kilpailu.manuaalisetPisteet).length === 0) {
            sarja.kilpailijat.sort((a, b) => {
              if (a.kilpailut[kilpailu._id].muuTulos) return 1
              if (b.kilpailut[kilpailu._id].muuTulos) return -1
              if (moment(a.kilpailut[kilpailu._id].maaliaika) - moment(a.kilpailut[kilpailu._id].lahtoaika) <
                moment(b.kilpailut[kilpailu._id].maaliaika) - moment(b.kilpailut[kilpailu._id].lahtoaika)) return -1
              if (moment(a.kilpailut[kilpailu._id].maaliaika) - moment(a.kilpailut[kilpailu._id].lahtoaika) >
                moment(b.kilpailut[kilpailu._id].maaliaika) - moment(b.kilpailut[kilpailu._id].lahtoaika)) return 1
              return 0
            })
          } else {
            sarja.kilpailijat.sort((a, b) => {
              if (a.kilpailut[kilpailu._id].pisteet < b.kilpailut[kilpailu._id].pisteet) return 1
              if (a.kilpailut[kilpailu._id].pisteet > b.kilpailut[kilpailu._id].pisteet) return -1
              return 0
            })
          }
        })

        kilpailu.sarjat.forEach(sarja => {
          let i = 0

          if (Object.keys(kilpailu.manuaalisetPisteet).length === 0) {
            let edellinenAika
            let edellinenSija

            sarja.kilpailijat.forEach(kilpailija => {
              if (!kilpailija.kilpailut[kilpailu._id].maaliaika || !kilpailija.kilpailut[kilpailu._id].lahtoaika) {
                return
              }
              i++
              const kilpailijanAika = moment(kilpailija.kilpailut[kilpailu._id].maaliaika) -
                moment(kilpailija.kilpailut[kilpailu._id].lahtoaika)
              kilpailija.aika = kilpailijanAika
              if (i === 1) {
                kilpailija.sija = i
                edellinenSija = i
                sarja.voittoaika = kilpailijanAika
                edellinenAika = kilpailijanAika
              } else if (kilpailijanAika === edellinenAika) {
                kilpailija.sija = edellinenSija
              } else {
                kilpailija.sija = i
                edellinenSija = i
                edellinenAika = kilpailijanAika
              }
            })
          } else {
            let edellisetPisteet
            let edellinenSija

            sarja.kilpailijat.forEach(kilpailija => {
              i++
              const pisteet = kilpailija.kilpailut[kilpailu._id].pisteet
              if (i === 1) {
                kilpailija.sija = i
                edellinenSija = i
                edellisetPisteet = pisteet
              } else if (pisteet === edellisetPisteet) {
                kilpailija.sija = edellinenSija
              } else {
                kilpailija.sija = i
                edellinenSija = i
                edellisetPisteet = pisteet
              }
            })
          }
        })

        muokattuKilpailu.current = kilpailu

        setPisteetLaskettu(true)
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div>
      <button onClick={() => haePisteet(true)} className='btn-yellow'>Päivitä pisteet</button>

      <div className='flex-container'><div className='table-container'>
        {!pisteetLaskettu
          ?
            <PisteidenLataus />
          :
            kilpailu.sarjat.map(sarja => <div key={sarja._id}>
              <h4>{sarja.nimi}</h4>
              <table>
                <thead>
                  <tr>
                    <th>Sija</th><th>Nimi</th><th>Aika</th><th>Ero</th>
                    {sarja.lasketaanPisteet && <th>Pisteet</th>}
                  </tr>
                </thead>
                <tbody>
                  {sarja.kilpailijat.map(kilpailija => {
                    return (
                      Object.keys(kilpailu.manuaalisetPisteet).length !== 0 || (kilpailija.kilpailut[kilpailu._id].lahtoaika &&
                      (kilpailija.kilpailut[kilpailu._id].maaliaika || kilpailija.kilpailut[kilpailu._id].muuTulos))
                        ? <Tulos key={kilpailija._id} kilpailija={kilpailija} sarja={sarja} />
                        : <></>
                    )
                  })}
                </tbody>
              </table>
            </div>)
        }

        {(kilpailu.jarjestajat && kilpailu.jarjestajat.length !== 0 && pisteetLaskettu) &&
          <>
            <h4>Järjestäjät</h4>
            <table>
              <thead>
                <tr><th>Nimi</th><th>Pisteet</th></tr>
              </thead>
              <tbody>
                {muokattuKilpailu.current.jarjestajat.map(järjestäjä => 
                  <tr key={järjestäjä._id}>
                    <td className='td-tulokset nimi'>{järjestäjä.nimi}</td><td>{järjestäjä.kilpailut[kilpailu._id].pisteet}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        }
      </div></div>
    </div>
  )
}

export default Tulokset