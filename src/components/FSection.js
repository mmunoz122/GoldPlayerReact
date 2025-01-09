import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Importem useNavigate i useLocation

// Crearem el component FSection per gestionar seccions amb botons
export default function FSection({ currentSection, onPress }) {

  const navigate = useNavigate(); // Inicialitzem el hook de navegació
  const location = useLocation(); // Obtenim la ruta actual

  // Bloquejar el desplaçament només si estem a '/list'
  useEffect(() => {
    if (location.pathname === '/list') {
      document.body.style.overflow = 'hidden'; // Bloqueja el desplaçament a '/list'
    } else {
      document.body.style.overflow = 'auto'; // Permet el desplaçament a altres pàgines
    }
    return () => {
      document.body.style.overflow = 'auto'; // Permet el desplaçament quan el component es desmunta
    };
  }, [location.pathname]);

  // Funció per obtenir el color de fons del botó basat en la secció actual
  const getButtonBackgroundColor = (section) => {
    if (currentSection === section) {
      switch (section) {
        case 1:
          return '#27ae60'; // Color per la secció 1
        case 2:
          return '#2980b9'; // Color per la secció 2
        case 3:
          return '#8e44ad'; // Color per la secció 3
        default:
          return '#bdc3c7'; // Color per defecte
      }
    }
    return '#bdc3c7'; // Si no és la secció actual, color gris
  };

  // Funció per redirigir a una pàgina específica amb transició
  const handleNavigation = (section) => {
    if (location.pathname === '/list' && section === 1) {
      // Si estem a '/list' i clicquem al botó de la secció 1, redirigim a '/new-video' amb transició
      navigate('/new-video', { state: { from: '/list' } }); // Afegim un estat per indicar la transició
    } else {
      // Altres redireccions basades en la secció
      switch (section) {
        case 1:
          navigate('/list');
          break;
        case 2:
          navigate('/favourites');
          break;
        case 3:
          navigate('/user');
          break;
        default:
          navigate('/');
          break;
      }
    }
  };

  return (
    <div style={styles.gradientBackground}>
      {/* Organitzem els botons en una fila */}
      <div style={styles.buttonRow}>
        <div>
          {/* Botó per la secció 2 */}
          <button
            style={styles.button}
            onClick={() => handleNavigation(2)} // Usam la funció handleNavigation
          >
            ❤️
          </button>
        </div>

        <div>
          {/* Botó per la secció 1 */}
          <button
            style={styles.button}
            onClick={() => handleNavigation(1)} // Usam la funció handleNavigation
          >
            ➕
          </button>
        </div>

        <div>
          {/* Botó per la secció 3 */}
          <button
            style={styles.button}
            onClick={() => handleNavigation(3)} // Usam la funció handleNavigation
          >
            👤
          </button>
        </div>
      </div>
    </div>
  );
}

// Estils per al component
const styles = {
  gradientBackground: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '18px',
    background: 'linear-gradient(to right, #3498db, #2ecc71, #9b59b6)', // Gradient adaptat per CSS
    width: '205vh',
    height: '5vh', // Assegurem que el contenidor ocupi tota la alçada de la pantalla
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: '100%', // Els botons es poden ajustar a la alçada del contenidor
  },

  button: {
    padding: '10px 20px', // Augmentem la mida del botó per fer-lo més gran
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '47px', // Augmentem la mida de la font per fer-ho més visible
    color: 'white',
    backgroundColor: 'transparent',
    width: '70px', // Assegurem que l'amplada dels botons no sigui massa gran
    height: '45px', // Assegurem que els botons siguin quadrats
  },
};
