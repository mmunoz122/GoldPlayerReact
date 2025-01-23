import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig'; 
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; 
import FSection from '../FSection'; 

export default function UserScreen() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  const handleLogout = async () => {
    if (isLoggingOut) return; 
    setIsLoggingOut(true); 

    try {
      await auth.signOut();
      navigate('/login'); 
    } catch (error) {
      console.error('Error en tancar la sessió:', error);
      alert('No s’ha pogut tancar la sessió.');
    } finally {
      setIsLoggingOut(false); 
    }
  };

  return (
    <div style={styles.userScreen}>
      {/* Header fixat */}
      <header style={styles.header}>
        <img src={require('../images/logo.jpg')} alt="Logo" style={styles.logo} />
      </header>

      {/* Contingut principal fixat */}
      <main style={styles.settingsContainer}>
        <h2 style={styles.title}>Configuració d'usuari</h2>
        <div style={styles.imageRow}>
          <button style={styles.imageContainer}>👤</button>
          <button style={styles.changeText}>Canviar</button>
        </div>

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

        <div style={styles.buttonContainer}>
          <button style={styles.saveButton} onClick={handleSave}> Desar canvis </button>
          <button style={styles.logoutButton} onClick={handleLogout}> Tancar sessió </button>
        </div>
      </main>

      {/* Footer fixat */}
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
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
    position: 'relative', // Ensures content stays fixed relative to the parent
  },
  header: {
    position: 'fixed', // Fix the header at the top
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
  settingsContainer: {
    position: 'fixed', // Make the settings container fixed
    top: '80px', // Start below the header
    left: 530,
    right: 0,
    backgroundColor: '#f3f8fe',
    borderRadius: '12px',
    padding: '35px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
    width: '400px',
    textAlign: 'center',
    top: '80px',
    marginTop: '10px',
    justifyContent: 'center',
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
    position: 'fixed', // Fix the footer at the bottom
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
