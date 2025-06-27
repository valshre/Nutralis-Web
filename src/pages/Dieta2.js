import React, { useState } from 'react';
import NavigationPanel from '../components/NavigationPanel';
import Volver from '../components/Volver';
import { useNavigate } from 'react-router-dom';
import '../css/Dieta2.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';



const tiemposComida = [
  'Desayuno',
  'Colación Matutina',
  'Comida',
  'Colación Vespertina',
  'Cena'
];

const Dieta2 = () => {
  const navigate = useNavigate();
  const [caloriasTotales, setCaloriasTotales] = useState(0);
  const [alimentos, setAlimentos] = useState({});
  const [formVisible, setFormVisible] = useState({});
  const [nuevoAlimento, setNuevoAlimento] = useState({ nombre: '', cantidad: '', calorias: '' });
const [sugerencias, setSugerencias] = useState([]);
const [mostrarSelect, setMostrarSelect] = useState(false);
const user_id = 'vaalshere';
const password = 'graciasapolo';
const app_name = 'Nutralis';
const app_version = '1.0';
const app_uuid = uuidv4();

  const handleAgregar = (tiempo) => {
    setFormVisible((prev) => ({ ...prev, [tiempo]: true }));
  };

 const handleInputChange = async (e) => {
  const { name, value } = e.target;
  setNuevoAlimento((prev) => ({ ...prev, [name]: value }));

  if (name === 'nombre' && value.length >= 3) {
    try {
      const res = await axios.get(
        'https://world.openfoodfacts.org/cgi/search.pl',
        {
          params: {
            search_terms: value,
            search_simple: 1,
            action: 'process',
            json: 1,
          },
          headers: {
            'User-Agent': 'Nutralis/1.0 (nutralis@example.com)',
          },
        }
      );

      console.log('Resultado API:', res.data);

    const productos = res.data.products
  .filter(p => p.nova_group === 1 && p.product_name) // alimentos simples
  .slice(0, 20); // mostrar máximo 5 sugerencias

      setSugerencias(productos);
      setMostrarSelect(true);
    } catch (error) {
      console.error('Error al buscar alimento:', error);
      setSugerencias([]);
      setMostrarSelect(false);
    }
  } else if (name === 'nombre') {
    setSugerencias([]);
    setMostrarSelect(false);
  }
};



const handleSelectChange = (e) => {
  const producto = sugerencias.find(p => p.code === e.target.value);
  if (producto) {
    setNuevoAlimento((prev) => ({
      ...prev,
      nombre: producto.product_name || '',
      calorias: producto.nutriments?.energy_kcal_100g || '',
    }));
  }
  setMostrarSelect(false);
};


  const guardarAlimento = (tiempo) => {
    const caloriasNum = parseInt(nuevoAlimento.calorias) || 0;
    setAlimentos((prev) => ({
      ...prev,
      [tiempo]: [...(prev[tiempo] || []), nuevoAlimento]
    }));
    setCaloriasTotales((prev) => prev + caloriasNum);
    setNuevoAlimento({ nombre: '', cantidad: '', calorias: '' });
    setFormVisible((prev) => ({ ...prev, [tiempo]: false }));
  };

  const eliminarAlimento = (tiempo, index) => {
    const caloriasEliminadas = parseInt(alimentos[tiempo][index].calorias) || 0;
    setAlimentos((prev) => {
      const nuevos = [...prev[tiempo]];
      nuevos.splice(index, 1);
      return { ...prev, [tiempo]: nuevos };
    });
    setCaloriasTotales((prev) => prev - caloriasEliminadas);
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
          <p><span className="dot blue"></span> Proteínas 30% <span className="gramos">6666667g</span></p>
          <p><span className="dot green"></span> Carbohidratos 25% <span className="gramos">5555556g</span></p>
          <p><span className="dot orange"></span> Lípidos 45% <span className="gramos">888888g</span></p>
          <hr />
          <p className="calorias-totales">Calorías totales: {caloriasTotales} kcal</p>
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
  value={nuevoAlimento.nombre}
  onChange={handleInputChange}
/>
{mostrarSelect && sugerencias.length > 0 && (
  <select onChange={handleSelectChange} className="select-sugerencias">
    <option value="">Selecciona una sugerencia</option>
    {sugerencias.map((producto) => (
      <option key={producto.code} value={producto.code}>
        {producto.product_name}
      </option>
    ))}
  </select>
)}

                  <input
                    type="text"
                    name="cantidad"
                    placeholder="Cantidad"
                    value={nuevoAlimento.cantidad}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="calorias"
                    placeholder="Calorías"
                    value={nuevoAlimento.calorias}
                    onChange={handleInputChange}
                  />
                  <div className="centrado">
                    <button onClick={() => guardarAlimento(tiempo)} className="btn-agregar">Guardar</button>
                  </div>
                </div>
              )}
              {alimentos[tiempo]?.length ? (
                <ul>
                  {alimentos[tiempo].map((item, i) => (
                    <li key={i}>
                      {item.nombre} - {item.cantidad} - {item.calorias} kcal
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
