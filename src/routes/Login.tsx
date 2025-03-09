import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../Autenticacion/AutProvider";
import DefaultLayout from "../layout/DefaultLayout";
import { useState } from "react";
import { API_URL } from "../Autenticacion/constanst";
import type { AuthResponse, AuthResponseError } from "../types/types";
import React from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorResponse, setErrorResponse] = useState("");

  const auth = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    try {
      console.log("📤 Enviando datos al backend...", { username, password });

      const response = await fetch(`${API_URL}/login`, {  // 🔥 CORREGIDO: "/api/login"
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log("✅ Inicio de sesión exitoso.");
        setErrorResponse("");

        const json = (await response.json()) as AuthResponse;

        if (json.body.accessToken && json.body.refreshToken) {
          auth.saveUser(json);
          navigate("/citas");
        }
      } else {
        console.log("❌ Error en el inicio de sesión.");
        const json = (await response.json()) as AuthResponseError;
        setErrorResponse(json.body.error || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("❌ Error en la solicitud:", error);
      setErrorResponse("Error de conexión con el servidor.");
    }
  }

  if (auth.esAutentico) {
    return <Navigate to="/citas" />;
  }

  return (
    <DefaultLayout>
      <form className="form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
        <label>Email</label>
        <input
          type="email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
    </DefaultLayout>
  );
}
