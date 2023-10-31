import React, { Component } from "react";

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
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ users_email: email, users_password: password }), // Asegúrate de enviar los campos correctos
      });

      if (response.status === 200) {
        // El inicio de sesión fue exitoso, redirige a la página principal u otra página deseada
        this.props.history.push("/");
      } else {
        // Maneja errores de inicio de sesión, como credenciales incorrectas
        const data = await response.json();
        this.setState({ error: data.message });
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
