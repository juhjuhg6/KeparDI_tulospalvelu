import React, { useContext } from 'react'
import moment from 'moment'
import Context from '../Context'

function Tulos({ kilpailija, sarja }) {
  const { kilpailu } = useContext(Context)

  return (
    <tr>
      {!kilpailija.kilpailut[kilpailu._id].muuTulos
        ?
          <>
            <td className='td-tulokset'>{kilpailija.sija}.</td>
            <td className='td-tulokset nimi'>{kilpailija.nimi}</td>
            {kilpailija.aika
              ?
                <>
                  <td className='td-tulokset'>{moment(kilpailija.aika).utc().format('H.mm.ss')}</td>
                  <td className='td-tulokset'>{moment(kilpailija.aika - sarja.voittoaika).utc().format('H.mm.ss')}</td>
                </>
              :
                <>
                  <td></td>
                  <td></td>
                </>
            }
          </>
        :
          <>
            <td></td>
            <td className='td-tulokset nimi'>{kilpailija.nimi}</td>
            <td className='td-tulokset'>{kilpailija.kilpailut[kilpailu._id].muuTulos}</td>
            <td></td>
          </>
      }
      {sarja.lasketaanPisteet && <td>{kilpailija.kilpailut[kilpailu._id].pisteet}</td>}
    </tr>
  )
}

export default Tulos