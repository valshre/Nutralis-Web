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

// Login de nutriólogo
router.post('/nutriologos/login', (req, res) => {
  const { correo, password } = req.body;

  const sql = `SELECT * FROM nutriologos WHERE correo = ?`;

  db.query(sql, [correo], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });

    if (results.length === 0) return res.status(401).json({ error: 'Correo no registrado' });

    const nutriologo = results[0];

    // Ya tiene sesión activa
    if (nutriologo.token) {
      return res.status(403).json({ error: 'Sesión ya activa en otro dispositivo' });
    }

    const match = await bcrypt.compare(password, nutriologo.password);

    if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const newToken = uuidv4();

    db.query(
      `UPDATE nutriologos SET token = ? WHERE id_nut = ?`,
      [newToken, nutriologo.id_nut],
      (err2) => {
        if (err2) return res.status(500).json({ error: 'Error al guardar token de sesión' });

        res.json({
          message: 'Inicio de sesión exitoso',
          id_nut: nutriologo.id_nut,
          nombre: nutriologo.nombre_nut,
          token: newToken,
        });
      }
    );
  });
});

// Logout 
router.post('/nutriologos/logout', (req, res) => {
  const { id_nut } = req.body;

  db.query(
    `UPDATE nutriologos SET token = NULL WHERE id_nut = ?`,
    [id_nut],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al cerrar sesión' });

      res.json({ message: 'Sesión cerrada correctamente' });
    }
  );
});

module.exports = router;
