import { 
  Speedometer2, 
  People, 
  FileEarmarkText, 
  Gear 
} from "react-bootstrap-icons";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../css/NavigationPanel.module.css';

export default function NavigationPanel() {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del enlace
    
    try {
      // Hacer la petición de logout al servidor
      const response = await axios.post('http://localhost:3001/api/logout', {}, {
        withCredentials: true
      });
      
      if (response.data.success) {
        // Limpiar el almacenamiento local
        localStorage.removeItem('userData');
        localStorage.removeItem('userType');
        sessionStorage.removeItem('tempData'); // Si usas sessionStorage
        
        // Redirigir al login
        navigate('/login');
      } else {
        console.error('Error en la respuesta de logout:', response.data.message);
        // Aún así limpiar y redirigir
        localStorage.removeItem('userData');
        localStorage.removeItem('userType');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Aún así limpiar y redirigir
      localStorage.removeItem('userData');
      localStorage.removeItem('userType');
      navigate('/login');
    }
  };

  return (
    <div className={styles.navigationPanel}>
      {/* Items de navegación */}
      <nav className={styles.navMenu}>
        <a href="/inicio" className={styles.navItem}>
          <People className={styles.navIcon} />
          <span>Pacientes</span>
        </a>
        <a href="/reportes" className={styles.navItem}>
          <FileEarmarkText className={styles.navIcon} />
          <span>Reportes</span>
        </a>
        <a href="/cuenta" className={styles.navItem}>
          <Gear className={styles.navIcon} />
          <span>Cuenta</span>
        </a>
        <a href="/Admin" className={styles.navItem}>
          <Gear className={styles.navIcon} />
          <span>Admin view</span>
        </a>
        <a 
          href="/salir" 
          className={styles.navItem}
          onClick={handleLogout}
        >
          <span>Salir</span>
        </a>
      </nav>
    </div>
  );
}