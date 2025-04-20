import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/revision.css";

const API_URL = "http://localhost:3000/api/revisiones";
const CITA_API_URL = "http://localhost:3000/api/citas";
const VEHICULO_API_URL = "http://localhost:3000/api/placas";

export interface Seguridad {
  // Frenos
  frenos: string;
  fuerzaFrenadoDelantera?: number;
  fuerzaFrenadoTrasera?: number;
  desbalanceFrenado?: number;
  observacionesFrenos?: string;

  // Dirección
  direccion: string;
  holguraVolante?: number;
  estadoRotulas?: string;
  observacionesDireccion?: string;

  // Suspensión
  suspension: string;
  reboteIzquierdo?: number;
  reboteDerecho?: number;
  estadoBujes?: string;
  observacionesSuspension?: string;

  // Llantas y Rines
  llantasRines: string;
  labradoLlantas?: number;
  estadoRines?: string;
  observacionesLlantasRines?: string;

  // Observación general
  observacionesSeguridad?: string;
}

export interface Ambiental {
  emisiones: string;
  co?: number;
  co2?: number;
  hc?: number;
  opacidad?: number;
  observacionesEmisiones?: string;

  escape: string;
  observacionesEscape?: string;

  observacionesAmbiental?: string;
}

export interface Electricidad {
  luces: string;
  observacionesLuces?: string;

  direccionales: string;
  observacionesDireccionales?: string;

  claxon: string;
  observacionesClaxon?: string;

