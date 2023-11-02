import React from 'react';
import NavBar from '../navBar';
import Carrousel from '../carrousel';
import ProductsComponent from '../products-container';
import Cart from '../cart';


export default function({ isUserLoggedIn, onLogout, userId }) {
  return (
    <div className='homePage-wrapper'>
        <NavBar isUserLoggedIn={isUserLoggedIn} onLogout={onLogout} />
        <Carrousel />
        <ProductsComponent userId={userId} />
        
    </div>
  );
}