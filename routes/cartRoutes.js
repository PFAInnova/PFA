const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Cart = require('../models/CartModel');
const verifyToken = require('../middlewares/verifyToken');
const {  removeFromCart } = require('../controllers/cart.controller');

// Route POST : Ajouter un cours au panier
router.post('/add', async (req, res) => {
  const { userId, cours } = req.body;

  if (!userId || !cours || !cours.coursId || !cours.titre || !cours.prix) {
    return res.status(400).json({ message: "Données manquantes (userId, coursId, titre, prix)." });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Vérifie si le cours existe déjà dans le panier
    const exists = cart.items.some(item => item.coursId.toString() === cours.coursId);
    if (exists) {
      return res.status(409).json({ message: "Ce cours est déjà dans le panier." });
    }

    cart.items.push({
      coursId: cours.coursId,
      titre: cours.titre,
      prix: cours.prix,
      niveau: cours.niveau || ""
    });

    await cart.save();
    res.status(200).json({ message: "Formation ajoutée au panier avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Route GET : Récupérer le panier d'un utilisateur
router.get('/cart/:userId', async (req, res) => {
  const { userId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'ID utilisateur invalide' });
  }

  try {
    const cart = await Cart.findOne({ userId });
    console.log(cart);  // Log pour vérifier ce que tu obtiens
    if (!cart) {
      return res.status(404).json({ error: 'Panier non trouvé' });
    }
    res.json(cart);
  } catch (err) {
    console.error("Erreur lors de la récupération du panier :", err);
    res.status(500).json({ error: 'Erreur du serveur' });
  }
});

// Route PUT : Supprimer un cours du panier
router.put('/:userId/remove', async (req, res) => {
  const { userId } = req.params;
  const { coursId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'ID utilisateur invalide' });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: 'Panier non trouvé' });
    }

    cart.items = cart.items.filter(item => item.coursId.toString() !== coursId);
    await cart.save();

    res.json({ message: "Cours supprimé du panier", cart });
  } catch (err) {
    console.error("Erreur lors de la suppression du cours :", err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
// Route DELETE : Supprimer un article spécifique du panier de l'utilisateur basé sur l'_id de l'article
router.delete('/cart/:userId/item/:itemId', async (req, res) => {
  const { userId, itemId } = req.params;

  try {
    // Trouver le panier de l'utilisateur
    const cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return res.status(404).json({ message: "Panier non trouvé pour cet utilisateur." });
    }

    // Retirer l'élément du panier
    cart.items = cart.items.filter(item => item.coursId !== itemId);

    // Sauvegarder le panier après suppression de l'article
    await cart.save();

    res.status(200).json({ message: "Article supprimé du panier avec succès.", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


module.exports = router;
