const { admin, db } = require('../config/firebase');

/**
 * Registrar nuevo usuario
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Validar campos requeridos
    if (!email || !password || !name || !role) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'email, password, name, and role are required'
      });
    }

    // Validar rol válido
    if (!['gerente', 'empleado'].includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role',
        message: 'Role must be either "gerente" or "empleado"'
      });
    }

    // Crear usuario en Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name
    });

    // Establecer custom claims para el rol
    await admin.auth().setCustomUserClaims(userRecord.uid, { role });

    // Guardar información adicional en Firestore
    await db().collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      name,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        uid: userRecord.uid,
        email,
        name,
        role
      }
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ 
      error: 'Registration failed',
      message: error.message
    });
  }
};

/**
 * Obtener información del usuario autenticado
 * GET /api/auth/me
 */
const getCurrentUser = async (req, res) => {
  try {
    const userDoc = await db().collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    res.json({
      uid: userData.uid,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      createdAt: userData.createdAt
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ 
      error: 'Failed to get user data',
      message: error.message
    });
  }
};

module.exports = {
  register,
  getCurrentUser
};
