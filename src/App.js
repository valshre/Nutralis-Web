import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import RegistroProfesional from './pages/RegistroProfesional';
import Login from './pages/Login';
import Inicio from './pages/Inicio'; 
import Perfil from './pages/Perfil';
import Dieta1 from './pages/Dieta1';
import Dieta2 from './pages/Dieta2';
import Cuenta from './pages/Cuenta';
import Reportes from './pages/Reportes';
import Admin from './pages/Admin';
import NoAutorizado from './pages/NoAutorizado'; 


// ProtectedRoute que acepta userType simple o array de tipos permitidos
const ProtectedRoute = ({ children, requiredUserType = null }) => {
  const nutriologo = JSON.parse(localStorage.getItem('nutriologo'));
  const userType = nutriologo?.tipo_usu;

  if (!nutriologo || userType === undefined || userType === null) {
    return <Navigate to="/login" replace />;
  }

  if (requiredUserType) {
    if (Array.isArray(requiredUserType)) {
      if (!requiredUserType.includes(userType.toString())) {
        return <Navigate to="/no-autorizado" replace />;
      }
    } else {
      if (userType.toString() !== requiredUserType.toString()) {
        return <Navigate to="/no-autorizado" replace />;
      }
    }
  }

  return children;
};

// PublicRoute redirige si ya está autenticado
const PublicRoute = ({ children }) => {
  const nutriologo = JSON.parse(localStorage.getItem('nutriologo'));
  const userType = nutriologo?.tipo_usu;

  if (nutriologo && userType !== undefined && userType !== null) {
    return <Navigate to="/inicio" replace />;
  }
  
  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={
          <PublicRoute>
            <RegistroProfesional />
          </PublicRoute>
        } />
        
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        
        {/* Rutas protegidas para ambos tipos (administrador o nutriólogo) */}
        <Route path="/inicio" element={
          <ProtectedRoute requiredUserType={['0', '1']}>
            <Inicio />
          </ProtectedRoute>
        } />
        
        <Route
  path="/perfil/:id"
  element={
    <ProtectedRoute requiredUserType={['0', '1']}>
      <Perfil />
    </ProtectedRoute>
  }
/>

        
        <Route path="/dieta1/:id" element={
          <ProtectedRoute requiredUserType={['0', '1']}>
            <Dieta1 />
          </ProtectedRoute>
        } />
        
        <Route path="/dieta2" element={
          <ProtectedRoute requiredUserType={['0', '1']}>
            <Dieta2 />
          </ProtectedRoute>
        } />
        
        <Route path="/cuenta" element={
          <ProtectedRoute requiredUserType={['0', '1']}>
            <Cuenta />
          </ProtectedRoute>
        } />
        
        {/* Rutas solo para nutriólogos */}
        <Route path="/reportes" element={
          <ProtectedRoute requiredUserType="1">
            <Reportes />
          </ProtectedRoute>
        } />
        
        {/* Rutas solo para administradores */}
        <Route path="/admin" element={
          <ProtectedRoute requiredUserType="0">
            <Admin />
          </ProtectedRoute>
        } />
        
        <Route path="/no-autorizado" element={<NoAutorizado />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
