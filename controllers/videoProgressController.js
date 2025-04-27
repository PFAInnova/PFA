// controllers/videoProgressController.js
const VideoProgress = require('../models/VideoProgress');

// Enregistrer ou mettre à jour la progression d'une vidéo
const saveVideoProgress = async (req, res) => {
  const { videoId, userId, seconds } = req.body;

  try {
    // Recherche si une progression existe déjà pour cette vidéo et cet utilisateur
    const existingProgress = await VideoProgress.findOne({ videoId, userId });

    if (existingProgress) {
      // Si la progression existe, on met à jour la progression et la date de mise à jour
      existingProgress.seconds = seconds;
      existingProgress.updatedAt = Date.now();
      await existingProgress.save();
      return res.status(200).json({ message: 'Progression mise à jour' });
    } else {
      // Si la progression n'existe pas, on crée un nouveau document
      const newProgress = new VideoProgress({ videoId, userId, seconds });
      await newProgress.save();
      return res.status(201).json({ message: 'Progression enregistrée' });
    }

  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la progression :', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};
const getVideoProgress = async (req, res) => {
  const { videoId } = req.params;
  const { userId } = req.query; // ← On récupère le userId dans la requête (via query params)

  try {
    const progress = await VideoProgress.findOne({ videoId, userId });

    if (progress) {
      return res.status(200).json(progress);
    } else {
      return res.status(404).json({ message: 'Aucune progression trouvée pour cette vidéo' });
    }

  } catch (error) {
    console.error('Erreur lors de la récupération de la progression :', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};


module.exports = { saveVideoProgress, getVideoProgress };
