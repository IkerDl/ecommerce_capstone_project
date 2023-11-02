import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';


export default class CheckoutComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 1, // Paso actual del proceso de pago
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
    };
  }

  emptyCart = () => {
    const userId = this.props.location.state.userId; // Asegúrate de tener acceso al ID del usuario desde props
    axios.delete(`http://localhost:5000/cart/empty/${userId}`)
      .then(response => {
        // Lógica para manejar la respuesta del servidor (puede ser una redirección, un mensaje de éxito, etc.)
        console.log('Carrito vaciado exitosamente:', response.data);
        // Puedes redirigir al usuario a una página de confirmación de pago o a donde desees.
      })
      .catch(error => {
        console.error('Error al vaciar el carrito:', error);
      });
    }
  

  handleInputChange = (event) => {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  }

  // Función para avanzar al siguiente paso del proceso de pago
  nextStep = () => {
    this.setState((prevState) => ({
      step: prevState.step + 1,
    }));
  }

  // Función para retroceder al paso anterior del proceso de pago
  prevStep = () => {
    this.setState((prevState) => ({
      step: prevState.step - 1,
    }));
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const userId = this.props.location.state.userId;
    alert('Payment completed successfully!');
    this.setState({ redirectToHome: true})
    // Aquí puedes agregar la lógica para procesar el pago en el último paso del proceso
    // Puedes enviar los datos de pago (cardNumber, cardHolder, expiryDate, cvv) a tu servidor para validar y procesar el pago.
    // También puedes acceder a los datos del carrito desde this.props.location.state.

    console.log('Datos de pago:', this.state);
    console.log('Datos del carrito:', this.props.location.state);

    // Puedes redirigir al usuario a una página de confirmación de pago después de procesar el pago.
    // Ejemplo:
    // this.props.history.push('/payment-confirmation');
  }

  

  render() {
    const { step, cardNumber, cardHolder, expiryDate, cvv } = this.state;
    
    if (this.state.redirectToHome) {
        return <Redirect to="/" />;
      }

    // Puedes definir componentes diferentes para cada paso del proceso de pago
    // y mostrar el componente correspondiente según el valor de 'step'.

    let stepComponent;

    if (step === 1) {
      stepComponent = (
        <div>
          <h2>Step 1: Enter Card Information</h2>
          <form onSubmit={this.nextStep}>
            <div>
              <label htmlFor="cardNumber">Card Number:</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={cardNumber}
                onChange={this.handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="cardHolder">Card Holder:</label>
              <input
                type="text"
                id="cardHolder"
                name="cardHolder"
                value={cardHolder}
                onChange={this.handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="expiryDate">Expiry Date:</label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={expiryDate}
                onChange={this.handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="cvv">CVV:</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={cvv}
                onChange={this.handleInputChange}
              />
            </div>
            <button type="submit">Next</button>
          </form>
        </div>
      );
    } else if (step === 2) {
      stepComponent = (
        <div>
          <h2>Step 2: Confirm Payment</h2>
          <p>Card Number: {cardNumber}</p>
          <p>Card Holder: {cardHolder}</p>
          <p>Expiry Date: {expiryDate}</p>
          <p>CVV: {cvv}</p>
          
          {/* Información del carrito obtenida de this.props.location.state */}
          <h3>Cart Contents:</h3>
          <ul>
            {this.props.location.state.cartItems.map((item, index) => (
              <li key={index}>
                <p>Product Name: {item.product_name}</p>
                <p>Price: ${item.product_price}</p>
                <p>Quantity: {item.quantity}</p>
              </li>
            ))}
          </ul>
          <h3>Total Price: ${this.props.location.state.totalPrice.toFixed(2)}</h3>

          <button onClick={this.prevStep}>Back</button>
          <button onClick={(event) => {
            this.handleSubmit(event);
            this.emptyCart();
          }}>Confirm Payment</button>
        </div>
      );
    }

    return (
      <div>
        {stepComponent}
      </div>
    );
  }
}
