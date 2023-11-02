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
    const userId = this.props.userId;
    axios.post(`http://localhost:5000/cart/add/${productId}`,{user_id: userId})
      .then(response => {
        console.log("Respuesta del servidor:", response.data);

        // Actualiza el estado del carrito en la interfaz de usuario
        const updatedCart = [...this.state.cartItems, response.data.product_details];
        this.setState({ cartItems: updatedCart });
      })
      .catch(error => {
        console.log('Error al agregar el producto al carrito:', error);
      });
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
