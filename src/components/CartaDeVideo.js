import React from 'react';
import { FaHeart, FaHeartBroken } from 'react-icons/fa'; // Usamos react-icons para los iconos de corazón

// Crearem el component VideoCard per mostrar el vídeo
export default function CartaDeVideo({ videoUrl, title, description, createdAt, onToggleFavorite, isFavorite }) {
  // Identificarem si la URL és de YouTube (llarga o curta) o un Reel d'Instagram
  const isYouTubeLong = videoUrl.includes('youtube.com/watch'); // URL llarga de YouTube
  const isYouTubeShort = videoUrl.includes('youtu.be/'); // URL curta de YouTube
  const isInstagramReel = videoUrl.includes('instagram.com/reel'); // URL de Reel d'Instagram

  // Extraurem el videoId per a URL llarga de YouTube
  const videoIdLong = isYouTubeLong ? videoUrl.split('v=')[1] : null;

  // Extraurem el videoId per a URL curta de YouTube
  const videoIdShort = isYouTubeShort ? videoUrl.split('/').pop().split('?')[0] : null;

  // Assignarem la URL del Reel d'Instagram
  const instagramReelUrl = isInstagramReel ? videoUrl : null;

  return (
    <div style={{ margin: '10px', position: 'relative' }}>
      {/* Crearem el botó de favorits a la cantonada superior dreta */}
      <button
        onClick={onToggleFavorite}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 10,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {isFavorite ? (
          <FaHeart size={30} color="red" />
        ) : (
          <FaHeartBroken size={30} color="gray" />
        )}
      </button>

      {/* Mostrarem el títol i la descripció */}
      <h3>{title}</h3>
      <p>{description}</p>

      {/* Mostrarem la data de creació */}
      {createdAt && (
        <p style={{ fontSize: 14, color: '#000', marginTop: 5 }}>
          Data de creació: {new Date(createdAt).toLocaleDateString()}
        </p>
      )}

      {/* Incrustarem vídeos de YouTube (llargs o curts) */}
      {isYouTubeLong || isYouTubeShort ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoIdLong || videoIdShort}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ height: 200, marginTop: 10, width: '100%' }}
        />
      ) : isInstagramReel ? (
        // Incrustarem Reels d'Instagram
        <iframe
          src={instagramReelUrl}
          title="Instagram Reel"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ height: 580, marginTop: 10, width: '100%' }}
        />
      ) : (
        <p>El link no és compatible.</p>
      )}
    </div>
  );
}
