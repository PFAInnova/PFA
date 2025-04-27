import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Nav from '../../components/public/landing/nav';

const AllFormation = () => {
  const [formations, setFormations] = useState([]);  // State pour stocker les formations

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        // Requête pour récupérer toutes les formations
        const response = await axios.get('http://localhost:8000/api/formations/all');
        setFormations(response.data);  // Mise à jour du state avec les formations
      } catch (error) {
        console.error('Erreur de chargement des formations :', error);
        toast.error('Erreur lors de la récupération des formations');
      }
    };

    fetchFormations();  // Appel de la fonction pour charger les formations
  }, []);  // Ce useEffect s'exécute une seule fois lors du montage du composant

  // Fonction pour ajouter une formation au panier
  const addToCart = async (formation) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('Vous devez être connecté pour ajouter une formation au panier !');
        return;
      }

      const price = parseFloat(formation.price);
      if (isNaN(price)) {
        toast.error('Le prix de la formation est invalide !');
        return;
      }

      const response = await axios.post('http://localhost:8000/api/cart/add', {
        userId,
        cours: {
          coursId: formation._id,
          titre: formation.title,
          prix: price,
          niveau: 'Avancé',
        },
      });

      if (response.status === 200) {
        toast.success(response.data.message);
      }
    } catch (err) {
      console.error('Erreur lors de l\'ajout au panier :', err.response ? err.response.data : err);
      toast.error(err.response ? err.response.data.message : 'Erreur inconnue');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />

      <div className="text-center py-10">
        <h1 className="text-5xl font-bold text-indigo-800 mb-4">Nos Formations</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Découvrez nos formations pour booster vos compétences en développement.
        </p>
      </div>

      <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto px-4">
        {formations.map((formation) => (
          <div
            key={formation._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
          >
            <img
              src={formation.coverImage}
              alt={`Image de la formation ${formation.title}`}
              className="w-full h-60 object-cover rounded-t-2xl"
            />
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-indigo-700">{formation.title}</h2>
              <p className="text-gray-600">{formation.description}</p>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Formateur : {formation.instructor}</span>
                <span className="text-indigo-600 font-bold">{formation.price} DT</span>
              </div>

              <div className="flex items-center text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(formation.rating) ? 'fill-current' : 'text-gray-300'}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-6 3 2-7-5-5 7-.5L10 0l3 6 7 .5-5 5 2 7-6-3z" />
                  </svg>
                ))}
                <span className="ml-2 text-gray-600">{formation.rating?.toFixed(1)} / 5</span>
              </div>

              <div className="flex justify-between items-center pt-4">
                <Link to={formation.link}>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-medium transition">
                    Voir la formation
                  </button>
                </Link>
                <button
                  onClick={() => addToCart(formation)}
                  className="ml-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Ajouter au panier
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllFormation;
