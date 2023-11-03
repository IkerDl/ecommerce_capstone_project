import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';


export default class CheckoutComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 1, //current step in the payment process
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
    };
  }

  emptyCart = () => {
    const userId = this.props.location.state.userId; 
    axios.delete(`http://localhost:5000/cart/empty/${userId}`)
      .then(response => {
        console.log('Shopping cart emptied successfully:', response.data);
      })
      .catch(error => {
        console.error('Error while emptying the shopping cart:', error);
      });
    }
  

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  }

  nextStep = () => {
    this.setState((prevState) => ({
      step: prevState.step + 1,
    }));
  }

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
    console.log('Payment data:', this.state);
    console.log('Cart data:', this.props.location.state);
  }

  

  render() {
    const { step, cardNumber, cardHolder, expiryDate, cvv } = this.state;

    if (this.state.redirectToHome) {
        return <Redirect to="/" />;
      }

    let stepComponent;

    if (step === 1) {
      stepComponent = (
        <div>
          <h2>Step 1: Enter Card Information</h2>
          <form onSubmit={this.nextStep}>
            <div className='checkout-step'>
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
            <button className='next-button' type="submit">Next</button>
          </form>
        </div>
      );
    } else if (step === 2) {
      stepComponent = (
        <div className='checkout-step'>
          <h2>Step 2: Confirm Payment</h2>
          <p>Card Number: {cardNumber}</p>
          <p>Card Holder: {cardHolder}</p>
          <p>Expiry Date: {expiryDate}</p>
          <p>CVV: {cvv}</p>
          
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
          <h3 className='total-price'>Total Price: ${this.props.location.state.totalPrice.toFixed(2)}</h3>

          <button className="back-button" onClick={this.prevStep}>Back</button>
          <button className="confirm-button" onClick={(event) => {
            this.handleSubmit(event);
            this.emptyCart();
          }}>Confirm Payment</button>
        </div>
      );
    }

    return (
      <div className='checkout-container'>
        {stepComponent}
      </div>
    );
  }
}
