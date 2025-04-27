const express = require('express');
const router = express.Router();
const multer = require('multer');
const Course = require('../models/cours');
const { uploadCourseVideo } = require('../controllers/courseController');

// 📁 Configuration du stockage Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// ✅ Route d'upload de vidéo
router.post('/upload', upload.single('file'), uploadCourseVideo);

// ✅ Route pour récupérer les cours par catégorie (React, Angular, etc.)
router.get('/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const courses = await Course.find({ category });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
