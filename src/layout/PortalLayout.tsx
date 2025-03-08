import React from "react";
import { useAuth } from "../Autenticacion/AutProvider";
import { Link } from "react-router-dom";
import { API_URL } from "../Autenticacion/constanst";
import logo from "../assets/image.png"; 
export default function PortalLayout({children}: {children:React.ReactNode}){
 const auth = useAuth();

    async function handleSignOut(e:React.MouseEvent<HTMLAnchorElement>){
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/signout`,{
                method: "DELETE",
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.getRefreshToken()}`
                }
            })

            if(response.ok){
                auth.signOut();
            }
        } catch (error) {     
      }
    }

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