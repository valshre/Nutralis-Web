// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, userType = null }) => {
  // Obtener datos de usuario del localStorage
  const userData = JSON.parse(localStorage.getItem('userData'));
  const storedUserType = localStorage.getItem('userType');
  
  // Si no hay usuario o no coincide el tipo requerido
  if (!userData || !storedUserType) {
    return <Navigate to="/login" replace />;
  }
  
  // Si se especificó un tipo de usuario y no coincide
  if (userType && storedUserType !== userType) {
    return <Navigate to="/no-autorizado" replace />;
  }
  
  return children;
};

export default ProtectedRoute;