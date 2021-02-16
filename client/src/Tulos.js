import React from 'react'
import moment from 'moment'

function Tulos({kilpailu, kilpailija, sarja}) {
  return (
    <tr>
      {!kilpailija.kilpailut[kilpailu._id].muuTulos
        ? <>
          <td>{kilpailija.sija}.</td>
          <td>{kilpailija.nimi}</td>
          {kilpailija.aika
          ? <>
            <td>{moment(kilpailija.aika).utc().format('H.mm.ss')}</td>
            <td>{moment(kilpailija.aika - sarja.voittoaika).utc().format('H.mm.ss')}</td>
          </> : <>
            <td></td>
            <td></td>
          </>}
        </> : <>
          <td></td>
          <td>{kilpailija.nimi}</td>
          <td>{kilpailija.kilpailut[kilpailu._id].muuTulos}</td>
          <td></td>
        </>
      }
      {sarja.lasketaanPisteet
      ? <td>{kilpailija.kilpailut[kilpailu._id].pisteet}</td>
      : <></>}
    </tr>
  )
}

export default Tulos