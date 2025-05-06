import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Nav from '../../components/public/landing/nav';

const AllFormation = () => {
  const [formations, setFormations] = useState([]);

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/formations/all');
        setFormations(response.data);
      } catch (error) {
        console.error('Erreur de chargement des formations :', error);
        toast.error('Erreur lors de la récupération des formations');
      }
    };

    fetchFormations();
  }, []);

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
          instructeur: formation.instructor || 'Non spécifié',
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      <Nav />

      <div className="text-center py-16">
        <h1 className="text-5xl font-extrabold text-indigo-700 mb-6 tracking-tight">
          Découvrez Nos Formations
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Formez-vous aux métiers de demain avec nos parcours spécialisés.
        </p>
      </div>

      <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto px-6 pb-20">
        {formations.map((formation) => (
          <div
            key={formation._id}
            className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col"
          >
            <img
              src={formation.coverImage}
              alt={`Image de la formation ${formation.title}`}
              className="w-full h-56 object-cover"
            />
            <div className="p-6 flex flex-col justify-between flex-1">
              <div className="space-y-3 mb-6">
                <h2 className="text-2xl font-semibold text-indigo-700">{formation.title}</h2>
                <p className="text-gray-500 text-sm line-clamp-3">{formation.description}</p>

                {/* Détails supplémentaires */}
                <div className="text-gray-600 text-sm mt-4 space-y-1">
                  <p><span className="font-semibold">Instructeur:</span> {formation.instructor}</p>
                  <p><span className="font-semibold">Prix:</span> {formation.price} DT</p>
                </div>
              </div>

              {/* Évaluation */}
              <div className="flex items-center text-yellow-400">
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
                <span className="ml-2 text-gray-600"></span>
              </div>

              {/* Boutons */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-6">
                <Link to={formation.link}>
                  <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-medium transition">
                    Voir la formation
                  </button>
                </Link>
                <button
                  onClick={() => addToCart(formation)}
                  className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl font-medium transition"
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
