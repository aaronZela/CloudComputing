const { admin } = require('../config/firebase');

/**
 * Middleware para verificar token JWT de Firebase
 * Extrae el token del header Authorization y lo verifica
 */
const verifyToken = async (req, res, next) => {
  try {
    // Extraer token del header Authorization: "Bearer <token>"
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No token provided',
        message: 'Authorization header must be provided with Bearer token'
      });
    }

    const token = authHeader.split('Bearer ')[1];

    // Verificar token con Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Agregar información del usuario al request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || 'empleado' // rol por defecto
    };

    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).json({ 
      error: 'Invalid token',
      message: error.message
    });
  }
};

/**
 * Middleware para verificar que el usuario tenga rol de gerente
 */
const verifyGerente = async (req, res, next) => {
  try {
    // Obtener información del usuario de Firestore
    const { db } = require('../config/firebase');
    const userDoc = await db().collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    
    if (userData.role !== 'gerente') {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'Only gerente role can perform this action'
      });
    }

    // Agregar datos del usuario al request
    req.userData = userData;
    next();
  } catch (error) {
    console.error('Error verifying gerente role:', error);
    return res.status(500).json({ 
      error: 'Error verifying permissions',
      message: error.message
    });
  }
};

module.exports = {
  verifyToken,
  verifyGerente
};
