const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db'); 
const connection = require('../config/db');


// Registro de nutriólogo
router.post('/nutriologos/registro', async (req, res) => {
  const {
    nombre_nut,
    app_nut,
    apm_nut,
    correo,
    password,
    cedula_nut,
    especialidad_nut,
    telefono_nut,
    token_vinculacion,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO nutriologos
      (nombre_nut, app_nut, apm_nut, correo, password, cedula_nut, especialidad_nut, telefono_nut, token_vinculacion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        nombre_nut,
        app_nut,
        apm_nut,
        correo,
        hashedPassword,
        cedula_nut,
        especialidad_nut,
        telefono_nut,
        token_vinculacion,
      ],
      (err, result) => {
        if (err) {
          console.error('Error en el registro:', err);
          return res.status(500).json({ error: 'Correo o token ya registrados' });
        }

        res.status(201).json({ message: 'Nutriólogo registrado exitosamente' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// LOGIN - nutriólogos o administradores 
router.post('/nutriologos/login', (req, res) => {
  const { correo, password } = req.body;

  const sqlNutri = `SELECT id_nut AS id, nombre_nut AS nombre, password, token, verificado, tipo_usu, 'nutriologo' AS rol FROM nutriologos WHERE correo = ?`;

  db.query(sqlNutri, [correo], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });

    if (results.length > 0) {
      const nutri = results[0];
if (nutri.verificado == 'denegado') {
      return res.status(403).json({ error: 'Solicitud no aprobada. Intenta más tarde.' });
    }

      if (nutri.token) {
        return res.status(403).json({ error: 'Sesión ya activa' });
      }

      const match = await bcrypt.compare(password, nutri.password);
      if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });

      const newToken = uuidv4();
      db.query(
        `UPDATE nutriologos SET token = ? WHERE id_nut = ?`,
        [newToken, nutri.id],
        (err2) => {
          if (err2) return res.status(500).json({ error: 'Error al guardar token' });

          res.json({
            message: 'Inicio de sesión exitoso (nutriólogo)',
            id_nut: nutri.id,
            nombre: nutri.nombre,
            token: newToken,
            tipo_usu: nutri.tipo_usu,
            rol: 'nutriologo'
          });
        }
      );
    } else {
      const sqlAdmin = `SELECT id_admin AS id, nombre_admin AS nombre, password, token, tipo_usu, 'admin' AS rol FROM administradores WHERE correo = ?`;

      db.query(sqlAdmin, [correo], async (err, resultsAdmin) => {
        if (err) return res.status(500).json({ error: 'Error en el servidor' });

        if (resultsAdmin.length === 0) {
          return res.status(404).json({ error: 'Correo no registrado' });
        }

        const admin = resultsAdmin[0];

        if (admin.token) {
          return res.status(403).json({ error: 'Sesión ya activa en otro dispositivo' });
        }

        const match = await bcrypt.compare(password, admin.password);
        if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });

        const newToken = uuidv4();
        db.query(
          `UPDATE administradores SET token = ? WHERE id_admin = ?`,
          [newToken, admin.id],
          (err2) => {
            if (err2) return res.status(500).json({ error: 'Error al guardar token' });

            res.json({
              message: 'Inicio de sesión exitoso (administrador)',
              id_nut: admin.id, // para mantener la clave en frontend
              nombre: admin.nombre,
              token: newToken,
              tipo_usu: admin.tipo_usu,
              rol: 'admin'
            });
          }
        );
      });
    }
  });
});

