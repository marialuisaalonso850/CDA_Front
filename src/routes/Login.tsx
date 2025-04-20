import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../Autenticacion/AutProvider";
import { useState } from "react";
import { API_URL } from "../Autenticacion/constanst";
import type { AuthResponse, AuthResponseError } from "../types/types";
import React from "react";
import DefaultLayout from "../layout/DefaultLayout";
import "../css/Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorResponse, setErrorResponse] = useState("");

  const auth = useAuth();
  const goto = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setErrorResponse("");
        const json = (await response.json()) as AuthResponse;
        if (json.body.accessToken && json.body.refreshToken) {
          auth.saveUser(json);
          goto("/tecno");
        }
      } else {
        const json = (await response.json()) as AuthResponseError;
        setErrorResponse(json.body.error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (auth.esAutentico) {
    return <Navigate to="/tecno" />;
  }

  return (
    <DefaultLayout>
      <div className="login-page">
        <div className="login-info">
          {/* Aquí la imagen */}
          <img src="../public/img/logo.webp" alt="Logo Tecnomecánica" className="login-logo" />
          <h1>Bienvenido a Samán</h1>
          <p>
            Gestiona fácilmente tus revisiones técnico-mecánicas, controla
            citas, reportes y aprobaciones desde un solo lugar.
          </p>
          <p>Inicia sesión para acceder a tu cuenta.</p>
        </div>

        <div className="form-container">
          <h2>Login</h2>
          {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
}
