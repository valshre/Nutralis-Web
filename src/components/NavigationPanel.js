import { People, FileEarmarkText, Gear } from "react-bootstrap-icons";
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from '../css/NavigationPanel.module.css';

export default function NavigationPanel() {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

    const nutriologo = JSON.parse(localStorage.getItem('nutriologo'));
    const token = localStorage.getItem('token');

    if (!nutriologo || !nutriologo.id_nut || !token) {
      localStorage.removeItem('token');
      localStorage.removeItem('nutriologo');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3001/api/nutriologos/logout',
        { id_nut: nutriologo.id_nut },
        {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.message === 'Sesión cerrada correctamente') {
        localStorage.removeItem('token');
        localStorage.removeItem('nutriologo');
        sessionStorage.clear();
        navigate('/login');
      } else {
        console.error('Respuesta inesperada al cerrar sesión:', response.data);
        localStorage.removeItem('token');
        localStorage.removeItem('nutriologo');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('nutriologo');
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
        <Link to="/admin" className={styles.navItem}>
          <Gear className={styles.navIcon} />
          <span>Admin View</span>
        </Link>
        <button
          onClick={handleLogout}
          className={styles.navItem}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            color: 'inherit',
            font: 'inherit'
          }}
          aria-label="Cerrar sesión"
        >
          <span>Salir</span>
        </button>
      </nav>
    </div>
  );
}
