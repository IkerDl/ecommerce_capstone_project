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

    this.userId = this.props.userId;
  }

  componentWillMount() {
    if (this.userId) {
      this.fetchCartItems();
    }
  }

  fetchCartItems() {
    if (!this.userId) {
      return;
    }
    // Realiza una solicitud GET a la API para obtener los productos en el carrito del usuario
    axios.get(`http://localhost:5000/cart/user/${this.userId}`)
      .then(response => {
        if (response.data) {
          this.setState({ cartItems: response.data });
        } else {
          console.log('No se encontró un carrito con el ID');
        }

      })
      .catch(error => {
        console.error('Error al obtener los productos del carrito del usuario:', error);
      });
  }

  // Función para editar la cantidad de un producto en el carrito
  editCartItemQuantity = (productId, action) => {
    const userId = this.props.userId;
    axios.put(`http://localhost:5000/cart/edit_quantity/${productId}`, { user_id: userId, action })
      .then(response => {
        // Actualizar el estado con la nueva cantidad del producto en el carrito
        const updatedCart = this.state.cartItems.map(item => {
          if (item.product_id === productId) {
            return { ...item, quantity: response.data.quantity };
          }
          return item;
        });
        this.setState({ cartItems: updatedCart });
      })
      .catch(error => {
        console.log('Error al actualizar la cantidad del producto en el carrito:', error);
      });
  }
  

  removeFromCart = (productId,) => {
    axios.delete(`http://localhost:5000/cart/remove/${this.userId}/${productId}`)
    .then(response => {
      this.fetchCartItems();
      console.log(`Producto ID ${productId} eliminado del carrito.`);
    })
    .catch(error => {
      console.error('Error al eliminar el producto del carrito:', error);
    });
  }

  emptyCart = () => {
    this.setState({ cartItems: [] });
    console.log('Carrito vaciado exitosamente.');
  }


  render() {
    const { cartItems } = this.state;

    return (
      <div className="cart">
        <h2>Shopping Cart</h2>
        {cartItems.length > 0 ? (
          <ul>
            {cartItems.map((item, index) => (
              <li key={index}>
                <div>
                  <p>{item.product_name}</p>
                  <p>Price: ${item.product_price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <button onClick={() => this.editCartItemQuantity(item.product_id, "increase")}>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                  <button onClick={() => this.editCartItemQuantity(item.product_id, "decrease")}>
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                </div>
                <button onClick={() => this.removeFromCart(item.product_id)}>Delete</button>
              </li>
            ))}
        </ul>
      ) : (
        <p>You don't have any products in your shopping cart yet.</p>
      )}
      </div>
    );
  }
}
