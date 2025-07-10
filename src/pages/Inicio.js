import { useEffect, useState } from 'react';
import { Search, Person, JournalText } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import NavigationPanel from '../components/NavigationPanel';
import '../css/Inicio.css';
import axios from 'axios';
import CryptoJS from 'crypto-js';


const Inicio = () => {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
const secretKey = 'mi_clave_secreta';
  useEffect(() => {
  const obtenerPacientes = async () => {
    const nutriologo = JSON.parse(localStorage.getItem('nutriologo'));
    const idNutriologo = nutriologo?.id;

    if (idNutriologo) {
      try {
        const res = await axios.post('http://localhost:3001/api/clientes-por-nutriologo', { idNutriologo });
        console.log("Pacientes recibidos:", res.data);
        setPacientes(res.data);
      } catch (err) {
        console.error("Error al cargar pacientes:", err);
      }
    }
  };

  obtenerPacientes();
}, []);


  // Función para calcular IMC redondeado a 1 decimal, retorna "N/D" si no hay datos
  const calcularIMC = (peso, estatura) => {
    if (!peso || !estatura) return 'N/D';
    const imc = peso / (estatura * estatura);
    return imc.toFixed(1);
  };

  return (
    <div className="inicio-view">
      <NavigationPanel />
      <div className="contenido-principal">
        <h1>Mis Pacientes</h1>

        <div className="buscador-container">
          <Search className="icono-busqueda" />
          <input
            type="text"
            placeholder="       Buscar pacientes..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="lista-pacientes">
          {pacientes
            .filter((paciente) =>
              paciente.nombre_cli?.toLowerCase().includes(busqueda.toLowerCase())
            )
            .map((paciente, index) => (
               console.log(paciente),
              <div key={index} className="tarjeta-paciente">
                <div className="info-paciente">
                  <h3>{paciente.nombre_cli} {paciente.app_cli} {paciente.apm_cli}</h3>
                  <p>
                    {paciente.edad_cli} años - IMC: {calcularIMC(paciente.peso_cli, paciente.estatura_cli)} - {paciente.objetivo || 'Sin objetivo'}
                  </p>
                </div>

                <div className="acciones-paciente">
                  <button
  className="ver"
  onClick={() => {
    const encryptedId = CryptoJS.AES.encrypt(paciente.id_cli.toString(), secretKey).toString();
    navigate(`/perfil/${encodeURIComponent(encryptedId)}`);
  }}
>
  <Person className="icono-accion" />
  Ver Perfil
</button>
                <button
  className="ver"
  onClick={() => {
    const encryptedId = CryptoJS.AES.encrypt(paciente.id_cli.toString(), secretKey).toString();
    navigate(`/dieta1/${encodeURIComponent(encryptedId)}`);
  }}
>
  <JournalText className="icono-accion" />
  Asignar Dieta
</button>
                  <button onClick={() => navigate('/dieta1')}>
                    <JournalText className="icono-accion" />
                    Desvincular paciente
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Inicio;
