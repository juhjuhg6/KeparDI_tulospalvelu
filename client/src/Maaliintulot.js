import React from 'react'
import Maaliintulo from './Maaliintulo.js'

function Maaliintulot({aktiivinenKausi, kilpailu, setKilpailu}) {

  return (
    <div>
      <table>
        <thead>
          <tr><th>Nimi</th><th>Maaliintuloaika</th></tr>
        </thead>
        <tbody>
          {kilpailu.maaliintulot.map(maaliintulo => <Maaliintulo key={maaliintulo._id}
            maaliintulo={maaliintulo} aktiivinenKausi={aktiivinenKausi}
            kilpailu={kilpailu} setKilpailu={setKilpailu} />)}
        </tbody>
      </table>
    </div>
  )
}

export default Maaliintulot