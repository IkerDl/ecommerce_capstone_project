import React, { Component } from 'react';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus} from '@fortawesome/free-solid-svg-icons';

export default class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems: [],
    };
  }

  componentDidMount() {
    this.fetchCartItems();
  }
  fetchCartItems() {
    // Realiza una solicitud GET a la API para obtener los productos en el carrito del usuario
    axios.get('http://localhost:5000/cart/get/9')
      .then(response => {
        if (response.data) {
          this.setState({ cartItems: response.data });
        } else {
          console.log('No se encontró un carrito con el ID');
        }
        // Actualiza el estado con los productos en el carrito del usuario
      })
      .catch(error => {
        console.error('Error al obtener los productos del carrito del usuario:', error);
      });
  }

  // Función para editar la cantidad de un producto en el carrito
  editCartItemQuantity = (productId, newQuantity) => {
    axios.put(`http://localhost:5000/cart/edit/5/${productId}`, { new_quantity: newQuantity })
      .then(response => {
        this.fetchCartItems();
        // Actualizar el estado del carrito o realizar otras acciones necesarias
        console.log(`Cantidad del producto ID ${productId} actualizada a ${newQuantity}`);
      })
      .catch(error => {
        console.error('Error al editar la cantidad del producto en el carrito:', error);
      });
  }

  removeFromCart = (productId) => {
    axios.delete(`http://localhost:5000/cart/remove/5/${productId}`)
    .then(response => {
      this.fetchCartItems();
      console.log(`Producto ID ${productId} eliminado del carrito.`);
    })
    .catch(error => {
      console.error('Error al eliminar el producto del carrito:', error);
    });
  }

  render() {
    const { cartItems } = this.state;

    return (
      <div className="cart">
        <h2>Shopping Cart</h2>
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>
              <div>
                <p>{item.product_name}</p>
                <p>Price: ${item.product_price}</p>
                <p>Quantity: {item.quantity}</p>
                <button onClick={() => this.editCartItemQuantity(item.product_id, item.quantity + 1)}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
                <button onClick={() => this.editCartItemQuantity(item.product_id, item.quantity - 1)}>
                  <FontAwesomeIcon icon={faMinus} />
                </button>
              </div>
              <button onClick={() => this.removeFromCart(item.product_id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
