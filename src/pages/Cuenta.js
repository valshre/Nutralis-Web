import React, { useState } from 'react';
import NavigationPanel from '../components/NavigationPanel';
import '../css/Cuenta.css';

const Cuenta = () => {
  const [mostrarPago, setMostrarPago] = useState(false);

  const handleRenovarClick = () => {
    setMostrarPago(true);
  };

  return (
    <div className="cuenta-container">
      <NavigationPanel />
      <div className="cuenta-content">
        <h2 className="titulo">Mi Cuenta</h2>
        <p>Gestiona tu información personal y suscripción</p>

        <div className="cuenta-grid">
          <div className="info-section">
            <h3 className="titulo">Información Personal</h3>
            <div className="info-grid">
               <p className="car"><strong>Nombre</strong> </p>
              <input disabled value="Dr. María González" placeholder="Nombre Completo" />
              <p className="car"><strong>Correo Electrónico</strong> </p>
              <input disabled value="admihjjn@nutralis.com" placeholder="Correo Electrónico" />
              <p className="car"><strong>Número de télefono</strong> </p>
              <input disabled value="+52 55 1234 5678" placeholder="Teléfono" />
              <p className="car"><strong>Especialidad</strong> </p>
              <input disabled value="Nutrición Clínica" placeholder="Especialidad" />
              <p className="car"><strong>Cédula Profesional</strong> </p>
              <input disabled value="1234567" placeholder="Cédula Profesional" />
            </div>
          </div>

          <div className="suscripcion-section">
            <h3 className="titulo">Estado de Suscripción</h3>
            <p><strong>Estado:</strong> <span className="activo">Activo</span></p>
           
            <p><strong>Fecha de inicio:</strong> 2024-01-01</p>
            <p><strong>Vence:</strong> 2024-12-31</p>
            <p><strong>Próximo pago:</strong> 2024-12-31</p>
           
            <button className="btn-renovar" onClick={handleRenovarClick}>Renovar Suscripción</button>

            {mostrarPago && (
              <div className="pago-section">
                <h3>Renovar Suscripción</h3>
                <input placeholder="Número de Tarjeta" />
                <div className="pago-row">
                  <input placeholder="MM/AA" />
                  <input placeholder="123" />
                </div>
                <input placeholder="Nombre como aparece en la tarjeta" />
                <div className="total-pago">
                  <p>Total a pagar</p>
                  <strong>$299.00 MXN</strong>
                  <p>Plan Profesional - 12 meses</p>
                </div>
                <div className="pago-botones">
                  <button className="btn-procesar">Procesar Pago</button>
                  <button className="btn-cancelar" onClick={() => setMostrarPago(false)}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cuenta;
