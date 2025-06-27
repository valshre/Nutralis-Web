import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/RegistroProfesional.css';

export default function RegistroProfesional() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre_nut: '',
    app_nut: '',
    apm_nut: '',
    correo: '',
    password: '',
    confirmarPassword: '',
    cedula: '',
    especialidad: '',
    telefono: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setError('');

    const {
      nombre_nut,
      app_nut,
      password,
      confirmarPassword,
      correo,
      cedula,
      telefono,
    } = formData;

    // Validar campos obligatorios (apm_nut es opcional)
    if (!nombre_nut || !app_nut || !correo || !password || !confirmarPassword || !cedula || !telefono) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }

    // Validar longitud mínima de contraseña
    if (password.length < 5) {
      setError('La contraseña debe tener al menos 5 caracteres.');
      return;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmarPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/nutriologos/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_nut: formData.nombre_nut,
          app_nut: formData.app_nut,
          apm_nut: formData.apm_nut, // opcional
          correo: formData.correo,
          password: formData.password,
          cedula_nut: formData.cedula,
          especialidad_nut: formData.especialidad,
          telefono_nut: formData.telefono,
          token_vinculacion: 'AUTO' + Math.floor(Math.random() * 100000),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        navigate('/login');
      } else {
        setError(data.error || 'Error al registrar.');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="registro-container">
      <div className="barra-superior" />
      <div className="titulo">
        <p className="texto-titulo">Registro de Profesionales en Nutrición</p>
      </div>
      <div className="contenido">
        <div className="logo-container">
          <img src="/logo.png" alt="Logo" className="logo" />
        </div>
        <div className="formulario">

          {error && <p className="error">{error}</p>}

          <div className="fila tres-columnas">
            <input
              type="text"
              name="nombre_nut"
              placeholder="Nombre(s)"
              onChange={handleChange}
            />
            <input
              type="text"
              name="app_nut"
              placeholder="Apellido paterno"
              onChange={handleChange}
            />
            <input
              type="text"
              name="apm_nut"
              placeholder="Apellido materno (opcional)"
              onChange={handleChange}
            />
          </div>

          <div className="fila una-columna">
            <input
              type="email"
              name="correo"
              placeholder="Correo electrónico"
              onChange={handleChange}
            />
          </div>

          <div className="fila dos-columnas">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmarPassword"
              placeholder="Confirmar contraseña"
              onChange={handleChange}
            />
          </div>

          <div className="fila tres-columnas">
            <input
              type="text"
              name="cedula"
              placeholder="Cédula profesional"
              onChange={handleChange}
            />
            <input
              type="text"
              name="especialidad"
              placeholder="Especialidad (Opcional)"
              onChange={handleChange}
            />
            <input
              type="tel"
              name="telefono"
              placeholder="Teléfono de contacto"
              onChange={handleChange}
            />
          </div>

          <button className="btn-enviar" onClick={handleSubmit}>
            Enviar Formulario
          </button>

          <p className="texto-login">
            ¿Ya estás registrado?{' '}
            <span className="link" onClick={() => navigate('/login')}>
              Inicia sesión aquí.
            </span>
          </p>

          <button className="btn-iniciar" onClick={() => navigate('/login')}>
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
