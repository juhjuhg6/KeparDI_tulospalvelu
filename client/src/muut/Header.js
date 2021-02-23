import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import Context from '../Context'

function Header({ kausienJaKilpailujenNimet, valikkoAuki, setValikkoAuki }) {
  const { kilpailu, aktiivinenKausi } = useContext(Context)

  const [valittuKausi, setValittuKausi] = useState(aktiivinenKausi.id)

  function menuClickHandler() {
    if (valikkoAuki) {
      setValittuKausi(aktiivinenKausi.id)
    }
    setValikkoAuki(!valikkoAuki)
  }

  return (
    <div className='header' style={{ marginBottom: valikkoAuki ? '-2rem' : '0' }}>
      <h1>KeparDI</h1>
      <h1>Tulospalvelu</h1>
      <button onClick={menuClickHandler} className='btn-menu'>
        {valikkoAuki ? <>Sulje</> : <>Kaudet</>}
      </button>
      {valikkoAuki
      ? <>
        <ul>
          {kausienJaKilpailujenNimet.map(kausi => <div key={kausi.id}>
            <li onClick={() => setValittuKausi(kausi.id)} className='li-kausi'
              style={{ color: kausi.id === aktiivinenKausi.id ? '#FFCC00' : 'whitesmoke' }}>
              {kausi.nimi}
            </li>
            {kausi.id === valittuKausi
            ?
              <ul>
                <li className='li-kilpailu'>
                  <Link to={`/${kausi.nimi}/Kokonaispisteet`} onClick={() => setValikkoAuki(false)}
                    style={{ color: kilpailu === 'Kokonaispisteet' &&
                    kausi.id === aktiivinenKausi.id ? '#FFCC00' : 'whitesmoke' }}>
                    Kokonaispisteet
                  </Link>
                </li>
                {kausi.kilpailut.map(k =>
                  <li key={k.id} className='li-kilpailu'>
                    <Link to={`/${kausi.nimi}/${k.nimi}`} onClick={() => setValikkoAuki(false)}
                      style={{ color: k.id === kilpailu._id ? '#FFCC00' : 'whitesmoke' }}>
                      {k.nimi}
                    </Link>
                  </li>
                )}
              </ul>
            : <></>
          }
          </div>)}
        </ul>
      </> : <></>}
    </div>
  )
}

export default Header