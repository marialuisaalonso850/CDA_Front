import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ReactDOM from 'react-dom/client'
import './css/index.css'
import ProtectedRoute from './routes/protectedRaute'
import { AuthProvider } from './Autenticacion/AutProvider'
import Home from './routes/Home'
import AgendarCita from './routes/agendarCita'
import Login from './routes/Login'
import Detalles from './routes/Detalles'
import PagoAnticipado from './routes/pagoAnticipado';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/citas" element={<AgendarCita />} />
        <Route path="/detalle" element={<Detalles />} />
        <Route path="/pago" element={<PagoAnticipado />} />
        <Route path="/protected" element={<ProtectedRoute />} /> 
      </Routes>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
