
// const Categorie = require("../models/categorieModel");
// const Produit = require("../models/produitModel");
// const APIFeatures = require("../utils/APIFeatures");

// exports.createCategorie = async (req,res)=>{
//     try{
//         const newCategorie = await Categorie.create(req.body);
//         res.status(201).json({
//             status: "success",
//             data: {

//                 newCategorie,
//             },
//         });
//     }catch (err) {
//         if (err.code === 11000) {
//             res.status(400).json({
//                 status: "fail",
//                 message: "La catégorie existe déjà !",
//             });
//         } else {
//             res.status(400).json({
//                 status: "fail",
//                 message: err.message || "Une erreur s'est produite.",
//             });
//         }
//     }
// };

// exports.getAllCategories = async (req, res) => {
// try {
//     const API_Features = new APIFeatures(Categorie.find(), req.query).sort().pagination().filter();
//     const categories = await API_Features.query;
//     res.status(200).json({
//       status: "success",
//       results: categories.length,
//       data: {
//         categories,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: "fail",
//       message: err,
//     });
// }
// };

// exports.getCategorieById = async (req, res) => {
//   try {
//     const categorie = await Categorie.findById(req.params.id);
//     res.status(200).json({
//       status: "success",
//       data: {
//         categorie,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: "fail",
//       message: err,
//     });
//   }
// };

// exports.updateCategorie = async (req, res) => {
//   try {
//     const updatedCategorie = await Categorie.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.status(203).json({
//       status: "success",
//       message: "Categorie Updated !",
//       data: { updatedCategorie },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: "fail",
//       message: err.message,
//     });
//   }
// };
// exports.deleteCategorie = async (req, res) => {
//   try {
//     const categorieId = req.params.id;

//     // Vérifie si la catégorie existe
//     const categorie = await Categorie.findById(categorieId);
//     if (!categorie) {
//       return res.status(404).json({
//         status: 'fail',
//         message: 'Catégorie non trouvée',
//       });
//     }

//     // Supprimer tous les produits liés à cette catégorie
//     await Produit.deleteMany({ categorie: categorieId });

//     // Supprimer la catégorie
//     await Categorie.findByIdAndDelete(categorieId);

//     res.status(200).json({
//       status: 'success',
//       message: 'Catégorie et ses produits associés ont été supprimés !',
//     });
//   } catch (err) {
//     res.status(500).json({

//       status: 'fail',
//       message: err.message,
//     });
//   }
// };