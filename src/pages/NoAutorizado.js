// src/pages/NoAutorizado.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NoAutorizado() {
  const navigate = useNavigate();
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      textAlign: 'center'
    }}>
      <h1>403 - Acceso no autorizado</h1>
      <p>No tienes permisos para acceder a esta página.</p>
      <button 
        onClick={() => navigate(-1)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Volver atrás
      </button>
    </div>
  );
}