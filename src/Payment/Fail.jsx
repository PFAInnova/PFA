import React from 'react';
import Nav from '../components/public/landing/nav'; 

export default function Fail() {
  return (
    <>
        <Nav />  
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Échec !</h1>
        <p style={styles.message}>Une erreur est survenue. Veuillez réessayer.</p>
        <button style={styles.button}>Retour à la page d'accueil</button>
      </div>
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
    backgroundColor: '#ffe6e6',
  },
  card: {
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
  },
  title: {
    fontSize: '2rem',
    color: '#e74c3c',
  },
  message: {
    fontSize: '1.2rem',
    color: '#555',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};
