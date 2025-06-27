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
        const response = await axios.get('http://localhost:3001/api/verify-session', {
          withCredentials: true
        });
        
        if (response.data.success) {
          setIsValid(true);
        } else {
          localStorage.removeItem('userData');
          localStorage.removeItem('userType');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error verifying session:', error);
        localStorage.removeItem('userData');
        localStorage.removeItem('userType');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [navigate]);

  if (loading) {
    return <div>Cargando...</div>; // Puedes poner un spinner aquí
  }

  return isValid ? children : null;
};

export default AuthWrapper;