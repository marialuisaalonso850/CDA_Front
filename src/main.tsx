import React from 'react'
import ReactDOM from 'react-dom/client'
import './css/index.css'
import { BrowserRouter as Router } from 'react-router-dom';
import { BrowserRouter as Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/protectedRaute'
import { AuthProvider } from './Autenticacion/AutProvider'
import Home from './routes/Home'
import AgendarCita from './routes/agendarCita'
import Login from './routes/Login'
import Detalles from './routes/Detalles'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/citas" element={<AgendarCita />} />
        <Route path="/detalle" element={<Detalles />} />
        <Route path="/protected" element={<ProtectedRoute />}>
        </Route>
      </Routes>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
