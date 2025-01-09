import React, { useState } from 'react';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { styles } from '../Styles';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedButton, setSelectedButton] = useState('login');
  
  const navigate = useNavigate(); // Usar el hook useNavigate para la navegación

  // Funció per manejar l'inici de sessió
  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Si us plau, introdueix un correu electrònic i una contrasenya.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/list'); // Redirigir a la pantalla de la lista
    } catch (error) {
      setErrorMsg('Error en iniciar sessió. Comprova les teves credencials.');
    } finally {
      setLoading(false);
    }
  };

  // Funció per manejar la recuperació de contrasenya
  const handleForgotPassword = () => {
    if (!email) {
      alert('Si us plau, introdueix el teu correu electrònic.');
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert('S\'ha enviat un codi de recuperació al teu correu electrònic.');
      })
      .catch(error => {
        alert('No es va poder enviar el correu de recuperació. Comprova el teu correu electrònic.');
      });
  };

  return (
    <div style={styles.container}>
      {/* Fondo amb imatge */}
      <img
        src={require('../images/fondo.jpg')}
        alt="Fondo"
        style={styles.backgroundImage}
      />
      
      <div style={styles.formContainer}>
        <img src={require('../images/logo.jpg')} style={styles.logo} alt="Logo" />

        <div style={styles.headerButtons}>
          <button
            style={{
              ...styles.headerButton,
              ...(selectedButton === 'login' ? styles.headerButtonSelected : {}),
            }}
            onClick={() => {
              setSelectedButton('login');
            }}
          >
            Iniciar sessió
          </button>

          <button
            style={{
              ...styles.headerButton,
              ...(selectedButton === 'register' ? styles.headerButtonSelected : {}),
            }}
            onClick={() => {
              setSelectedButton('register');
              navigate('/register'); // Usar navigate para redirigir a la pantalla de registro
            }}
          >
            Registrar-se
          </button>
        </div>

        <h2 style={styles.title}>Benvingut a Gold Player</h2>

        {errorMsg && <p style={styles.errorText}>{errorMsg}</p>}

        <input
          type="email"
          style={styles.input}
          placeholder="Correu electrònic"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          style={styles.input}
          placeholder="Contrasenya"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleLogin} disabled={loading}>
          {loading ? 'Entrant...' : 'Iniciar sessió'}
        </button>
        <br></br>
        <p style={styles.link} onClick={handleForgotPassword}>
          Has oblidat la contrasenya?
        </p>
      </div>
    </div>
  );
}
