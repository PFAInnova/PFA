// const Produit = require("../models/produitModel"); // Assure-toi du chemin correct
// const Categorie = require("../models/categorieModel");
// const APIFeatures = require("../utils/APIFeatures");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Configurer multer pour sauvegarder les images dans un dossier spécifique

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'images/produits/'); // Dossier où les images seront stockées
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname); // Utiliser le nom d'origine pour éviter la duplication
//   },
// });

// const upload = multer({ storage: storage });

// // Fonction pour vérifier si l'image existe déjà dans le dossier
// const imageExists = (imageName) => {
//   const imagePath = path.join(__dirname, '../images/produits', imageName);
//   return fs.existsSync(imagePath); // Retourne true si l'image existe, sinon false
// };

// // Contrôleur pour ajouter un produit avec une image
// exports.AddProduit = async (req, res) => {
//   try {
//     // Vérifier si une image est envoyée
//     if (!req.file) {
//       return res.status(400).json({
//         status: "fail",
//         message: "Une image est requise pour ajouter un produit",
//       });
//     }

//     const imageName = req.file.filename; // Utiliser le nom de fichier généré par multer
//     const imagePath = `images/produits/${imageName}`;

//     // Vérifier si l'image existe déjà dans le dossier
//     if (imageExists(imageName)) {
//       console.log("Image déjà existante dans le dossier !");
//     } else {
//       console.log("Nouvelle image enregistrée");
//     }

//     // Vérifier si l'image est déjà utilisée par un autre produit dans la base de données
//     const existingProduit = await Produit.findOne({ image: imagePath });
//     if (existingProduit) {
//       return res.status(400).json({
//         status: "fail",
//         message: "Cette image est déjà utilisée pour un autre produit.",
//       });
//     }

//     // Vérifier si la catégorie existe
//     const categorieExistante = await Categorie.findById(req.body.categorie);
//     if (!categorieExistante) {
//       return res.status(404).json({
//         status: "fail",
//         message: "La catégorie spécifiée n'existe pas.",
//       });
//     }

//     // Créer un nouveau produit avec l'URL de l'image
//     const newProduit = await Produit.create({
//       ...req.body,
//       image: imagePath, // Enregistre le chemin de l'image
//     });

//     // Retourner une réponse avec les données du produit et la catégorie associée
//     res.status(201).json({
//       status: "success",
//       message: "Produit ajouté avec succès !",
//       data: {
//         _id: newProduit._id,
//         name: newProduit.name,
//         description: newProduit.description,
//         prix: newProduit.prix,
//         quantite: newProduit.quantite,
//         image: newProduit.image,
//         categorie: categorieExistante, //3malna fazet id_catégorie lezem tkoun mawjouda fi table catégorie
//         // Inclut les détails de la catégorie associée
//         add_at: newProduit.add_at,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: "fail",
//       message: err.message || "Une erreur s'est produite lors de l'ajout du produit.",
//     });
//   }
// };


// // Contrôleur pour mettre à jour un produit
// exports.updateProduit = async (req, res) => {
//   try {
//     const produitId = req.params.id; // Récupérer l'ID du produit à mettre à jour
//     let updatedData = req.body; // Récupérer les données textuelles envoyées

//     // 1. Vérifier si une nouvelle image est envoyée avec la requête
//     if (req.file) {
//       const imageName = req.file.filename; // Nom de fichier généré par multer
//       const imagePath = `images/produits/${imageName}`; // Chemin de stockage de l'image

//       // Vérifier si l'image existe déjà dans le dossier
//       if (imageExists(imageName)) {
//         console.log("Image déjà existante dans le dossier !");
//         updatedData.image = imagePath; // Utiliser l'image existante
//       } else {
//         console.log("Nouvelle image enregistrée");
//         updatedData.image = imagePath; // Utiliser la nouvelle image si elle n'existe pas
//       }
//     }

//     // 2. Vérifier si une catégorie est spécifiée dans la mise à jour
//     if (updatedData.categorie) {
//       const categorieExistante = await Categorie.findById(updatedData.categorie);
//       if (!categorieExistante) {
//         return res.status(404).json({
//           status: "fail",
//           message: "La catégorie spécifiée n'existe pas.",
//         });
//       }
//     }

//     // 3. Mettre à jour le produit dans la base de données
//     const produit = await Produit.findByIdAndUpdate(produitId, updatedData, {
//       new: true, // Retourner le produit mis à jour
//     });

//     if (!produit) {
//       return res.status(404).json({
//         status: "fail",
//         message: "Produit non trouvé",
//       });
//     }

//     // 4. Inclure les détails de la catégorie dans la réponse
//     const categorie = await Categorie.findById(produit.categorie);

//     res.status(200).json({
//       status: "success",
//       message: "Produit mis à jour avec succès !",
//       data: {
//         id: produit._id, // Affiche l'ID en premier
//         name: produit.name,
//         description: produit.description,
//         prix: produit.prix,
//         quantite: produit.quantite,
//         image: produit.image,
//         categorie: {
//           id: categorie ? categorie._id : null, // Inclut les informations sur la catégorie
//           name: categorie ? categorie.categorie : "Non spécifiée",
//         },
//         updated_at: produit.updatedAt, // Date de mise à jour
//       },
//     });
//   } catch (err) {
//     // Gestion des erreurs
//     res.status(400).json({
//       status: "fail",
//       message: err.message || "Une erreur s'est produite lors de la mise à jour du produit.",
//     });
//   }
// };


// //all product 
// exports.GetAllProduits = async (req, res) => {
//   try {
//     let filter = {}; // Initialisation du filtre vide
//     // Si une catégorie est passée dans les paramètres de la requête
//     if (req.query.categorie) {
//       const categorie = await Categorie.findOne({ categorie: req.query.categorie });
//       if (!categorie) {
//         return res.status(404).json({
//           status: "fail",
//           message: "La catégorie spécifiée n'existe pas.",
//         });
//       }
//       filter.categorie = categorie._id; // Filtre basé sur l'ID de la catégorie
//     }
//     const API_Features = new APIFeatures(Produit.find(filter),req.query).sort().pagination().filter()
//     const produits = await API_Features.query.populate("categorie", "categorie");
//     res.status(200).json({
//       status: "success",
//       data: { produits },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: "fail",
//       message: err.message,
//     });
//   }
// };


// //get by id 
// exports.getProduitById = async (req, res) => {
//   try {
//     const produit = await Produit.findById(req.params.id).populate("categorie", "categorie");
//     if (!produit) {
//       return res.status(404).json({
//         status: "fail",
//         message: "Produit non trouvé",
//       });
//     }

//     res.status(200).json({
//       status: "success",
//       message: "Produit récupéré avec succès !",
//       data: { produit },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: "fail",
//       message: err.message || "Une erreur s'est produite.",
//     });
//   }
// };
//   // delete  produit 

//   exports.deleteProduit = async (req, res) => {
//     try {
//       const produit = await Produit.findByIdAndDelete(req.params.id);  
//       if (!produit) {
//         return res.status(404).json({
//           status: "fail",
//           message: "Produit non trouvé",
//         });
//       }
//         res.status(200).json({
//         status: "success",
//         message: "Produit supprimé avec succès !",
//         data: null,
//       });
//     } catch (err) {
//       res.status(400).json({
//         status: "fail",
//         message: err.message || "Une erreur s'est produite",
//       });
//     }
//   };