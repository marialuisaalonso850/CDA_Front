import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api/revisiones";
const CITA_API_URL = "http://localhost:3000/api/citas";
const VEHICULO_API_URL = "http://localhost:3000/api/placas";

interface Seguridad {
  frenos: string;
  suspension: string;
  direccion: string;
  llantasRines: string;
  observacionesSeguridad: string;
}

interface Ambiental {
  emisiones: string;
  escape: string;
  observacionesAmbiental: string;
}

interface Electricidad {
  luces: string;
  direccionales: string;
  claxon: string;
  observacionesElectricidad: string;
}

interface RevisionType {
  placa: string;
  marca: string;
  modelo: string;
  kilometraje: string;
  seguridad: Seguridad;
  ambiental: Ambiental;
  electricidad: Electricidad;
  observaciones: string;
  estadoFinal: string; // Campo agregado
}

interface CitaType {
  placa: string;
  fechaCita: string;
  horaCita: string;
  estado: string;
}

export default function Revision() {
  const { codigoCita } = useParams<{ codigoCita: string }>();
  const navigate = useNavigate();

  const [revision, setRevision] = useState<RevisionType>({
    placa: "",
    marca: "",
    modelo: "",
    kilometraje: "",
    seguridad: {
      frenos: "Aprobado",
      suspension: "Aprobado",
      direccion: "Aprobado",
      llantasRines: "Aprobado",
      observacionesSeguridad: "",
    },
    ambiental: {
      emisiones: "Dentro del límite",
      escape: "Aprobado",
      observacionesAmbiental: "",
    },
    electricidad: {
      luces: "Funcionando",
      direccionales: "Funcionando",
      claxon: "Funcionando",
      observacionesElectricidad: "",
    },
    observaciones: "",
    estadoFinal: "Aprobado", // Inicializando el estado final
  });

  const [cita, setCita] = useState<CitaType | null>(null);

  useEffect(() => {
    if (codigoCita) fetchCita();
  }, [codigoCita]);

  const fetchCita = async () => {
    try {
      const response = await fetch(`${CITA_API_URL}/${codigoCita}`);
      if (!response.ok) throw new Error("Error al obtener la cita");
      const data = await response.json();
      setCita(data);
      setRevision((prev) => ({ ...prev, placa: data.placa }));
      fetchVehiculo(data.placa);
    } catch (error) {
      console.error("Error en fetchCita:", error);
      alert("No se pudo cargar la información de la cita.");
    }
  };

  const fetchVehiculo = async (placa: string) => {
    try {
      const response = await fetch(`${VEHICULO_API_URL}/${placa}`);
      if (!response.ok) throw new Error("Error al obtener el vehículo");
      const data = await response.json();
      setRevision((prev) => ({
        ...prev,
        marca: data.marca,
        modelo: data.modelo,
      }));
    } catch (error) {
      console.error("Error en fetchVehiculo:", error);
      alert("No se pudo cargar los datos del vehículo.");
    }
  };

  const isValidForm = () => {
    return revision.seguridad.frenos && revision.seguridad.suspension && revision.ambiental.emisiones && revision.electricidad.luces;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    section?: keyof RevisionType
  ) => {
    const { name, value } = e.target;
    setRevision((prev) => {
      if (section && typeof prev[section] === "object") {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [name]: value,
          },
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidForm()) {
      alert("Por favor complete todos los campos requeridos.");
      return;
    }

    const dataToSend = { codigoCita, ...revision };
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) throw new Error("Error al guardar la revisión");

      const updateResponse = await fetch(`${CITA_API_URL}/${codigoCita}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "Tecnomecánica realizada" }),
      });
      if (!updateResponse.ok) throw new Error("Error al actualizar la cita");

      alert("Revisión guardada y cita actualizada");
      navigate("/");
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const buttonStyle = {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "6px",
    backgroundColor: cita?.estado === "Pendiente" || cita?.estado === "Rechazado" ? "#2196F3" : "#4CAF50",
    color: "white",
    border: "none",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
  };

  const sectionStyle = {
    background: "#f9f9f9",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 8px rgba(0,0,0,0.06)",
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h1 style={{ marginBottom: "20px" }}>Formulario de Revisión Técnico-Mecánica</h1>

      {cita && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Detalles de la Cita</h3>
          <p><strong>Placa:</strong> {cita.placa}</p>
          <p><strong>Fecha de Cita:</strong> {cita.fechaCita}</p>
          <p><strong>Hora de Cita:</strong> {cita.horaCita}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", width: "90%", maxWidth: "1100px", margin: "0 auto", textAlign: "left" }}>
        {/* Columna Izquierda */}
        <div style={sectionStyle}>
          <h3>Datos del Vehículo</h3>
          {["placa", "marca", "modelo", "kilometraje"].map((campo) => (
            <div key={campo}>
              <label>{campo.charAt(0).toUpperCase() + campo.slice(1)}:</label>
              <input
                type={campo === "kilometraje" ? "number" : "text"}
                name={campo}
                value={(revision as any)[campo]}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          ))}

          <h3>Seguridad</h3>
          {["frenos", "suspension", "direccion", "llantasRines"].map((campo) => (
            <div key={campo}>
              <label>{campo}:</label>
              <select
                name={campo}
                value={revision.seguridad[campo as keyof Seguridad]}
                onChange={(e) => handleChange(e, "seguridad")}
                style={inputStyle}
              >
                <option value="Aprobado">Aprobado</option>
                <option value="Reprobado">Reprobado</option>
              </select>
            </div>
          ))}
          <label>Observaciones Seguridad:</label>
          <textarea
            name="observacionesSeguridad"
            value={revision.seguridad.observacionesSeguridad}
            onChange={(e) => handleChange(e, "seguridad")}
            style={{ ...inputStyle, height: "60px" }}
          />
        </div>

        {/* Columna Derecha */}
        <div style={sectionStyle}>
          <h3>Ambiental</h3>
          {["emisiones", "escape"].map((campo) => (
            <div key={campo}>
              <label>{campo}:</label>
              <select
                name={campo}
                value={revision.ambiental[campo as keyof Ambiental]}
                onChange={(e) => handleChange(e, "ambiental")}
                style={inputStyle}
              >
                <option value="Aprobado">Aprobado</option>
                <option value="Reprobado">Reprobado</option>
                <option value="Dentro del límite">Dentro del límite</option>
              </select>
            </div>
          ))}
          <label>Observaciones Ambiental:</label>
          <textarea
            name="observacionesAmbiental"
            value={revision.ambiental.observacionesAmbiental}
            onChange={(e) => handleChange(e, "ambiental")}
            style={{ ...inputStyle, height: "60px" }}
          />

          <h3>Electricidad</h3>
          {["luces", "direccionales", "claxon"].map((campo) => (
            <div key={campo}>
              <label>{campo}:</label>
              <select
                name={campo}
                value={revision.electricidad[campo as keyof Electricidad]}
                onChange={(e) => handleChange(e, "electricidad")}
                style={inputStyle}
              >
                <option value="Funcionando">Funcionando</option>
                <option value="No funciona">No funciona</option>
              </select>
            </div>
          ))}
          <label>Observaciones Electricidad:</label>
          <textarea
            name="observacionesElectricidad"
            value={revision.electricidad.observacionesElectricidad}
            onChange={(e) => handleChange(e, "electricidad")}
            style={{ ...inputStyle, height: "60px" }}
          />
        </div>

        {/* Estado Final - Ahora encima del botón */}
        <div style={sectionStyle}>
          <h3>Estado Final</h3>
          <select
            name="estadoFinal"
            value={revision.estadoFinal}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="Aprobado">Aprobado</option>
            <option value="Rechazado">Rechazado</option>
          </select>
        </div>

        <div>
          <button type="submit" style={buttonStyle} disabled={!isValidForm()}>
            Guardar Revisión
          </button>
        </div>
      </form>
    </div>
  );
}

