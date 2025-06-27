import { useState } from 'react';
import { Search, PlusCircle, Person, JournalText } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import NavigationPanel from '../components/NavigationPanel';
import '../css/Inicio.css';

const Inicio = () => {
   const navigate = useNavigate();
  const [pacientes] = useState([
    {
      nombre: "Ana Martínez",
      edad: 32,
      imc: 25,
      objetivo: "Pérdida de peso"
    },
    {
      nombre: "Carlos Rodríguez",
      edad: 45,
      imc: 26.8,
      objetivo: "Control de diabetes",
    }
  ]);

  const [busqueda, setBusqueda] = useState('');

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
          {pacientes.map((paciente, index) => (
            <div key={index} className="tarjeta-paciente">
              <div className="info-paciente">
                <h3>{paciente.nombre}</h3>
                <p>{paciente.edad} años - IMC: {paciente.imc} - {paciente.objetivo}</p>
                
              </div>
              
              <div className="acciones-paciente">
                <button className="ver" onClick={() => navigate('/perfil')} >
                  <Person className="icono-accion" />
                  Ver Perfil
                </button>
                <button onClick={() => navigate('/dieta1')} >
                  <JournalText className="icono-accion" />
                  Asignar Dieta
                </button>
              </div>
            </div>
          ))}

          
        </div>
      </div>
    </div>
  );
   <NavigationPanel />
};

export default Inicio;