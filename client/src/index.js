import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import App from './App';
import axios from 'axios'
import './style/index.css'
import './style/header.css'
import './style/table.css'

axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt')

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Route path='/:kausiNimi?/:kilpailuNimi?' component={App} />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);