import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { JournalText } from 'react-bootstrap-icons';
import Volver from '../components/Volver';
import '../css/Perfil.css';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const secretKey = 'mi_clave_secreta'; // La misma clave usada para encriptar

const Perfil = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [cliente, setCliente] = useState(null);
  const [imc, setImc] = useState(null);

  // Desencriptar el ID
  let idCliente = null;
  try {
    const bytes = CryptoJS.AES.decrypt(decodeURIComponent(id), secretKey);
    idCliente = bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Error desencriptando el ID:', error);
  }

  useEffect(() => {
    if (!idCliente) {
      // Si no se pudo desencriptar o no hay id, redirigir o mostrar error
      navigate('/');
      return;
    }

    const obtenerCliente = async () => {
      try {
        const res = await axios.post('http://localhost:3001/api/cliente-detalle', { idCliente });
        const data = res.data;
        setCliente(data);

        const peso = parseFloat(data.peso_cli);
        const altura_metros = parseFloat(data.estatura_cli) / 100;

        if (!isNaN(peso) && !isNaN(altura_metros) && altura_metros > 0) {
          const imcCalculado = peso / (altura_metros * altura_metros);
          setImc(imcCalculado.toFixed(1));
        } else {
          setImc(null);
        }
      } catch (error) {
        console.error('Error al obtener cliente:', error);
      }
    };

    obtenerCliente();
  }, [idCliente, navigate]);

  if (!cliente) return <p>Cargando...</p>;

  return (
    <div className="perfil-view">
      <Volver />

      <div
        className="profile-header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
      >
        <div>
          <h1 style={{ marginBottom: '10px' }}>
            {cliente.nombre_cli} {cliente.app_cli} {cliente.apm_cli}
          </h1>
          <div className="profile-details" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <p>Edad: {cliente.edad_cli} años</p>
            <p>Correo: {cliente.correo_cli}</p>
            <p>Estado: {cliente.tiene_acceso ? 'Activo' : 'Inactivo'}</p>
          </div>
        </div>
        <button
          className="dieta"
          onClick={() => {
            // Encriptar para navegar a dieta1 con ID oculto también
            const encryptedId = CryptoJS.AES.encrypt(cliente.id_cli.toString(), secretKey).toString();
            navigate(`/dieta1/${encodeURIComponent(encryptedId)}`);
          }}
          style={{ alignSelf: 'center' }}
        >
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
              <td>{cliente.peso_cli}</td>
              <td>{cliente.estatura_cli}</td>
              <td>{imc || 'N/D'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="profile-card">
        <h2>Objetivo Nutricional</h2>
        <div className="card-content">
          <p>{cliente.objetivo || 'No especificado'}</p>
        </div>
      </div>

      <div className="profile-card">
        <h2>Dietas Asignadas</h2>
        <div className="card-content">
          {cliente.dietas && cliente.dietas.length > 0 ? (
            <ul>
              {cliente.dietas.map((d, i) => (
                <li key={i}>{d}</li>
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

      <div className="profile-card">
        <h2>Antecedentes Médicos</h2>
        <div className="card-content">
          {cliente.antecedentes_medicos && cliente.antecedentes_medicos.length > 0 ? (
            <div className="antecedentes-table-container">
              <table className="antecedentes-table">
                <thead>
                  <tr>
                    <th>Motivo</th>
                    <th>Heredo Familiares</th>
                    <th>No Patológicos</th>
                    <th>Patológicos</th>
                    <th>Alergias</th>
                    <th>Aversiones</th>
                    <th>Fecha Registro</th>
                  </tr>
                </thead>
                <tbody>
                  {cliente.antecedentes_medicos.map((a, i) => (
                    <tr key={i}>
                      <td>{a.motivo}</td>
                      <td>{a.heredo_familiares}</td>
                      <td>{a.no_patologicos}</td>
                      <td>{a.patologicos}</td>
                      <td>{a.alergias}</td>
                      <td>{a.aversiones}</td>
                      <td>{new Date(a.fecha_registro).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No hay antecedentes registrados</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;
