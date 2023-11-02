import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import Home from './pages/home';
import Contact from './pages/contact';
import AuthPage from './pages/auth-page';
import Cart from './cart';
import CheckoutComponent from './checkout';

export default class App extends Component {
  constructor(props) {
    super()
    this.state = {
      isUserLoggedIn: false,
      userId: null
    }
  }

  handleLogin = (userId) => {
    this.setState({isUserLoggedIn: true, userId: userId})
  }

  handleLogout = () => {
    this.setState({ isUserLoggedIn: false, userId: null });
  }

  render() {
    return (
      <div className='container'>
        <Router>
          <Switch>
            <Route exact path="/" render={() => (
              <Home
                isUserLoggedIn={this.state.isUserLoggedIn}
                onLogout={this.handleLogout}
                userId={this.state.userId}
              />
              )} />
            <Route path="/auth">
              <AuthPage
                isUserLoggedIn={this.state.isUserLoggedIn}
                onLogin={this.handleLogin}
                onLogout={this.handleLogout}
                userId={this.state.userId}
              />
            </Route> 
            <Route path="/contact" component={Contact} />
            <Route path="/cart" render={(props) => <Cart {...props} userId={this.state.userId} />} />
            <Route path="/checkout" component={CheckoutComponent} />

          </Switch>
          
        </Router>
        
      </div>
    );
  }
}
