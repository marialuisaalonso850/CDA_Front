import { useState, useEffect } from "react";
import DefaultLayout from "../layout/DefaultLayout";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import "../css/Contac.css";
import "../css/detalles.css";

const API_URL = "http://localhost:3000/api/citas";
const REVISION_API_URL = "http://localhost:3000/api/revisiones";
const PASSWORD = "admin123";

const Detalles = () => {
  const [codigoCita, setCodigoCita] = useState("");
  const [citaBuscada, setCitaBuscada] = useState<any>(null);
  const [citas, setCitas] = useState<any[]>([]);
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

      const revisionResponse = await fetch(`${REVISION_API_URL}/${data.codigoCita}`);
      const revisionData = await revisionResponse.json();

      if (revisionResponse.ok) {
        data.revision = revisionData;
      }

      setCitaBuscada(data);
      setError("");
    } catch (err: any) {
      setCitaBuscada(null);
      setError(err.message || "Cita no encontrada.");
    }
  };

  const generarPDF = () => {
    if (!citaBuscada) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Comprobante Revisión Técnico-Mecánica", 20, 20);

    doc.setFontSize(12);
    doc.text(`Nombre: ${citaBuscada.nombre}`, 20, 40);
    doc.text(`Correo: ${citaBuscada.correo}`, 20, 50);
    doc.text(`Teléfono: ${citaBuscada.telefono}`, 20, 60);
    doc.text(`Fecha: ${citaBuscada.fechaCita}`, 20, 70);
    doc.text(`Hora: ${citaBuscada.horaCita}`, 20, 80);
    doc.text(`Placa: ${citaBuscada.placa}`, 20, 90);
    doc.text(`CDA: ${citaBuscada.cdaSeleccionado}`, 20, 100);

    doc.text("Detalles de la Revisión:", 20, 110);
    doc.text(`Luces delanteras: ${citaBuscada.revision?.lucesDelanteras ? "Funcionan correctamente" : "No funcionan"}`, 20, 120);
    doc.text(`Luces traseras: ${citaBuscada.revision?.lucesTraseras ? "Funcionan correctamente" : "No funcionan"}`, 20, 130);
    doc.text(`Frenos: ${citaBuscada.revision?.frenos ? "En buen estado" : "No en buen estado"}`, 20, 140);
    doc.text(`Neumáticos: ${citaBuscada.revision?.neumaticos ? "Adecuados" : "No adecuados"}`, 20, 150);
    doc.text(`Estado del motor: ${citaBuscada.revision?.estadoMotor}`, 20, 160);

    doc.text("Estado de la Revisión:", 20, 170);
    doc.text(`${citaBuscada.estado || "Sin estado"}`, 20, 180);

    doc.save(`${citaBuscada.codigoCita}_revision.pdf`);
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
        const response = await fetch(`${API_URL}/${codigo}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Error al cancelar la cita");

        setCitas(prev => prev.filter(cita => cita.codigoCita !== codigo));
        Swal.fire("Cancelado", "La cita ha sido cancelada.", "success");

        if (citaBuscada?.codigoCita === codigo) {
          setCitaBuscada(null);
        }
      } catch {
        Swal.fire("Error", "No se pudo cancelar la cita.", "error");
      }
    }
  };

  const verComprobante = async (cita: any) => {
    if (cita.estado === "Tecnomecánica realizada" || cita.estado === "Aprobada" || cita.estado === "Rechazada") {
      const response = await fetch(`${REVISION_API_URL}/${cita.codigoCita}`);
      const revisionData = await response.json();
      cita.revision = revisionData;
      setCitaBuscada(cita);
    } else {
      Swal.fire("No disponible", "Solo puedes ver detalles de tecnomecánicas realizadas.", "info");
    }
  };

  const actualizarEstadoRevision = async (estado: string) => {
    if (!citaBuscada) return;

    const updatedCita = {
      ...citaBuscada,
      estado: estado
    };

    try {
      const response = await fetch(`${API_URL}/${citaBuscada.codigoCita}`, {
        method: "PUT",
        body: JSON.stringify(updatedCita),
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) throw new Error("Error al actualizar el estado de la revisión");

      setCitaBuscada(updatedCita);
      Swal.fire("Estado actualizado", `La revisión ha sido ${estado.toLowerCase()}.`, "success");
      obtenerCitas();
    } catch {
      Swal.fire("Error", "No se pudo actualizar el estado de la revisión.", "error");
    }
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


              <p><strong>Estado de la Revisión:</strong>
                <span style={{
                  color: citaBuscada.estado === "Aprobada" ? "green"
                    : citaBuscada.estado === "Rechazada" ? "red"
                    : "orange",
                  fontWeight: "bold",
                  marginLeft: "10px"
                }}>
                  {citaBuscada.estado || "Sin estado"}
                </span>
              </p>

              <button onClick={generarPDF} className="btn-pdf">Generar PDF</button>

              <div className="estado-revision">
                <button
                  onClick={() => actualizarEstadoRevision("Aprobada")}
                  className="btn-aprobar"
                  disabled={citaBuscada.estado === "Aprobada" || citaBuscada.estado === "Rechazada"}
                >
                  Aprobar
                </button>
                <button
                  onClick={() => actualizarEstadoRevision("Rechazada")}
                  className="btn-rechazar"
                  disabled={citaBuscada.estado === "Aprobada" || citaBuscada.estado === "Rechazada"}
                >
                  Rechazar
                </button>
              </div>
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
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {citas.map(cita => (
                  <tr key={cita.codigoCita}>
                    <td>{cita.codigoCita}</td>
                    <td>{cita.nombre}</td>
                    <td>{cita.correo}</td>
                    <td>{cita.telefono}</td>
                    <td>{cita.fechaCita}</td>
                    <td>{cita.horaCita}</td>
                    <td>{cita.placa}</td>
                    <td>{cita.cdaSeleccionado}</td>
                    <td>{cita.estado}</td>
                    <td>
                      <button
                        onClick={() => verComprobante(cita)}
                        style={{ color: cita.estado === "Tecnomecánica realizada" || cita.estado === "Aprobada" || cita.estado === "Rechazada" ? "blue" : "gray" }}
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => cancelarCita(cita.codigoCita)}
                        style={{ color: "red", marginLeft: "10px" }}
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
