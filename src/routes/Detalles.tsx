import { useState } from "react";
import DefaultLayout from "../layout/DefaultLayout";
import Swal from "sweetalert2"; 
import '../css/Contac.css';
import "../css/detalles.css";

const API_URL = "https://cda-back9.onrender.com/api/citas"; 

const Detalles = () => {
  const [codigoCita, setCodigoCita] = useState("");
  const [citaBuscada, setCitaBuscada] = useState<any>(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const buscarCita = async () => {
    if (!codigoCita) {
      setError("Por favor ingresa un código de cita.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${codigoCita}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Error al buscar la cita");

      setCitaBuscada(data);
      setError("");
    } catch (err: any) {
      setCitaBuscada(null);
      setError(err.message || "Cita no encontrada.");
    }
  };

  const cancelarCita = async () => {
    if (!citaBuscada) return;

    // Confirmación con SweetAlert2
    const resultado = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción cancelará tu cita y no podrás recuperarla.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No, mantener",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!resultado.isConfirmed) return;

    try {
      const response = await fetch(`${API_URL}/${citaBuscada.codigoCita}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al cancelar la cita.");
      }

      setMensaje("Cita cancelada con éxito.");
      setCitaBuscada(null);
      setCodigoCita("");

      // Mensaje de éxito con SweetAlert2
      Swal.fire({
        title: "Cita cancelada",
        text: "Tu cita ha sido cancelada correctamente.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });

    } catch (err: any) {
      setError(err.message || "Error al cancelar la cita.");
    }
  };

  return (
    <DefaultLayout>
      <div className="detalles-container">
      <div className="imagen-container">
    <img 
      src="https://cdasabaneta.com/wp-content/uploads/2021/06/c952d2bc-5bd3-43ba-b67b-a23399a2.jpg" 
      alt="Bienvenida" 
      className="banner-img"
    />
  </div>
        <h1>Consulta tu Cita</h1>

        <p className="descripcion">
          Ingresa el código de tu cita para ver los detalles. Aquí podrás consultar la información de tu cita y, si lo deseas, cancelarla. 
        </p>

        <div className="buscar-cita">
          <input 
            type="text"
            placeholder="Ingrese el código de la cita"
            value={codigoCita}
            onChange={(e) => setCodigoCita(e.target.value)}
          />
          <button onClick={buscarCita}>Buscar</button>
        </div>

        {error && <p className="error-message">{error}</p>}
        {mensaje && <p className="success-message">{mensaje}</p>}

        {citaBuscada && (
          <div className="cita-detalles">
            <h2>Detalles de la Cita</h2>
            <table className="tabla-detalles">
              <tbody>
                <tr><td><strong>Nombre:</strong></td><td>{citaBuscada.nombre}</td></tr>
                <tr><td><strong>Correo:</strong></td><td>{citaBuscada.correo}</td></tr>
                <tr><td><strong>Teléfono:</strong></td><td>{citaBuscada.telefono}</td></tr>
                <tr><td><strong>Fecha:</strong></td><td>{citaBuscada.fechaCita}</td></tr>
                <tr><td><strong>Hora:</strong></td><td>{citaBuscada.horaCita}</td></tr>
                <tr><td><strong>Placa:</strong></td><td>{citaBuscada.placa}</td></tr>
                <tr><td><strong>CDA:</strong></td><td>{citaBuscada.cdaSeleccionado}</td></tr>
              </tbody>
            </table>

            <button className="cancelar-cita" onClick={cancelarCita}>
              Cancelar Cita
            </button>
          </div>
        )}
      </div>

      <footer>
        <p>CDA-Armenia &copy; {new Date().getFullYear()}</p>
      </footer>
    </DefaultLayout>
  );
};

export default Detalles;
