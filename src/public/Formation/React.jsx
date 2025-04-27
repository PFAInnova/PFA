import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import Nav from '../../components/public/landing/nav';

const ReactPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  const userId = localStorage.getItem('userId') || 'default-user-id';

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/courses/React');
        setCourses(response.data);
      } catch (err) {
        console.error('Erreur chargement :', err);
        setError('Erreur lors du chargement des vidéos React');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const saveProgress = () => {
    if (selectedVideo) {
      axios.post('http://localhost:8000/api/video-progress', {
        videoId: selectedVideo._id,
        userId,
        seconds: currentProgress,
      }).catch(err => console.error('Erreur de sauvegarde :', err));
    }
  };

  useEffect(() => {
    if (shouldPlay && selectedVideo) {
      intervalRef.current = setInterval(() => {
        saveProgress();
      }, 5000);
    }

    return () => clearInterval(intervalRef.current);
  }, [shouldPlay, selectedVideo, currentProgress]);

  const handleVideoClick = async (course) => {
    if (selectedVideo && selectedVideo._id === course._id) {
      return;
    }

    setSelectedVideo(course);
    setShouldPlay(false);
    setCurrentProgress(0);

    try {
      const res = await axios.get(`http://localhost:8000/api/video-progress/${course._id}?userId=${userId}`);
      const seconds = res.data?.seconds || 0;
      setCurrentProgress(seconds);
      setShouldPlay(true);
    } catch (err) {
      console.warn('Aucune progression enregistrée pour cette vidéo');
      setCurrentProgress(0);
      setShouldPlay(true);
    }
  };

  const handlePlayerReady = () => {
    if (playerRef.current && currentProgress > 0) {
      playerRef.current.seekTo(currentProgress, 'seconds');
    }
  };

  const handleVideoProgress = (progress) => {
    setCurrentProgress(progress.playedSeconds);
  };

  const handleVideoPause = () => {
    saveProgress();
    clearInterval(intervalRef.current);
  };

  const handleVideoEnd = () => {
    saveProgress();
    clearInterval(intervalRef.current);
    setShouldPlay(false);
  };

  if (loading) return <div>Chargement des vidéos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-200">
      <Nav />
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-5xl font-bold text-indigo-600 mb-12 text-center">Bienvenue dans les Cours React !</h1>
        <p className="text-xl text-gray-700 text-center mb-8">Maîtrisez les bases et les concepts avancés de React, du JSX à la gestion d'état, pour créer des applications interactives et dynamiques.</p>

        {selectedVideo && (
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-indigo-700 mb-4 text-center">{selectedVideo.title}</h2>
            <div className="flex justify-center mb-6">
              <ReactPlayer
                ref={playerRef}
                url={selectedVideo.videoUrl}
                controls
                width="80%"
                height="500px"
                playing={shouldPlay}
                onReady={handlePlayerReady}
                onProgress={handleVideoProgress}
                onPause={handleVideoPause}
                onEnded={handleVideoEnd}
                muted={false}
              />
            </div>
            <div className="text-center text-indigo-600 text-lg">
              Progression : {Math.round(currentProgress)} secondes
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              onClick={() => handleVideoClick(course)}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer transform hover:scale-105"
            >
              <h2 className="text-2xl font-semibold text-indigo-700 mb-4">{course.title}</h2>
              <p className="text-gray-600 mb-4">
                {course.description || "Dans ce cours, vous apprendrez à utiliser React pour créer des interfaces utilisateur interactives, comprendre la gestion des composants, et maîtriser les concepts comme le JSX, les hooks, et le routage."}
              </p>
              <div className="flex justify-center mb-4">
                <ReactPlayer
                  url={course.videoUrl}
                  width="100%"
                  height="200px"
                  light={true}
                  playing={false}
                />
              </div>
              <p className="text-indigo-500 text-sm text-center">Cliquez pour commencer à explorer le cours</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReactPage;
