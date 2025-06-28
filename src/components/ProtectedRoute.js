import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, userType = null }) => {
  const nutriologo = JSON.parse(localStorage.getItem('nutriologo'));
  const storedUserType = nutriologo?.tipo_usu;

  if (!nutriologo || storedUserType === undefined || storedUserType === null) {
    return <Navigate to="/login" replace />;
  }

  if (userType) {
    if (Array.isArray(userType)) {
      if (!userType.map(String).includes(String(storedUserType))) {
        return <Navigate to="/no-autorizado" replace />;
      }
    } else {
      if (String(storedUserType) !== String(userType)) {
        return <Navigate to="/no-autorizado" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;
