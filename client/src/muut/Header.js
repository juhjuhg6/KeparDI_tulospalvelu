import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import Context from '../Context'
import logo from '../resources/logo_43x40.png'

function Header({ kausienJaKilpailujenNimet, valikkoAuki, setValikkoAuki }) {
  const { kilpailu, aktiivinenKausi } = useContext(Context)

  const [valittuKausi, setValittuKausi] = useState(aktiivinenKausi.id)

  const imgStyle = {
    position: 'absolute',
    paddingTop: '1.3rem',
    paddingLeft: '0.3rem'
  }

  const headerStyle = {
    marginBottom: valikkoAuki ? '-2rem' : '0',
    position: 'relative'
  }

  function menuClickHandler() {
    setValittuKausi(aktiivinenKausi.id)
    setValikkoAuki(!valikkoAuki)
  }

  return (
    <div className='header' style={headerStyle}>
      <a href='https://webpages.tuni.fi/kepardi' style={{padding: 0}}>
        <img src={logo} alt='Keijo Kepardi' style={imgStyle} />
      </a>
      {window.innerWidth < 352
      ? <></> :
        <h1 style={{marginLeft: '4rem'}}>
          <a href='https://webpages.tuni.fi/kepardi' style={{ padding: 0 }}>KeparDI</a>
        </h1>
      }
      <h1 style={{marginLeft: window.innerWidth < 352 ? '4rem' : 0}}>
        <Link to='/' style={{padding: 0}}>Tulospalvelu</Link>
      </h1>
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