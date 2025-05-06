const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Cart = require('../models/CartModel');


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
    if (!cart) {
      return res.status(404).json({ error: 'Panier non trouvé' });
    }
    res.json(cart);
  } catch (err) {
    console.error("Erreur lors de la récupération du panier :", err);
    res.status(500).json({ error: 'Erreur du serveur' });
  }
});

// Route PUT : Supprimer un cours du panier (par coursId)
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
// Route pour supprimer un item du panier
router.delete('/cart/:userId/item/:itemId', async (req, res) => {
  const { userId, itemId } = req.params;

  // Vérification si les IDs sont valides
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).json({ error: 'ID utilisateur ou ID item invalide' });
  }

  try {
    // Rechercher le panier de l'utilisateur en utilisant ObjectId pour userId
    const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });

    // Si le panier n'est pas trouvé
    if (!cart) {
      return res.status(404).json({ message: "Panier non trouvé pour cet utilisateur." });
    }

    // Supprimer l'article du panier en filtrant les éléments
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item.coursId.toString() !== itemId);

    // Si le panier n'a pas changé après le filtrage, cela signifie qu'aucun élément n'a été supprimé
    if (cart.items.length === initialLength) {
      return res.status(400).json({ message: "Aucun article correspondant trouvé à supprimer." });
    }

    // Si le panier est vide après la suppression, on peut choisir de supprimer le panier ou de le conserver avec un tableau vide
    if (cart.items.length === 0) {
      // Optionnel : supprimer le panier si vide
      // await Cart.deleteOne({ _id: cart._id }); // Décommente cette ligne si tu veux supprimer le panier vide
    }

    // Sauvegarder les modifications dans le panier
    await cart.save();

    // Retourner la réponse avec le panier mis à jour
    res.status(200).json({
      message: "Article supprimé du panier avec succès.",
      cart: cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
