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

// Componente para rutas protegidas
const ProtectedRoute = ({ children, requiredUserType = null }) => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const userType = localStorage.getItem('userType');

  // Si no hay sesión
  if (!userData || !userType) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un tipo específico de usuario
  if (requiredUserType && userType !== requiredUserType) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return children;
};

// Componente para redirigir si ya está autenticado
const PublicRoute = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const userType = localStorage.getItem('userType');
  
  if (userData && userType) {
    // Redirigir a inicio si ya está logueado
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
        
        {/* Rutas protegidas */}
        <Route path="/inicio" element={
          <ProtectedRoute>
            <Inicio />
          </ProtectedRoute>
        } />
        
        <Route path="/perfil" element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        } />
        
        <Route path="/dieta1" element={
          <ProtectedRoute>
            <Dieta1 />
          </ProtectedRoute>
        } />
        
        <Route path="/dieta2" element={
          <ProtectedRoute>
            <Dieta2 />
          </ProtectedRoute>
        } />
        
        <Route path="/cuenta" element={
          <ProtectedRoute>
            <Cuenta />
          </ProtectedRoute>
        } />
        
        <Route path="/reportes" element={
          <ProtectedRoute requiredUserType="nutriologo">
            <Reportes />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
         
            <Admin />
         
            
        } />
        
      
    
        <Route path="/no-autorizado" element={<NoAutorizado />} />
        
       
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}