import React from 'react'
import Tulos from './Tulos'

function SarjanTulokset({ kilpailu, sarja }) {
  return (<>
    <h4>{sarja.nimi}</h4>
    <table>
      <thead>
        <tr><th>Sija</th><th>Nimi</th><th>Aika</th><th>Ero</th><th>Pisteet</th></tr>
      </thead>
      <tbody>
        {sarja.kilpailijat.map(kilpailija => <Tulos key={kilpailija._id} kilpailu={kilpailu}
          kilpailija={kilpailija} sarja={sarja} />)}
      </tbody>
    </table>
  </>)
}

export default SarjanTulokset