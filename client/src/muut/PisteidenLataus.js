import React from 'react'
import logo from '../resources/logo_300x278.png'

function PisteidenLataus() {
  const pStyle = {
    textAlign: 'center',
    fontWeight: 'bold',
    paddingBottom: '1rem'
  }

  const imgStyle = {
    paddingTop: '1rem'
  }

  return (
    <div className='flex-container'>
      <p style={pStyle}>Pikku hetki...</p>
      <p style={pStyle}>Keijo laskee pisteet ja toimittaa ne pikapuoliin!</p>
      <img src={logo} alt='Keijo KeparDI' style={imgStyle} />
    </div>
  )
}

export default PisteidenLataus