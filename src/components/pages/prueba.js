import axios from "axios";
import React, { useState, useEffect } from "react";

const baseURL = "http://localhost:5000/product/get/2"; // Deberías cargar el producto dinámicamente

export default function App() {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      setProduct(response.data);
    });
  }, []);

  const addToCart = (productId) => {
    axios
      .post(`http://localhost:5000/cart/add/${productId}`)
      .then((response) => {
        if (response.status === 200) {
          // Manejar la respuesta del servidor, si es necesario
          alert("Product added to cart successfully!");
        }
      })
      .catch((error) => {
        // Manejar errores
        console.error("Error adding product to cart:", error);
      });
  };

  if (!product) return null;

  return (
    <div>
      <h1>{product.products_name}</h1>
      <p>{product.products_price}</p>
      <button
        onClick={() => addToCart(product.products_id)}
        type="button"
        className="btn btn-primary"
      >
        Add to Cart
      </button>
    </div>
  );
}
