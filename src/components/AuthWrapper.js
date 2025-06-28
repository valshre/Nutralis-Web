// src/components/AuthWrapper.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthWrapper = ({ children }) => {
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifySession = async () => {
      try {
        const nutriologo = JSON.parse(localStorage.getItem('nutriologo'));
        const token = localStorage.getItem('token');

        if (!nutriologo || !token) throw new Error('No session data');

        const response = await axios.get('http://localhost:3001/api/verify-session', {
          headers: {
            id_nut: nutriologo.id_nut,
            token: token,
          }
        });

        if (response.data.success) {
          setIsValid(true);
        } else {
          localStorage.removeItem('nutriologo');
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error verifying session:', error);
        localStorage.removeItem('nutriologo');
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [navigate]);

  if (loading) return <div>Cargando...</div>;

  return isValid ? children : null;
};

export default AuthWrapper;
