import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Nav from '../components/public/landing/nav';  

export default function Success() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const { data } = await axios.post(`/api/PaymentRouter/${searchParams.get("payment_id")}`);
        setStatus(data.result.status);
      } catch (error) {
        console.error("Erreur de paiement :", error);
        setStatus("ERROR");
      }
    };

    if (searchParams.get("payment_id")) {
      fetchPaymentStatus();
    }
  }, [searchParams]);

  const renderMessage = () => {
    switch (status) {
      case "SUCCESS":
        return (
          <>
            
             <div style={styles.card}>
              <h2 style={styles.title}>✅ Paiement réussi</h2>
              <p style={styles.message}>Merci pour votre achat !</p>
            </div>
          </>
        );
      case "ERROR":
      case "FAILED":
        return (
          <div style={{ ...styles.card, borderColor: '#f44336' }}>
            <h2 style={{ ...styles.title, color: '#f44336' }}>❌ Paiement échoué</h2>
            <p style={styles.message}>Une erreur est survenue. Veuillez réessayer.</p>
          </div>
        );
      default:
        return (
          <div style={styles.card}>
            <h2 style={styles.title}>Chargement...</h2>
            <p style={styles.message}>Vérification du statut du paiement...</p>
          </div>
        );
    }
  };

  return (
    <> 
     <Nav />
    <div style={styles.container}>
      {renderMessage()}
    </div>
    </>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f8ff',
  },
  card: {
    padding: '30px',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    border: '2px solid #4caf50',
  },
  title: {
    fontSize: '2rem',
    color: '#4caf50',
    marginBottom: '10px',
  },
  message: {
    fontSize: '1.2rem',
    color: '#555',
    marginBottom: '20px',
  },
};
