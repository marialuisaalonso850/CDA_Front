import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


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
          const errorText = await response.text();
          throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
        }
        const data: Cita[] = await response.json();
        console.log("Citas obtenidas:", data);
        setCitas(data);
      } catch (error) {
        setError("Error al obtener citas. Intente de nuevo más tarde.");
        console.error("Error al obtener citas:", error);
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

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Bienvenido a la Tecnomecánica</h1>
      <h2>Lista de Citas</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <input
          type="text"
          placeholder="Ingrese el código de la cita"
          value={codigoCita}
          onChange={(e) => setCodigoCita(e.target.value)}
        />
        <button onClick={buscarCita}>Buscar</button>
      </div>
      {citaBuscada && (
        <div>
          <h2>Detalles de la Cita</h2>
          <p><strong>Nombre:</strong> {citaBuscada.nombre}</p>
          <p><strong>Correo:</strong> {citaBuscada.correo}</p>
          <p><strong>Teléfono:</strong> {citaBuscada.telefono}</p>
          <p><strong>Fecha:</strong> {citaBuscada.fechaCita}</p>
          <p><strong>Hora:</strong> {citaBuscada.horaCita}</p>
          <p><strong>Placa:</strong> {citaBuscada.placa}</p>
          <p><strong>CDA:</strong> {citaBuscada.cdaSeleccionado}</p>
        </div>
      )}
      {citas.length > 0 ? (
        <table  style={{ margin: "0 auto", width: "80%" }}>
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
            {citas.map((cita, index) => (
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
                <button onClick={() => navigate(`/revision/${cita.codigoCita}`)}>
                    Hacer Tecnomecánica
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
  );
}

