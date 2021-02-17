import React, { useRef } from 'react'

function ManuaalisetPisteet({ kilpailija, nykyisetPisteet, uudetManuaalisetPisteet, setUudetManuaalisetPisteet }) {
  const pisteInput = useRef(null)

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