// LOGOUT 
router.post('/nutriologos/logout', (req, res) => {
  const { id, rol } = req.body;

  // Validación de datos
  if (!id || !rol) {
    return res.status(400).json({ error: 'Datos incompletos para cerrar sesión' });
  }

  // Determinar tabla y campo según el rol
  const tabla = rol === 'admin' ? 'administradores' : 'nutriologos';
  const campo = rol === 'admin' ? 'id_admin' : 'id_nut';

  // Actualizar base de datos
  db.query(
    `UPDATE ${tabla} SET token = NULL WHERE ${campo} = ?`,
    [id],
    (err, result) => {
      if (err) {
        console.error('Error en la base de datos:', err);
        return res.status(500).json({ error: 'Error al cerrar sesión' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      res.json({ message: 'Sesión cerrada correctamente' });
    }
  );
});


// Middleware para verificar token de sesión
const verifyToken = (req, res, next) => {
  const id_nut = req.headers['id_nut'];
  const token = req.headers['token'];
  const rol = req.headers['rol'];

  if (!id_nut || !token || !rol) {
    return res.status(401).json({ error: 'Faltan credenciales de autenticación' });
  }

  const tabla = rol === 'admin' ? 'administradores' : 'nutriologos';
  const campo = rol === 'admin' ? 'id_admin' : 'id_nut';

  const sql = `SELECT token FROM ${tabla} WHERE ${campo} = ?`;

  db.query(sql, [id_nut], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en la base de datos' });

    if (results.length === 0) {
      return res.status(403).json({ error: 'Usuario no encontrado' });
    }

    const tokenBD = results[0].token;

    if (!tokenBD) {
      return res.status(403).json({ error: 'No hay sesión activa' });
    }

    if (tokenBD !== token) {
      return res.status(403).json({ error: 'Token inválido' });
    }

    next();
  });
};
// POST para obtener clientes por nutriólogo, recibe idNutriologo en body
router.post('/clientes-por-nutriologo', (req, res) => {
  const { idNutriologo } = req.body;

  if (!idNutriologo || isNaN(idNutriologo)) {
    return res.status(400).json({ error: 'ID de nutriólogo inválido' });
  }

  const query = `
    SELECT 
      c.*, 
      a.motivo, 
      a.heredo_familiares, 
      a.no_patologicos, 
      a.patologicos, 
      a.alergias, 
      a.aversiones,
      a.fecha_registro AS fecha_registro_antecedentes
    FROM 
      clientes c
    LEFT JOIN 
      antecedentes_medicos a ON c.id_cli = a.id_cli
    WHERE 
      c.id_nut = ?
    ORDER BY 
      c.id_cli, a.fecha_registro DESC
  `;

  db.query(query, [idNutriologo], (err, clientes) => {
    if (err) {
      console.error('Error al obtener clientes:', err);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }

    // Agrupar los antecedentes médicos por cliente
    const clientesAgrupados = clientes.reduce((acc, row) => {
      if (!acc[row.id_cli]) {
        acc[row.id_cli] = {
          ...row,
          antecedentes: []
        };
        delete acc[row.id_cli].motivo;
        delete acc[row.id_cli].heredo_familiares;
        delete acc[row.id_cli].no_patologicos;
        delete acc[row.id_cli].patologicos;
        delete acc[row.id_cli].alergias;
        delete acc[row.id_cli].aversiones;
        delete acc[row.id_cli].fecha_registro_antecedentes;
      }

      if (row.motivo) {
        acc[row.id_cli].antecedentes.push({
          motivo: row.motivo,
          heredo_familiares: row.heredo_familiares,
          no_patologicos: row.no_patologicos,
          patologicos: row.patologicos,
          alergias: row.alergias,
          aversiones: row.aversiones,
          fecha_registro: row.fecha_registro_antecedentes
        });
      }

      return acc;
    }, {});

    res.json(Object.values(clientesAgrupados));
  });
});


// POST para obtener cliente por id, recibe idCliente en body
router.post('/cliente-detalle', (req, res) => {
  const { idCliente } = req.body;

  if (!idCliente || isNaN(idCliente)) {
    return res.status(400).json({ error: 'ID de cliente inválido' });
  }

  const sqlCliente = `
    SELECT 
      id_cli, tipo_usu, nombre_cli, app_cli, apm_cli, correo_cli, edad_cli, sexo_cli, 
      peso_cli, estatura_cli, faf_cli, geb_cli, modo, id_nut, fecha_inicio_pago, fecha_fin_pago, tiene_acceso
    FROM clientes
    WHERE id_cli = ?;
  `;

  const sqlAntecedentes = `
    SELECT 
      id_antecedente, motivo, heredo_familiares, no_patologicos, patologicos, alergias, aversiones, fecha_registro
    FROM antecedentes_medicos
    WHERE id_cli = ?;
  `;

  connection.query(sqlCliente, [idCliente], (err, clienteResults) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener datos del cliente' });
    }
    if (clienteResults.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    connection.query(sqlAntecedentes, [idCliente], (err2, antecedentesResults) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ error: 'Error al obtener antecedentes médicos' });
      }

      const cliente = clienteResults[0];
      cliente.antecedentes_medicos = antecedentesResults;

      res.json(cliente);
    });
  });
});

