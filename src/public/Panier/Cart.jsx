import React, { useEffect, useState } from 'react';
import Nav from '../../components/public/landing/nav';

const Panier = () => {
  const [panier, setPanier] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Récupérer l'ID utilisateur du localStorage
    const userId = localStorage.getItem('userId');

    if (userId) {
      // Faire la requête GET pour récupérer le panier
      fetch(`http://localhost:8000/api/cart/cart/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,  // Envoi du token d'authentification
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération du panier');
        }
        return response.json();
      })
      .then(data => {
        console.log('Panier:', data);  // Afficher le panier récupéré
        setPanier(data);  // Mettre à jour l'état avec les données du panier
      })
      .catch(error => {
        console.error('Erreur:', error);
        setError(error.message);  // Mettre l'erreur dans l'état pour l'afficher
      });
    } else {
      setError('Utilisateur non authentifié');
      console.log('Utilisateur non authentifié');
    }
  }, []); // Utiliser [] pour que le code ne s'exécute qu'une fois lors du montage du composant

  // Fonction pour supprimer un article spécifique du panier
  const handleRemoveItem = (itemId) => {
    const userId = localStorage.getItem('userId');
    
    // Faire la requête DELETE pour supprimer l'article spécifique
    fetch(`http://localhost:8000/api/cart/cart/${userId}/item/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Envoi du token d'authentification
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'article');
      }
      return response.json();
    })
    .then(() => {
      // Mettre à jour le panier après suppression
      setPanier(prevPanier => ({
        ...prevPanier,
        items: prevPanier.items.filter(item => item.coursId !== itemId),
      }));
    })
    .catch(error => {
      console.error('Erreur:', error);
      setError(error.message);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400">
      <Nav />
      <div style={styles.container}>
        <h1 style={styles.title}>Mon Panier</h1>
        {error && <p style={styles.errorMessage}>{error}</p>}  {/* Afficher l'erreur si elle existe */}
        {panier ? (
          <ul style={styles.itemList}>
            {panier.items.map(item => (
              <li key={item.coursId} style={styles.item}>
                <span style={styles.itemTitle}>{item.titre}</span> - 
                <span style={styles.itemPrice}>{item.prix} Dt</span>
                <button
                  onClick={() => handleRemoveItem(item.coursId)}  // Appel à la fonction de suppression
                  style={styles.removeButton}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Chargement du panier...</p>
        )}
      </div>
    </div>
  );
};

// Styles en ligne
const styles = {
  container: {
    width: '90%',
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    textAlign: 'center',
    marginBottom: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  errorMessage: {
    color: 'red',
    fontSize: '1.2rem',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: '20px',
  },
  itemList: {
    listStyleType: 'none',
    padding: '0',
    marginTop: '20px',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px',
    borderBottom: '1px solid #ddd',
    fontSize: '1.1rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    marginBottom: '10px',
    transition: 'all 0.2s ease',
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  itemPrice: {
    color: '#2d6a4f',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};

export default Panier;
