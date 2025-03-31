import { Link } from "react-router-dom";
import React from "react";
import logo from "../assets/image.png"; 

interface DefaultLayoutProps {
  children: React.ReactNode;
  ingresoPermitido?: boolean;
}

export default function DefaultLayout({ children, ingresoPermitido }: DefaultLayoutProps) {
  return (
    <>
      <header style={{ backgroundColor: "green", padding: "10px 20px" }}>
        <nav style={{ display: "flex", alignItems: "center", padding: "10px 20px",backgroundColor: "green"}}>
          

          <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img 
              src={logo} 
              alt="CDA Logo" 
              style={{ height: "50px", width: "auto", display: "block" }}
            />
          </Link>

          <Link 
            to="/detalle" 
            style={{ 
              marginLeft: "20px", 
              textDecoration: "none", 
              fontSize: "18px", 
              fontWeight: "bold", 
              color: "white" 
            }}
          >
            Login Admin
          </Link>
          <Link 
                        to="/login" 
                        style={{ 
                          marginLeft: "20px", 
                          textDecoration: "none", 
                          fontSize: "18px", 
                          fontWeight: "bold", 
                          color: "white" 
                        }}
                      >
                        Login Mecanico
                      </Link>
         
          {ingresoPermitido && (
            <Link 
              to="/crearUsuario" 
              style={{ 
                marginLeft: "20px", 
                textDecoration: "none", 
                fontSize: "18px", 
                fontWeight: "bold", 
                color: "white" 
              }}
            >
              Crear Usuario
            </Link>
          )}
        </nav>
      </header>
      
      <main>{children}</main>
    </>
  );
}
