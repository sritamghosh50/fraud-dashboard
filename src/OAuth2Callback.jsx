import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
  useLocation,
} from 'react-router-dom';

import { useAuth } from './AuthContext';

export default function OAuth2Callback() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const { login } =
    useAuth();

  const [message, setMessage] =
    useState(
      'Completing authentication...'
    );

  useEffect(() => {

    const params =
      new URLSearchParams(
        location.search
      );

    const token =
      params.get('token');

    const email =
      params.get('email');

    const fullName =
      params.get('fullName');

    const error =
      params.get('error');

    // =======================================================
    // OAUTH ERROR
    // =======================================================

    if (error) {

      setMessage(
        'Login failed. Please try again.'
      );

      return;
    }

    // =======================================================
    // TOKEN CHECK
    // =======================================================

    if (!token) {

      setMessage(
        'Authentication token was not received.'
      );

      return;
    }

    // =======================================================
    // EMAIL CHECK
    // =======================================================

    if (!email) {

      setMessage(
        'Email was not received from the provider.'
      );

      return;
    }

    // =======================================================
    // SAVE LOGIN
    // =======================================================

    login(
      token,
      email,
      fullName
    );

    setMessage(
      'Login successful. Opening FraudGuard...'
    );

    // =======================================================
    // OPEN HOME
    // =======================================================

    const timer =
      setTimeout(() => {

        navigate(
          '/',
          {
            replace: true,
          }
        );

      }, 300);

    return () => {
      clearTimeout(timer);
    };

  }, [
    location.search,
    login,
    navigate,
  ]);

  return (
    <div style={styles.page}>

      <div style={styles.card}>

        <div style={styles.spinner}></div>

        <h2 style={styles.title}>
          {message}
        </h2>

        <p style={styles.text}>
          Please wait...
        </p>

      </div>

    </div>
  );
}

const styles = {

  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f5f7fc',
    padding: '20px',
  },

  card: {
    width: '100%',
    maxWidth: '460px',
    background: '#ffffff',
    borderRadius: '22px',
    padding: '48px 40px',
    textAlign: 'center',
    boxShadow:
      '0 20px 50px rgba(15, 23, 42, 0.10)',
  },

  spinner: {
    width: '42px',
    height: '42px',
    border: '5px solid #e4e9f7',
    borderTop:
      '5px solid #315cff',
    borderRadius: '50%',
    margin:
      '0 auto 28px',
    animation:
      'fraudguard-spin 1s linear infinite',
  },

  title: {
    margin:
      '0 0 12px',
    fontSize: '22px',
    fontWeight: '700',
    color: '#101828',
  },

  text: {
    margin: 0,
    color: '#667085',
    fontSize: '15px',
  },
};