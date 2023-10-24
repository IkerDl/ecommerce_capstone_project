import React, { Component } from 'react';
import Home from './pages/home';
import Contact from './pages/contact';
import Prueba from "./pages/prueba";

export default class App extends Component {
  render() {
    return (
      <div className='container'>
        <Home />
        <Contact />
        <Prueba />

      </div>
    );
  }
}
