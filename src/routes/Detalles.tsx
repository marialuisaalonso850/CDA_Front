import { useState, useEffect } from "react";
import DefaultLayout from "../layout/DefaultLayout";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import "../css/detalles.css";

// API URLs
const API_URL = "http://localhost:3000/api/citas";
const REVISION_API_URL = "http://localhost:3000/api/revisiones";
const PASSWORD = "admin123";

// Interfaces
interface Cita {
  codigoCita: string;
  nombre: string;
  correo: string;
  telefono: string;
  fechaCita: string;
  horaCita: string;
  placa: string;
  cdaSeleccionado: string;
  estado?: string;
  revision?: RevisionType;
  captchaToken?: string; // Añadido campo captchaToken
}

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

// Componente
const Detalles = () => {
  const [codigoCita, setCodigoCita] = useState("");
  const [citaBuscada, setCitaBuscada] = useState<Cita | null>(null);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [error, setError] = useState("");
  const [ingresoPermitido, setIngresoPermitido] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (ingresoPermitido) obtenerCitas();
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
      console.error("Error obteniendo citas:", err);
    }
  };

  const buscarCita = async () => {
    const codigoLimpio = codigoCita.trim();

    if (!codigoLimpio) {
      setError("Por favor ingresa un código de cita.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${codigoLimpio}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Cita no encontrada");
      }

      // Intentar obtener los datos de revisión si existen
      try {
        const revisionResponse = await fetch(`${REVISION_API_URL}/${codigoLimpio}`);
        if (revisionResponse.ok) {
          const revisionData = await revisionResponse.json();
          data.revision = revisionData;
        }
      } catch (revErr) {
        console.warn("No se encontró revisión para esta cita:", revErr);
      }

      setCitaBuscada(data);
      setError("");
    } catch (err: any) {
      setCitaBuscada(null);
      setError(err.message || "Cita no encontrada.");
      console.error("Error buscando cita:", err);
    }
  };

  const generarPDF = () => {
    if (!citaBuscada) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Comprobante Revisión Técnico-Mecánica", 20, 20);

    const { nombre, correo, telefono, fechaCita, horaCita, placa, cdaSeleccionado, revision, estado, codigoCita } = citaBuscada;

    doc.setFontSize(12);
    doc.text(`Nombre: ${nombre}`, 20, 40);
    doc.text(`Correo: ${correo}`, 20, 50);
    doc.text(`Teléfono: ${telefono}`, 20, 60);
    doc.text(`Fecha: ${fechaCita}`, 20, 70);
    doc.text(`Hora: ${horaCita}`, 20, 80);
    doc.text(`Placa: ${placa}`, 20, 90);
    doc.text(`CDA: ${cdaSeleccionado}`, 20, 100);

    doc.text("Detalles de la Revisión:", 20, 110);
    if (revision) {
      doc.text(`Luces delanteras: ${revision.electricidad.luces}`, 20, 120);
      doc.text(`Luces traseras: ${revision.electricidad.direccionales}`, 20, 130);
      doc.text(`Frenos: ${revision.seguridad.frenos}`, 20, 140);
      doc.text(`Neumáticos: ${revision.seguridad.llantasRines}`, 20, 150);
      doc.text(`Estado del motor: ${revision.estadoFinal}`, 20, 160);
    }

    doc.text("Estado de la Revisión:", 20, 170);
    doc.text(`${estado || "Sin estado"}`, 20, 180);

    doc.save(`${codigoCita}_revision.pdf`);
  };

  const cancelarCita = async (codigo: string) => {
    const codigoLimpio = codigo.trim();

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
        const response = await fetch(`${API_URL}/${codigoLimpio}`, { method: "DELETE" });
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Error al cancelar la cita");
        }

        setCitas(prev => prev.filter(cita => cita.codigoCita !== codigoLimpio));
        Swal.fire("Cancelado", "La cita ha sido cancelada.", "success");

        if (citaBuscada?.codigoCita === codigoLimpio) setCitaBuscada(null);

      } catch (err) {
        console.error("Error cancelando cita:", err);
        Swal.fire("Error", "No se pudo cancelar la cita.", "error");
      }
    }
  };

  const verComprobante = async (cita: Cita) => {
    const codigoLimpio = cita.codigoCita.trim();

    if (["Tecnomecánica realizada", "Aprobada", "Rechazada"].includes(cita.estado || "")) {
      try {
        const response = await fetch(`${REVISION_API_URL}/${codigoLimpio}`);
        const data = await response.json();
        
        if (response.ok) {
          const citaActualizada = { ...cita, revision: data };
          setCitaBuscada(citaActualizada);
        } else {
          throw new Error(data.error || "No se pudo cargar la revisión");
        }
      } catch (err) {
        console.error("Error cargando revisión:", err);
        Swal.fire("Error", "No se pudo cargar la revisión.", "error");
      }
    } else {
      Swal.fire("No disponible", "Solo puedes ver detalles de tecnomecánicas realizadas.", "info");
    }
  };

  const actualizarEstadoRevision = async (nuevoEstado: string) => {
    if (!citaBuscada) return;

    const codigoLimpio = citaBuscada.codigoCita.trim();
    
    // Mantener todos los campos originales y solo actualizar el estado
    const citaParaActualizar = {
      ...citaBuscada,
      estado: nuevoEstado,
      // Asegurar que no se envían campos no necesarios
      revision: undefined
    };

    try {
      const response = await fetch(`${API_URL}/${codigoLimpio}`, {
        method: "PUT",
        body: JSON.stringify(citaParaActualizar),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar el estado de la revisión");
      }

      // Actualizar el estado local con los datos recibidos del servidor
      const updatedCita = { ...citaBuscada, estado: nuevoEstado };
      setCitaBuscada(updatedCita);
      setCitas(prevCitas =>
        prevCitas.map(cita =>
          cita.codigoCita === codigoLimpio ? updatedCita : cita
        )
      );

      Swal.fire("Estado actualizado", `La revisión ha sido ${nuevoEstado.toLowerCase()}.`, "success");
    } catch (err: any) {
      console.error("Error actualizando estado:", err);
      Swal.fire("Error", err.message || "No se pudo actualizar el estado de la revisión.", "error");
    }
  };

  const renderRevisionInfo = () => {
    if (!citaBuscada?.revision) return null;

    return (
      <>
        <h3>Información de la Revisión</h3>
        <p><strong>Marca:</strong> {citaBuscada.revision.marca || 'N/A'}</p>
        <p><strong>Modelo:</strong> {citaBuscada.revision.modelo || 'N/A'}</p>
        <p><strong>Kilometraje:</strong> {citaBuscada.revision.kilometraje || 'N/A'}</p>
        <p><strong>Estado Seguridad:</strong> {citaBuscada.revision.seguridad.direccion || 'N/A'}</p>
        <p><strong>Estado Ambiental:</strong> {citaBuscada.revision.ambiental.emisiones || 'N/A'}</p>
        <p><strong>Estado Eléctrico:</strong> {citaBuscada.revision.electricidad.claxon || 'N/A'}</p>
        <p><strong>Observaciones:</strong> {citaBuscada.revision.observaciones || 'N/A'}</p>
        <p><strong>Estado Final:</strong> {citaBuscada.revision.estadoFinal || 'N/A'}</p>
      </>
    );
  };

  return (
    <DefaultLayout ingresoPermitido={ingresoPermitido}>
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

          {error && <p style={{ color: "red" }}>{error}</p>}

          {citaBuscada && (
            <div className="pdf-preview">
              <h2>Comprobante Revisión Técnico-Mecánica</h2>
              <p><strong>Nombre:</strong> {citaBuscada.nombre}</p>
              <p><strong>Correo:</strong> {citaBuscada.correo}</p>
              <p><strong>Teléfono:</strong> {citaBuscada.telefono}</p>
              <p><strong>Fecha:</strong> {citaBuscada.fechaCita}</p>
              <p><strong>Hora:</strong> {citaBuscada.horaCita}</p>
              <p><strong>Placa:</strong> {citaBuscada.placa}</p>
              <p><strong>CDA:</strong> {citaBuscada.cdaSeleccionado}</p>
              <p><strong>Estado:</strong> {citaBuscada.estado || "Sin estado"}</p>
              
              {renderRevisionInfo()}

              <button onClick={() => generarPDF()}>Generar PDF</button>

              <button onClick={() => actualizarEstadoRevision("Aprobada")} disabled={["Aprobada", "Rechazada"].includes(citaBuscada.estado || "")}>
                Aprobar
              </button>
              <button onClick={() => actualizarEstadoRevision("Rechazada")} disabled={["Aprobada", "Rechazada"].includes(citaBuscada.estado || "")}>
                Rechazar
              </button>

              <button onClick={() => cancelarCita(citaBuscada.codigoCita)}>Cancelar Cita</button>
            </div>
          )}

          <div className="citas-lista">
            <h2>Citas Pendientes</h2>
            {citas.length > 0 ? (
              citas.map(cita => (
                <div key={cita.codigoCita} className="cita-item">
                  <p>{cita.codigoCita} - {cita.placa} - {cita.estado || "Pendiente"}</p>
                  <button onClick={() => verComprobante(cita)}>Ver comprobante</button>
                </div>
              ))
            ) : (
              <p>No hay citas pendientes.</p>
            )}
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default Detalles;