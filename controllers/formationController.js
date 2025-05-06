const Formation = require('../models/Formation'); // Assurez-vous que le chemin est correct

// Ajouter une nouvelle formation
exports.createFormation = async (req, res) => {
  try {
    // Création d'une nouvelle formation avec les données du corps de la requête
    const formation = new Formation(req.body);
    
    // Sauvegarde de la formation dans la base de données
    await formation.save();

    res.status(201).json({ message: 'Formation créée avec succès', formation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la création' });
  }
};

exports.getAllFormations = async (req, res) => {
  try {
    // Récupérer toutes les formations dans la base de données
    const formations = await Formation.find();

    // Réponse avec toutes les formations
    res.status(200).json(formations);
  } catch (error) {
    console.error("Erreur lors de la récupération des formations :", error);
    // Réponse en cas d'erreur serveur
    res.status(500).json({ message: "Erreur serveur lors de la récupération des formations." });
  }
};
