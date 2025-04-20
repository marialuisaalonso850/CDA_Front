import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "../layout/Portal2"; 
import "../css/Bienvenido.css"


const API_URL = "http://localhost:3000/api/citas";

interface Cita {
  codigoCita: string;
  nombre: string;
  correo: string;
  telefono: string;
  fechaCita: string;
  horaCita: string;
  placa: string;
  cdaSeleccionado: string;
  estado: string;
}

export default function Bienvenido() {
  const navigate = useNavigate();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [error, setError] = useState<string>("");
  const [codigoCita, setCodigoCita] = useState("");
  const [citaBuscada, setCitaBuscada] = useState<Cita | null>(null);

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
      }
    }
    fetchCitas();
  }, []);

  const buscarCita = async () => {
    if (!codigoCita.trim()) {
      setError("Por favor ingresa un código de cita.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/${codigoCita}`);
      if (!response.ok) throw new Error("Cita no encontrada");

      const data: Cita = await response.json();
      setCitaBuscada(data);
      setError("");
    } catch {
      setCitaBuscada(null);
      setError("Cita no encontrada.");
    }
  };

  const esCitaVencida = (fechaCita: string, horaCita: string): boolean => {
    const fechaActual = new Date();
    const fechaHoraCita = new Date(`${fechaCita}T${horaCita}:00`);
    return fechaActual > fechaHoraCita;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citaBuscada) return;

    try {
      const response = await fetch(`${API_URL}/revision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigoCita: citaBuscada.codigoCita }),
      });

      if (!response.ok) throw new Error("Error al guardar la revisión");

      const updatedCita = await response.json();
      setCitaBuscada(updatedCita);
      setError("");
    } catch {
      setError("Error al guardar la revisión.");
    }
  };

  return (
    <DefaultLayout>
      <div className="container">
        <h1>Bienvenido a la Tecnomecánica</h1>
        <h2>Buscar Cita</h2>
        {error && <p className="error">{error}</p>}
        <div className="buscar-cita">
          <input
            type="text"
            placeholder="Ingrese código de cita"
            value={codigoCita}
            onChange={(e) => setCodigoCita(e.target.value)}
          />
          <button onClick={buscarCita}>Buscar</button>
        </div>

        {citaBuscada && (
          <div className="detalle-cita">
            <h2>Detalles de la Cita</h2>
            <table>
              <tbody>
                <tr><td>Nombre:</td><td>{citaBuscada.nombre}</td></tr>
                <tr><td>Correo:</td><td>{citaBuscada.correo}</td></tr>
                <tr><td>Teléfono:</td><td>{citaBuscada.telefono}</td></tr>
                <tr><td>Fecha:</td><td>{citaBuscada.fechaCita}</td></tr>
                <tr><td>Hora:</td><td>{citaBuscada.horaCita}</td></tr>
                <tr><td>Placa:</td><td>{citaBuscada.placa}</td></tr>
                <tr><td>CDA:</td><td>{citaBuscada.cdaSeleccionado}</td></tr>
              </tbody>
            </table>

            {(citaBuscada.estado === "Pendiente" || citaBuscada.estado === "Rechazado") && (
              <button
                onClick={handleSubmit}
                disabled={esCitaVencida(citaBuscada.fechaCita, citaBuscada.horaCita)}
                className={esCitaVencida(citaBuscada.fechaCita, citaBuscada.horaCita) ? "boton-vencido" : "boton-realizar"}
              >
                {esCitaVencida(citaBuscada.fechaCita, citaBuscada.horaCita)
                  ? "Cita Vencida"
                  : "Realizar Tecnomecánica"}
              </button>
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
                  let botonColor = "boton-realizar";
                  let botonTexto = "Hacer Tecnomecánica";

                  if (cita.estado === "Tecnomecánica realizada") {
                    botonColor = "boton-realizada";
                    botonTexto = "Tecnomecánica Realizada";
                  } else if (cita.estado === "Aprobada") {
                    botonColor = "boton-aprobada";
                    botonTexto = "Aprobada";
                  } else if (esCitaVencida(cita.fechaCita, cita.horaCita)) {
                    botonColor = "boton-vencido";
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
