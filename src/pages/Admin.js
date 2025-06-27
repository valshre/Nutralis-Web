// admin.js

import React, { useState } from 'react';
import NavigationPanel from '../components/NavigationPanel';
import '../css/Admin.css';

const nutriologosData = [
  {
    id: 1,
    nombre: 'Dr. María González Pérez',
    correo: 'maria.gonzalez@email.com',
    especialidad: 'Nutrición Clínica',
    cedula: '1234567',
    registro: '2024-01-15',
    pacientes: 24,
    dietas: 156,
    estado: 'Aprobado',
   
  },
  {
    id: 2,
    nombre: 'Dr. Carlos Mendoza Silva',
    correo: 'carlos.mendoza@email.com',
    especialidad: 'Nutrición',
    cedula: '9876543',
    registro: '2024-02-01',
    pacientes: 0,
    dietas: 0,
    estado: 'Pendiente',
  
  }
  // Agrega más nutriólogos según se necesite
];

const estadosFiltro = ['Todos los estados', 'Aprobados', 'Pendientes', 'Rechazados', 'Inactivos'];

function Admin() {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('Todos los estados');

  const filtrarNutriologos = (estado) => {
    if (estado === 'Todos los estados') return nutriologosData;
    return nutriologosData.filter((n) => n.estado === estado);
  };

  const nutriologosFiltrados = filtrarNutriologos(estadoSeleccionado);

  return (
    <div className="admin-container">
      <NavigationPanel />
      <div className="admin-content">
        <h1 className="admin-title">Gestión de Nutriólogos</h1>
        <p className="admin-description">
          Revisa y aprueba las solicitudes de registro de nuevos nutriólogos
        </p>

        <div className="admin-filtros">
          <input
            type="text"
            placeholder="Buscar por nombre, email"
            className="admin-busqueda"
          />

          <div className="admin-dropdown">
            <select
              value={estadoSeleccionado}
              onChange={(e) => setEstadoSeleccionado(e.target.value)}
            >
              {estadosFiltro.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-total">
            {nutriologosFiltrados.length} de {nutriologosData.length} nutriólogos
          </div>
        </div>

        <div className="admin-cards">
          {nutriologosFiltrados.map((n) => (
            <div key={n.id} className="admin-card">
                    <div className="admin-info">
                <div className="admin-header">
                  <strong>{n.nombre}</strong>
                  <span className={`estado ${n.estado.toLowerCase()}`}>
                    {n.estado}
                  </span>
                </div>
                <div className="admin-detalles">
                  <p>{n.correo}</p>
                  <p>{n.especialidad}</p>
                  <p>Cédula: {n.cedula}</p>
                  <p>Registro: {n.registro}</p>
                  <p>Pacientes: {n.pacientes}</p>
                  <p>Dietas: {n.dietas}</p>
                </div>
              </div>
              <div className="admin-acciones">
                <button className="ver-detalles">👁 Ver Detalles</button>
                {n.estado === 'Pendiente' && (
                  <>
                    <button className="aceptar">Aceptar</button>
                    <button className="rechazar">Rechazar</button>
                  </>
                )}
                {n.estado === 'Aprobado' && (
                  <div className="menu-desplegable">
                    <button className="mas-opciones">⋮</button>
                    <div className="menu-contenido">
                      <button className="desactivar">✖ Desactivar</button>
                      <button className="ver-detalles">👁 Ver Detalles</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;
