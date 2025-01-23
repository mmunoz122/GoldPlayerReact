import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { doc, getDoc, getDocs, collection, setDoc, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';
import VideoCard from '../CartaDeVideo'; // Import the VideoCard component
import FSection from '../FSection'; // Import the footer section component

export default function ListScreen({ navigation }) {
  const [errorMsg, setErrorMsg] = useState(null);
  const [userVideos, setUserVideos] = useState([]);
  const [userllistes, setUserllistes] = useState([]);
  const [selectedLists, setSelectedLists] = useState([]); // Track multiple selected lists
  const [selectedVideos, setSelectedVideos] = useState([]); // Track selected videos for deletion
  const [favoriteVideos, setFavoriteVideos] = useState([]);
  const [videoSelection, setVideoSelection] = useState({}); // State to track individual video selections
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
      } else {
        setUserVideos([]);
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
    setVideoSelection(prevState => ({
      ...prevState,
      [video.url]: !prevState[video.url], // Toggle the selection for the specific video
    }));
  };

  const handleSelectAllVideos = () => {
    if (Object.keys(videoSelection).length === userVideos.length) {
      setVideoSelection({}); // Deselect all videos
    } else {
      const allVideosSelected = {};
      userVideos.forEach(video => {
        allVideosSelected[video.url] = true; // Select all videos
      });
      setVideoSelection(allVideosSelected);
    }
  };

  const deleteSelectedVideos = async () => {
    const selectedVideos = userVideos.filter(video => videoSelection[video.url]);
    if (selectedVideos.length > 0) {
      const confirmDelete = window.confirm("Confirmes que vols suprimir els vídeos seleccionats?");
      if (confirmDelete) {
        try {
          // Recorremos todas las listas seleccionadas
          for (const list of selectedLists) {
            const listDocRef = doc(db, 'usuaris', currentUser.uid, 'llistes', list);

            // Obtenemos los documentos de la lista
            const listDocSnap = await getDoc(listDocRef);

            if (listDocSnap.exists()) {
              const listData = listDocSnap.data();
              const videosInList = listData.videos || [];

              // Filtramos los videos seleccionados para eliminar
              const videosToDelete = selectedVideos.filter(video => 
                videosInList.some(v => v.url === video.url)
              );

              if (videosToDelete.length > 0) {
                // Actualizamos la lista eliminando los videos seleccionados
                await setDoc(listDocRef, { 
                  videos: arrayRemove(...videosToDelete) 
                }, { merge: true });
// También eliminamos los videos de los favoritos
const favoritesDocRef = doc(db, 'usuaris', currentUser.uid);
const favoritesDocSnap = await getDoc(favoritesDocRef);

if (favoritesDocSnap.exists()) {
  const favoritesData = favoritesDocSnap.data();
  const favoritesList = favoritesData.favorites || [];

  // Filtramos los videos seleccionados para eliminar de los favoritos
  const videosToDeleteFromFavorites = selectedVideos.filter(video =>
    favoritesList.some(fav => fav.url === video.url)
  );

  if (videosToDeleteFromFavorites.length > 0) {
    // Eliminamos los videos de los favoritos
    await setDoc(favoritesDocRef, { 
      favorites: arrayRemove(...videosToDeleteFromFavorites) 
    }, { merge: true });
  }
}

                // Eliminamos los videos también de la colección del usuario
                const userDocRef = doc(db, 'usuaris', currentUser.uid);
                await setDoc(userDocRef, { 
                  videos: arrayRemove(...videosToDelete) 
                }, { merge: true });

                // Actualizamos el estado local
                setUserVideos(prevVideos => prevVideos.filter(v => !videosToDelete.some(vd => vd.url === v.url)));
              }
            }
          }

          // Limpiar selección
          setVideoSelection({});
        } catch (error) {
          console.error('Error al eliminar els vídeos:', error);
          setErrorMsg('Hi ha hagut un error en eliminar els vídeos.');
        }
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
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
        <h3 style={{ color: '#fff', width: '100%', marginTop: '100px' }}>Vídeos que hi ha a la base de dades:</h3>

        {/* Mostrar vídeos solo si al menos una lista está seleccionada */}
        {selectedLists.length > 0 && userVideos.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)', // Esto asegura 3 items por fila
              gap: '10px',
              padding: '30px',
              marginRight: 'calc(155px + 20px)', 
              marginBottom: '10px',
            }}
          >
            {[...userVideos].reverse().map((video, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#9b59b6',
                  borderRadius: '10px',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.25)',
                  padding: '15px',
                  width: '80%',
                  marginBottom: '10px',
                }}
              >
                <input
                  type="checkbox"
                  checked={videoSelection[video.url] || false}
                  onChange={() => handleVideoCheckboxChange(video)}
                  style={{ marginBottom: '10px' }}
                />
                <h4 style={{ color: 'black', marginBottom: '10px' }}>{video.title || 'Sense nom'}</h4>
                <VideoCard
                  videoUrl={video.url}
                  description={video.description}
                  createdAt={video.createdAt}
                  onToggleFavorite={() => toggleFavorite(video)}
                  isFavorite={favoriteVideos.some(fav => fav.url === video.url)}
                />
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#fff', textAlign: 'center', marginTop: '5px' }}>
            No hi ha vídeos disponibles o no has seleccionat cap llista.
          </p>
        )}
      </main>

      {/* Sidebar con las listas */}
      <div
        style={{
          position: 'fixed',
          top: '120px',
          right: '0',
          width: '250px',
          height: 'calc(100vh - 120px)',
          backgroundColor: '#9b59b6',
          padding: '20px',
          boxShadow: '-4px 0px 8px rgba(0, 0, 0, 0.25)',
          overflowY: 'auto',
          zIndex: 1000,
        }}
      >
        <h4 style={{ color: '#fff' }}>Selecció Múltiple De Videos:</h4>
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

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={deleteSelectedVideos}
            style={{
              padding: '10px 15px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '10px',
              width: '100%',
            }}
          >
            Suprimeix els vídeos seleccionats
          </button>
          <button
            onClick={handleSelectAllVideos}
            style={{
              padding: '10px 15px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              width: '100%',
            }}
          >
            {Object.keys(videoSelection).length === userVideos.length ? 'Desseleccioneu-ho tot' : 'Seleccioneu Tot'}
          </button>
        </div>
      </div>

      {/* Header */}
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

      {/* Footer */}
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
