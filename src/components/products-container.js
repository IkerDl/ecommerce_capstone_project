import React, { Component } from 'react';

export default class ProductsComponent extends Component {
    render() {
      return (
        <div className='general-wrapper'>
            <div>
                <h2>Products</h2>
            </div>
            <div className='products-wrapper'>
                <div>Product 1</div>
                <div>Product 2</div>
                <div>Product 3</div>
                <div>Product 4</div>
                <div>Product 5</div>
                <div>Product 6</div>
                <div>Product 7</div>
            </div>
           
        </div>
      )
    }
}