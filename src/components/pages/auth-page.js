import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import axios from "axios";


class AuthPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn : false,
      isRegister: true, // Para alternar entre registro e inicio de sesión
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      error: "",
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
  
    const { isRegister, firstname, lastname, email, password } = this.state;
  
    try {
      const url = isRegister ? "http://localhost:5000/user/register" : "http://localhost:5000/login";
      const body = isRegister
        ? { users_firstname: firstname, users_lastname: lastname, users_email: email, users_password: password }
        : { users_email: email, users_password: password };
  
      // Enviar datos al servidor para el registro o inicio de sesión utilizando Axios
      const response = await axios.post(url, body);
  
      if (response.status === 200) {
        const data = response.data;
        this.props.onLogin(data.user_id); // Pasa el ID del usuario al componente App
        this.props.history.push("/");
      } else {
        // Maneja errores de registro o inicio de sesión, como credenciales incorrectas
        const data = response.data;
        this.setState({ error: data.message });
      }
    } catch (error) {
      console.error("Error al registrar o iniciar sesión:", error);
    }
  };
  

  toggleAuth = () => {
    this.setState((prevState) => ({ isRegister: !prevState.isRegister, error: "" }));
  };

  render() {
    return (
      <div className="user-auth">
        <h2>{this.state.isRegister ? "Registration" : "User Login"}</h2>
        {this.state.error && <p className="error-message">{this.state.error}</p>}
        <form onSubmit={this.handleSubmit}>
          {this.state.isRegister && (
            <div>
              <input
                type="text"
                name="firstname"
                placeholder="Name"
                value={this.state.firstname}
                onChange={this.handleInputChange}
              />
              <input
                type="text"
                name="lastname"
                placeholder="Lastname"
                value={this.state.lastname}
                onChange={this.handleInputChange}
              />
            </div>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleInputChange}
          />
          <button type="submit">
            {this.state.isRegister ? "Register" : "Login"}
          </button>
        </form>
        <p>
          {this.state.isRegister
            ? "Already have an account? " : "Don't have an account? "}
          <button onClick={this.toggleAuth}>
            {this.state.isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    );
  }
}

export default withRouter(AuthPage);
