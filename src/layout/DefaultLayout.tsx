import { Link } from "react-router-dom";
import React from "react";
import logo from "../assets/image.png"; 

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <>
     
      <header style={{ backgroundColor: "green", padding: "10px 20px" }}>
        <nav 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            backgroundColor: "green",  
            padding: "10px 20px" 
          }}
        >
        
          <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img 
              src={logo} 
              alt="CDA Logo" 
              style={{
                height: "50px",
                width: "auto",
                display: "block"
              }}
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
            Visualizar Citas
          </Link>
              
        </nav>
      </header>
      <main>{children}</main>
    </>
  );
}

