import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import NavigationPanel from '../components/NavigationPanel';
import Volver from '../components/Volver';
import '../css/Dieta1.css';

const Dieta1 = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // Recupera datos si viene desde dieta2
  const [nombre, setNombre] = useState(location.state?.nombre || '');
  const [objetivo, setObjetivo] = useState(location.state?.objetivo || '');
  const [calorias, setCalorias] = useState(location.state?.calorias || '');
  const [duracion, setDuracion] = useState(location.state?.duracion || '');
  const [notas, setNotas] = useState(location.state?.notas || '');
  const [proteinas, setProteinas] = useState(location.state?.proteinas || 25);
  const [carbohidratos, setCarbohidratos] = useState(location.state?.carbohidratos || 45);
  const [grasas, setGrasas] = useState(location.state?.grasas || 30);

  // Errores por campo
  const [errors, setErrors] = useState({});

  const totalMacros = proteinas + carbohidratos + grasas;

  const ajustarMacronutriente = (nuevoValor, tipo) => {
    let restantes;

    if (tipo === 'proteinas') {
      restantes = 100 - nuevoValor - grasas;
      setProteinas(nuevoValor);
      setCarbohidratos(restantes >= 0 ? restantes : 0);
    } else if (tipo === 'carbohidratos') {
      restantes = 100 - nuevoValor - proteinas;
      setCarbohidratos(nuevoValor);
      setGrasas(restantes >= 0 ? restantes : 0);
    } else if (tipo === 'grasas') {
      restantes = 100 - nuevoValor - carbohidratos;
      setGrasas(nuevoValor);
      setProteinas(restantes >= 0 ? restantes : 0);
    }
  };

  const validarCampos = () => {
    const nuevosErrores = {};
    if (!nombre.trim()) nuevosErrores.nombre = true;
    if (!objetivo.trim()) nuevosErrores.objetivo = true;
    if (!calorias) nuevosErrores.calorias = true;

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };
const [intentoEnvio, setIntentoEnvio] = useState(false);

  const handleContinuar = () => {
  setIntentoEnvio(true);

  if (!validarCampos()) {
    // Oculta el mensaje luego de 3 segundos
    setTimeout(() => {
      setIntentoEnvio(false);
    }, 3000);
    return;
  }

  navigate('/dieta2', {
    state: {
      idCliente: id,
      nombre,
      objetivo,
      calorias,
      duracion,
      notas,
      proteinas,
      carbohidratos,
      grasas,
    },
  });
};


  const camposCompletos = nombre && objetivo && calorias;

  return (
    <div className="dieta-container">
      <Volver />

      <div className="left-section">
        <div className="form-section">
          <h2>📓 Información General de la Dieta</h2>
          <p>Define los parámetros básicos de la nueva dieta</p>

          <label>Nombre de la Dieta *</label>
          <input
            type="text"
            placeholder="Ej: Dieta Hipocalórica Personalizada"
            className={errors.nombre ? 'input-error' : ''}
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              setErrors({ ...errors, nombre: false });
            }}
          />

          <label>Objetivo Principal *</label>
          <input
            type="text"
            placeholder="Ej: Perder peso"
            className={errors.objetivo ? 'input-error' : ''}
            value={objetivo}
            onChange={(e) => {
              setObjetivo(e.target.value);
              setErrors({ ...errors, objetivo: false });
            }}
          />

          <label>Calorías Diarias *</label>
          <input
            type="number"
            className={errors.calorias ? 'input-error' : ''}
            value={calorias}
            onChange={(e) => {
              setCalorias(e.target.value);
              setErrors({ ...errors, calorias: false });
            }}
          />

          <label>Duración (semanas)</label>
          <input
            type="number"
            value={duracion}
            onChange={(e) => setDuracion(e.target.value)}
          />

          <label>Descripción y Notas</label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Describe el enfoque de esta dieta, consideraciones especiales, etc."
          ></textarea>
        </div>

        <div className="macros-section">
          <h3>📋 Distribución de Macronutrientes</h3>
          <p>Ajusta los porcentajes de cada macronutriente</p>

          <label>Proteínas</label>
          <input
            type="range"
            min="10"
            max="60"
            value={proteinas}
            onChange={(e) =>
              ajustarMacronutriente(parseInt(e.target.value), 'proteinas')
            }
          />
          <span>{proteinas}%</span>

          <label>Carbohidratos</label>
          <input
            type="range"
            min="5"
            max="70"
            value={carbohidratos}
            onChange={(e) =>
              ajustarMacronutriente(parseInt(e.target.value), 'carbohidratos')
            }
          />
          <span>{carbohidratos}%</span>

          <label>Grasas</label>
          <input
            type="range"
            min="15"
            max="80"
            value={grasas}
            onChange={(e) =>
              ajustarMacronutriente(parseInt(e.target.value), 'grasas')
            }
          />
          <span>{grasas}%</span>
        </div>
      </div>

      <div className="preview-section">
        <h3>Vista Previa</h3>
        <p><strong>Nombre:</strong> {nombre || 'Sin nombre definido'}</p>
        <p><strong>Objetivo:</strong> {objetivo || 'Sin objetivo definido'}</p>
        <p><strong>Calorías diarias:</strong> {calorias || 'No definidas'}</p>

        <hr />

        <h4>Distribución de Macronutrientes</h4>
        <div className="grafica">
          <div className="circle">
            <span>100%</span>
            <span>Total</span>
          </div>
        </div>
        <ul>
          <li><span className="dot blue"></span> Proteínas {proteinas}%</li>
          <li><span className="dot green"></span> Carbohidratos {carbohidratos}%</li>
          <li><span className="dot orange"></span> Grasas {grasas}%</li>
        </ul>

     <button
  onClick={handleContinuar}
  className={!camposCompletos && intentoEnvio ? 'disabled-button' : ''}
>
  Continuar con la Dieta
</button>

{intentoEnvio && !camposCompletos && (
  <p className="mensaje-error">⚠️ Por favor completa todos los campos obligatorios.</p>
)}

      </div>
    </div>
  );
};

export default Dieta1;
