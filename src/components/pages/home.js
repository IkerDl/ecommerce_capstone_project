import React from 'react';
import NavBar from '../navBar';
import Carrousel from '../carrousel';
import ProductsComponent from '../products-container';
import Cart from '../cart';


export default function() {
  return (
    <div className='homePage-wrapper'>
        <NavBar />
        <Carrousel />
        <ProductsComponent />
        <Cart />
        
    </div>
  );
}