import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebaseConfig';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import FSection from '../FSection';
import defaultImage from '../images/default_image.jpg';


export default function PantallaUsuari() {
  const navigate = useNavigate();
  const [nomUsuari, setNomUsuari] = useState('');
  const [contrasenya, setContrasenya] = useState('');
  const [correu, setCorreu] = useState('');
  const [imatgePerfil, setImatgePerfil] = useState(null);
  const [tancantSessio, setTancantSessio] = useState(false);

  useEffect(() => {
    const obtenirDadesUsuari = async () => {
      if (auth.currentUser) {
        setCorreu(auth.currentUser.email);
        try {
          const refUsuari = doc(db, 'usuaris', auth.currentUser.uid);
          const dadesUsuari = await getDoc(refUsuari);
          if (dadesUsuari.exists()) {
            const dades = dadesUsuari.data();
            setNomUsuari(dades.nomUsuari || '');
            setContrasenya(dades.contrasenya || '');
            setImatgePerfil(dades.imatgePerfil || null);
          }
        } catch (error) {
          console.error('Error en obtenir les dades de l\'usuari:', error);
        }
      }
    };
    obtenirDadesUsuari();
  }, []);

  const guardarCanvis = async () => {
    if (!nomUsuari || !contrasenya) {
      alert('El nom d\'usuari i la contrasenya no poden estar buits.');
      return;
    }
    try {
      const refUsuari = doc(db, 'usuaris', auth.currentUser.uid);
      await updateDoc(refUsuari, {
        nomUsuari,
        contrasenya,
        imatgePerfil: imatgePerfil || null,
      });
      alert('Els canvis s\'han guardat correctament.');
    } catch (error) {
      console.error('Error en guardar les dades:', error);
      alert('No s\'han pogut guardar les dades.');
    }
  };

  const gestionarCanviImatge = async (e) => {
    const fitxer = e.target.files[0];
    if (fitxer && auth.currentUser) {
      const userId = auth.currentUser.uid;
      const refStorage = ref(storage, `profilePictures/${userId}`);
      try {
        await uploadBytes(refStorage, fitxer);
        const url = await getDownloadURL(refStorage);
        setImatgePerfil(url);
        const refUsuari = doc(db, 'usuaris', userId);
        await updateDoc(refUsuari, { imatgePerfil: url });
        alert('La imatge de perfil s\'ha actualitzat correctament!');
      } catch (error) {
        console.error('Error en pujar la imatge:', error);
        alert('Error en pujar la imatge. Torna-ho a intentar.');
      }
    } else {
      alert('No s\'ha trobat l\'usuari. Si us plau, inicia sessió de nou.');
    }
  };

  const tancarSessio = async () => {
    if (tancantSessio) return;
    setTancantSessio(true);

    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error en tancar la sessió:', error);
      alert('No s\'ha pogut tancar la sessió.');
    } finally {
      setTancantSessio(false);
    }
  };

  return (
    <div style={estils.pantallaUsuari}>
      <header style={estils.capcalera}>
        <img src={require('../images/logo.jpg')} alt="Logo" style={estils.logo} />
      </header>

      <main style={estils.contenidorConfiguracio}>
        <h2 style={estils.titol}>Configuració d'Usuari</h2>
        <div style={estils.filaImatge}>
        <img
  src={imatgePerfil || defaultImage}
  alt="Perfil"
  style={estils.imatgePerfil}
/>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            id="inputImatgePerfil"
            onChange={gestionarCanviImatge}
          />
          <label htmlFor="inputImatgePerfil" style={estils.canviarText}>Canviar</label>
        </div>

        <div style={estils.contenidorInput}>
          <label>Nom d'Usuari</label>
          <input
            value={nomUsuari}
            onChange={(e) => setNomUsuari(e.target.value)}
            style={estils.input}
          />
        </div>
        <div style={estils.contenidorInput}>
          <label>Contrasenya</label>
          <input
            type="password"
            value={contrasenya}
            onChange={(e) => setContrasenya(e.target.value)}
            style={estils.input}
          />
        </div>
        <div style={estils.contenidorInput}>
          <label>Correu</label>
          <input value={correu} readOnly style={estils.input} />
        </div>

        <div style={estils.contenidorBotons}>
          <button style={estils.botoGuardar} onClick={guardarCanvis}>Guardar Canvis</button>
          <button style={estils.botoTancarSessio} onClick={tancarSessio}>Tancar Sessió</button>
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
  filaImatge: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
  },
  imatgePerfil: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #ddd',
    cursor: 'pointer',
  },
  canviarText: {
    fontSize: '14px',
    color: '#007bff',
    textDecoration: 'underline',
    cursor: 'pointer',
    marginLeft: '10px',
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
  contenidorBotons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '20px',
  },
  botoGuardar: {
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
  botoTancarSessio: {
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
