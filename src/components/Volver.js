import { 
  ArrowLeft, 
  People, 
  FileEarmarkText, 
  Gear 
} from "react-bootstrap-icons";
import { useNavigate, useLocation } from "react-router-dom";
import styles from '../css/Volver.module.css';

export default function NavigationPanel() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.pathname === '/dieta2') {
      // Si está en /dieta2, ir a /dieta1 preservando el state
      navigate('/dieta1', {
        replace: true,
        state: location.state
      });
    } else {
      
      navigate(-1);
    }
  };

  return (
    <div className={styles.navigationPanel}>
      {/* Botón volver */}
      <button className={styles.backButton} onClick={handleBack}>
        <ArrowLeft className={styles.backIcon} />
        <span>Volver</span>
      </button>

    
    </div>
  );
}
