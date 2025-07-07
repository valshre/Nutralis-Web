import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/nutriologos/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: correo.trim(),
          password: password.trim(),
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en la solicitud');
      }

      // Guardar token y datos EXACTAMENTE como lo hacías antes
      localStorage.setItem('nutriologo', JSON.stringify({
        id: data.id_nut || data.id, // Mantiene compatibilidad con tu estructura original
        nombre: data.nombre,
        tipo_usu: data.tipo_usu,
        rol: data.tipo_usu === 0 ? 'admin' : 'nutriologo' // Exactamente como lo tenías
      }));




      // Guardar el token por separado
      localStorage.setItem('token', data.token);

      // REDIRECCIÓN ORIGINAL (tal como la tenías)
      if (data.tipo_usu === 0 || data.tipo_usu === '0') {
        navigate('/admin'); // Redirige a /admin para administradores
      } else {
        navigate('/inicio'); // Redirige a /inicio para nutriólogos
      }

    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor');
      // Limpiar localStorage en caso de error
      localStorage.removeItem('nutriologo');
      localStorage.removeItem('token');
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

          <button type="submit" className="btn-enviar" disabled={isLoading}>
            {isLoading ? 'Cargando...' : 'Ingresar'}
          </button>

          <p className="texto-login">¿No estás registrado?</p>

          <button
            type="button"
            className="btn-iniciar"
            onClick={() => navigate('/registroprofesional')}
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}