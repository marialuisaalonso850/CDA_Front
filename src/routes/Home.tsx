import { useNavigate } from 'react-router-dom';
import DefaultLayout from "../layout/DefaultLayout";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', margin: '0', padding: '0' }}>
        {/* Imagen */}
        <div style={{ width: '100%', height: '500px', overflow: 'hidden' }}>
          <img 
            src="https://www.gurugo.co/_next/image?url=https%3A%2F%2Fwww.paginasamarillas.com.co%2Fimagenes%2Fco%2Fimages%2Fad_id_23788%2Fimage_id_140859.jpeg&w=3840&q=60" 
            alt="Bienvenida" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Contenido */}
        <div style={{ flex: 1, textAlign: 'center', padding: '50px 20px', width: '100%' }}>
          <h1 style={{ fontSize: '48px', color: '#333' }}>Hola, Bienvenidos a CDA</h1>
          <p style={{ fontSize: '22px', color: '#555', marginBottom: '40px' }}>
            Estamos encantados de tenerte aquí. Agenda tu cita fácilmente con el botón de abajo.
          </p>
          
          {/* Botón Agendar Cita */}
          <button 
            onClick={() => navigate('/citas')} 
            style={{ 
              padding: '18px 36px', 
              backgroundColor: '#007BFF',
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontSize: '22px',
              transition: 'background 0.3s',
              width: '280px',
              marginBottom: '20px'
            }}
          >
            Agendar Cita
          </button>

          {/* Botón Pago Anticipado */}
          <button 
            onClick={() => navigate('/pago')} 
            style={{ 
              padding: '18px 36px', 
              backgroundColor: '#28a745',
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontSize: '22px',
              transition: 'background 0.3s',
              width: '280px'
            }}
          >
            Pago Anticipado
          </button>
        </div>

        {/* Footer */}
        <footer style={{ width: '100%', backgroundColor: 'green', color: 'white', textAlign: 'center', padding: '20px 0' }}>
          <p style={{ margin: '0', fontSize: '16px' }}>CDA-Armenia &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </DefaultLayout>
  );
};

export default Home;
