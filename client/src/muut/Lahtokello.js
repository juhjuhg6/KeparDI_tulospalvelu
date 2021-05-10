import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import moment from 'moment'

function Lähtökello(props) {
  const [kilpailijat, setKilpailijat] = useState([])
  const [aika, setAika] = useState(moment())
  const [seuraavaLähtö, setSeuraavaLähtö] = useState()
  const [beep, setBeep] = useState()
  const [beepPitkä, setBeepPitkä] = useState()

  const ajastin = useRef()

  useEffect(() => {
    ajastin.current = setInterval(() => setAika(moment()), 100)

    setBeep(new Audio(`${process.env.PUBLIC_URL}/beep.wav`))
    setBeepPitkä(new Audio(`${process.env.PUBLIC_URL}/beep_pitka.wav`))

    document.getElementById('root').style.backgroundColor = 'black'
    document.getElementById('root').style.color = 'white'
    document.getElementById('root').style.padding = '0'

    axios.get(`/api/kilpailut/${props.match.params.kausiId}/${props.match.params.kilpailuId}`)
      .then(vastaus => {
        const kilpailu = vastaus.data
        let uudetKilpailijat = []

        kilpailu.sarjat.forEach(sarja => {
          uudetKilpailijat = uudetKilpailijat.concat(sarja.kilpailijat)
        })

        uudetKilpailijat = uudetKilpailijat.map(kilpailija => {
          let muokattuKilpailija = {}
          muokattuKilpailija._id = kilpailija._id
          muokattuKilpailija.nimi = kilpailija.nimi
          muokattuKilpailija.lähtöaika =
            moment(kilpailija.kilpailut[props.match.params.kilpailuId].lahtoaika)
          return muokattuKilpailija
        })
        uudetKilpailijat.filter(kilpailija => kilpailija.lähtöaika >= aika - 1000)
        uudetKilpailijat.sort((a, b) => a.lähtöaika - b.lähtöaika)
        setSeuraavaLähtö(uudetKilpailijat[0].lähtöaika)
        setKilpailijat(uudetKilpailijat)
      })
      .catch(err => {
        console.log(err)
      })

    return () => {
      clearInterval(ajastin.current)
      document.getElementById('root').style.backgroundColor = 'whitesmoke'
      document.getElementById('root').style.color = '#3e434c'
      document.getElementById('root').style.padding = '1rem'
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (!kilpailijat.length) {
      return
    }
    if (kilpailijat[0].lähtöaika >= aika - 1000) {
      return
    }
    const päivitetytKilpailijat = kilpailijat.filter(kilpailija => kilpailija.lähtöaika >= aika - 1000)
    setKilpailijat(päivitetytKilpailijat)
    if (päivitetytKilpailijat.length) {
      setSeuraavaLähtö(päivitetytKilpailijat[0].lähtöaika)
    }
    // eslint-disable-next-line
  }, [aika])

  useEffect(() => {
    const aikaaSeuraavaanLähtöön = seuraavaLähtö - aika
    if (aikaaSeuraavaanLähtöön <= 0 && aikaaSeuraavaanLähtöön > -100) {
      beepPitkä.play()
    }
    if ((aikaaSeuraavaanLähtöön <= 10000 && aikaaSeuraavaanLähtöön > 9900) ||
      (aikaaSeuraavaanLähtöön <= 5000 && aikaaSeuraavaanLähtöön > 4900) ||
      (aikaaSeuraavaanLähtöön <= 4000 && aikaaSeuraavaanLähtöön > 3900) ||
      (aikaaSeuraavaanLähtöön <= 3000 && aikaaSeuraavaanLähtöön > 2900) ||
      (aikaaSeuraavaanLähtöön <= 2000 && aikaaSeuraavaanLähtöön > 1900) ||
      (aikaaSeuraavaanLähtöön <= 1000 && aikaaSeuraavaanLähtöön > 900)) {
        beep.play()
    }
    // eslint-disable-next-line
  }, [aika])

  function lähtöaikaStr(kilpailija) {
    const lähtöaika = kilpailija.lähtöaika
    return moment(lähtöaika).format('HH.mm.ss')
  }

  return (
    <div className='ulompi-div'>
      <div className='sisempi-div'>
        <p className='seuraavaan-lähtöön'>{moment.utc(seuraavaLähtö - aika + 1000).format('mm.ss')}</p>
        <p className='aika'>{aika.format('HH.mm.ss')}</p>
      </div>
      <div className='sisempi-div taulukko-container'>
        <table>
          <thead>
            <tr><th>Nimi</th><th>Lähtöaika</th></tr>
          </thead>
          <tbody>
            {kilpailijat.map(kilpailija =>
              <tr key={kilpailija._id}>
                <td>{kilpailija.nimi}</td>
                <td>{lähtöaikaStr(kilpailija)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Lähtökello