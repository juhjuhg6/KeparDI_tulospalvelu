import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import App from './App';
import axios from 'axios'
import './style/index.css'
import './style/header.css'
import './style/table.css'

if (process.env.PUBLIC_URL) {
  axios.defaults.baseURL = process.env.PUBLIC_URL
}

axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt')

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Route path={`${process.env.PUBLIC_URL}/:kausiNimi?/:kilpailuNimi?`} component={App} />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);