import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import Context from '../Context'
import LisääKausiTaiKilpailu from './LisaaKausiTaiKilpailu'
import Kirjautuminen from './Kirjautuminen'
import logo from '../resources/logo_43x40.png'
import menuIcon from '../resources/menu_icon_30x30.png'

function Header({ kausienJaKilpailujenNimet, valikkoAuki, setValikkoAuki, päivitäKausienJaKilpailujenNimet }) {
  const { kilpailu, aktiivinenKausi, kirjauduttu } = useContext(Context)

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
      {window.innerWidth > 290 &&
        <h1 style={{marginLeft: '4rem'}}>
          <a href='https://webpages.tuni.fi/kepardi' style={{ padding: 0 }}>KeparDI</a>
        </h1>
      }
      <h1 style={{marginLeft: window.innerWidth < 290 ? '4rem' : 0}}>
        <Link to={`${process.env.PUBLIC_URL}/`} style={{padding: 0}}>Tulospalvelu</Link>
      </h1>
      <div className='menu-icon-container'>
        <img src={menuIcon} alt='Valikko' className='menu-icon' style={imgStyle} onClick={menuClickHandler} />
      </div>
      {valikkoAuki &&
        <>
          {kirjauduttu &&
            <LisääKausiTaiKilpailu päivitäKausienJaKilpailujenNimet={päivitäKausienJaKilpailujenNimet} />
          }

          <ul>
            {kausienJaKilpailujenNimet.map(kausi => <div key={kausi.id}>
              <li onClick={() => setValittuKausi(kausi.id)} className='li-kausi'
                style={{ color: kausi.id === aktiivinenKausi.id ? '#FFCC00' : 'whitesmoke' }}>
                {kausi.nimi}
              </li>
              {kausi.id === valittuKausi &&
                <ul>
                  <li className='li-kilpailu'>
                    <Link to={`${process.env.PUBLIC_URL}/${kausi.nimi}/Kokonaispisteet`} onClick={() => setValikkoAuki(false)}
                      style={{ color: kilpailu === 'Kokonaispisteet' &&
                      kausi.id === aktiivinenKausi.id ? '#FFCC00' : 'whitesmoke' }}>
                      Kokonaispisteet
                    </Link>
                  </li>
                  {kausi.kilpailut.map(k =>
                    <li key={k.id} className='li-kilpailu'>
                      <Link to={`${process.env.PUBLIC_URL}/${kausi.nimi}/${k.nimi}`} onClick={() => setValikkoAuki(false)}
                        style={{ color: k.id === kilpailu._id ? '#FFCC00' : 'whitesmoke' }}>
                        {k.nimi}
                      </Link>
                    </li>
                  )}
                </ul>
              }
            </div>)}
          </ul>

          <Kirjautuminen />
        </>
      }
    </div>
  )
}

export default Header