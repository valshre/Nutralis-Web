import React, { useState } from 'react';
import NavigationPanel from '../components/NavigationPanel';
import '../css/Reportes.css';

const boxShadowStyle = { boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' };

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

            {/* Cumplimiento de Calorías Diarias */}
            <section className="seccion-reporte" style={boxShadowStyle}>
              <h2 className="titulo-principal">Cumplimiento de Calorías Diarias</h2>
              <div className="grafica-placeholder">
                {/* Gráfica aquí */}
              </div>
            </section>

            {/* Distribución de Macronutrientes */}
            <section className="seccion-reporte" style={boxShadowStyle}>
              <h2 className="titulo-principal">Distribución de Macronutrientes</h2>
              <div className="grafica-placeholder">
                {/* Gráfica aquí */}
              </div>
            </section>

            {/* Secciones originales */}
            <section className="seccion-reporte" style={boxShadowStyle}>
              <h2 className="titulo-principal">Adherencia a la Dieta</h2>
              <div className="grafica-placeholder"></div>
            </section>

            <section className="seccion-reporte" style={boxShadowStyle}>
              <h2 className="titulo-principal">Objetivos Nutricionales</h2>
              <div className="grafica-placeholder"></div>
            </section>

            <section className="seccion-reporte" style={boxShadowStyle}>
              <h2 className="titulo-principal">Cumplimiento de Horarios</h2>
              <div className="grafica-placeholder"></div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Reportes;
