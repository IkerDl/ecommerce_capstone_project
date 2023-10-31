import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import Home from './pages/home';
import Contact from './pages/contact';
import AuthPage from './pages/auth-page';

export default class App extends Component {
  constructor(props) {
    super()
    this.state = {
      isUserLoggedIn: false
    }
  }

  handleLogin = () => {
    this.setState({isUserLoggedIn: true})
  }

  handleLogout = () => {
    this.setState({ isUserLoggedIn: false });
  }

  render() {
    return (
      <div className='container'>
        <Router>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/auth">Auth</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          

          <Switch>
            <Route exact path="/" render={() => (
              <Home
               isUserLoggedIn={this.state.isUserLoggedIn}
                onLogout={this.handleLogout}
              />
              )} />
            <Route path="/auth">
              <AuthPage
                isUserLoggedIn={this.state.isUserLoggedIn}
                onLogin={this.handleLogin}
                onLogout={this.handleLogout}
              />
            </Route> 
            <Route path="/contact" component={Contact} />
          </Switch>
          
        </Router>
        
      </div>
    );
  }
}