  observacionesElectricidad?: string;
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
    estadoFinal: "Aprobada", // Inicializando el estado final
  });

  const [cita, setCita] = useState<CitaType | null>(null);

  const [seccionActiva, setSeccionActiva] = useState("datos");

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

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
  };

  function calcularEstadoFinal(): "Aprobada" | "Reprobada" {
    const s = revision.seguridad;
    const a = revision.ambiental;
    const e = revision.electricidad;
  
    const secciones = [
      s.frenos,
      s.direccion,
      s.suspension,
      s.llantasRines,
      a.emisiones === "Dentro del límite" ? "Aprobado" : "Reprobado",
      a.escape,
      e.luces,
      e.direccionales,
      e.claxon
    ];
  
    const algunaFalla = secciones.some(val => val === "Reprobado" || val === "No Funcionando" || val === "Fuera del límite");
  
    return algunaFalla ? "Reprobada" : "Aprobada";
  }

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

      <div className="tab-container">
        <button
          className={`tab-button ${seccionActiva === "datos" ? "active" : ""}`}
          onClick={() => setSeccionActiva("datos")}
        >
          Datos del vehículo
        </button>
        <button
          className={`tab-button ${seccionActiva === "seguridad" ? "active" : ""}`}
          onClick={() => setSeccionActiva("seguridad")}
        >
          Seguridad
        </button>
        <button
          className={`tab-button ${seccionActiva === "ambiental" ? "active" : ""}`}
          onClick={() => setSeccionActiva("ambiental")}
        >
          Ambiental
        </button>
        <button
          className={`tab-button ${seccionActiva === "electricidad" ? "active" : ""}`}
          onClick={() => setSeccionActiva("electricidad")}
        >
          Electricidad
        </button>
        <button
          className={`tab-button ${seccionActiva === "resumen" ? "active" : ""}`}
          onClick={() => setSeccionActiva("resumen")}
        >
          Resumen
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", width: "90%", maxWidth: "1100px", margin: "0 auto", textAlign: "left" }}>
      {seccionActiva === "datos" && (
          <div>
          <h3>Datos del Vehículo</h3>
          <div className="section-box">
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
          </div>
          </div>
        )}

      {seccionActiva === "seguridad" && (
        <div>
        <h3>Seguridad</h3>

        {/* Frenos */}
        <div className="section-box">
          <label>Frenos:</label>
          <select
            name="frenos"
            value={revision.seguridad.frenos}
            onChange={(e) => handleChange(e, "seguridad")}
            style={inputStyle}
          >
            <option value="Aprobado">Aprobado</option>
            <option value="Reprobado">Reprobado</option>
          </select>

          <label>Fuerza de frenado delantera (N):</label>
          <input
            type="number"
            name="fuerzaFrenadoDelantera"
            value={revision.seguridad.fuerzaFrenadoDelantera || ""}
            onChange={(e) => handleChange(e, "seguridad")}
            style={inputStyle}
          />

          <label>Fuerza de frenado trasera (N):</label>
          <input
            type="number"
            name="fuerzaFrenadoTrasera"
            value={revision.seguridad.fuerzaFrenadoTrasera || ""}
            onChange={(e) => handleChange(e, "seguridad")}
            style={inputStyle}
          />

          <label>Desbalance de frenado (%):</label>
          <input
            type="number"
            name="desbalanceFrenado"
            step="0.1"
            value={revision.seguridad.desbalanceFrenado || ""}
            onChange={(e) => handleChange(e, "seguridad")}
            style={inputStyle}
          />

          <label>Observaciones frenos:</label>
          <input
            type="text"
            name="observacionesFrenos"
            value={revision.seguridad.observacionesFrenos || ""}
            onChange={(e) => handleChange(e, "seguridad")}
            style={inputStyle}
          />
        </div>

        {/* Dirección */}
        <div className="section-box">
          <label>Dirección:</label>
          <select
            name="direccion"
            value={revision.seguridad.direccion}
            onChange={(e) => handleChange(e, "seguridad")}
            style={inputStyle}
          >
            <option value="Aprobado">Aprobado</option>
            <option value="Reprobado">Reprobado</option>
          </select>

          <label>Holgura del volante (° o cm):</label>
          <input
            type="number"
            step="0.1"
            name="holguraVolante"
            value={revision.seguridad.holguraVolante || ""}
            onChange={(e) => handleChange(e, "seguridad")}
            style={inputStyle}
          />

          <label>Estado rótulas/terminales:</label>
          <input
            type="text"
            name="estadoRotulas"
            placeholder="Ej: sin juego / con desgaste"
            value={revision.seguridad.estadoRotulas || ""}
            onChange={(e) => handleChange(e, "seguridad")}
            style={inputStyle}
          />

          <label>Observaciones dirección:</label>
          <input
            type="text"
            name="observacionesDireccion"
            value={revision.seguridad.observacionesDireccion || ""}
            onChange={(e) => handleChange(e, "seguridad")}
            style={inputStyle}
          />
        </div>

        {/* Suspensión */}
        <div className="section-box">
          <label>Suspensión:</label>
          <select
            name="suspension"
            value={revision.seguridad.suspension}
            onChange={(e) => handleChange(e, "seguridad")}
            style={inputStyle}
          >
            <option value="Aprobado">Aprobado</option>
            <option value="Reprobado">Reprobado</option>
          </select>

          <label>Rebote izquierdo (N° rebotes):</label>
          <input
            type="number"
            name="reboteIzquierdo"
            value={revision.seguridad.reboteIzquierdo || ""}
            onChange={(e) => handleChange(e, "seguridad")}
            style={inputStyle}
          />

          <label>Rebote derecho (N° rebotes):</label>
          <input
            type="number"
            name="reboteDerecho"
            value={revision.seguridad.reboteDerecho || ""}
            onChange={(e) => handleChange(e, "seguridad")}
            style={inputStyle}
          />

          <label>Estado bujes/anclajes:</label>
          <input
            type="text"
            name="estadoBujes"
            value={revision.seguridad.estadoBujes || ""}
            onChange={(e) => handleChange(e, "seguridad")}
            style={inputStyle}
          />

          <label>Observaciones suspensión:</label>
          <input
            type="text"
            name="observacionesSuspension"
            value={revision.seguridad.observacionesSuspension || ""}
            onChange={(e) => handleChange(e, "seguridad")}
            style={inputStyle}
          />
        </div>

        {/* Llantas y Rines */}
        <div className="section-box">
          <label>Llantas y Rines:</label>
          <select
            name="llantasRines"
            value={revision.seguridad.llantasRines}
            onChange={(e) => handleChange(e, "seguridad")}
            style={inputStyle}
          >
            <option value="Aprobado">Aprobado</option>
            <option value="Reprobado">Reprobado</option>
          </select>

          <label>Profundidad del labrado (mm):</label>
          <input
            type="number"
            step="0.1"
            name="labradoLlantas"
            value={revision.seguridad.labradoLlantas || ""}
            onChange={(e) => handleChange(e, "seguridad")}
            style={inputStyle}
          />

          <label>Estado de los rines:</label>
          <input
            type="text"
            name="estadoRines"
            value={revision.seguridad.estadoRines || ""}
            onChange={(e) => handleChange(e, "seguridad")}
            style={inputStyle}
          />

          <label>Observaciones llantas/rines:</label>
          <input
            type="text"
            name="observacionesLlantasRines"
            value={revision.seguridad.observacionesLlantasRines || ""}
            onChange={(e) => handleChange(e, "seguridad")}
            style={inputStyle}
          />
        </div>

        {/* Observación general del módulo */}
        <label>Observaciones generales de seguridad:</label>
        <textarea
          name="observacionesSeguridad"
          value={revision.seguridad.observacionesSeguridad}
          onChange={(e) => handleChange(e, "seguridad")}
          style={{ ...inputStyle, height: "60px" }}
        />
        </div>
      )}

      {seccionActiva === "ambiental" && (
          <div>
          <h3>Ambiental</h3>

          {/* Emisiones de Gases */}
          <div className="section-box">
            <label>Emisiones:</label>
            <select
              name="emisiones"
              value={revision.ambiental.emisiones}
              onChange={(e) => handleChange(e, "ambiental")}
              style={inputStyle}
            >
              <option value="Dentro del límite">Dentro del límite</option>
              <option value="Fuera del límite">Fuera del límite</option>
            </select>

            <label>CO (%):</label>
            <input
              type="number"
              step="0.01"
              name="co"
              value={revision.ambiental.co || ""}
              onChange={(e) => handleChange(e, "ambiental")}
              style={inputStyle}
            />

            <label>CO₂ (%):</label>
            <input
              type="number"
              step="0.01"
              name="co2"
              value={revision.ambiental.co2 || ""}
              onChange={(e) => handleChange(e, "ambiental")}
              style={inputStyle}
            />

            <label>HC (ppm):</label>
            <input
              type="number"
              step="1"
              name="hc"
              value={revision.ambiental.hc || ""}
              onChange={(e) => handleChange(e, "ambiental")}
              style={inputStyle}
            />

            <label>Opacidad (diesel):</label>
            <input
              type="number"
              step="0.1"
              name="opacidad"
              value={revision.ambiental.opacidad || ""}
              onChange={(e) => handleChange(e, "ambiental")}
              style={inputStyle}
            />

            <label>Observaciones emisiones:</label>
            <input
              type="text"
              name="observacionesEmisiones"
              value={revision.ambiental.observacionesEmisiones || ""}
              onChange={(e) => handleChange(e, "ambiental")}
              style={inputStyle}
            />
          </div>

          {/* Sistema de escape */}
          <div className="section-box">
            <label>Sistema de escape:</label>
            <select
              name="escape"
              value={revision.ambiental.escape}
              onChange={(e) => handleChange(e, "ambiental")}
              style={inputStyle}
            >
              <option value="Aprobado">Aprobado</option>
              <option value="Reprobado">Reprobado</option>
            </select>

            <label>Observaciones escape:</label>
            <input
              type="text"
              name="observacionesEscape"
              value={revision.ambiental.observacionesEscape || ""}
              onChange={(e) => handleChange(e, "ambiental")}
              style={inputStyle}
            />
          </div>

          {/* Observaciones generales del módulo */}
          <label>Observaciones ambientales generales:</label>
          <textarea
            name="observacionesAmbiental"
            value={revision.ambiental.observacionesAmbiental || ""}
            onChange={(e) => handleChange(e, "ambiental")}
            style={{ ...inputStyle, height: "60px" }}
          />

          </div>
        )}

      {seccionActiva === "electricidad" && (
        <div>
        <h3>Electricidad</h3>

        {/* Luces */}
        <div className="section-box">
          <label>Luces:</label>
          <select
            name="luces"
            value={revision.electricidad.luces}
            onChange={(e) => handleChange(e, "electricidad")}
            style={inputStyle}
          >
            <option value="Funcionando">Funcionando</option>
            <option value="No Funcionando">No Funcionando</option>
          </select>

          <label>Observaciones luces:</label>
          <input
            type="text"
            name="observacionesLuces"
            value={revision.electricidad.observacionesLuces || ""}
            onChange={(e) => handleChange(e, "electricidad")}
            style={inputStyle}
          />
        </div>

        {/* Direccionales */}
        <div className="section-box">
          <label>Direccionales:</label>
          <select
            name="direccionales"
            value={revision.electricidad.direccionales}
            onChange={(e) => handleChange(e, "electricidad")}
            style={inputStyle}
          >
            <option value="Funcionando">Funcionando</option>
            <option value="No Funcionando">No Funcionando</option>
          </select>

          <label>Observaciones direccionales:</label>
          <input
            type="text"
            name="observacionesDireccionales"
            value={revision.electricidad.observacionesDireccionales || ""}
            onChange={(e) => handleChange(e, "electricidad")}
            style={inputStyle}
          />
        </div>

        {/* Claxon */}
        <div className="section-box">
          <label>Claxon:</label>
          <select
            name="claxon"
            value={revision.electricidad.claxon}
            onChange={(e) => handleChange(e, "electricidad")}
            style={inputStyle}
          >
            <option value="Funcionando">Funcionando</option>
            <option value="No Funcionando">No Funcionando</option>
          </select>

          <label>Observaciones claxon:</label>
          <input
            type="text"
            name="observacionesClaxon"
            value={revision.electricidad.observacionesClaxon || ""}
            onChange={(e) => handleChange(e, "electricidad")}
            style={inputStyle}
          />
        </div>

        {/* Observaciones generales */}
        <label>Observaciones generales del sistema eléctrico:</label>
        <textarea
          name="observacionesElectricidad"
          value={revision.electricidad.observacionesElectricidad || ""}
          onChange={(e) => handleChange(e, "electricidad")}
          style={{ ...inputStyle, height: "60px" }}
        />
      </div>
      )}

        {seccionActiva === "resumen" && (
          <div>
          <h3>Resumen de revisión</h3>
      
          <ul>
            <li><strong>Frenos:</strong> {revision.seguridad.frenos}</li>
            <li><strong>Suspensión:</strong> {revision.seguridad.suspension}</li>
            <li><strong>Dirección:</strong> {revision.seguridad.direccion}</li>
            <li><strong>Llantas y Rines:</strong> {revision.seguridad.llantasRines}</li>
            <li><strong>Emisiones:</strong> {revision.ambiental.emisiones}</li>
            <li><strong>Escape:</strong> {revision.ambiental.escape}</li>
            <li><strong>Luces:</strong> {revision.electricidad.luces}</li>
            <li><strong>Direccionales:</strong> {revision.electricidad.direccionales}</li>
            <li><strong>Claxon:</strong> {revision.electricidad.claxon}</li>
          </ul>
      
          <p>
            <strong>Estado final de la revisión:</strong>{" "}
            {calcularEstadoFinal().toUpperCase()}
          </p>
      
          <button
            type="submit"
            onClick={() =>
              setRevision(prev => ({
                ...prev,
                estadoFinal: calcularEstadoFinal()
              }))
            }
          >
            Guardar revisión
          </button>
        </div>
      )}      
      </form>
    </div>
  );
}
