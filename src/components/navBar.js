import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import Register from './pages/auth-page';

export default class NavBar extends Component {
  constructor(props) {
    super(props)
    this.state ={
      cartItemsCount: 0,
    };
  }

    render() {
      const {cartItemsCount, isCartOpen} = this.state;
      
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
          <div className='cart-icon'>
            <FontAwesomeIcon icon={faCartShopping} />
            <span>{this.state.cartItemsCount}</span>
          </div>
        </div>
      )
    }
}