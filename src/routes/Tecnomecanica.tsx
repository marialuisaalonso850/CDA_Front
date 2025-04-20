import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Bienvenido.css"
import DefaultLayout from "../layout/Portal2"; 


const API_URL = "https://cda-back-adia.onrender.com/api/citas";

interface Cita {
  codigoCita: string;
  nombre: string;
  correo: string;
  telefono: string;
  fechaCita: string;
  horaCita: string;
  placa: string;
  cdaSeleccionado: string;
  estado: string; // Add all possible values for estado
}

export default function Bienvenido() {
  const navigate = useNavigate();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [error, setError] = useState<string>("");
  const [codigoCita, setCodigoCita] = useState("");
  const [citaBuscada, setCitaBuscada] = useState<Cita | null>(null);

  // Obtener todas las citas
  useEffect(() => {
    async function fetchCitas() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Error al obtener citas");
        }
        const data: Cita[] = await response.json();
        setCitas(data);
      } catch (error) {
        setError("Error al obtener citas. Intente de nuevo más tarde.");
        console.error("Error al obtener citas:", error);
      }
    }
    fetchCitas();
  }, []);

  // Buscar una cita por código
  const buscarCita = async () => {
    if (!codigoCita.trim()) {
      setError("Por favor ingresa un código de cita.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/${codigoCita}`);
      if (!response.ok) {
        throw new Error("Cita no encontrada");
      }
      const data: Cita = await response.json();
      setCitaBuscada(data);
      setError("");
    } catch (err) {
      setCitaBuscada(null);
      setError("Cita no encontrada.");
    }
  };

  // Verificar si la cita está vencida
  const esCitaVencida = (fechaCita: string, horaCita: string): boolean => {
    const fechaActual = new Date();
    const fechaHoraCita = new Date(`${fechaCita}T${horaCita}:00`);
    return fechaActual > fechaHoraCita;
  };

  // Enviar revisión
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citaBuscada) return;

    try {
      const response = await fetch(`${API_URL}/revision`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codigoCita: citaBuscada.codigoCita }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar la revisión");
      }

      const updatedCita = await response.json();
      setCitaBuscada(updatedCita);
      setError("");
    } catch (error) {
      setError("Error al guardar la revisión.");
      console.error("Error al guardar la revisión:", error);
    }
  };

  return (
    <DefaultLayout>
    <div className="container">
      <h1>Bienvenido a la Tecnomecánica</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
         <div className="detalle-cita">
          <h2>Detalles de la Cita</h2>
          <p><strong>Nombre:</strong> {citaBuscada.nombre}</p>
          <p><strong>Correo:</strong> {citaBuscada.correo}</p>
          <p><strong>Teléfono:</strong> {citaBuscada.telefono}</p>
          <p><strong>Fecha:</strong> {citaBuscada.fechaCita}</p>
          <p><strong>Hora:</strong> {citaBuscada.horaCita}</p>
          <p><strong>Placa:</strong> {citaBuscada.placa}</p>
          <p><strong>CDA:</strong> {citaBuscada.cdaSeleccionado}</p>

          {/* Acción de realizar tecnomecánica */}
          {(citaBuscada.estado === "Pendiente" || citaBuscada.estado === "Rechazado") && (
            <div>
              <button
                onClick={handleSubmit}
                disabled={esCitaVencida(citaBuscada.fechaCita, citaBuscada.horaCita)}
                style={{
                  backgroundColor: esCitaVencida(citaBuscada.fechaCita, citaBuscada.horaCita)
                    ? "gray"
                    : "blue",
                  color: "white",
                  padding: "10px 20px",
                  cursor: esCitaVencida(citaBuscada.fechaCita, citaBuscada.horaCita) ? "not-allowed" : "pointer",
                }}
              >
                {esCitaVencida(citaBuscada.fechaCita, citaBuscada.horaCita)
                  ? "Cita Vencida"
                  : "Realizar Tecnomecánica"}
              </button>
            </div>
          )}
        </div>
      )}

      <h2>Citas Pendientes</h2>
      {citas.length > 0 ? (
          <div className="tabla-responsive">
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
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita, index) => {
              let botonColor = "blue";
              let botonTexto = "Hacer Tecnomecánica";

              // Check for "Tecnomecánica realizada" and separately check for "Aprobada"
              if (cita.estado === "Tecnomecánica realizada") {
                botonColor = "green";
                botonTexto = "Tecnomecánica Realizada";
              } else if (cita.estado === "Aprobada") {
                botonColor = "green";
                botonTexto = "Aprobada";
              } else if (esCitaVencida(cita.fechaCita, cita.horaCita)) {
                botonColor = "red";
                botonTexto = "Cita Vencida";
              }

              return (
                <tr key={index}>
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
                          onClick={() => navigate(`/revision/${cita.codigoCita}`)}
                          className={botonColor}
                          disabled={cita.estado === "Tecnomecánica realizada" || esCitaVencida(cita.fechaCita, cita.horaCita)}
                        >
                      {botonTexto}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      ) : (
        <p>No hay citas registradas.</p>
      )}
    </div>
    </DefaultLayout>
  );
}
