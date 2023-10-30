import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';


export default class ProductsComponent extends Component {
  constructor() {
    super();

    this.state = {
      productsItems: [],
      cartItems: []
    };
  }

  addToCart = (productId) => {
    console.log(`Añadido al carrito: Producto ID ${productId}`);
    const { cartItems } = this.state;
    const productToAdd = this.state.productsItems.find(product => product.products_id === productId);
    const updatedCart = [...cartItems, productToAdd];
    this.setState({ cartItems: updatedCart });
  }

  componentDidMount() {
    // Realizar una solicitud GET para obtener productos de la API
    axios.get('http://localhost:5000/product/get')
      .then(response => {
        // Actualiza el estado con los datos de los productos
        this.setState({ productsItems: response.data });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  render() {
    const { productsItems } = this.state;

    return (
      <div className="general-wrapper">
        <div>
          <h2>Our Bags</h2>
        </div>
        <div className="products-wrapper">
          {productsItems.map(product => (
            <div key={product.products_id} className="product-wrapper">
              <div className="product">
                <div className="img-wrapper">
                  <img src={product.products_image} alt= ""/>
                </div>
                <h2>{product.products_name}</h2>
                <p>{product.products_description}</p>
                <p>Price: ${parseFloat(product.products_price).toFixed(2)}</p>
                <div className="cart-icon" onClick={() => this.addToCart(product.products_id)}>
                  <FontAwesomeIcon icon={faCartPlus} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
