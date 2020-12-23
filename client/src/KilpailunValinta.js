import React from 'react'

function KilpailunValinta({kausienJaKilpailujenNimet,
  aktiivinenKausi, setAktiivinenKausi, setAktiivinenKilpailu}) {

  function aktiivinenKausiMuutettu(e) {
    setAktiivinenKausi(JSON.parse(e.target.value))
  }

  function aktiivinenKilpailuMuutettu(e) {
    setAktiivinenKilpailu(JSON.parse(e.target.value))
  }

  return(
    <div>
      <label htmlFor="valitseKausi">Kausi:</label>
      <select name="kausi" id ="valitseKausi" onChange={aktiivinenKausiMuutettu}>
        {kausienJaKilpailujenNimet.map(kausi => <option key={kausi.id} value={JSON.stringify(kausi)}>{kausi.nimi}</option>)}
      </select>
      <label htmlFor="valitseKilpailu">Kilpailu:</label>
      <select name="kilpailu" id ="valitseKilpailu" onChange={aktiivinenKilpailuMuutettu}>
        {aktiivinenKausi.kilpailut
        ? aktiivinenKausi.kilpailut.map(kilpailu => <option key={kilpailu.id} value={JSON.stringify(kilpailu)}>{kilpailu.nimi}</option>) : <></>}
      </select>
    </div>
  )
}

export default KilpailunValinta