import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const Video = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:8000/videos')
      .then(res => {
        setVideos(res.data);
      })
      .catch(err => {
        console.error("Erreur chargement vidéos :", err.message);
      });
  }, []);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      const percent = (video.currentTime / video.duration) * 100;
      setProgress(percent.toFixed(0));
    }
  };

  const handleEnded = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      alert("🎉 Toutes les vidéos sont terminées !");
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  // Détecte si c'est un lien YouTube
  const isYouTube = (url) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  // Transforme le lien en embed YouTube
  const getYouTubeEmbed = (url) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🎥 Vidéo {currentIndex + 1} / {videos.length}</h2>

      {videos.length > 0 && (
        <>
          {isYouTube(videos[currentIndex].url) ? (
            <iframe
              width="640"
              height="360"
              src={getYouTubeEmbed(videos[currentIndex].url)}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onEnded={handleEnded}
            />
          ) : (
            <video
              ref={videoRef}
              width="640"
              height="360"
              controls
              src={videos[currentIndex].url}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
            />
          )}

          <p>⏳ Progression : {progress}%</p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={handlePrevious} disabled={currentIndex === 0}>⬅️ Précédente</button>
            <button onClick={handleEnded} disabled={currentIndex >= videos.length - 1}>➡️ Suivante</button>
          </div>
        </>
      )}

      {videos.length === 0 && <p>Chargement des vidéos...</p>}
    </div>
  );
};

export default Video;
