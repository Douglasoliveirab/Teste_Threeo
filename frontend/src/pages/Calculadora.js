import React, { useState } from "react";
import "./css/calculadora.css";
import Header from "../components/header";

export default function Calculadora() {
  const [formData, setFormData] = useState({
    firstNumber: "",
    secondNumber: "",
    operation: "",
  });

  const [resultado, setResultado] = useState("");

  const userAuthenticado = localStorage.getItem("userLogado");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e, operation) => {
    e.preventDefault();

    const { firstNumber, secondNumber } = formData;

    if (!firstNumber || !secondNumber) {
      alert("Por favor, preencha ambos os números.");
      return;
    }

    const data = {
      firstNumber: firstNumber,
      secondNumber: secondNumber,
      operation: operation,
    };

    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch("http://localhost:8000/calculadora", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();

        setResultado(result.result);
      } else {
        console.error("Falha ao calcular");
      }
    } catch (error) {
      console.error("Falha no fetch", error);
    }
  };

  if (userAuthenticado) {
    return (
      <div>
        <Header />
        <div className="container_calculadora">
          <form className="form_calculadora">
            <label>Primeiro número</label>
            <input
              type="number"
              placeholder="Primeiro número"
              required
              name="firstNumber"
              value={formData.firstNumber}
              onChange={handleInputChange}
            />
            <label>Segundo número</label>
            <input
              type="number"
              placeholder="Segundo número"
              required
              name="secondNumber"
              value={formData.secondNumber}
              onChange={handleInputChange}
            />

            <p>Resultado: {resultado}</p>

            <div className="container_buttons">
              <button type="button" onClick={(e) => handleSubmit(e, "soma")}>
                +
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, "subtracao")}
              >
                -
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, "multiplicacao")}
              >
                x
              </button>
              <button type="button" onClick={(e) => handleSubmit(e, "divide")}>
                ÷
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  } else {
    return (window.location.href = "/");
  }
}
