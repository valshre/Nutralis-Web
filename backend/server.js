// server.js - API Backend (Sin tokens JWT)
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();

// Configuración CORS más específica
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json());

// Middleware de debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Raw body:', req.body);
  next();
});

// Configuración de la base de datos
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'graciasapolo',
  database: 'nutralis'
};

// Endpoint de prueba para verificar conectividad
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Endpoint de prueba POST
app.post('/api/test-post', (req, res) => {
  console.log('Test POST - Headers:', req.headers);
  console.log('Test POST - Body:', req.body);
  res.json({
    success: true,
    message: 'POST funcionando',
    receivedData: req.body
  });
});

// Endpoint de inicio de sesión
app.post('/api/login', async (req, res) => {
  try {
    // Debug completo del request
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Headers recibidos:', req.headers);
    console.log('Body completo:', req.body);
    console.log('Content-Type:', req.headers['content-type']);
    
    const { correo, password } = req.body;
    console.log('Correo extraído:', correo);
    console.log('Password extraído:', password);

    if (!correo || !password) {
      console.log('❌ Faltan credenciales');
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    const connection = await mysql.createConnection(dbConfig);
    let user = null;
    let userType = null;

    try {
      // Buscar en tabla administradores (tipo_usu = 0)
      const [adminResults] = await connection.execute(
        'SELECT id_admin as id, tipo_usu, nombre_admin as nombre, correo_admin as correo, password_admin as password FROM administradores WHERE correo_admin = ?',
        [correo]
      );

      if (adminResults.length > 0) {
        user = adminResults[0];
        userType = 'admin';
        console.log('Usuario encontrado en administradores');
      }

      // Si no es admin, buscar en nutriólogos (tipo_usu = 1)
      if (!user) {
        const [nutResults] = await connection.execute(
          'SELECT id_nut as id, tipo_usu, CONCAT(nombre_nut, " ", app_nut, " ", apm_nut) as nombre, correo_nut as correo, password_nut as password, cedula_nut, especialidad_nut, telefono_nut, activo, tiene_acceso FROM nutriologos WHERE correo_nut = ?',
          [correo]
        );

        if (nutResults.length > 0) {
          user = nutResults[0];
          userType = 'nutriologo';
          console.log('Usuario encontrado en nutriólogos');
        }
      }

      // Si no es nutriólogo, buscar en clientes (tipo_usu = 2)
      if (!user) {
        const [clientResults] = await connection.execute(
          'SELECT id_cli as id, tipo_usu, CONCAT(nombre_cli, " ", app_cli, " ", apm_cli) as nombre, correo_cli as correo, password_cli as password, edad_cli, sexo_cli, peso_cli, estatura_cli, faf_cli, geb_cli, modo, id_nut, tiene_acceso FROM clientes WHERE correo_cli = ?',
          [correo]
        );

        if (clientResults.length > 0) {
          user = clientResults[0];
          userType = 'cliente';
          console.log('Usuario encontrado en clientes');
        }
      }

      await connection.end();

      // Verificar si el usuario existe
      if (!user) {
        console.log('❌ Usuario no encontrado para:', correo);
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      console.log('✅ Usuario encontrado:', user.correo);
      console.log('Password en BD:', user.password);
      console.log('Password enviado:', password);

      // Verificar contraseña (comparación directa sin encriptación)
      if (password !== user.password) {
        console.log('❌ Password incorrecto');
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      console.log('✅ Password correcto');

      // Verificar si el usuario está activo (para nutriólogos)
      if (userType === 'nutriologo' && !user.activo) {
        console.log('❌ Cuenta de nutriólogo desactivada');
        return res.status(401).json({
          success: false,
          message: 'Cuenta desactivada'
        });
      }

      // Verificar acceso (para nutriólogos y clientes)
      if ((userType === 'nutriologo' || userType === 'cliente') && !user.tiene_acceso) {
        console.log('❌ Usuario sin acceso al sistema');
        return res.status(401).json({
          success: false,
          message: 'Sin acceso al sistema'
        });
      }

      // Preparar datos del usuario para respuesta (sin password)
      const userData = { ...user };
      delete userData.password;

      console.log('✅ Login exitoso para:', userType);

      res.json({
        success: true,
        message: 'Login exitoso',
        user: {
          ...userData,
          userType
        }
      });

    } catch (dbError) {
      console.error('Error de base de datos:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Error en el servidor'
      });
    }

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Endpoint para logout (simplificado)
app.post('/api/logout', (req, res) => {
  try {
    // Debug logs
    console.log('=== LOGOUT REQUEST ===');
    console.log('Timestamp:', new Date().toISOString());
    
    // Aquí podrías agregar lógica adicional si necesitas:
    // - Invalidar sesiones en base de datos
    // - Registrar auditoría de logout
    // - Limpiar datos temporales
    
    console.log('✅ Logout exitoso');
    
    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cerrar sesión',
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint para registrar nuevos usuarios (opcional)
app.post('/api/register-client', async (req, res) => {
  try {
    const {
      nombre_cli,
      app_cli,
      apm_cli,
      correo_cli,
      password_cli,
      edad_cli,
      sexo_cli,
      peso_cli,
      estatura_cli,
      faf_cli,
      geb_cli,
      modo
    } = req.body;

    // Validaciones básicas
    if (!nombre_cli || !app_cli || !apm_cli || !correo_cli || !password_cli || !edad_cli || !sexo_cli || !peso_cli || !estatura_cli) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos obligatorios son requeridos'
      });
    }

    const connection = await mysql.createConnection(dbConfig);

    try {
      // Verificar si el correo ya existe
      const [existingUser] = await connection.execute(
        'SELECT correo_cli FROM clientes WHERE correo_cli = ?',
        [correo_cli]
      );

      if (existingUser.length > 0) {
        await connection.end();
        return res.status(409).json({
          success: false,
          message: 'Este correo electrónico ya está registrado'
        });
      }

      // Insertar nuevo cliente
      const [result] = await connection.execute(
        `INSERT INTO clientes (
          nombre_cli, app_cli, apm_cli, correo_cli, password_cli, 
          edad_cli, sexo_cli, peso_cli, estatura_cli, faf_cli, geb_cli, 
          modo, tiene_acceso
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
        [
          nombre_cli, app_cli, apm_cli, correo_cli, password_cli,
          edad_cli, sexo_cli, peso_cli, estatura_cli, faf_cli || 1.2, geb_cli || 0,
          modo || 'autonomo'
        ]
      );

      await connection.end();

      console.log('✅ Cliente registrado:', correo_cli);

      res.json({
        success: true,
        message: 'Cliente registrado exitosamente',
        clientId: result.insertId
      });

    } catch (dbError) {
      await connection.end();
      console.error('Error de base de datos en registro:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Error al registrar el cliente'
      });
    }

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`API disponible en: http://localhost:${PORT}/api`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
  console.log('📋 Endpoints disponibles:');
  console.log('  GET  /api/test        - Test de conectividad');
  console.log('  POST /api/test-post   - Test POST');
  console.log('  POST /api/login       - Inicio de sesión');
  console.log('  POST /api/logout      - Cerrar sesión');
  console.log('  POST /api/register-client - Registro de clientes');
});