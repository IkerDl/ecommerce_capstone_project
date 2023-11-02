import React, { Component } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
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
      return; // Si no hay usuario logueado, no hay carrito que mostrar
    }
    
    // Realiza una solicitud GET para obtener los productos del carrito del usuario
    axios.get(`http://localhost:5000/cart/user/${this.userId}`)
      .then(response => {
        if (response.status === 200) {
          this.setState({ cartItems: response.data });
        } else if (response.status === 404) {
          console.log('El carrito no fue encontrado para el usuario');
          // Puedes mostrar un mensaje en la interfaz de usuario indicando que el carrito está vacío.
          this.setState({ cartItems: [] }); // Establece cartItems como un array vacío
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
        if (response.data.quantity <1 && action === "decrease") {
          // La cantidad es 1 y se ha restado 1, elimina el producto del carrito
          this.removeFromCart(productId);
        } else {
          // La cantidad no es 1 o no se ha restado 1, actualiza la cantidad normalmente
          const updatedCart = this.state.cartItems.map(item => {
            if (item.product_id === productId) {
              return { ...item, quantity: response.data.quantity };
            }
            return item;
          });
          this.setState({ cartItems: updatedCart });
        }
      })
      .catch(error => {
        console.log('Error al actualizar la cantidad del producto en el carrito:', error);
      });
  }
  
  

  removeFromCart = (productId) => {
    const userId = this.props.userId;
    axios.delete(`http://localhost:5000/cart/remove/${userId}/${productId}`)
      .then(response => {
        // Eliminar el producto del carrito en la interfaz de usuario
        const updatedCart = this.state.cartItems.filter(item => item.product_id !== productId);
        this.setState({ cartItems: updatedCart });
      })
      .catch(error => {
        console.log('Error al eliminar el producto del carrito:', error);
      });
  }
  

  emptyCart = () => {
    this.setState({ cartItems: [] });
    console.log('Carrito vaciado exitosamente.');
  }



  render() {
    const { cartItems } = this.state;

    const totalPrice = cartItems.reduce((total, item) => {
      return total + item.product_price * item.quantity;
    }, 0);

    return (
      <div className="cart">
        <div className='logo-container'>
          <Link to="/">
            <img src="/assets/logo.jpg" alt="" />
          </Link>
        </div>
        <h2>Shopping Cart</h2>
        <div className='cart-products'>
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
            <p>{cartItems.length === 0 && "You don't have any products in your shopping cart yet."}</p>
        )}
        </div>
        {cartItems.length > 0 && (
          <div className='cart-summary'>
            <p>Total Price: ${totalPrice.toFixed(2)}</p>
            <Link to="/checkout">Proceed to Checkout</Link>
          </div>
        )}
      </div>
    );
  }
}
