import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig'; // Assegura't que les rutes d'importació siguin correctes
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Importem useNavigate de react-router-dom
import FSection from '../FSection'; // Assegura't que aquesta ruta sigui correcta

export default function UserScreen() {
  const navigate = useNavigate(); // Hook de React Router per a la navegació
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Efecte per carregar les dades de l'usuari
  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        setEmail(auth.currentUser.email);
        try {
          const userDocRef = doc(db, 'usuaris', auth.currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUsername(userData.username || '');
            setPassword(userData.password || '');
          }
        } catch (error) {
          console.error('Error en obtenir les dades de l’usuari:', error);
        }
      }
    };
    fetchUserData();
  }, []);

  // Funció per guardar els canvis de l'usuari
  const handleSave = async () => {
    if (!username || !password) {
      alert('El nom d’usuari i la contrasenya no poden estar buits.');
      return;
    }
    try {
      const userDocRef = doc(db, 'usuaris', auth.currentUser.uid);
      await updateDoc(userDocRef, {
        username,
        password
      });
      alert('Les dades s’han desat correctament.');
    } catch (error) {
      console.error('Error en desar les dades:', error);
      alert('No s’han pogut desar les dades.');
    }
  };

  // Funció per tancar la sessió de l'usuari
  const handleLogout = async () => {
    if (isLoggingOut) return; // Si ja està en procés de tancar la sessió, no fem res
    setIsLoggingOut(true); // Marquem que estem en procés de logout

    try {
      await auth.signOut();
      navigate('/login'); // Redirigim a la pantalla de login després de tancar la sessió
    } catch (error) {
      console.error('Error en tancar la sessió:', error);
      alert('No s’ha pogut tancar la sessió.');
    } finally {
      setIsLoggingOut(false); // Restableixem l'estat de logout
    }
  };

  return (
    <div style={styles.userScreen}>
      {/* Header sempre visible */}
      <header style={styles.header}>
        <img src={require('../images/logo.jpg')} alt="Logo" style={styles.logo} />
      </header>

      {/* Contingut principal */}
      <main style={styles.settingsContainer}>
        <h2 style={styles.title}>Configuració d'usuari</h2>
        {/* Imatge d'usuari */}
        <div style={styles.imageRow}>
          <button style={styles.imageContainer}>👤</button>
          <button style={styles.changeText}>Canviar</button>
        </div>

        {/* Inputs */}
        <div style={styles.inputContainer}>
          <label>Nom d'usuari</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} style={styles.input} />
        </div>
        <div style={styles.inputContainer}>
          <label>Contrasenya</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
        </div>
        <div style={styles.inputContainer}>
          <label>Email</label>
          <input value={email} readOnly style={styles.input} />
        </div>

        {/* Botons */}
        <div style={styles.buttonContainer}>
          <button style={styles.saveButton} onClick={handleSave}> Desar canvis </button>
          <button style={styles.logoutButton} onClick={handleLogout}> Tancar sessió </button>
        </div>
      </main>

      {/* Footer sempre visible */}
      <footer style={styles.footer}>
        <FSection currentSection={3} onPress={(id) => navigate(id === 1 ? '/list' : id === 2 ? '/favourites' : '/user')} />
      </footer>
    </div>
  );
}

const styles = {
  userScreen: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    background: 'linear-gradient(135deg, #1db9d7, #f94892)',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    height: '80px',
    backgroundColor: '#8e44ad',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    height: '60px',
  },
  settingsContainer: {
    backgroundColor: '#f3f8fe',
    borderRadius: '12px',
    padding: '35px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
    width: '400px',
    textAlign: 'center',
    marginTop: '10px',
    marginBottom: '2px',
  },
  title: {
    fontSize: '24px',
    color: '#34495e',
    marginBottom: '20px',
  },
  imageRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
  },
  imageContainer: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    backgroundColor: '#e3e3e3',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '32px',
    color: '#555',
    border: '2px solid #ddd',
    marginRight: '10px',
    cursor: 'pointer',
  },
  changeText: {
    fontSize: '14px',
    color: '#007bff',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  inputContainer: {
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
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '20px',
  },
  saveButton: {
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#28a745',
    color: '#fff',
    transition: 'background-color 0.3s ease',
  },
  logoutButton: {
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#dc3545',
    color: '#fff',
    transition: 'background-color 0.3s ease',
  },
  footer: {
    padding: '1px',
    height: '90px',
    background: 'transparent',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
};
