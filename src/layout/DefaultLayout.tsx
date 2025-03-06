import { Link } from "react-router-dom";
import React, { useState } from "react";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/Home">Home</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
            <li
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
              style={{ position: "relative", cursor: "pointer" }}
            >
              <span>Servicios ▼</span>
              {isDropdownOpen && (
                <ul
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "0",
                    backgroundColor: "gray",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    padding: "10px",
                    listStyle: "none",
                    borderRadius: "5px",
                    
                  }}
                >
                  <li>
                    <Link to="/citas">Agendar Cita</Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link to="/dashboard">Login</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </>
  );
}
