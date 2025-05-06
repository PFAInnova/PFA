import { CreditCard } from '@mui/icons-material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Nav from '../components/public/landing/nav';

export default function Payment() {
  const [form, setForm] = useState({ amount: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Récupère le montant du localStorage si présent
  useEffect(() => {
    const storedAmount = localStorage.getItem('paymentAmount');
    if (storedAmount) {
      setForm({ amount: storedAmount });
    }
  }, []);

  const onchange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onsubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.amount || isNaN(form.amount)) {
      setError('Veuillez entrer un montant valide.');
      return;
    }

    axios
      .post(`http://localhost:8000/api/PaymentRouter`, form)
      .then((res) => {
        const { result } = res.data;
        setSuccess('Redirection vers le paiement en cours...');
        setTimeout(() => {
          window.location.href = result.link;
        }, 1500);
      })
      .catch((err) => {
        console.error(err);
        setError('Erreur lors du paiement. Veuillez réessayer.');
      });
  };

  return (
    <>
      <Nav />
      <div style={styles.container}>
        <form style={styles.form} onSubmit={onsubmit}>
          <h2 style={styles.title}>💳 Paiement sécurisé</h2>

          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <div style={styles.inputContainer}>
            <CreditCard style={styles.inputIcon} />
            <input
              type="text"
              name="amount"
              value={form.amount}
              onChange={onchange}
              placeholder="Montant en Dinar"
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>Payer</button>
        </form>
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
    background: 'linear-gradient(to right, #e0f7fa, #e1bee7)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px',
    borderRadius: '15px',
    backgroundColor: '#ffffff',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '420px',
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '20px',
    color: '#4a148c',
    fontWeight: '600',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '8px 12px',
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    color: '#6a1b9a',
    marginRight: '10px',
  },
  input: {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    width: '100%',
    fontSize: '1rem',
  },
  button: {
    padding: '12px 24px',
    fontSize: '1rem',
    backgroundColor: '#6a1b9a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  error: {
    color: '#d32f2f',
    marginBottom: '10px',
    fontWeight: '500',
  },
  success: {
    color: '#388e3c',
    marginBottom: '10px',
    fontWeight: '500',
  },
};
