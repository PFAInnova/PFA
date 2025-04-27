const mongoose = require("mongoose");

const formationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, default: "" },  // Valeur par défaut vide si pas utilisée
  coverImage: { type: String, default: "" },  // Valeur par défaut vide
  instructor: { type: String, default: "Inconnu" },  // Valeur par défaut pour instructor
  rating: { type: Number, min: 0, max: 5, default: 0 },  // Validation de la note entre 0 et 5
  price: { type: Number, required: true },
  link: { type: String, default: "" }  // Valeur par défaut vide
});

// Création du modèle basé sur le schéma
const Formation = mongoose.model("Formation", formationSchema);

// Exportation du modèle pour l'utiliser dans d'autres fichiers
module.exports = Formation;
