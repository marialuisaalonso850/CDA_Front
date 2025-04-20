import { useNavigate } from 'react-router-dom';
import DefaultLayout from "../layout/DefaultLayout";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Imagen */}
        <div style={{ width: '100%', height: '300px', overflow: 'hidden' }}>
          <img 
            src="https://www.gurugo.co/_next/image?url=https%3A%2F%2Fwww.paginasamarillas.com.co%2Fimagenes%2Fco%2Fimages%2Fad_id_23788%2Fimage_id_140859.jpeg&w=3840&q=60" 
            alt="Bienvenida" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Contenido */}
        <div style={{ flex: 1, textAlign: 'center', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '24px', color: '#333' }}>Hola, Bienvenidos a CDA</h1>
          <p style={{ fontSize: '16px', color: '#555', marginBottom: '20px' }}>
            Estamos encantados de tenerte aquí. Agenda tu cita fácilmente con el botón de abajo.
          </p>
          <button 
            onClick={() => navigate('/citas')} 
            style={{ 
              padding: '12px 24px', 
              backgroundColor: '#007BFF',
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              fontSize: '16px',
              transition: 'background 0.3s',
              width: '200px'
            }}
          >
            Agendar Cita
          </button>
        </div>

        {/* Footer */}
        <footer style={{ padding: '15px 0', backgroundColor: 'green', color: 'white', fontSize: '14px', textAlign: 'center' }}>
          <p style={{ margin: '0' }}>CDA-Armenia &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </DefaultLayout>
  );
};

export default Home;
