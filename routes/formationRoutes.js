const express = require('express');
const Formation = require('../models/Formation'); // Assure-toi que le chemin est correct
const router = express.Router();
const formationController = require("../controllers/formationController");

// Route POST pour créer une formation
router.post('/create', async (req, res) => {
  try {
    // Extraction des données de la requête
    const { title, description, coverImage, instructor, rating, price, link } = req.body;

    // Création d'une nouvelle formation
    const newFormation = new Formation({
      title,
      description,
      coverImage,
      instructor,
      rating,
      price,
      link
    });

    // Sauvegarde de la formation dans la base de données
    await newFormation.save();

    // Réponse de succès
    res.status(201).json({ message: 'Formation créée avec succès', formation: newFormation });
  } catch (error) {
    // Gestion des erreurs
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la création', error: error.message });
  }
});
router.get('/all', formationController.getAllFormations);


module.exports = router;
