import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { doc, getDoc, getDocs, collection, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import VideoCard from '../CartaDeVideo'; // Import the VideoCard component
import FSection from '../FSection'; // Import the footer section component

export default function ListScreen({ navigation }) {
  const [errorMsg, setErrorMsg] = useState(null);
  const [userVideos, setUserVideos] = useState([]);
  const [userllistes, setUserllistes] = useState([]);
  const [selectedLists, setSelectedLists] = useState([]); // Track multiple selected lists
  const [selectedVideos, setSelectedVideos] = useState([]); // Track selected videos for deletion
  const [favoriteVideos, setFavoriteVideos] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        try {
          const llistesCollectionRef = collection(db, 'usuaris', currentUser.uid, 'llistes');
          const llistesSnapshot = await getDocs(llistesCollectionRef);

          if (!llistesSnapshot.empty) {
            const llistes = llistesSnapshot.docs.map(doc => doc.id);
            setUserllistes(llistes);
          } else {
            setUserllistes([]);
          }

          const userDocRef = doc(db, 'usuaris', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserVideos(userDocSnap.data().videos || []);
            setFavoriteVideos(userDocSnap.data().favorites || []);
          } else {
            setUserVideos([]);
            setFavoriteVideos([]);
          }
        } catch (error) {
          console.error('Error al obtenir les dades:', error);
          setErrorMsg('Hi ha hagut un error en carregar els vídeos i llistes.');
        }
      };

      fetchUserData();
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchVideosFromList = async () => {
      if (selectedLists.length > 0) {
        try {
          const combinedVideos = [];
          for (const list of selectedLists) {
            const listDocRef = doc(db, 'usuaris', currentUser.uid, 'llistes', list);
            const listDocSnap = await getDoc(listDocRef);

            if (listDocSnap.exists()) {
              const videos = listDocSnap.data().videos || [];
              combinedVideos.push(...videos);
            }
          }
          setUserVideos(combinedVideos);
        } catch (error) {
          console.error('Error al obtenir els vídeos de les llistes:', error);
          setErrorMsg('Hi ha hagut un error en carregar els vídeos de les llistes.');
        }
      }
    };

    fetchVideosFromList();
  }, [selectedLists, currentUser]);

  const toggleFavorite = async (video) => {
    const userDocRef = doc(db, 'usuaris', currentUser.uid);
    const isFavorite = favoriteVideos.some(fav => fav.url === video.url);

    try {
      if (isFavorite) {
        await setDoc(userDocRef, { favorites: arrayRemove(video) }, { merge: true });
        setFavoriteVideos(prevState => prevState.filter(fav => fav.url !== video.url));
      } else {
        await setDoc(userDocRef, { favorites: arrayUnion(video) }, { merge: true });
        setFavoriteVideos(prevState => [...prevState, video]);
      }
    } catch (error) {
      console.error('Error en marcar vídeo com a favorit:', error);
      setErrorMsg('Hi ha hagut un error en guardar el vídeo com a favorit.');
    }
  };

  const handlePress = (id) => {
    if (id === 1) navigation.navigate("NewVideoScreen");
    else if (id === 2) navigation.navigate("FavouritesScreen");
    else if (id === 3) navigation.navigate("UserScreen");
  };

  const handleCheckboxChange = (list) => {
    setSelectedLists(prevState => {
      if (prevState.includes(list)) {
        return prevState.filter(item => item !== list); // Deselect the list
      } else {
        return [...prevState, list]; // Select the list
      }
    });
  };

  const handleVideoCheckboxChange = (video) => {
    setSelectedVideos(prevState => {
      if (prevState.includes(video)) {
        return prevState.filter(item => item.url !== video.url); // Deselect video
      } else {
        return [...prevState, video]; // Select video
      }
    });
  };

  const handleSelectAllVideos = () => {
    if (selectedVideos.length === userVideos.length) {
      // Deselect all if all are selected
      setSelectedVideos([]);
    } else {
      // Select all videos
      setSelectedVideos(userVideos);
    }
  };

  const deleteSelectedVideos = async () => {
    if (selectedVideos.length > 0) {
      const confirmDelete = window.confirm("Confirmes que vols suprimir els vídeos seleccionats?");
      if (confirmDelete) {
        try {
          const userDocRef = doc(db, 'usuaris', currentUser.uid);
          selectedVideos.forEach(async (video) => {
            // Delete video from user data
            await setDoc(userDocRef, { videos: arrayRemove(video) }, { merge: true });
            setUserVideos(prevVideos => prevVideos.filter(v => v.url !== video.url));
          });
          setSelectedVideos([]); // Clear selected videos
        } catch (error) {
          console.error('Error al eliminar els vídeos:', error);
          setErrorMsg('Hi ha hagut un error en eliminar els vídeos.');
        }
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
      {/* Contenedor del contenido principal */}
      <main
        style={{
          flex: 1,
          paddingTop: '120px',
          paddingBottom: '120px',
          padding: '30px',
          background: `url(${require('../images/fondo.jpg')}) no-repeat center center fixed`,
          backgroundSize: 'cover',
          overflowY: 'auto',
        }}
      >
        <h3 style={{ color: '#fff', width: '100%', marginTop: '100px' }}>Selecciona les llistes per veure els vídeos:</h3>
        <button
          onClick={deleteSelectedVideos}
          style={{
            marginBottom: '20px',
            padding: '10px 20px',
            backgroundColor: '#ff6f61',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Delete Selected Videos
        </button>
        <label style={{ color: '#fff', fontSize: '16px' }}>
          <input
            type="checkbox"
            checked={selectedVideos.length === userVideos.length}
            onChange={handleSelectAllVideos}
            style={{ marginRight: '10px' }}
          />
          Select All
        </label>
        {userVideos.length > 0 ? (
          [...userVideos].reverse().map((video, index) => (
            <div
              key={index}
              style={{
                margin: '10px',
                padding: '10px',
                backgroundColor: '#9b59b6',
                borderRadius: '10px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.25)',
                marginBottom: '15px',
                width: 'calc(33% - 20px)', // Smaller size
                float: 'left',
              }}
            >
              <input
                type="checkbox"
                checked={selectedVideos.includes(video)}
                onChange={() => handleVideoCheckboxChange(video)}
                style={{ marginBottom: '10px' }}
              />
              <VideoCard
                videoUrl={video.url}
                description={video.description}
                createdAt={video.createdAt}
                onToggleFavorite={() => toggleFavorite(video)}
                isFavorite={favoriteVideos.some(fav => fav.url === video.url)}
              />
            </div>
          ))
        ) : (
          <p style={{ color: '#fff', textAlign: 'center', marginTop: '5px' }}>No hi ha vídeos disponibles.</p>
        )}
      </main>

      {/* Panel flotante a la derecha */}
      <div
        style={{
          position: 'fixed',
          top: '120px', // Espacio para ajustar con el header
          right: '0',
          width: '250px',
          height: 'calc(100vh - 120px)', // Rellenar el espacio debajo del header
          backgroundColor: '#9b59b6',
          padding: '20px',
          boxShadow: '-4px 0px 8px rgba(0, 0, 0, 0.25)',
          overflowY: 'auto',
          zIndex: 1000,
        }}
      >
        <h4 style={{ color: '#fff' }}>Selecció Múltiple De Videos Per Eliminar:</h4>
        {userllistes.length > 0 ? (
          <div>
            {userllistes.map((list, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <label style={{ color: '#fff', fontSize: '16px' }}>
                  <input
                    type="checkbox"
                    checked={selectedLists.includes(list)}
                    onChange={() => handleCheckboxChange(list)}
                    style={{ marginRight: '10px' }}
                  />
                  {list}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#fff' }}>No tens llistes creades.</p>
        )}
      </div>

      {/* Header fix */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100px',
          padding: '10px',
          background: 'linear-gradient(#8e44ad, #9b59b6, #663399)',
          textAlign: 'center',
          zIndex: 1000,
        }}
      >
        <img src={require('../images/logo.jpg')} alt="Logo" style={{ width: '90px', height: '90px', objectFit: 'contain' }} />
      </header>

      {/* Footer fix */}
      <footer
        style={{
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
        }}
      >
        <FSection handlePress={handlePress} />
      </footer>
    </div>
  );
}
