import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { doc, getDoc, getDocs, collection, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import VideoCard from '../CartaDeVideo';
import FSection from '../FSection';

export default function ListScreen({ navigation }) {
  const [errorMsg, setErrorMsg] = useState(null);
  const [favoriteVideos, setFavoriteVideos] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        try {
          const userDocRef = doc(db, 'usuaris', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            // Solo cargamos los vídeos que están en la lista de favoritos
            setFavoriteVideos(userDocSnap.data().favorites || []);
          } else {
            setFavoriteVideos([]);
          }
        } catch (error) {
          console.error('Error al obtenir les dades:', error);
          setErrorMsg('Hi ha hagut un error en carregar els vídeos favorits.');
        }
      };

      fetchUserData();
    }
  }, [currentUser]);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
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

      <main
        style={{
          flex: 1,
          paddingTop: '120px',
          paddingBottom: '60px',
          padding: '580px',
          background: `url(${require('../images/fondo.jpg')}) no-repeat center center fixed`,
          backgroundSize: 'cover',
          overflowY: 'auto',
        }}
      >
        <h3 style={{ color: '#fff', width: '200%' }}>Vídeos favorits:</h3>

        {favoriteVideos.length > 0 ? (
          [...favoriteVideos].reverse().map((video, index) => (
            <div
              key={index}
              style={{
                margin: '10px',
                padding: '10px',
                backgroundColor: '#9b59b6',
                borderRadius: '10px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.25)',
              }}
            >
              <VideoCard
                videoUrl={video.url}
                title={video.title}
                description={video.description}
                createdAt={video.createdAt}
                onToggleFavorite={() => toggleFavorite(video)}
                isFavorite={true} // Sempre serà un favorit
              />
            </div>
          ))
        ) : (
          <p style={{ color: '#fff', textAlign: 'center', marginTop: '5px' }}>No tens vídeos favorits.</p>
        )}
      </main>

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
