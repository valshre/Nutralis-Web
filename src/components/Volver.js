import { 
  ArrowLeft, 
  People, 
  FileEarmarkText, 
  Gear 
} from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import styles from '../css/Volver.module.css';

export default function NavigationPanel() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Navega a la página anterior
  };

  return (
    <div className={styles.navigationPanel}>

      {/* Botón volver */}
      <button className={styles.backButton} onClick={handleBack}>
        <ArrowLeft className={styles.backIcon} />
        <span>Volver</span>
      </button>

      {/* Menú de navegación */}
      
    </div>
  );
}
