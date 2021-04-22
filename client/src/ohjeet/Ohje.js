import React, { useState } from 'react'

function Ohje({ otsikko, ohjeteksti }) {
  const [auki, setAuki] = useState(false)

  return (
    <>
      <h3 className='ohje-otsikko' onClick={() => setAuki(!auki)}>{otsikko}</h3>
      <div className='ohjeteksti'>{auki && ohjeteksti}</div>
    </>
  )
}

export default Ohje