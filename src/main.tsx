import React from 'react'
import ReactDOM from 'react-dom/client'
import './css/index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProtectedRoute from './routes/protectedRaute'
import { AuthProvider } from './Autenticacion/AutProvider'
import Home from './routes/Home'
import AgendarCita from './routes/agendarCita'
import Login from './routes/Login'
import Detalles from './routes/Detalles'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/> // Ruta pública para la página de inicio
  },
  {
    path: "/login",
    element: <Login/> // Ruta pública para login
  },
  {
    path: "/citas",
    element: <AgendarCita/> // Ruta para agendar citas
  },
  {
    path: "/detalle",
    element: <Detalles/> // Ruta para ver detalles
  },
  {
    path: "/protected", // Ruta protegida, para evitar conflicto con la raíz
    element: <ProtectedRoute/>,
    children:[
      // Aquí puedes agregar más rutas protegidas
    ]
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </React.StrictMode>,
)
