import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../../components/public/landing/nav";
import axios from "axios"; // Assure-toi d'importer axios

import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

const DownloadCVPage = () => {
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));
  const [userName, setUserName] = useState(userEmail ? userEmail.split("@")[0] : "Utilisateur");
  const [cvFile, setCvFile] = useState(null); // Etat pour gérer le fichier CV
  const [dark, setDark] = useState(false);
  const [numPages, setNumPages] = useState(null); // Pour gérer le nombre de pages du PDF
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const id = localStorage.getItem("userId");
  
    if (!email || !id) {
      alert("Aucun ID utilisateur trouvé. Veuillez vous reconnecter.");
      navigate("/"); // Redirection vers la page de login
    } else {
      setUserEmail(email);
      setUserName(email.split("@")[0]);
    }
  }, [navigate]);
  
  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
  
      try {
        const res = await axios.get(`http://localhost:8000/users/${userId}`);
        const user = res.data;
  
        if (user.cv && user.cv.filename) {
          setCvFile({
            name: user.cv.filename,
            url: `http://localhost:8000/${user.cv.path.replace(/\\/g, "/")}`, // remplace \ par /
            type: user.cv.mimetype, // Ajout du type MIME
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement du CV :", error);
      }
    };
  
    fetchUser();
  }, []);
  

  const darkModeHandler = () => {
    setDark(!dark);
    document.body.classList.toggle("dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token"); // Supprimer le token lors de la déconnexion
    navigate("/"); // Rediriger vers la page de connexion après déconnexion
  };

  // Fonction pour gérer le changement de fichier
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!cvFile) {
      alert("Veuillez sélectionner un fichier à télécharger.");
      return;
    }
  
    const userId = localStorage.getItem("userId");
    console.log("👉 userId dans le localStorage :", userId); // <--- 👈 ICI on vérifie
  
    if (!userId) {
      alert("Aucun ID utilisateur trouvé. Veuillez vous reconnecter.");
      return;
    }
  
    const formData = new FormData();
    formData.append("cv", cvFile);
    formData.append("userId", userId);
  
    try {
      const response = await axios.post("http://localhost:8000/upload-cv", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
  
      alert(`✅ Fichier "${cvFile.name}" envoyé avec succès !`);
      console.log("Réponse du serveur :", response.data);
    } catch (error) {
      console.error("Erreur upload :", error);
      alert("❌ Échec de l'envoi du fichier.");
    }
  };

  // Gère le nombre de pages du PDF
  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className={`download-cv-page ${dark ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen`}>
      <Nav />
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-8 max-w-4xl">
        <header className="flex items-center justify-between pb-6 border-b">
          <div className="flex items-center space-x-6">
            {/* Avatar et nom de l'utilisateur */}
            <div className="w-24 h-24 bg-blue-500 text-white flex items-center justify-center rounded-full shadow-md">
              <span className="text-2xl font-bold">{userName.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{userName}</h1>
              <p className="text-gray-500">{userEmail}</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md shadow-md bg-red-500 text-white hover:bg-red-600"
            >
              Déconnexion
            </button>
          </div>
        </header>

        <section className="mt-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h2 className="text-xl font-semibold">Télécharger mon CV</h2>
            <p className="mt-2">Veuillez choisir votre fichier CV ci-dessous.</p>

            {/* Formulaire d'upload de fichier */}
            <input
              type="file"
              accept=".pdf, .doc, .docx"
              onChange={handleFileChange}
              className="mt-4"
            />

<button
  onClick={handleFileUpload}
  className="mt-4 inline-block px-6 py-2 rounded-md shadow-md bg-green-500 text-white hover:bg-green-600"
>
  Envoyer le CV
</button>
            <div className="mt-4 space-y-2">
              {cvFile?.url ? (
                <div className="space-y-2">
                  <p>✅ CV actuel : <strong>{cvFile.name}</strong></p>

                  {/* Afficher le CV selon le type de fichier */}
                  {cvFile.type === "application/pdf" ? (
                    <div>
                      <Document file={cvFile.url} onLoadSuccess={onLoadSuccess}>
                        {Array.from(new Array(numPages), (el, index) => (
                          <Page key={index} pageNumber={index + 1} />
                        ))}
                      </Document>
                    </div>
                  ) : cvFile.type.startsWith("image") ? (
                    <img src={cvFile.url} alt="CV" className="mt-4" />
                  ) : (
                    <p className="text-gray-500">Le fichier n'est pas un PDF ou une image valide.</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">Aucun CV n’est encore enregistré.</p>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h2 className="text-xl font-semibold">À propos de moi</h2>
            <p className="mt-2">
              Bienvenue, <strong>{userName}</strong>! Vous pouvez gérer votre compte depuis cette page.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DownloadCVPage;
