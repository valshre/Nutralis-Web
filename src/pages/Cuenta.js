import React, { useState, useEffect } from 'react';
import NavigationPanel from '../components/NavigationPanel';
import '../css/Cuenta.css';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';

const Cuenta = () => {
  const [mostrarPago, setMostrarPago] = useState(false);
  const [ordenPayPal, setOrdenPayPal] = useState(null);
  const [idPago, setIdPago] = useState(null);
  const [nutriologo, setNutriologo] = useState(null);

  // Datos duros de ejemplo, reemplaza con datos reales al hacer login
  const idNutriologo = 1;
  const monto = 299.0;

  useEffect(() => {
    async function fetchNutriologo() {
      try {
        const res = await axios.get(`http://localhost:3001/api/detalle/${idNutriologo}`);
        setNutriologo(res.data);

        localStorage.setItem(
          'nutriologo',
          JSON.stringify({
            id: res.data.id_nut,
            nombre: `${res.data.nombre_nut} ${res.data.app_nut} ${res.data.apm_nut}`,
            tipo_usu: res.data.tipo_usu,
            rol: res.data.tipo_usu === 0 ? 'admin' : 'nutriologo',
          })
        );
      } catch (error) {
        console.error('Error al obtener datos del nutriólogo', error);
      }
    }
    fetchNutriologo();
  }, [idNutriologo]);

  const crearPago = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/crear-pago', {
        id_nut: idNutriologo,
        monto,
        metodo_pago: 'paypal',
      });
      setOrdenPayPal(response.data.orden_paypal);
      setIdPago(response.data.id_pago);
    } catch (error) {
      alert('Error al crear pago');
      console.error(error);
    }
  };

  const handleRenovarClick = () => {
    setMostrarPago(true);
    crearPago();
  };

  const onApprove = async (data) => {
    try {
      const res = await axios.post('http://localhost:3001/api/capturar-pago', {
        orderID: data.orderID,
        id_pago: idPago,
      });
      alert(`Pago ${res.data.estado}`);
      setMostrarPago(false);
    } catch (error) {
      alert('Error al capturar pago');
      console.error(error);
    }
  };

  return (
    <div className="cuenta-container">
      <NavigationPanel />
      <div className="cuenta-content">
        <p className="texto-titulo">Mi Cuenta</p>
        <p>Gestiona tu información personal y suscripción</p>

        <div className="cuenta-grid">
          <div className="info-section">
            <h3 className="titulo">Información Personal</h3>
            <div className="info-grid">
              <p className="car"><strong>Nombre</strong></p>
              <input
                disabled
                value={
                  nutriologo
                    ? `${nutriologo.nombre_nut} ${nutriologo.app_nut} ${nutriologo.apm_nut}`
                    : 'Cargando...'
                }
                placeholder="Nombre Completo"
              />
              <p className="car"><strong>Correo Electrónico</strong></p>
              <input disabled value={nutriologo ? nutriologo.correo : ''} placeholder="Correo Electrónico" />
              <p className="car"><strong>Número de télefono</strong></p>
              <input disabled value={nutriologo ? nutriologo.telefono_nut : ''} placeholder="Teléfono" />
              <p className="car"><strong>Especialidad</strong></p>
              <input disabled value={nutriologo ? nutriologo.especialidad_nut || '' : ''} placeholder="Especialidad" />
              <p className="car"><strong>Cédula Profesional</strong></p>
              <input disabled value={nutriologo ? nutriologo.cedula_nut : ''} placeholder="Cédula Profesional" />
            </div>
          </div>

          <div className="suscripcion-section">
            <h3 className="titulo">Estado de Suscripción</h3>
            <p><strong>Estado:</strong> <span className="activo">Activo</span></p>
            <p><strong>Fecha de inicio:</strong> {nutriologo ? nutriologo.fecha_inicio_sub || 'N/A' : 'N/A'}</p>
            <p><strong>Vence:</strong> {nutriologo ? nutriologo.fecha_fin_sub || 'N/A' : 'N/A'}</p>
            <p><strong>Próximo pago:</strong> {nutriologo ? nutriologo.fecha_fin_sub || 'N/A' : 'N/A'}</p>

            <button className="btn-renovar" onClick={handleRenovarClick}>Renovar Suscripción</button>

            {mostrarPago && ordenPayPal && (
              <div className="pago-section">
                <h3>Renovar Suscripción</h3>

                <PayPalScriptProvider
                  options={{
                    "client-id": "AbCpAHnHhEs2jlbon0p7sX_hfRcdDE2VN0fYKew2TTddKk2kMQB7JI6C7jl2380cg3Rl2BymYKdlxDxT",
                    currency: "MXN",
                  }}
                >
                  <PayPalButtons
                    createOrder={() => Promise.resolve(ordenPayPal.id)}
                    onApprove={onApprove}
                    onError={(err) => {
                      alert('Error en el pago');
                      console.error(err);
                    }}
                  />
                </PayPalScriptProvider>

                <button className="btn-cancelar" onClick={() => setMostrarPago(false)}>Cancelar</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cuenta;
