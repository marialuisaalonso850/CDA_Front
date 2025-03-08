import React from "react";
import { Link } from "react-router-dom";

import logo from "../assets/image.png"; 
export default function PortalLayout({children}: {children:React.ReactNode}){


    return (
      <>
        <header>
          <nav style={{ display: "flex", alignItems: "center", padding: "10px", backgroundColor: "green" }}>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
              <img
                src={logo}
                alt="CDA Logo"
                style={{
                  height: "50px",
                  width: "auto",
                  display: "block"
                }}
              />
              <span style={{ color: "white", fontSize: "16px", fontWeight: "bold" }}>Salir</span>
            </Link>
          </nav>
        </header>
    
        <main>{children}</main>
      </>
    );
}