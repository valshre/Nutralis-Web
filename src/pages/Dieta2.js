import React, { useState, useEffect, useRef } from 'react';
import Volver from '../components/Volver';
import { useNavigate } from 'react-router-dom';
import '../css/Dieta2.css';
import axios from 'axios';

const USDA_API_KEY = 'yILlwBPoQm0nD5pgjsaeXlq3503EmAfRAE6fQgjZ';

const tiemposComida = [
  'Desayuno',
  'Colación Matutina',
  'Comida',
  'Colación Vespertina',
  'Cena'
];

// Función para traducir texto con LibreTranslate
const traducirTexto = async (texto, sourceLang = 'es', targetLang = 'en') => {
  try {
    const res = await axios.post('https://libretranslate.de/translate', {
      q: texto,
      source: sourceLang,
      target: targetLang,
      format: 'text'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    return res.data.translatedText;
  } catch (err) {
    console.error('Error al traducir:', err);
    return texto; // En caso de fallo, devuelve el texto original
  }
};

const Dieta2 = () => {
  const navigate = useNavigate();
  const [caloriasTotales, setCaloriasTotales] = useState(0);
  const [alimentos, setAlimentos] = useState({});
  const [formVisible, setFormVisible] = useState({});
  const [nombreInput, setNombreInput] = useState('');
  const [nuevoAlimento, setNuevoAlimento] = useState({ nombre: '', cantidad: '', calorias: '', caloriasPor100g: '' });
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarSelect, setMostrarSelect] = useState(false);
  const [cargando, setCargando] = useState(false);
  const debounceRef = useRef();

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
      // Traducir el texto de español a inglés para búsqueda
      const valorTraducido = await traducirTexto(valor, 'es', 'en');

      const res = await axios.post(
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}`,
        {
          query: valorTraducido,
          pageSize: 10,
          dataType: ['Foundation', 'Survey (FNDDS)'],
          requireAllWords: true,
        }
      );

      let productos = res.data.foods;

      // Traducir cada nombre de alimento de inglés a español
      const productosTraducidos = await Promise.all(
        productos.map(async (food) => {
          const energy = food.foodNutrients.find(n => n.nutrientId === 1008);
          const nombreEsp = await traducirTexto(food.description, 'en', 'es');
          return {
            fdcId: food.fdcId,
            product_name: food.description,
            nombre_es: nombreEsp,
            caloriasPor100g: energy ? energy.value : ''
          };
        })
      );

      setSugerencias(productosTraducidos);
      setMostrarSelect(true);
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
        nombre: producto.nombre_es,  // Mostrar en español
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

  return (
    <div className="dieta2-container">
      <Volver />

      <div className="dieta2-content">
        <aside className="configuracion">
          <h2><i className="bi bi-gear"></i> Configuración</h2>
          <p><strong>Paciente:</strong> Ana Martínez</p>
          <p><strong>Dieta:</strong> kkkk</p>
          <p><strong>Objetivo:</strong> Aumento de energía</p>
          <p><strong>Calorías objetivo:</strong> 2000 kcal</p>
          <hr />
          <h3>Macronutrientes</h3>
          <p><span className="dot blue"></span> Proteínas 30%</p>
          <p><span className="dot green"></span> Carbohidratos 25%</p>
          <p><span className="dot orange"></span> Lípidos 45%</p>
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
            />
          </div>
          <div className="centrado">
            <button className="guardar-dieta" onClick={() => navigate('/inicio')}>Guardar Dieta</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dieta2;