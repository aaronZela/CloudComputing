const express = require('express');
const router = express.Router();
const { register, getCurrentUser } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', register);

// GET /api/auth/me - Obtener información del usuario actual
router.get('/me', verifyToken, getCurrentUser);

module.exports = router;
