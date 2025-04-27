const User = require("../models/user.model");
const Cart = require("../models/CartModel");

// Ajouter une formation au panier
const addToCart = async (req, res) => {
  const { userId, cours } = req.body;

  if (!userId || !cours || !cours._id || !cours.title || !cours.price) {
    return res.status(400).json({ message: "Données manquantes (userId, cours._id, title, price)." });
  }

  try {
    // Vérification si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "Utilisateur introuvable." });
    }

    // Chercher le panier existant pour cet utilisateur
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Créer un nouveau panier si l'utilisateur n'en a pas
      cart = new Cart({
        user: userId,
        cours: [cours],
      });
    } else {
      // Ajouter la formation au panier existant
      const exists = cart.cours.some(item => item._id.toString() === cours._id.toString());
      if (exists) {
        return res.status(409).json({ message: "Ce cours est déjà dans le panier." });
      }
      cart.cours.push(cours);
    }

    await cart.save(); // Enregistrer le panier
    res.status(200).json({ message: "Formation ajoutée au panier", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const removeFromCart = async (req, res) => {
  const { userId } = req.params; // L'ID de l'utilisateur est passé dans l'URL
  const { title } = req.body; // Le titre de la formation est passé dans le corps de la requête

  if (!userId || !title) {
    return res.status(400).json({ message: "userId et title sont requis." });
  }

  try {
    // Vérification si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "Utilisateur introuvable." });
    }

    // Chercher le panier existant pour cet utilisateur
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Panier introuvable." });
    }

    // Trouver l'index de la formation à supprimer en utilisant le title
    const itemIndex = cart.cours.findIndex(item => item.title === title);

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Formation non trouvée dans le panier." });
    }

    // Supprimer l'élément du panier
    cart.cours.splice(itemIndex, 1);

    await cart.save(); // Enregistrer les modifications
    res.status(200).json({ message: "Formation supprimée du panier", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  addToCart,
  removeFromCart, // Exporter la fonction de suppression
};
