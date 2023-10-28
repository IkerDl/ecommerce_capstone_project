import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

export default class NavBar extends Component {
    render() {
      return (
        <div className='navbar-wrapper'>
          <div className='logo-container'>
            <img src="/assets/logo.jpg" alt= ""/>
          </div>

          <div className='contact-container'>
            <h2>Contact</h2>
          </div>
          
          <div className='about-container'>
            <h2>About us</h2>
          </div>
          <div className='cart-logo'>
            <FontAwesomeIcon icon={faCartShopping} />
          </div>
        </div>
      )
    }
}