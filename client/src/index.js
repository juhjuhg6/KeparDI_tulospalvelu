import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import App from './App'
import Lähtökello from './muut/Lahtokello'
import axios from 'axios'
import './style/index.css'
import './style/header.css'
import './style/table.css'
import './style/maaliintulo.css'
import './style/lahtokello.css'

if (process.env.PUBLIC_URL) {
  axios.defaults.baseURL = process.env.PUBLIC_URL
}

axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt')

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path={`${process.env.PUBLIC_URL}/:kausiId?/:kilpailuId?/lähtökello`}
          component={Lähtökello} />
        <Route path={`${process.env.PUBLIC_URL}/:kausiNimi?/:kilpailuNimi?`} component={App} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);