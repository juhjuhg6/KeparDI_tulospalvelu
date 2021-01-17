import React from 'react'
import moment from 'moment'

function Tulos({kilpailu, kilpailija, sarja}) {
  return (
    <tr>
      <td>{kilpailija.sija}.</td>
      <td>{kilpailija.nimi}</td>
      <td>{moment(kilpailija.aika).utc().format('H.mm.ss')}</td>
      <td>{moment(kilpailija.aika - sarja.voittoaika).utc().format('H.mm.ss')}</td>
      <td>{kilpailija.kilpailut[kilpailu._id].pisteet}</td>
    </tr>
  )
}

export default Tulos