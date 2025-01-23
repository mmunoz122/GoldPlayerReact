import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { doc, getDoc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import VideoCard from '../CartaDeVideo';
import FSection from '../FSection';
import logo from '../images/logo.jpg';
import fondo from '../images/fondo.jpg';

export default function FavouritesScreen({ navigation }) {
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
        <img src={logo} alt="Logo" style={{ width: '90px', height: '90px', objectFit: 'contain' }} />
      </header>

      <main
        style={{
          flex: 1,
          paddingTop: '120px',
          paddingBottom: '80px',
          background: `url(${fondo}) no-repeat center center fixed`,
          backgroundSize: 'cover',
          overflowY: 'auto',
        }}
      >
        <h3 style={{ color: '#fff', textAlign: 'center' }}>Vídeos favorits:</h3>

        {errorMsg && (
          <div style={{ color: '#f00', textAlign: 'center', marginBottom: '20px' }}>
            {errorMsg}
          </div>
        )}

        {favoriteVideos.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
              padding: '0 20px',
            }}
          >
            {[...favoriteVideos].reverse().map((video, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#9b59b6',
                  borderRadius: '10px',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.25)',
                  padding: '10px',
                  width: '300px',
                }}
              >
                <VideoCard
                  videoUrl={video.url}
                  title={video.title}
                  description={video.description}
                  createdAt={video.createdAt}
                  onToggleFavorite={() => toggleFavorite(video)}
                  isFavorite={true}
                />
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#fff', textAlign: 'center', marginTop: '5px' }}>No tens vídeos favorits.</p>
        )}
      </main>

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
