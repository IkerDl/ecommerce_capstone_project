import React, { Component } from "react";
import axios from "axios";

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

    const { email, password } = this.state;

    try {
      // Enviar datos al servidor para el inicio de sesión
      const response = await axios.post("http://localhost:5000/login", {
        users_email: email,
        users_password: password
      });

      if (response.status === 200) {
        // El inicio de sesión fue exitoso, redirige a la página principal u otra página deseada
        const data = response.data;
        this.props.onLogin(data.user_id);
        this.props.history.push("/");
      } else{
        if (response.status === 401) {
          this.setState({ error: "Credenciales incorrectas. Por favor, verifica tu email y contraseña." });
        } else {
          // Maneja errores de inicio de sesión, como credenciales incorrectas
          const data = response.data
          this.setState({ error: data.message });
        }
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  render() {
    return (
      <div className="user-login">
        <h2>User Login</h2>
        {this.state.error && <p className="error-message">{this.state.error}</p>}
        <form onSubmit={this.handleSubmit}>
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
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}

export default LoginPage;
