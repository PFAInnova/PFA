import React, { useEffect, useState } from 'react';
import Nav from '../../components/public/landing/nav';

const Panier = () => {
  const [panier, setPanier] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Utilisateur non authentifié');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/cart/cart/${userId}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
        });
        if (!response.ok) throw new Error('Erreur lors de la récupération du panier');
        const data = await response.json();
        setPanier(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCart();
  }, []);

  const handleRemoveItem = async (itemId) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:8000/api/cart/cart/${userId}/item/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression de l\'article');

      setPanier(prev => ({
        ...prev,
        items: prev.items.filter(item => item.coursId !== itemId),
      }));
      setMessage('Article supprimé du panier ✅');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePayment = (item) => {
    setIsPaying(true);

    localStorage.setItem('paymentAmount', item.prix);

    window.location.href = 'http://localhost:5173/Payment/Payment';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100">
      <Nav />
      <div className="max-w-4xl mx-auto p-6 mt-8 bg-white shadow-2xl rounded-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">🛒 Mon Panier</h1>

        {message && <p className="text-green-600 text-center font-semibold mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center font-semibold mb-4">{error}</p>}

        {panier ? (
          panier.items.length > 0 ? (
            <div className="space-y-6">
              {panier.items.map(item => (
                <div
                  key={item.coursId}
                  className="bg-gray-50 p-5 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="text-lg font-semibold text-gray-800">
                      {item.titre} <span className="text-indigo-600 ml-2">{item.prix} Dt</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handlePayment(item)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition"
                        disabled={isPaying}
                      >
                        {isPaying ? 'Chargement...' : '💳 Payer'}
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.coursId)}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition"
                      >
                        ❌ Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center mt-12 text-lg">Votre panier est vide 🧺</p>
          )
        ) : (
          <p className="text-center text-gray-600">Chargement du panier...</p>
        )}
      </div>
    </div>
  );
};

export default Panier;
