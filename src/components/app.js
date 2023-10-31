import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import Home from './pages/home';
import Contact from './pages/contact';
import AuthPage from './pages/auth-page';
export default class App extends Component {


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
            <Route exact path="/" component={Home} />
            <Route path="/auth" component={AuthPage} />
            <Route path="/contact" component={Contact} />
          </Switch>
          
        </Router>
        
      </div>
    );
  }
}
