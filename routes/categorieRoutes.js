// const express = require("express");
// const router = express.Router();
// const { createCategorie,getAllCategories,getCategorieById,updateCategorie,deleteCategorie} = require("../controllers/categorieController");
// const { protectorMW, permitMW } = require("../controllers/authController"); // Importer les middlewares

// // Protéger et restreindre l'accès à certaines routes pour les administrateurs
// router
//   .route("/")
//   .post(upload.single("image"), createCategorie) // Création de catégorie
//   .get(getAllCategories); // Récupérer toutes les catégories

// router
//   .route("/:id")
//   .get(getCategorieById) // Récupérer une catégorie par son ID
//   .patch(upload.single("image"), updateCategorie) // Mise à jour de catégorie
//   .delete(deleteCategorie); // Suppression de catégorie
// module.exports = router;