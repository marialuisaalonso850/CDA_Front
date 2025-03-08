import React from 'react'
import ReactDOM from 'react-dom/client'
import './css/index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProtectedRoute from './routes/protectedRaute'
import { AuthProvider } from './Autenticacion/AutProvider'
import Home from './routes/Home'
import AgendarCita from './routes/agendarCita'
import Login from './routes/Login'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/citas",
    element: <AgendarCita/>
  },
  {
    path: "/",
    element: <ProtectedRoute/>,
    children:[
      {
        path: "/",
        element: <Home/>
      }
      
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


