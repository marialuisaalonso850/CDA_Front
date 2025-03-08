import React, { useState } from "react";
import Swal from "sweetalert2";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { API_URL } from "../Autenticacion/constanst";
import "../css/agendar.css";
import PortalLayout from "../layout/PortalLayout";

export default function AgendarCita() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [correoValido, setCorreoValido] = useState<boolean | null>(null);
  const [telefono, setTelefono] = useState("");
  const [telefonoValido, setTelefonoValido] = useState<boolean | null>(null);
  const [fechaCita, setFechaCita] = useState("");
  const [horaCita, setHoraCita] = useState("");
  const [placa, setPlaca] = useState("");
  const [placaValida, setPlacaValida] = useState<boolean | null>(null);
  const [cdaSeleccionado, setCdaSeleccionado] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [citaReservada, setCitaReservada] = useState<any>(null);

  const validarCorreo = (correo: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setCorreo(correo);
    setCorreoValido(regex.test(correo));
  };

  const validarTelefono = (telefono: string) => {
    const regex = /^3[0-9]{9}$/;
    setTelefono(telefono);
    setTelefonoValido(regex.test(telefono));
  };

  const validarPlaca = (placa: string) => {
    const regex = /^[A-Z]{3}\d{3}$/;
    setPlaca(placa);
    setPlacaValida(regex.test(placa));
  };

  const limpiarCampos = () => {
    setNombre("");
    setCorreo("");
    setCorreoValido(null);
    setTelefono("");
    setTelefonoValido(null);
    setFechaCita("");
    setHoraCita("");
    setPlaca("");
    setPlacaValida(null);
    setCdaSeleccionado("");
    setCaptchaToken("");
    setCitaReservada(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!correoValido || !telefonoValido || !placaValida) {
      Swal.fire({
        title: "Datos inválidos",
        text: "Por favor, ingresa un correo, un teléfono y una placa válidos.",
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          correo,
          telefono,
          fechaCita,
          horaCita,
          placa,
          cdaSeleccionado,
          captchaToken,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al agendar cita");

      setCitaReservada(data);

      // Formatear fecha y hora
      const fechaFormateada = new Date(fechaCita).toLocaleDateString("es-ES");
      const horaFormateada = new Date(`1970-01-01T${horaCita}:00Z`).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

      Swal.fire({
        title: "¡Cita agendada con éxito! 🎉",
        html: `
          <b>👤 Senor@ Nombre :</b> ${nombre} <br>
          <b>📅 La fecha de su cita es :</b> ${fechaFormateada} <br>
          <b>⏰ La hora :</b> ${horaFormateada} <br>
          <b>🚗 Su Placa:</b> ${placa} <br>
          <b>🏢 LA CDA:</b> ${cdaSeleccionado} <br>
          <b>📩 Correo:</b> ${correo} <br>
          <b>📞 Teléfono:</b> ${telefono} 
           <b>Gracias por agendar su cita con CDA Sáman <br>
        `,
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      limpiarCampos(); 

    } catch (error) {
      console.error("Error al agendar cita:", error);
      Swal.fire({ title: "Error", text: "Hubo un problema al agendar la cita.", icon: "error" });
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
              <div className="form-group">
                <label>Nombre:</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Correo:</label>
                <input type="email" value={correo} onChange={(e) => validarCorreo(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Teléfono:</label>
                <input type="tel" value={telefono} onChange={(e) => validarTelefono(e.target.value)} required />
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
                <input type="text" value={placa} onChange={(e) => validarPlaca(e.target.value)} required />
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
              <HCaptcha sitekey="1e3e5db4-5b58-404e-8cfc-9f7a0c561be8" onVerify={(token) => setCaptchaToken(token)} />
              <button type="submit">Agendar Cita</button>
            </form>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
