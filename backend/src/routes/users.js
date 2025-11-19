const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUsersByRole, 
  getUserById, 
  getUserMetrics 
} = require('../controllers/userController');
const { verifyToken, verifyGerente } = require('../middleware/auth');

// Todas las rutas requieren autenticación y rol de gerente
router.use(verifyToken);
router.use(verifyGerente);

// GET /api/users - Listar todos los usuarios
router.get('/', getUsers);

// GET /api/users/role/:role - Listar usuarios por rol (gerente o empleado)
router.get('/role/:role', getUsersByRole);

// GET /api/users/metrics/summary - Obtener métricas de usuarios
router.get('/metrics/summary', getUserMetrics);

// GET /api/users/:uid - Obtener usuario específico
router.get('/:uid', getUserById);

module.exports = router;
