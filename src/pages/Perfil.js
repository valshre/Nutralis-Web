import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  JournalText } from 'react-bootstrap-icons';
import Volver from '../components/Volver';
import '../css/Perfil.css';

const Perfil = () => {
  const navigate = useNavigate();
  const [weight] = useState('68');
  const [height] = useState('165');
  const [imc] = useState('25.0');
  const [nutritionalGoal] = useState('Mantener un peso saludable y mejorar hábitos alimenticios.');
  const [assignedDiets] = useState([
    'Dieta Mediterránea - Inicio: 10/01/2024',
    'Plan de alimentación baja en carbohidratos - Inicio: 15/01/2024'
  ]);

  return (
    <div className="perfil-view">
      <Volver />
      
  <div className="profile-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
  <div>
    <h1 style={{ marginBottom: '10px' }}>Ana Martinez</h1>
    <div className="profile-details" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
      <p>Edad: 32 años</p>
      <p>Correo: ana.martinez@email.com</p>
    
      <p>Estado: Activo</p>
    </div>
  </div>
   <button className="dieta" onClick={() => navigate('/dieta1')} style={{ 
    alignSelf: 'center', justifyContent:'flex-start'
  }}>
    <JournalText className="icono-accion" /> Asignar Dieta
  </button>
</div>

      <div className="profile-card">
        <h2>Información Antropométrica</h2>
        <table className="anthropometric-table">
          <thead>
            <tr>
              <th>Peso (kg)</th>
              <th>Altura (cm)</th>
              <th>IMC</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{weight}</td>
              <td>{height}</td>
              <td>{imc}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="profile-card">
        <h2>Objetivo Nutricional</h2>
        <div className="card-content">
          <p>{nutritionalGoal}</p>
        </div>
      </div>

     <div className="profile-card">
  <h2>Dietas Asignadas</h2>
  <div className="card-content">
    {assignedDiets.length > 0 ? (
      <ul>
        {assignedDiets.map((diet, index) => (
          <li key={index}>{diet}</li>
        ))}
      </ul>
    ) : (
      <p>No hay dietas asignadas</p>
    )}
  </div>
  <button className="ver-dietas-btn" onClick={() => navigate('/dietas')}>
    Ver todas las dietas
  </button>
</div>

    </div>
  );
};

export default Perfil;