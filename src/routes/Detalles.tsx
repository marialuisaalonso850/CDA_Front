import { useState, useEffect } from "react";
import DefaultLayout from "../layout/DefaultLayout";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import "../css/detalles.css";

// API URLs
const API_URL = "https://cda-back-adia.onrender.com/api/citas";
const REVISION_API_URL = "https://cda-back-adia.onrender.com/api/revisiones";
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
  
    // Logo
    const logo = new Image();
    logo.src = "../public/img/logo.webp"; // Cambia la ruta al logo
    doc.addImage(logo, 'WEBP', 10, 10, 40, 20); // Logo alineado a la izquierda
  
    // Título (Centrado y con mayor espacio)
    const title = "Comprobante de Revisión Técnico-Mecánica";
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    const titleWidth = doc.getTextWidth(title);
    const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
    doc.text(title, titleX, 50); // Título centrado, separado del logo
  
    // Fecha de emisión (Alineada a la derecha y con más separación)
    doc.setFontSize(12);
    const dateText = "Fecha de emisión: " + new Date().toLocaleDateString();
    doc.text(dateText, doc.internal.pageSize.width - 20 - doc.getTextWidth(dateText), 60); // Fecha alineada a la derecha y un poco más abajo
    
    // Cuadro de información del cliente
    doc.setFillColor(235, 235, 235); // Color de fondo gris claro
    doc.rect(20, 70, 180, 50, 'F'); // Crear cuadro para información del cliente
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.text("Información del Cliente", 20, 80);
    doc.text(`Nombre: ${citaBuscada.nombre}`, 30, 90);
    doc.text(`Correo: ${citaBuscada.correo}`, 30, 100);
    doc.text(`Teléfono: ${citaBuscada.telefono}`, 30, 110);
    doc.text(`Placa: ${citaBuscada.placa}`, 30, 120);
    
    // Espaciado
    doc.line(20, 130, 200, 130); // Línea horizontal de separación
    
    // Información de la cita
    doc.setFillColor(235, 235, 235); 
    doc.rect(20, 135, 180, 30, 'F'); 
    doc.text("Detalles de la Cita", 20, 145);
    doc.text(`Fecha: ${citaBuscada.fechaCita}`, 30, 155);
    doc.text(`Hora: ${citaBuscada.horaCita}`, 30, 165);
    doc.text(`CDA: ${citaBuscada.cdaSeleccionado}`, 30, 175);
    
    // Detalles de la revisión (si existen)
    if (citaBuscada.revision) {
      doc.setFillColor(235, 235, 235); 
      doc.rect(20, 180, 180, 100, 'F'); 
      doc.text("Detalles de la Revisión:", 20, 190);
      
      // Sección de electricidad
      doc.text(`Luces delanteras: ${citaBuscada.revision.electricidad.luces}`, 30, 200);
      doc.text(`Luces traseras: ${citaBuscada.revision.electricidad.direccionales}`, 30, 210);
      
      // Sección de seguridad
      doc.text(`Frenos: ${citaBuscada.revision.seguridad.frenos}`, 30, 220);
      doc.text(`Neumáticos: ${citaBuscada.revision.seguridad.llantasRines}`, 30, 230);
      
      // Estado final
      doc.text(`Estado del motor: ${citaBuscada.revision.estadoFinal}`, 30, 240);
    }
    
    // Estado final de la revisión
    doc.setFillColor(235, 235, 235); 
    doc.rect(20, 250, 180, 30, 'F'); 
    doc.text("Estado de la Revisión:", 20, 260);
    doc.text(`${citaBuscada.estado || "Sin estado"}`, 30, 270);
    
    // Footer
    doc.setFontSize(10);
    doc.text("Generado por Sistema de Citas Técnicas", 20, 280);
    
    // Guardar el PDF
    doc.save(`${citaBuscada.codigoCita}_revision.pdf`);
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
       <div className="login-wrapper">
       <div className="login-container">
         <div className="left-side">
         <h1>Administrador: Luisa</h1>
         <p>Por favor ingrese la contraseña para continuar.</p>
            <img src="../img/logo.webp" alt="Logo" className="login-logo" />
            </div>
            <div className="right-side">
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