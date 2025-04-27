// routes/videoProgressRoutes.js
const express = require('express');
const { saveVideoProgress, getVideoProgress } = require('../controllers/videoProgressController');
const router = express.Router();

router.post('/', saveVideoProgress);  // Route pour enregistrer ou mettre à jour la progression
router.get('/:videoId', getVideoProgress);  // Route pour obtenir la progression d'une vidéo par son ID

module.exports = router;
