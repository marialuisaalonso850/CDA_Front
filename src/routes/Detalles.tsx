import { useState, useEffect } from "react";
import DefaultLayout from "../layout/DefaultLayout";
import Swal from "sweetalert2";
import '../css/Contac.css';
import "../css/detalles.css";

const API_URL = "http://localhost:5000/api/citas";
const PASSWORD = "admin123"; 

const Detalles = () => {
  const [codigoCita, setCodigoCita] = useState("");
  const [citaBuscada, setCitaBuscada] = useState<any>(null);
  const [citas, setCitas] = useState<any[]>([]);
  const [, setError] = useState("");
  const [ingresoPermitido, setIngresoPermitido] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (ingresoPermitido) {
      obtenerCitas();
    }
  }, [ingresoPermitido]);

  const verificarPassword = () => {
    if (password === PASSWORD) {
      setIngresoPermitido(true);
    } else {
      Swal.fire("Error", "Contraseña incorrecta", "error");
    }
  };

  const obtenerCitas = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al obtener las citas");
      setCitas(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener citas.");
    }
  };

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

  const cancelarCita = async (codigo: string) => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No, mantener"
    });

    if (confirmacion.isConfirmed) {
      try {
        const response = await fetch(`${API_URL}/${codigo}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Error al cancelar la cita");
        }

        setCitas(citas.filter(cita => cita.codigoCita !== codigo));
        Swal.fire("Cancelado", "La cita ha sido cancelada.", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo cancelar la cita.", "error");
      }
    }
  };

  return (
    <DefaultLayout>    
      {!ingresoPermitido ? (
        <div className="password-wrapper">
          <div className="password-card">
            <h1>Administrador: Luisa</h1>
            <img src="../img/logo.webp" alt="Logo" className="login-logo" />
            <div className="password-container">
              <h2>Ingrese la contraseña</h2>
              <input 
                type="password" 
                placeholder="Contraseña" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                name="password"
              />
              <button onClick={verificarPassword}>Ingresar</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="detalles-container">
          <h1>Consulta y Gestión de Citas</h1>
          <div className="buscar-cita">
            <input 
              type="text"
              placeholder="Ingrese el código de la cita"
              value={codigoCita}
              onChange={(e) => setCodigoCita(e.target.value)}
            />
            <button onClick={buscarCita}>Buscar</button>
          </div>
          {citaBuscada && (
            <div className="cita-detalles">
              <h2>Detalles de la Cita</h2>
              <p><strong>Nombre:</strong> {citaBuscada.nombre}</p>
              <p><strong>Correo:</strong> {citaBuscada.correo}</p>
              <p><strong>Teléfono:</strong> {citaBuscada.telefono}</p>
              <p><strong>Fecha:</strong> {citaBuscada.fechaCita}</p>
              <p><strong>Hora:</strong> {citaBuscada.horaCita}</p>
              <p><strong>Placa:</strong> {citaBuscada.placa}</p>
              <p><strong>CDA:</strong> {citaBuscada.cdaSeleccionado}</p>
              <button 
                onClick={() => cancelarCita(citaBuscada.codigoCita)}
                style={{
                  padding: "10px",
                  backgroundColor: "#d9534f",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "10px"
                }}
              >
                Cancelar Cita
              </button>
            </div>
          )}
          <h2>Todas las Citas Registradas</h2>
          {citas.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Placa</th>
                  <th>CDA</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {citas.map((cita) => (
                  <tr key={cita.codigoCita}>
                    <td>{cita.codigoCita}</td>
                    <td>{cita.nombre}</td>
                    <td>{cita.correo}</td>
                    <td>{cita.telefono}</td>
                    <td>{cita.fechaCita}</td>
                    <td>{cita.horaCita}</td>
                    <td>{cita.placa}</td>
                    <td>{cita.cdaSeleccionado}</td>
                    <td>
                      <button 
                        onClick={() => cancelarCita(cita.codigoCita)}
                        style={{
                          padding: "6px",
                          backgroundColor: "#d9534f",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer"
                        }}
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay citas registradas.</p>
          )}
        </div>
      )}
    </DefaultLayout>
  );
};

export default Detalles;
