import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserLoggedIn: this.props.isUserLoggedIn,
      cartItemsCount: 0,
    };
  }

  handleLogout = () => {
    // Realiza aquí la lógica para desloguear al usuario
    // Por ejemplo, puedes llamar a una función que esté en tus props para hacerlo.
    this.props.onLogout();
    this.setState({ isUserLoggedIn: false });
    this.props.history.push("/");
    
  };

  render() {
    const { cartItemsCount, isCartOpen } = this.state;

    return (
      <div className='navbar-wrapper'>
        <div className='logo-container'>
          <img src="/assets/logo.jpg" alt="" />
        </div>

        <div className='contact-container'>
          <h2>Contact</h2>
        </div>

        <div className='about-container'>
          <h2>About us</h2>
        </div>

        {this.props.isUserLoggedIn ? (
          <div>
            <Link to="/logout" onClick={this.handleLogout}>
              Log Out
            </Link>
          </div>
        ) : (
          <div>
            <Link to="/auth">Login</Link>
          </div>
        )}

        <div className='cart-icon' >
        <Link to ="/cart">
          <FontAwesomeIcon icon={faCartShopping} />
          <span>{this.state.cartItemsCount}</span>
        </Link>
          
         
          
        </div>
      </div>
    );
  }
}
