// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const produitController = require("../controllers/produitController");
// const router = express.Router();
// const {protectorMW,permitMW } = require("../controllers/authController"); // Importer les middlewares

// // Configurer multer pour sauvegarder les images dans un dossier spécifique
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "images/produits/"); // Dossier où les images seront stockées
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // Nom unique pour éviter les conflits
//     },
// });

// const upload = multer({ storage: storage }); // Configurer multer

// // Routes
// router
// .route("/")
// .post(upload.single("image"), produitController.AddProduit) // Ajouter un produit avec une image
// .get(produitController.GetAllProduits); // Récupérer tous les produits

// router
// .route("/:id")
// .get(produitController.getProduitById) // Récupérer un produit par son ID
// .patch(upload.single("image"), produitController.updateProduit) // Mettre à jour un produit
// .delete(produitController.deleteProduit); // Supprimer un produit


// module.exports = router;