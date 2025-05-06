const express = require("express");
const mongoose = require("./mongo");
const cors = require("cors");
const path = require('path');
const certificateController = require("./controllers/certificate.controller.js");
const quizController = require("./controllers/quiz.controller.js");
const testController = require('./controllers/testController.js');
const skillsController = require("./controllers/skills.controller");
const userController = require("./controllers/user.controller.js");
const authController = require('./controllers/auth.controller');
const { authMiddleware } = require('./middlewares/auth');
const FeedbackController = require('./controllers/FeedbackController.js');
const upload = require('./middlewares/upload.middleware');
const courseRoutes = require('./routes/courseRoutes.js');
const videoProgressRoutes = require('./routes/videoProgressRoutes.js');
const UserModel = require("./models/user.model");
const cartRoutes = require("./routes/cartRoutes.js");
const formationRoutes = require('./routes/formationRoutes.js');
const PaymentRouter= require ("./routes/PaymentRoutes.js");
const app = express();

app.use(express.json()); 

app.use(cors());
//payement 
app.use('/api', PaymentRouter); 

app.use(express.urlencoded({ extended: true }));

// Routes pour les formations
app.use('/api/formations', formationRoutes);

// Route GET pour la page d'accueil
app.get("/", (req, res) => {
    res.send("Bienvenue sur l'API !");
});

// Routes pour les compétences
app.get("/skills", skillsController.getAll);
app.post("/skills", skillsController.telecharger.single('file'), skillsController.create);
app.put('/skills/:id', authMiddleware, skillsController.telecharger.single('file'), skillsController.update);
app.delete("/skills/:id", skillsController.remove);
app.use('/public', express.static(path.join(__dirname, 'public')));

// Routes utilisateurs
app.get('/users', userController.getAll);
app.get("/users/:id", userController.getUserById);
app.post('/create_user', upload.single('avatar'), async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Les champs 'username', 'email' et 'password' sont requis." });
    }
    await userController.create(req, res); 
  } catch (err) {
    console.error("Erreur lors de la création de l'utilisateur:", err);
    res.status(500).json({ message: "Erreur serveur lors de la création de l'utilisateur." });
  }
});
app.put('/users/:id', [upload.single('avatar')], userController.update);
app.delete('/users/:id', userController.remove);
app.put('/users/:id', userController.approveUser);

// Routes authentification
app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);  

// Routes pour les certificats et quiz
app.get("/certificate/:id", certificateController.generate);
app.get("/quiz", quizController.getAll);
app.post("/quizzes", quizController.createQuiz);
app.post("/quiz/submit/:quizId", quizController.submitQuiz);

// Routes pour les tests
app.post('/create_test', testController.createTest);
app.get('/tests', testController.getAllTests);
app.post('/submit_test/:testId', testController.submitTest);

// Routes de feedback
app.post('/feedback', FeedbackController.addfeedback);
app.get('/feedbacks', FeedbackController.getfeedbacks);
app.delete('/feedback/:id', FeedbackController.removefeedback);

// Route d’upload de CV
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || file.mimetype === 'application/msword') {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé'), false);
  }
};

app.post("/upload-cv", upload.single("cv", { fileFilter }), async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.file || !userId) {
      return res.status(400).json({ message: "Fichier ou ID utilisateur manquant" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    user.cv = {
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      uploadedAt: new Date(),
    };

    await user.save();

    res.status(200).json({
      message: "CV uploadé et associé à l'utilisateur",
      userCv: user.cv,
    });
  } catch (error) {
    console.error("Erreur upload :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Routes statiques pour les fichiers uploadés
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/videos', express.static(path.join(__dirname, 'uploads/videos')));

// upload video 
app.use('/api/courses', courseRoutes);
app.use('/api/video-progress', videoProgressRoutes);

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error("Erreur:", err);
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      message: "Erreur de validation des données",
      details: err.errors,
    });
  }

  res.status(err.status || 500).json({
    message: err.message || "Erreur serveur. Veuillez réessayer plus tard."
  });
});

// Panier
app.use('/api/cart', cartRoutes);  

// Démarrage du serveur
app.listen(8000, () => {
  console.log(`🚀 Serveur démarré sur le port 8000`);
});
