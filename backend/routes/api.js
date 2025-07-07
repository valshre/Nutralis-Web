const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

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

// LOGIN - nutriólogos o administradores (ruta original)
router.post('/nutriologos/login', (req, res) => {
  const { correo, password } = req.body;

  const sqlNutri = `SELECT id_nut AS id, nombre_nut AS nombre, password, token, tipo_usu, 'nutriologo' AS rol FROM nutriologos WHERE correo = ?`;

  db.query(sqlNutri, [correo], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });

    if (results.length > 0) {
      const nutri = results[0];

      if (nutri.token) {
        return res.status(403).json({ error: 'Sesión ya activa en otro dispositivo' });
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

// NUEVA RUTA: obtener clientes asignados a un nutriólogo específico
router.get('/nutriologos/:id_nut/clientes', (req, res) => {
  const idNutriologo = req.params.id_nut;

  const sql = `
    SELECT
      c.id_cli,
      c.nombre_cli,
      c.app_cli,
      c.apm_cli,
      c.correo_cli,
      c.edad_cli,
      c.sexo_cli,
      c.peso_cli,
      c.estatura_cli,
      c.faf_cli,
      c.geb_cli,
      c.modo,
      c.fecha_inicio_pago,
      c.fecha_fin_pago,
      c.tiene_acceso,
      (
        SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'id_antecedente', am.id_antecedente,
            'motivo', am.motivo,
            'heredo_familiares', am.heredo_familiares,
            'no_patologicos', am.no_patologicos,
            'patologicos', am.patologicos,
            'alergias', am.alergias,
            'aversiones', am.aversiones,
            'fecha_registro', am.fecha_registro
          )
        )
        FROM antecedentes_medicos am
        WHERE am.id_cli = c.id_cli
      ) AS antecedentes
    FROM clientes c
    WHERE c.id_nut = ?
  `;

  db.query(sql, [idNutriologo], (err, results) => {
    if (err) {
      console.error('Error al obtener clientes:', err);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }

    res.json({ clientes: results });
  });
});

module.exports = router;  
