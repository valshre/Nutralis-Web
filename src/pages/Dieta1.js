import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationPanel from '../components/NavigationPanel';
import Volver from '../components/Volver';
import '../css/Dieta1.css';

const Dieta1 = () => {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [calorias, setCalorias] = useState('');
  const [duracion, setDuracion] = useState('');
  const [notas, setNotas] = useState('');

  const [proteinas, setProteinas] = useState(25);
  const [carbohidratos, setCarbohidratos] = useState(45);
  const [grasas, setGrasas] = useState(30);

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
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <label>Objetivo Principal *</label>
          <input
            type="text"
            placeholder="Ej: Perder peso"
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value)}
          />

          <label>Calorías Diarias *</label>
          <input
            type="number"
            value={calorias}
            onChange={(e) => setCalorias(e.target.value)}
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
        <button onClick={() => navigate('/dieta2')}>Continuar con la Dieta</button>
      </div>
      
    </div>
  );
};

export default Dieta1;
