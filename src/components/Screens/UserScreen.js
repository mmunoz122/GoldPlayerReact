import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import FSection from '../FSection';
 
export default function UserScreen() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState(null);
  const [userData, setUserData] = useState({
    uid: '',
    email: '',
    password: '******',
    createdAt: '',
  });

  useEffect(() => {
    if (auth.currentUser) {
      setUserData({
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        password: '******', // No se puede acceder a la contraseña del usuario desde Firebase
        createdAt: new Date(auth.currentUser.metadata.creationTime).toLocaleDateString(),
      });
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      setErrorMsg('Error en tancar sessió.');
    }
  };

  return (
    <div style={estils.pantallaUsuari}>
      <header style={estils.capcalera}>
        <img src={require('../images/logo.jpg')} alt="Logo" style={estils.logo} />
      </header>

      <main style={estils.contenidorConfiguracio}>
        <h2 style={estils.titol}>Configuració d'Usuari</h2>
        <div style={estils.contenidorInput}>
          <label>ID:</label>
          <input value={userData.uid} readOnly style={estils.input} />
        </div>

        <div style={estils.contenidorInput}>
          <label>Correu:</label>
          <input value={userData.email} readOnly style={estils.input} />
        </div>
        <div style={estils.contenidorInput}>
          <label>Contrasenya:</label>
          <input value={userData.password} readOnly style={estils.input} />
        </div>
        <div style={estils.contenidorInput}>
          <label>Creat:</label>
          <input value={userData.createdAt} readOnly style={estils.input} />
        </div>
        <div style={estils.botoContainer}>
          <button onClick={handleLogout} style={estils.botoTancarSessio}>Tancar Sessió</button>
        </div>
      </main>
      
      <footer style={estils.peuDePagina}>
        <FSection currentSection={3} onPress={(id) => navigate(id === 1 ? '/list' : id === 2 ? '/favourites' : '/user')} />
      </footer>
    </div>
  );
}

const estils = {
  pantallaUsuari: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    background: 'linear-gradient(135deg, #1db9d7, #f94892)',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
    position: 'relative',
  },
  capcalera: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '80px',
    backgroundColor: '#8e44ad',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  logo: {
    height: '60px',
  },
  contenidorConfiguracio: {
    position: 'fixed',
    top: '80px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#f3f8fe',
    borderRadius: '12px',
    padding: '35px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
    width: '400px',
    textAlign: 'center',
    marginTop: '10px',
  },
  titol: {
    fontSize: '24px',
    color: '#34495e',
    marginBottom: '20px',
  }, 
  contenidorInput: {
    marginBottom: '15px',
    textAlign: 'left',
  },
  input: {
    width: '100%',
    height: '40px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '0 10px',
    fontSize: '14px',
    color: '#333',
    backgroundColor: '#fff',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  botoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  }, 
  botoTancarSessio: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#e74c3c',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer', 
    textAlign: 'center',
  },
  peuDePagina: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '70px',
    backgroundColor: '#8e44ad',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
};
