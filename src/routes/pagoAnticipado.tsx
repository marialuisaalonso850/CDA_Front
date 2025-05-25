import { useState } from "react";
import { API_URL } from "../Autenticacion/constanst";
import "../css/PagoAnticipado.css";
import PortalLayout from "../layout/PagoDelayout";
import Swal from "sweetalert2";

const PagoAnticipado = () => {
  const [codigoCita, setCodigoCita] = useState("");
  const [placa, setPlaca] = useState("");
  const [citaValida, setCitaValida] = useState(false);

  const [antiguedad, setAntiguedad] = useState(null);
  const [valorAPagar, setValorAPagar] = useState<number | null>(null);

  const [tipoTarjeta, setTipoTarjeta] = useState("Visa");
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Verifica cita y placa
  const verificarCita = async () => {
    setMensaje("");
    setCitaValida(false);
    setAntiguedad(null);
    setValorAPagar(null);

    try {
      // Verificar la cita y placa
      const response = await fetch(`${API_URL}/citas/${codigoCita}`);
      const data = await response.json();

      if (!response.ok) {
        Swal.fire("Error", "Cita no encontrada.", "error");
        return;
      }
      
      if (data.estado === "Pagada") {
        Swal.fire("Advertencia", "Esta cita ya fue pagada.", "warning");
        return;
      }
      if (data.placa !== placa.toUpperCase()) {
        Swal.fire("Error", "La placa no coincide con la registrada en la cita.", "error");
        return;
      }

      // Si la cita y placa están bien, obtener info de pago (antigüedad y valor)
      const pagoResponse = await fetch(
        `${API_URL}/pago/infoPago/${codigoCita}`
      );
      const pagoData = await pagoResponse.json();

      if (!pagoResponse.ok) {
        Swal.fire("Error", "No se pudo obtener información de pago.", "error");
        return;
      }

      setAntiguedad(pagoData.antiguedad);
      setValorAPagar(pagoData.valorCalculado);
      setCitaValida(true);
      Swal.fire("Éxito", "Cita verificada. Puedes continuar con el pago.", "success");
    } catch (error) {
        Swal.fire("Error", "Error al verificar la cita.", "error");
    }
  };

  const manejarPago = async () => {
    setMensaje("");
    if (!/^\d{16}$/.test(numeroTarjeta)) {
        Swal.fire("Error", "Número de tarjeta inválido. Debe tener 16 dígitos.", "error");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/pago`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigoCita,
          tipoTarjeta,
          numeroTarjeta,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire(
            "Pago realizado",
            `Pago realizado con éxito. Valor pagado: $${data.pago.valorCalculado.toLocaleString()}`,
            "success"
          );
        // Limpiar formulario
        setCodigoCita("");
        setPlaca("");
        setTipoTarjeta("Visa");
        setNumeroTarjeta("");
        setCitaValida(false);
        setAntiguedad(null);
        setValorAPagar(null);
      } else {
        Swal.fire("Error", data.error || "Error al procesar el pago.", "error");
      }
    } catch (error) {
        Swal.fire("Error", "Error de red o del servidor.", "error");
    }
  };

  return (
     <PortalLayout>
    <div className="pago-container">
      <div className="pago-card">
        <h2>Pago Anticipado</h2>
  
        <label className="label">Código de Cita:</label>
        <input
          className="input"
          type="text"
          value={codigoCita}
          onChange={(e) => setCodigoCita(e.target.value)}
          placeholder="Ej: fda321-..."
        />
  
        <label className="label">Placa:</label>
        <input
          className="input"
          type="text"
          value={placa}
          onChange={(e) => setPlaca(e.target.value)}
          placeholder="Ej: ABC123"
        />
  
        <button className="button" onClick={verificarCita}>
          Verificar Cita
        </button>
  
        {citaValida && (
          <>
            <p className="infoText">
              <strong>Antigüedad del vehículo:</strong> {antiguedad} años
            </p>
            <p className="infoText">
              <strong>Valor a pagar:</strong>{" "}
              {valorAPagar?.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })}
            </p>
  
            <label className="label">Tipo de Tarjeta:</label>
            <select
              className="select"
              value={tipoTarjeta}
              onChange={(e) => setTipoTarjeta(e.target.value)}
            >
              <option value="Visa">Visa</option>
              <option value="Mastercard">Mastercard</option>
              <option value="American Express">American Express</option>
            </select>
  
            <label className="label">Número de Tarjeta:</label>
            <input
              className="input"
              type="text"
              value={numeroTarjeta}
              onChange={(e) => setNumeroTarjeta(e.target.value)}
              maxLength={16}
              placeholder="Ej: 4111111111111111"
            />
  
            <button className="button" onClick={manejarPago}>
              Pagar
            </button>
          </>
        )}
  
        <p className={`mensaje ${mensaje.includes("éxito") ? "mensajeExito" : "mensajeError"}`}>
          {mensaje}
        </p>
      </div>
  
      <div className="imagen-panel">
        <img src="/public/img/pagoanticipado.jpg" alt="Vehículo para revisión" />
      </div>
    </div>
    <footer>
        <p style={{ textAlign: 'center', padding: '30px', color: 'white', backgroundColor: 'green', fontSize: '14px', margin: '0' }}>
          CDA-Armenia &copy; {new Date().getFullYear()}
        </p>
      </footer>
      </PortalLayout>
  );
  
}
export default PagoAnticipado;
