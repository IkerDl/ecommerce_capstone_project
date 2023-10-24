import React, { Component } from 'react';

export default class NavBar extends Component {
    render() {
      return (
        <div className='navbar-wrapper'>
           <div>Logo</div>
           <div>Searchbar</div>
           <div>Togle</div>
           <div>Contact</div>
           <div>User</div>
           <div>Cart</div>
        </div>
      )
    }
}