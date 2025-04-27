// const mongoose = require("mongoose");

// const produitSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "Le nom du produit est obligatoire"],
//     unique: true,
//   },
//   description: {
//     type: String,
//     required: [true, "La description est obligatoire"],
//     unique: true,
//   },
//   prix: {
//     type: Number,
//     required: [true, "Le prix est obligatoire"],
//     min: [0, "Le prix doit être un nombre positif"],
//   },
//   quantite: {
//     type: Number,
//     required: [true, "La quantité du produit est obligatoire"],
//     min: [0, "La quantité doit être un nombre positif"],
//   },
//   image: {
//     type: String, 
//   },

//   //relation entre deux table produit / categorie !
//   categorie: {
//     type: mongoose.Schema.Types.ObjectId, // Référence à une catégorie
//     ref: "Categorie", // Nom du modèle de catégorie
//     required: [true, "La catégorie est obligatoire"],
//   },
  
//   add_at: {
//     type: Date,
//     default: Date.now,
//   },

// });

// const Produit = mongoose.model("Produit", produitSchema);

// module.exports = Produit;