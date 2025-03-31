import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api/revisiones";

export default function Revision() {
  const { codigoCita } = useParams();
  const navigate = useNavigate();
  
  interface Seguridad {
    frenos: string;
    suspension: string;
    direccion: string;
    llantasRines: string;
  }
  
  interface Ambiental {
    emisiones: string;
    escape: string;
  }
  
  interface Electricidad {
    luces: string;
    direccionales: string;
    claxon: string;
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
    estadoFinal: string;
  }
  
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
    },
    ambiental: {
      emisiones: "Dentro del límite",
      escape: "Aprobado",
    },
    electricidad: {
      luces: "Funcionando",
      direccionales: "Funcionando",
      claxon: "Funcionando",
    },
    observaciones: "",
    estadoFinal: "Aprobado",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    section?: keyof RevisionType
  ) => {
    const { name, value } = e.target;
  
    setRevision((prev) => {
      if (section && prev[section]) {
        const currentSection = prev[section];
  
        if (typeof currentSection === "object" && currentSection !== null) {
          return {
            ...prev,
            [section]: { ...currentSection, [name]: value },
          };
        }
      }
  
      return { ...prev, [name]: value };
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend = { codigoCita, ...revision };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) throw new Error("Error al guardar la revisión");

      alert("Revisión guardada con éxito");
      navigate("/"); // Redirige a la página principal
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al guardar la revisión");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Formulario de Revisión Técnico-Mecánica</h1>
      <form onSubmit={handleSubmit} style={{ display: "inline-block", textAlign: "left", width: "50%" }}>
        <label>Placa:</label>
        <input type="text" name="placa" value={revision.placa} onChange={handleChange} required />

        <label>Marca:</label>
        <input type="text" name="marca" value={revision.marca} onChange={handleChange} required />

        <label>Modelo:</label>
        <input type="text" name="modelo" value={revision.modelo} onChange={handleChange} required />

        <label>Kilometraje:</label>
        <input type="number" name="kilometraje" value={revision.kilometraje} onChange={handleChange} required />

        <h3>Seguridad</h3>
        {Object.keys(revision.seguridad).map((campo) => (
          <div key={campo}>
            <label>{campo}</label>
            <select name={campo} value={revision.seguridad[campo as keyof typeof revision.seguridad]} onChange={(e) => handleChange(e, "seguridad")}>
              <option value="Aprobado">Aprobado</option>
              <option value="Reprobado">Reprobado</option>
            </select>
          </div>
        ))}

        <h3>Ambiental</h3>
        {Object.keys(revision.ambiental).map((campo) => (
          <div key={campo}>
            <label>{campo}</label>
            <select name={campo} value={revision.ambiental[campo as keyof typeof revision.ambiental]} onChange={(e) => handleChange(e, "ambiental")}>
              <option value="Dentro del límite">Dentro del límite</option>
              <option value="Fuera del límite">Fuera del límite</option>
            </select>
          </div>
        ))}

        <h3>Electricidad</h3>
        {Object.keys(revision.electricidad).map((campo) => (
          <div key={campo}>
            <label>{campo}</label>
            <select name={campo} value={revision.electricidad[campo as keyof typeof revision.electricidad]} onChange={(e) => handleChange(e, "electricidad")}>
              <option value="Funcionando">Funcionando</option>
              <option value="No funcionando">No funcionando</option>
            </select>
          </div>
        ))}

        <label>Observaciones:</label>
        <textarea name="observaciones" value={revision.observaciones} onChange={(e) => handleChange(e)} />

        <label>Estado Final:</label>
        <select name="estadoFinal" value={revision.estadoFinal} onChange={handleChange}>
          <option value="Aprobado">Aprobado</option>
          <option value="Rechazado">Rechazado</option>
        </select>

        <button type="submit">Guardar Revisión</button>
      </form>
    </div>
  );
}
