import React, { useState } from 'react';
import NavigationPanel from '../components/NavigationPanel';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import '../css/Reportes.css';

const boxShadowStyle = { boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' };

const caloriasData = [
  { dia: 'Lun', calorias: 1800 },
  { dia: 'Mar', calorias: 2000 },
  { dia: 'Mié', calorias: 1900 },
  { dia: 'Jue', calorias: 2200 },
  { dia: 'Vie', calorias: 2100 },
  { dia: 'Sáb', calorias: 2000 },
  { dia: 'Dom', calorias: 1950 },
];

const macronutrientesData = [
  { name: 'Carbohidratos', value: 50 },
  { name: 'Proteínas', value: 30 },
  { name: 'Grasas', value: 20 },
];

const objetivosData = [
  { name: 'Logrados', value: 4 },
  { name: 'Pendientes', value: 1 },
];

const adherenciaData = [
  { dia: 'Semana 1', porcentaje: 85 },
  { dia: 'Semana 2', porcentaje: 90 },
  { dia: 'Semana 3', porcentaje: 70 },
  { dia: 'Semana 4', porcentaje: 95 },
];

const horariosData = [
  { comida: 'Desayuno', cumplido: 90 },
  { comida: 'Almuerzo', cumplido: 80 },
  { comida: 'Cena', cumplido: 70 },
];

const colores = ['#8884d8', '#82ca9d', '#ffc658'];

const Reportes = () => {
  const [mostrarReporte, setMostrarReporte] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState('Carlos Rodríguez');
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('Último mes');

  const handleGenerarReporte = () => {
    setMostrarReporte(true);
  };

  return (
    <div className="reportes-container">
      <NavigationPanel />
      <main className="reportes-main">
        <h1 className="titulo-principal">Reportes de Pacientes</h1>

        <section className="configuracion-reporte" style={boxShadowStyle}>
          <h2 className="titulo-principal">Configuración del Reporte</h2>
          <div className="form-row">
            <label>
              Paciente
              <select
                value={pacienteSeleccionado}
                onChange={(e) => setPacienteSeleccionado(e.target.value)}
              >
                <option value="Carlos Rodríguez">Carlos Rodríguez</option>
                <option value="Otro Paciente">Otro Paciente</option>
              </select>
            </label>

            <label>
              Período de Análisis
              <select
                value={periodoSeleccionado}
                onChange={(e) => setPeriodoSeleccionado(e.target.value)}
              >
                <option value="Último mes">Último mes</option>
                <option value="Últimos 3 meses">Últimos 3 meses</option>
                <option value="Último año">Último año</option>
              </select>
            </label>

            <button className="btn-generar" onClick={handleGenerarReporte}>
              Generar Reporte
            </button>
          </div>
        </section>

        {mostrarReporte && (
          <>
            {/* Información del Paciente */}
            <section className="seccion-reporte" style={boxShadowStyle}>
              <h2 className="titulo-principal">Información del Paciente</h2>
              <table style={{ width: '100%', fontSize: '22px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px', fontWeight: '700', width: '180px' }}>Nombre</td>
                    <td style={{ padding: '8px' }}>{pacienteSeleccionado}</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f9f9f9' }}>
                    <td style={{ padding: '8px', fontWeight: '700' }}>Rol</td>
                    <td style={{ padding: '8px' }}>Paciente</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', fontWeight: '700' }}>Edad</td>
                    <td style={{ padding: '8px' }}>45 años</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f9f9f9' }}>
                    <td style={{ padding: '8px', fontWeight: '700' }}>Objetivo</td>
                    <td style={{ padding: '8px' }}>Control de diabetes</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', fontWeight: '700' }}>Período analizado</td>
                    <td style={{ padding: '8px' }}>{periodoSeleccionado}</td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* Gráfica 1: Cumplimiento de Calorías */}
            <section className="seccion-reporte" style={boxShadowStyle}>
              <h2 className="titulo-principal">Cumplimiento de Calorías Diarias</h2>
              <LineChart width={600} height={300} data={caloriasData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="calorias" stroke="#8884d8" />
              </LineChart>
            </section>

            {/* Gráfica 2: Macronutrientes */}
            <section className="seccion-reporte" style={boxShadowStyle}>
              <h2 className="titulo-principal">Distribución de Macronutrientes</h2>
              <PieChart width={400} height={300}>
                <Pie
                  data={macronutrientesData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {macronutrientesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </section>

            {/* Gráfica 3: Adherencia a la dieta */}
            <section className="seccion-reporte" style={boxShadowStyle}>
              <h2 className="titulo-principal">Adherencia a la Dieta</h2>
              <BarChart width={600} height={300} data={adherenciaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="porcentaje" fill="#82ca9d" />
              </BarChart>
            </section>

            {/* Gráfica 4: Objetivos Nutricionales */}
            <section className="seccion-reporte" style={boxShadowStyle}>
              <h2 className="titulo-principal">Objetivos Nutricionales</h2>
              <PieChart width={400} height={300}>
                <Pie
                  data={objetivosData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {objetivosData.map((entry, index) => (
                    <Cell key={`cell-obj-${index}`} fill={colores[index % colores.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </section>

            {/* Gráfica 5: Cumplimiento de Horarios */}
            <section className="seccion-reporte" style={boxShadowStyle}>
              <h2 className="titulo-principal">Cumplimiento de Horarios</h2>
              <BarChart width={600} height={300} data={horariosData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="comida" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cumplido" fill="#ffc658" />
              </BarChart>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Reportes;
