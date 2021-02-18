import React, { useEffect, useRef, useContext } from 'react'
import Context from '../Context'

function KilpailunValinta({ kausienJaKilpailujenNimet, setAktiivinenKausi, setAktiivinenKilpailu }) {
  const { aktiivinenKausi } = useContext(Context)

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
      <div style={{display: 'inline-block'}}>
        <label htmlFor="valitseKausi">Kausi:</label>
        <select ref={kausiSelect} name="kausi" id ="valitseKausi" onChange={aktiivinenKausiMuutettu}>
          {kausienJaKilpailujenNimet.map(kausi => <option key={kausi.id} value={JSON.stringify(kausi)}>{kausi.nimi}</option>)}
        </select>
      </div>
      <div style={{ display: 'inline-block' }}>
        <label htmlFor="valitseKilpailu">Kilpailu:</label>
        <select name="kilpailu" id ="valitseKilpailu" onChange={aktiivinenKilpailuMuutettu}>
          <option value="Kokonaispisteet">Kokonaispisteet</option>
          {aktiivinenKausi.kilpailut
          ? aktiivinenKausi.kilpailut.map(kilpailu => <option key={kilpailu.id} value={JSON.stringify(kilpailu)}>{kilpailu.nimi}</option>) : <></>}
        </select>
      </div>
    </div>
  )
}

export default KilpailunValinta