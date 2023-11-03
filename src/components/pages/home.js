import React from 'react';
import NavBar from '../navBar';
import BrandComponent from '../brand';
import ProductsComponent from '../products-container';


export default function({ isUserLoggedIn, onLogout, userId }) {
  return (
    <div className='homePage-wrapper'>
        <NavBar isUserLoggedIn={isUserLoggedIn} onLogout={onLogout} />
        <BrandComponent />
        <ProductsComponent userId={userId} />
        
    </div>
  );
}