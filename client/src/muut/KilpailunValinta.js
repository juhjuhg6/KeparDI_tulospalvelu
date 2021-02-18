import React, { useEffect, useRef } from 'react'

function KilpailunValinta({kausienJaKilpailujenNimet,
  aktiivinenKausi, setAktiivinenKausi, setAktiivinenKilpailu}) {
  const kausiSelect = useRef(null)

  useEffect(() => {
    kausiSelect.current.value = JSON.stringify(aktiivinenKausi)
  }, [aktiivinenKausi])

  function aktiivinenKausiMuutettu(e) {
    setAktiivinenKausi(JSON.parse(e.target.value))
  }

  function aktiivinenKilpailuMuutettu(e) {
    if (e.target.value === 'Kokonaispisteet') {
      setAktiivinenKilpailu('Kokonaispisteet')
      return
    }
    setAktiivinenKilpailu(JSON.parse(e.target.value))
  }

  return(
    <div>
      <label htmlFor="valitseKausi">Kausi:</label>
      <select ref={kausiSelect} name="kausi" id ="valitseKausi" onChange={aktiivinenKausiMuutettu}>
        {kausienJaKilpailujenNimet.map(kausi => <option key={kausi.id} value={JSON.stringify(kausi)}>{kausi.nimi}</option>)}
      </select>
      <label htmlFor="valitseKilpailu">Kilpailu:</label>
      <select name="kilpailu" id ="valitseKilpailu" onChange={aktiivinenKilpailuMuutettu}>
        <option value="Kokonaispisteet">Kokonaispisteet</option>
        {aktiivinenKausi.kilpailut
        ? aktiivinenKausi.kilpailut.map(kilpailu => <option key={kilpailu.id} value={JSON.stringify(kilpailu)}>{kilpailu.nimi}</option>) : <></>}
      </select>
    </div>
  )
}

export default KilpailunValinta