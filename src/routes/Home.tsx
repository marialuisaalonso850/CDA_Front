import React from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from "../layout/DefaultLayout";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <div style={{ width: '100%' }}>
        <img 
          src="https://www.gurugo.co/_next/image?url=https%3A%2F%2Fwww.paginasamarillas.com.co%2Fimagenes%2Fco%2Fimages%2Fad_id_23788%2Fimage_id_140859.jpeg&w=3840&q=60" 
          alt="Bienvenida" 
          style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block' }}
        />
      </div>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1 style={{ fontSize: '24px', color: '#333' }}>Hola, Bienvenidos a la página de Inicio</h1>
        <p style={{ fontSize: '16px', color: '#555', marginBottom: '20px' }}>
          Estamos encantados de tenerte aquí. Agenda tu cita fácilmente con el botón de abajo.
        </p>
        <button 
          onClick={() => navigate('/citas')} 
          style={{ 
            padding: '12px 24px', 
            backgroundColor: 'green', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer', 
            fontSize: '16px',
            transition: 'background 0.3s',
            width:'200px'
            
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#007BFF'}
        >
          Agendar Cita
        </button>
      </div>
    </DefaultLayout>
  );
};

export default Home;