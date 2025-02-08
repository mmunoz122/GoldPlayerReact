import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig'; // Importamos Firestore
import { doc, setDoc } from 'firebase/firestore';
import { styles } from '../Styles';
import { useNavigate } from 'react-router-dom';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedButton, setSelectedButton] = useState('register');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setErrorMsg('Si us plau, introdueix un correu electrònic i una contrasenya.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Les contrasenyes no coincideixen.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar datos en Firestore
      await setDoc(doc(db, 'usuaris', user.uid), {
        uid: user.uid,
        email: user.email,
        password: password,
        createdAt: new Date()
      });
      
      navigate('/login');
    } catch (error) {
      setErrorMsg('Error en registrar-se. Comprova les teves dades.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
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
              navigate('/login');
            }}
          >
            Iniciar sessió
          </button>

          <button
            style={{
              ...styles.headerButton,
              ...(selectedButton === 'register' ? styles.headerButtonSelected : {}),
            }}
            onClick={() => setSelectedButton('register')}
          >
            Registrar-se
          </button>
        </div>

        <h2 style={styles.title}>Crea el teu compte</h2>
        
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

        <input
          type="password"
          style={styles.input}
          placeholder="Confirmar contrasenya"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleRegister} disabled={loading}>
          {loading ? 'Registrant...' : 'Registrar-se'}
        </button>
        
        <br />
        <p
          style={{ color: 'blue', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => navigate('/login')}
        >
          Ja tens compte? Inicia sessió
        </p>
      </div>
    </div>
  );
}