// Guardar dieta con tiempos y alimentos
router.post('/guardar-dieta', async (req, res) => {
  const {
    idCliente,
    nombreDieta,
    objetivoDieta,
    duracion,
    proteinas,
    carbohidratos,
    grasas,
    caloriasObjetivo,
    recomendaciones,
    alimentosPorTiempo // objeto { desayuno: [...], colacion1: [...], ... }
  } = req.body;

  if (!idCliente || !nombreDieta || !duracion || !proteinas || !carbohidratos || !grasas || !caloriasObjetivo) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  // Mapeo para los nombres que usas en el frontend al enum de BD
  const nombreTiempoMap = {
    'Desayuno': 'desayuno',
    'Colación Matutina': 'colacion1',
    'Comida': 'comida',
    'Colación Vespertina': 'colacion2',
    'Cena': 'cena'
  };

  // Para usar async/await con connection.query, promisificamos:
  const query = (sql, params) => new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });

  try {
    // 1. Insertar dieta
    const resultadoDieta = await query(
      `INSERT INTO dietas (id_cli, nombre_dieta, objetivo_dieta, duracion, porcentaje_proteinas, porcentaje_carbs, porcentaje_grasas, calorias_objetivo, recomendaciones)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [idCliente, nombreDieta, objetivoDieta, duracion, proteinas, carbohidratos, grasas, caloriasObjetivo, recomendaciones || null]
    );

    const idDieta = resultadoDieta.insertId;

    // 2. Insertar tiempos de comida y sus alimentos
    for (const [tiempo, alimentos] of Object.entries(alimentosPorTiempo)) {
      const nombreTiempo = nombreTiempoMap[tiempo];
      if (!nombreTiempo) continue;

      // Insertar tiempo comida
      const resultadoTiempo = await query(
        `INSERT INTO tiempos_comida (id_dieta, nombre_tiempo) VALUES (?, ?)`,
        [idDieta, nombreTiempo]
      );

      const idTiempo = resultadoTiempo.insertId;

      // Insertar alimentos de ese tiempo
      for (const alimento of alimentos) {
        await query(
          `INSERT INTO alimentos_dieta (id_tiempo, nombre_alimento, cantidad_gramos, calorias, grupo_alimenticio)
           VALUES (?, ?, ?, ?, ?)`,
          [
            idTiempo,
            alimento.nombre || '',
            parseFloat(alimento.cantidad) || 0,
            parseFloat(alimento.calorias) || 0,
            alimento.grupoAlimenticio || 'No definido'
          ]
        );
      }
    }

    res.json({ mensaje: 'Dieta guardada correctamente', idDieta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar dieta' });
  }
});

router.get('/detalle/:id', (req, res) => {
  const idNut = req.params.id;

  if (!idNut) {
    return res.status(400).json({ error: 'Falta id de nutriólogo' });
  }

  connection.query(
    `SELECT 
      id_nut,
      tipo_usu,
      nombre_nut,
      app_nut,
      apm_nut,
      correo,
      cedula_nut,
      especialidad_nut,
      telefono_nut,
      fecha_inicio_sub,
      fecha_fin_sub,
      verificado
    FROM nutriologos
    WHERE id_nut = ?`,
    [idNut],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Error en base de datos' });
      if (results.length === 0) return res.status(404).json({ error: 'Nutriólogo no encontrado' });

      const data = results[0];
      res.json(data);
    }
  );
});


// Tus credenciales PayPal sandbox
const PAYPAL_CLIENT_ID = 'AbCpAHnHhEs2jlbon0p7sX_hfRcdDE2VN0fYKew2TTddKk2kMQB7JI6C7jl2380cg3Rl2BymYKdlxDxT';
const PAYPAL_SECRET = 'EJ9AM55H8UaXTABTPQoNJcQGdU8y1_cHDTxqVk7xmV8LpyEqkdJGbZLCAteJKVQcj2DbA40bNUK5R4oF';

// Función para obtener token OAuth PayPal
async function getPayPalToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
  const res = await axios.post(
    'https://api-m.sandbox.paypal.com/v1/oauth2/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }
  );
  return res.data.access_token;
}

// Ruta POST para crear pago y guardar en BD
router.post('/crear-pago', async (req, res) => {
  const { id_nut, monto, metodo_pago } = req.body;

  if (!id_nut || !monto || !metodo_pago) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    const token = await getPayPalToken();

    const ordenResponse = await axios.post(
      'https://api-m.sandbox.paypal.com/v2/checkout/orders',
      {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'MXN',
            value: monto.toString()
          }
        }]
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const orden = ordenResponse.data;
    const fecha_pago = new Date();

    connection.query(
      'INSERT INTO pagos_nutriologos (id_nut, monto, fecha_pago, metodo_pago, estado) VALUES (?, ?, ?, ?, ?)',
      [id_nut, monto, fecha_pago, metodo_pago, 'pendiente'],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error al guardar pago' });
        }

        res.json({
          mensaje: 'Pago creado',
          id_pago: result.insertId,
          orden_paypal: orden,
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error con PayPal', detalle: error.message });
  }
});

// Ruta POST para capturar pago y actualizar estado
router.post('/capturar-pago', async (req, res) => {
  const { orderID, id_pago } = req.body;

  if (!orderID || !id_pago) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    const token = await getPayPalToken();

    const captureResponse = await axios.post(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );

    let estado = 'fallido';
    if (captureResponse.data.status === 'COMPLETED') {
      estado = 'exitoso';
    }

    connection.query(
      'UPDATE pagos_nutriologos SET estado = ? WHERE id_pago = ?',
      [estado, id_pago],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error al actualizar pago' });
        }

        res.json({ mensaje: 'Pago actualizado', estado, detalle: captureResponse.data });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al capturar pago', detalle: error.message });
  }
});

module.exports = router;  
