import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/RegistroProfesional.css';

export default function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevenir comportamiento por defecto del formulario
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          correo: correo.trim(), 
          password: password.trim() 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en la solicitud');
      }

      if (data.success) {
       
        localStorage.setItem('userData', JSON.stringify(data.user));
        localStorage.setItem('userType', data.user.userType);
        
        // Redirigir según el tipo de usuario
        switch(data.user.userType) {
          case 'admin':
            navigate('/admin');
            break;
          case 'nutriologo':
            navigate('/inicio');
            break;
          case 'cliente':
            navigate('/perfil');
            break;
          default:
            navigate('/inicio');
        }
      } else {
        setError(data.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="barra-superior" />
      <div className="titulo">
        <p className="texto-titulo">Inicio de sesión</p>
      </div>
      <div className="contenido">
        <div className="logo-container">
          <img src="/logo.png" alt="Logo" className="logo" />
        </div>
        <form onSubmit={handleLogin} className="formulario">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-text">{error}</p>}

          <button 
            type="submit" 
            className="btn-enviar"
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : 'Ingresar'}
          </button>

          <p className="texto-login">
            ¿No estás registrado?{' '}
            
              Regístrate aquí
            
          </p>
          <button className="btn-iniciar" onClick={() => navigate('/registroprofesional')}>
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}