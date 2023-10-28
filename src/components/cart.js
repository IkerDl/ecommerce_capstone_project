import React, { Component } from 'react';

export default class Cart extends Component {
    render() {
      return (
        <div className='cart-wrapper'>
            <h2>Shopping Cart</h2>
            <ul>
                <li>Product 1 - $19.99</li>
                <li>Product 2 - $29.99</li>
                {/* Mostrar productos reales del carrito aquí */}
            </ul>
        </div>
      );
    }
}