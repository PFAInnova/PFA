const Course = require('../models/cours');

const uploadCourseVideo = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Aucune vidéo n’a été envoyée.' });
    }

    const videoUrl = `http://localhost:8000/uploads/videos/${file.filename}`;

    const newCourse = new Course({
      title,
      description,
      videoUrl,
      category // 🟡 Ajouté ici
    });

    await newCourse.save();

    res.status(201).json({ message: 'Cours ajouté avec succès', course: newCourse });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

module.exports = {
  uploadCourseVideo
};
