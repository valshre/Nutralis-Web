import React, { useState, useEffect, useRef } from 'react';
import Volver from '../components/Volver';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import '../css/Dieta2.css';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const secretKey = 'mi_clave_secreta'; // Igual que en backend o Dieta1

const tiemposComida = [
  'Desayuno',
  'Colación Matutina',
  'Comida',
  'Colación Vespertina',
  'Cena'
];

// Función para traducir (igual que antes)...

const Dieta2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // ID encriptado recibido
  const idClienteEncrypted = params.id || location.state?.idCliente || null;

  const [idCliente, setIdCliente] = useState(null);
  const [paciente, setPaciente] = useState('Cargando...');
  const [error, setError] = useState(null);

  const {
    nombre = '',
    objetivo = '',
    calorias = '',
    duracion = '',
    notas = '',
    proteinas = 25,
    carbohidratos = 45,
    grasas = 30
  } = location.state || {};

  const [caloriasTotales, setCaloriasTotales] = useState(0);
  const [alimentos, setAlimentos] = useState({});
  const [formVisible, setFormVisible] = useState({});
  const [nombreInput, setNombreInput] = useState('');
  const [nuevoAlimento, setNuevoAlimento] = useState({ nombre: '', cantidad: '', calorias: '', caloriasPor100g: '' });
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarSelect, setMostrarSelect] = useState(false);
  const [cargando, setCargando] = useState(false);
  const debounceRef = useRef();

  // Desencriptar id y obtener paciente
  useEffect(() => {
    if (!idClienteEncrypted) {
      setError('No se recibió ID del cliente');
      setPaciente('');
      return;
    }

    try {
      const bytes = CryptoJS.AES.decrypt(decodeURIComponent(idClienteEncrypted), secretKey);
      const idDesencriptado = bytes.toString(CryptoJS.enc.Utf8);

      if (!idDesencriptado || isNaN(idDesencriptado)) {
        setError('ID de cliente inválido tras desencriptar');
        setPaciente('');
        return;
      }

      setIdCliente(idDesencriptado);
      obtenerDatosCliente(idDesencriptado);

    } catch (e) {
      setError('Error desencriptando el ID del cliente');
      setPaciente('');
      console.error(e);
    }
  }, [idClienteEncrypted]);

  const obtenerDatosCliente = async (id) => {
    try {
      const res = await axios.post('http://localhost:3001/api/cliente-detalle', { idCliente: id });
      const data = res.data;

      const nombreCompleto = `${data.nombre_cli} ${data.app_cli} ${data.apm_cli}`;
      setPaciente(nombreCompleto);
    } catch (err) {
      setError('Error al obtener datos del cliente');
      setPaciente('');
      console.error(err);
    }
  };

  // Funciones para manejar formulario, agregar alimentos, etc (igual que tu código original)...

  const handleAgregar = (tiempo) => {
    setFormVisible((prev) => ({ ...prev, [tiempo]: true }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'nombre') {
      setNombreInput(value);
      setNuevoAlimento({ nombre: '', cantidad: '', calorias: '', caloriasPor100g: '' });
    } else {
      setNuevoAlimento((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    if (nombreInput.length >= 3) {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        buscarAlimento(nombreInput);
      }, 600);
    } else {
      setSugerencias([]);
      setMostrarSelect(false);
    }
  }, [nombreInput]);

  useEffect(() => {
    if (
      nuevoAlimento.cantidad &&
      nuevoAlimento.caloriasPor100g &&
      !isNaN(nuevoAlimento.cantidad) &&
      !isNaN(nuevoAlimento.caloriasPor100g)
    ) {
      const calculo = (parseFloat(nuevoAlimento.cantidad) * parseFloat(nuevoAlimento.caloriasPor100g)) / 100;
      setNuevoAlimento((prev) => ({ ...prev, calorias: calculo.toFixed(2) }));
    } else {
      setNuevoAlimento((prev) => ({ ...prev, calorias: '' }));
    }
  }, [nuevoAlimento.cantidad, nuevoAlimento.caloriasPor100g]);

  const buscarAlimento = async (valor) => {
    setCargando(true);
    try {
      // Traducción y llamada a API USDA (igual que antes)
      // ...
    } catch (error) {
      console.error('Error al buscar alimento:', error);
      setSugerencias([]);
      setMostrarSelect(false);
    } finally {
      setCargando(false);
    }
  };

  const handleSelectChange = (e) => {
    const producto = sugerencias.find(p => p.fdcId.toString() === e.target.value);
    if (producto) {
      setNuevoAlimento({
        nombre: producto.nombre_es,
        cantidad: '',
        calorias: '',
        caloriasPor100g: producto.caloriasPor100g
      });
      setNombreInput(producto.nombre_es);
    }
    setMostrarSelect(false);
  };

  const guardarAlimento = (tiempo) => {
    const caloriasNum = parseFloat(nuevoAlimento.calorias) || 0;
    setAlimentos((prev) => ({
      ...prev,
      [tiempo]: [...(prev[tiempo] || []), nuevoAlimento]
    }));
    setCaloriasTotales((prev) => prev + caloriasNum);
    setNuevoAlimento({ nombre: '', cantidad: '', calorias: '', caloriasPor100g: '' });
    setNombreInput('');
    setFormVisible((prev) => ({ ...prev, [tiempo]: false }));
  };

  const eliminarAlimento = (tiempo, index) => {
    const cal = parseFloat(alimentos[tiempo][index].calorias) || 0;
    setAlimentos((prev) => {
      const copia = [...prev[tiempo]];
      copia.splice(index, 1);
      return { ...prev, [tiempo]: copia };
    });
    setCaloriasTotales((prev) => prev - cal);
  };

  // Aquí función para guardar dieta completa en BD
  const handleGuardarDieta = async () => {
    if (!idCliente) {
      alert('ID de cliente no definido');
      return;
    }

    try {
      await axios.post('http://localhost:3001/api/guardar-dieta', {
        idCliente,
        nombreDieta: nombre,
        objetivoDieta: objetivo,
        duracion,
        proteinas,
        carbohidratos,
        grasas,
        caloriasObjetivo: calorias,
        recomendaciones: notas,
        alimentosPorTiempo: alimentos
      });
      alert('Dieta guardada correctamente');
      navigate('/inicio');
    } catch (error) {
      console.error('Error al guardar dieta:', error);
      alert('Error al guardar dieta');
    }
  };

  return (
    <div className="dieta2-container">
      <Volver />

      <div className="dieta2-content">
        <aside className="configuracion">
          <h2><i className="bi bi-gear"></i> Configuración</h2>
          <p><strong>Paciente:</strong> {error ? <span style={{color:'red'}}>{error}</span> : (paciente || 'Cargando...')}</p>
          <p><strong>Dieta:</strong> {nombre || 'Sin nombre'}</p>
          <p><strong>Objetivo:</strong> {objetivo || 'Sin objetivo'}</p>
          <p><strong>Calorías objetivo:</strong> {calorias || 'No definidas'} kcal</p>
          <hr />
          <h3>Macronutrientes</h3>
          <p><span className="dot blue"></span> Proteínas {proteinas}%</p>
          <p><span className="dot green"></span> Carbohidratos {carbohidratos}%</p>
          <p><span className="dot orange"></span> Lípidos {grasas}%</p>
          <hr />
          <p className="calorias-totales">Calorías totales: {caloriasTotales.toFixed(2)} kcal</p>
        </aside>

        <main className="tiempos-comida">
          <h2><i className="bi bi-clock"></i> Tiempos de Comida</h2>
          {tiemposComida.map((tiempo, index) => (
            <section key={index} className="bloque-comida">
              <div className="titulo-tiempo">
                <i className="bi bi-apple"></i>
                <h3>{tiempo}</h3>
              </div>
              <div className="centrado">
                <button className="btn-agregar" onClick={() => handleAgregar(tiempo)}>Agregar Alimento</button>
              </div>
              {formVisible[tiempo] && (
                <div className="form-alimento">
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Alimento"
                    value={nombreInput}
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                  {cargando && <p>Cargando...</p>}
                  {mostrarSelect && sugerencias.length > 0 && (
                    <select onChange={handleSelectChange} size={5}>
                      <option value="">Selecciona una sugerencia</option>
                      {sugerencias.map(p => (
                        <option key={p.fdcId} value={p.fdcId}>
                          {p.nombre_es} - {p.caloriasPor100g} kcal/100g
                        </option>
                      ))}
                    </select>
                  )}
                  <input
                    type="text"
                    name="cantidad"
                    placeholder="Cantidad (g)"
                    value={nuevoAlimento.cantidad}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="calorias"
                    placeholder="Calorías"
                    value={nuevoAlimento.calorias}
                    disabled
                  />
                  <div className="centrado">
                    <button
                      onClick={() => guardarAlimento(tiempo)}
                      className="btn-agregar"
                      disabled={
                        !nuevoAlimento.nombre ||
                        !nuevoAlimento.cantidad ||
                        !nuevoAlimento.calorias
                      }
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              )}
              {alimentos[tiempo]?.length ? (
                <ul>
                  {alimentos[tiempo].map((item, i) => (
                    <li key={i}>
                      {item.nombre} - {item.cantidad} g - {item.calorias} kcal
                      <button className="btn-eliminar" onClick={() => eliminarAlimento(tiempo, i)}>Eliminar</button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="vacio">No hay alimentos agregados para este tiempo de comida</p>
              )}
            </section>
          ))}
          <div className="recomendaciones">
            <h3><i className="bi bi-clipboard-check"></i> Recomendaciones Específicas</h3>
            <textarea
              className="input-recomendaciones"
              placeholder="Instrucciones adicionales para el paciente"
              rows={3}
              value={notas}
              onChange={e => {
                // Aquí podrías actualizar estado si quieres guardar recomendaciones dinámicamente
              }}
            />
          </div>
          <div className="centrado">
            <button className="guardar-dieta" onClick={handleGuardarDieta}>Guardar Dieta</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dieta2;
