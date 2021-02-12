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
      <td>{kilpailija.nimi}</td>
      <td><input ref={pisteInput} type='number' defaultValue={nykyisetPisteet} onChange={päivitäPisteet}/></td>
      <td><button onClick={palautaNykyisetPisteet}>Palauta</button></td>
    </tr>
  )
}

export default ManuaalisetPisteet