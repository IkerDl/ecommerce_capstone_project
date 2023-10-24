import React from 'react';
import NavBar from '../navBar';
import Carrousel from '../carrousel';
import ProductsComponent from '../products-container';

export default function() {
  return (
    <div className='homePage-wrapper'>
        <NavBar />
        <Carrousel />
        <ProductsComponent />
    </div>
  );
}