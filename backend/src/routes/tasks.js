const express = require('express');
const router = express.Router();
const { 
  getTasks, 
  getTaskById, 
  createTask, 
  updateTask, 
  updateTaskStatus,
  deleteTask,
  addComment 
} = require('../controllers/taskController');
const { verifyToken, verifyGerente } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// GET /api/tasks - Listar tareas (gerente ve todas, empleado solo sus tareas)
router.get('/', getTasks);

// GET /api/tasks/:id - Obtener tarea específica
router.get('/:id', getTaskById);

// POST /api/tasks - Crear tarea (solo gerente)
router.post('/', verifyGerente, createTask);

// PUT /api/tasks/:id - Actualizar tarea completa (solo gerente)
router.put('/:id', verifyGerente, updateTask);

// PATCH /api/tasks/:id/status - Actualizar solo el estado (gerente y empleado)
router.patch('/:id/status', updateTaskStatus);

// DELETE /api/tasks/:id - Eliminar tarea (solo gerente)
router.delete('/:id', verifyGerente, deleteTask);

// POST /api/tasks/:id/comments - Agregar comentario
router.post('/:id/comments', addComment);

module.exports = router;
