import React, { useState, useEffect, useRef } from 'react'

function ManuaalisetPisteet({ kilpailu, kilpailija, uudetManuaalisetPisteet, setUudetManuaalisetPisteet }) {
  const [nykyisetPisteet, setNykyisetPisteet] = useState()
  const pisteInput = useRef(null)

  useEffect(() => {
    setNykyisetPisteet(kilpailu.manuaalisetPisteet[kilpailija.id])
    // eslint-disable-next-line
  }, [kilpailu])

  useEffect(() => {
    palautaNykyisetPisteet()
    // eslint-disable-next-line
  }, [nykyisetPisteet])

  function palautaNykyisetPisteet() {
    pisteInput.current.value = nykyisetPisteet || ''
  }

  function päivitäPisteet() {
    let asetettavatPisteet = uudetManuaalisetPisteet
    asetettavatPisteet[kilpailija.id] = pisteInput.current.value
    setUudetManuaalisetPisteet = asetettavatPisteet
  }

  return (
    <tr>
      <td className='nimi'>{kilpailija.nimi}</td>
      <td><input ref={pisteInput} type='number' defaultValue={nykyisetPisteet} onChange={päivitäPisteet}
      className='input-piste'/></td>
      <td><button onClick={palautaNykyisetPisteet} className='btn-yellow'>Palauta</button></td>
    </tr>
  )
}

export default ManuaalisetPisteet