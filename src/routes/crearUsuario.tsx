
import React, { useState, useEffect } from "react";
import DefaultLayout from "../layout/DefaultLayout";
import { API_URL } from "../Autenticacion/constanst";
import type { AuthResponseError } from "../types/types";

export default function CrearUsuario() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorResponse, setErrorResponse] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [usuarios, setUsuarios] = useState<any[]>([]);
  
  
  useEffect(() => {
    obtenerUsuarios();
  }, []);

  async function obtenerUsuarios() {
    try {
      const response = await fetch(`${API_URL}/user`);
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  }
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/crearUsuario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          password,
        }),
      });

      if (response.ok) {
        console.log("El usuario se creó correctamente");
        setErrorResponse("");
        setSuccessMessage("Usuario creado con éxito");
        const nuevoUsuario = { name, username };


        setUsuarios((prevUsuarios) => [...prevUsuarios, nuevoUsuario]);
        obtenerUsuarios();
        setName("");
        setUsername("");
        setPassword("");
      } else {
        console.log("Algo salió mal :o");
        const json = (await response.json()) as AuthResponseError;
        setErrorResponse(json.body.error);
      }
    } catch (error) {
      console.error("Error en la creación del usuario:", error);
      setErrorResponse("Error en el servidor. Inténtalo de nuevo.");
    }
  }

  return (
    <DefaultLayout ingresoPermitido={true}>
      <form className="form" onSubmit={handleSubmit}>
        <h1>Crear Usuario</h1>
        {errorResponse && <div className="errorMessage">{errorResponse}</div>}
        {successMessage && <div className="successMessage">{successMessage}</div>}
        <label>Nombre</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        <label>Email</label>
        <input type="email" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <label>Contraseña</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Crear Usuario</button>
      </form>

      <h2>Usuarios Creados</h2>
      {usuarios.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario, index) => (
              <tr key={index}>
                <td>{usuario.name}</td>
                <td>{usuario.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay usuarios registrados.</p>
      )}
    </DefaultLayout>
  );
}
