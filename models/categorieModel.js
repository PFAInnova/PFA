// const mongoose = require("mongoose");

// const categorieSchema = new mongoose.Schema({
//     categorie: {
//         type: String,
//         unique: true,
//         required: [true, "Name is required !!!!"],
//     },  
//     created_at: {
//         type: Date,
//         default: Date.now, // Utiliser la référence de la fonction Date.now
//     },
// });
// // Synchroniser les index lors de la connexion

// mongoose.connection.on('connected', () => {
//     // Force Mongoose à synchroniser les index avec MongoDB
//     mongoose.model('Categorie').syncIndexes();
// });

// const Categorie = mongoose.model("Categorie", categorieSchema);

// module.exports = Categorie;