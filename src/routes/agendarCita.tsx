import React, { useState } from "react";
import Swal from "sweetalert2";
import HCaptcha from "@hcaptcha/react-hcaptcha"; // ✅ Importar hCaptcha
import { API_URL } from "../Autenticacion/constanst";
import "../css/agendar.css";
import PortalLayout from "../layout/PortalLayout";

export default function AgendarCita() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [correoValido, setCorreoValido] = useState<boolean | null>(null);
  const [telefono, setTelefono] = useState("");
  const [telefonoValido, setTelefonoValido] = useState<boolean | null>(null);
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [fechaCita, setFechaCita] = useState("");
  const [horaCita, setHoraCita] = useState("");
  const [placa, setPlaca] = useState("");
  const [cdaSeleccionado, setCdaSeleccionado] = useState("");
  const [captchaToken, setCaptchaToken] = useState(""); // ✅ Estado para hCaptcha

  const validarCorreo = (correo: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setCorreo(correo);
    setCorreoValido(regex.test(correo));
  };

  const validarTelefono = (telefono: string) => {
    const regex = /^[0-9]{7,10}$/;
    setTelefono(telefono);
    setTelefonoValido(regex.test(telefono));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!correoValido || !telefonoValido) {
      Swal.fire({
        title: "Datos inválidos",
        text: "Por favor, ingresa un correo y un teléfono válidos.",
        icon: "error",
      });
      return;
    }

    if (!captchaToken) {
      Swal.fire({
        title: "Verificación requerida",
        text: "Completa el hCaptcha antes de enviar.",
        icon: "warning",
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/citas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          correo,
          telefono,
          fechaVencimiento,
          fechaCita,
          horaCita,
          placa,
          cdaSeleccionado,
          captchaToken, // ✅ Enviar el token al backend
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({ title: "¡Cita agendada!", text: "Tu cita ha sido registrada.", icon: "success" });

        setNombre("");
        setCorreo("");
        setCorreoValido(null);
        setTelefono("");
        setTelefonoValido(null);
        setFechaVencimiento("");
        setFechaCita("");
        setHoraCita("");
        setPlaca("");
        setCdaSeleccionado("");
        setCaptchaToken("");
      } else {
        Swal.fire({ title: "Error", text: data.error || "No se pudo agendar la cita.", icon: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({ title: "Error de conexión", text: "No se pudo conectar con el servidor.", icon: "error" });
    }
  };

  return (
    <PortalLayout>
      <div className="agendar-container">
        <div className="card">
          <div className="imageContainer"></div>
          <div className="formContainer">
            <h1>Agendar Cita</h1>
            <form onSubmit={handleSubmit}>
              {/* Campos del formulario */}
              <div className="form-group">
                <label>Nombre:</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Correo:</label>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => validarCorreo(e.target.value)}
                  required
                  style={{ borderColor: correoValido === false ? "red" : "initial" }}
                />
                {!correoValido && correo && <p style={{ color: "red" }}>Correo no válido</p>}
              </div>
              <div className="form-group">
                <label>Teléfono:</label>
                <input type="tel" value={telefono} onChange={(e) => validarTelefono(e.target.value)} required />
                {!telefonoValido && telefono && <p style={{ color: "red" }}>Teléfono no válido</p>}
              </div>
              <div className="form-group">
                <label>Fecha de vencimiento:</label>
                <input type="date" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Fecha de la cita:</label>
                <input type="date" value={fechaCita} onChange={(e) => setFechaCita(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Hora de la cita:</label>
                <input type="time" value={horaCita} onChange={(e) => setHoraCita(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Placa:</label>
                <input type="text" value={placa} onChange={(e) => setPlaca(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Seleccionar CDA:</label>
                <select value={cdaSeleccionado} onChange={(e) => setCdaSeleccionado(e.target.value)} required>
                  <option value="">Seleccione un CDA</option>
                  <option value="CDA Norte">CDA Norte</option>
                  <option value="CDA Centro">CDA Centro</option>
                  <option value="CDA Sur">CDA Sur</option>
                </select>
              </div>

              {/* ✅ hCaptcha */}
              <div className="form-group">
                <HCaptcha
                  sitekey="1e3e5db4-5b58-404e-8cfc-9f7a0c561be8" // 🚨 REEMPLAZA ESTO CON TU CLAVE REAL
                  onVerify={(token) => setCaptchaToken(token)}
                />
              </div>

              <div className="form-group">
                <button type="submit">Agendar Cita</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
