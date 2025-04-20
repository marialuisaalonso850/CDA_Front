import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/image.png"; 
import "../css/PortalLayout.css";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="header">
        <nav className="nav">
          <Link to="/" className="logo-link">
            <img src={logo} alt="CDA Logo" className="logo" />
          </Link>

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>

          <div className={`nav-links ${menuOpen ? "active" : ""}`}>
            <Link to="/detalle" className="nav-item">Detalle Citas</Link>
            <Link to="/" className="nav-item">Salir</Link>
          </div>
        </nav>
      </header>

      <main>{children}</main>
    </>
  );
}
