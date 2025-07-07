import { People, FileEarmarkText, Gear, BoxArrowRight } from "react-bootstrap-icons";
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from '../css/NavigationPanel.module.css';

export default function NavigationPanel() {
  const navigate = useNavigate();

 const handleLogout = async (e) => {
  e.preventDefault();

  // Obtenemos datos del localStorage
  const userData = JSON.parse(localStorage.getItem('nutriologo'));
  const token = localStorage.getItem('token');

  // Validación robusta
  if (!userData || !userData.id || userData.tipo_usu === undefined || !token) {
    localStorage.clear();
    navigate('/login');
    return;
  }

  try {
    // Convertimos tipo_usu a rol (según tu DB)
    const rol = userData.tipo_usu === 0 ? 'admin' : 'nutriologo';
    
    await axios.post(
      'http://localhost:3001/api/nutriologos/logout',
      {
        id: userData.id,
        rol: rol // Enviamos el rol convertido
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      }
    );

    
    // Limpieza y redirección
    localStorage.clear();
    navigate('/login');
  } catch (error) {
    console.error('Error en logout:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    localStorage.clear();
    navigate('/login');
  }
};
  return (
    <div className={styles.navigationPanel}>
      <nav className={styles.navMenu}>
        <Link to="/inicio" className={styles.navItem}>
          <People className={styles.navIcon} />
          <span>Pacientes</span>
        </Link>
        <Link to="/reportes" className={styles.navItem}>
          <FileEarmarkText className={styles.navIcon} />
          <span>Reportes</span>
        </Link>
        <Link to="/cuenta" className={styles.navItem}>
          <Gear className={styles.navIcon} />
          <span>Cuenta</span>
        </Link>

        <button
          onClick={handleLogout}
          className={styles.navItem}
          style={{
            background: 'none',
            padding: 0,
            marginRight: -44
          }}
          aria-label="Cerrar sesión"
        >
          <BoxArrowRight className={styles.navIcon} />
          <span>Salir</span>
        </button>
      </nav>
    </div>
  );
}