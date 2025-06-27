import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/RegistroProfesional.css';

export default function RegistroProfesional() {
  const navigate = useNavigate();

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
          <input type="text" placeholder="Nombre completo" />
          <input type="email" placeholder="Correo electrónico" />
          <input type="password" placeholder="Contraseña" />
          <input type="text" placeholder="Cédula profesional" />
          <input type="text" placeholder="Especialidad (Opcional)" />
          <input type="tel" placeholder="Teléfono de contacto" />
          <button className="btn-enviar" onClick={() => navigate('/login')} >Enviar Formulario</button>

          <p className="texto-login">
            ¿Ya estás registrado?{' '}
              Inicia sesión aquí.
          </p>

          <button className="btn-iniciar" onClick={() => navigate('/login')}>
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
