import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { doc, setDoc, updateDoc, arrayUnion, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function NewVideoScreen() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedList, setSelectedList] = useState('');
  const [newListName, setNewListName] = useState('');
  const [userLists, setUserLists] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentUser = auth.currentUser;
  const navigate = useNavigate(); // Hook de navegación

  useEffect(() => {
    const fetchUserLists = async () => {
      if (!currentUser) {
        alert("No hi ha un usuari autenticat.");
        return;
      }

      try {
        const listsCollectionRef = collection(db, 'videos', currentUser.uid, 'llistes');
        const listsSnapshot = await getDocs(listsCollectionRef);

        if (!listsSnapshot.empty) {
          const lists = listsSnapshot.docs.map(doc => doc.id);
          setUserLists(lists);
        } else {
          setUserLists([]);
        }
      } catch (error) {
        console.error('Error en obtenir les llistes: ', error);
        alert('Hi ha hagut un problema en carregar les llistes.');
      }
    };

    fetchUserLists();
  }, [currentUser]);

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      alert('Si us plau, introdueix un nom per a la llista.');
      return;
    }

    try {
      const listRef = doc(db, 'videos', currentUser.uid, 'llistes', newListName);
      await setDoc(listRef, { videos: [] });

      setUserLists(prevLists => [...prevLists, newListName]);
      setSelectedList(newListName);
      setNewListName('');

      alert('Llista creada correctament!');
    } catch (error) {
      console.error('Error en crear la llista: ', error);
      alert('Hi ha hagut un problema en crear la llista.');
    }
  };

  const handleSave = async () => {
    if (!url.trim() || !title.trim() || !description.trim() || !selectedList) {
      alert('Si us plau, completa tots els camps i selecciona una llista.');
      return;
    }

    setLoading(true);

    try {
      const video = {
        url,
        title,
        description,
        createdAt: new Date().toISOString(),
      };

      const listDocRef = doc(db, 'videos', currentUser.uid, 'llistes', selectedList);

      await updateDoc(listDocRef, {
        videos: arrayUnion(video),
      });

      alert('Vídeo guardat correctament!');
      navigate('/list');  // Navegar a ListScreen
    } catch (error) {
      console.error('Error en guardar el vídeo: ', error);
      alert('Hi ha hagut un problema en guardar el vídeo.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/list');  // Retroceder a ListScreen
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <button onClick={handleGoBack} style={styles.backButton}>← Retrocedir</button> 
        <h1 style={styles.title}>Guardar Vídeo</h1>
        
        <input
          type="text"
          placeholder="URL del vídeo"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Títol del vídeo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Descripció"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
        />
        <label style={{ color: 'black' }}>Selecciona una llista</label>
        {userLists.length > 0 ? (
          <select
            value={selectedList}
            onChange={(e) => setSelectedList(e.target.value)}
            style={styles.select}
          >
            {userLists.map((list, index) => (
              <option key={index} value={list}>
                {list}
              </option>
            ))}
          </select>
        ) : (
          <p>No tens cap llista creada.</p>
        )}

        <label style={{ color: 'black' }}>Crea una nova llista</label>
        <input
          type="text"
          placeholder="Nom de la nova llista"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleCreateList} style={styles.createListButton}>
          Crear nova llista
        </button>

        <button
          onClick={handleSave}
          style={styles.saveButton}
          disabled={loading}
        >
          {loading ? 'Guardant...' : 'Guardar Vídeo'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    position: 'fixed',  // Fixes the container to the screen
    top: 0,  // Aligns it to the top of the screen
    left: 0,  // Aligns it to the left of the screen
    width: '100%',  // Takes full width
    height: '100vh',  // Takes full height of the viewport
    padding: '0',  // Remove any padding to make it full screen
    backgroundImage: `url(${require('../images/fondo.jpg')})`,  // Fondo de la imagen
    backgroundSize: 'cover',  // Para que cubra toda el área
    backgroundPosition: 'center',  // Para centrar la imagen
    display: 'flex',
    justifyContent: 'center',  // Centers the content horizontally
    alignItems: 'center',  // Centers the content vertically
  },
  container: {
    padding: '50px',
    backgroundColor: '#d3d3d3',
    borderRadius: '8px',
    width: '80%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: 'black',
  },
  input: {
    display: 'block',
    marginBottom: '10px',
    padding: '8px',
    width: '100%',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  textarea: {
    display: 'block',
    marginBottom: '10px',
    padding: '8px',
    width: '100%',
    height: '100px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  select: {
    display: 'block',
    marginBottom: '10px',
    padding: '8px',
    width: '100%',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  createListButton: {
    padding: '10px',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginRight: '10px',
  },
  saveButton: {
    padding: '10px',
    backgroundColor: '#00796b',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  backButton: {
    padding: '10px',
    backgroundColor: '#FBC02D',  // Color de fons groc
    color: '#fff',  // Text negre
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginBottom: '20px',
  }
};
