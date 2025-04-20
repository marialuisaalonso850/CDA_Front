import { Link } from "react-router-dom";
import React, { useState } from "react";
import logo from "../assets/image.png";
import "../css/default.css"
interface DefaultLayoutProps {
  children: React.ReactNode;
  ingresoPermitido?: boolean;
}

export default function DefaultLayout({ children, ingresoPermitido }: DefaultLayoutProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <>
      <header className="header">
        <nav className="navbar">
          <Link to="/" className="logo">
            <img src={logo} alt="CDA Logo" />
          </Link>

          <button className="menu-toggle" onClick={() => setMenuAbierto(!menuAbierto)}>
            ☰
          </button>

          <div className={`nav-links ${menuAbierto ? "open" : ""}`}>
            <Link to="/detalle">Login Admin</Link>
            <Link to="/login">Login Mecánico</Link>
            {ingresoPermitido && <Link to="/crearUsuario">Crear Usuario</Link>}
          </div>
        </nav>
      </header>

      <main className="content">{children}</main>
    </>
  );
}