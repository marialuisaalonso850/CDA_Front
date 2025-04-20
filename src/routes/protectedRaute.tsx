import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../Autenticacion/AutProvider";

export default function ProtectedRoute() {
  const auth = useAuth();
  
  // Simplemente verifica el estado local sin llamadas asíncronas
  const isAuthenticated = auth.esAutentico; 
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}