const { admin, db } = require('../config/firebase');

/**
 * Obtener todas las tareas
 * GET /api/tasks
 * Gerente: ve todas las tareas
 * Empleado: solo ve sus tareas asignadas
 */
const getTasks = async (req, res) => {
  try {
    const { uid, role } = req.user;
    let tasksQuery = db().collection('tasks');

    // Si es empleado, filtrar solo sus tareas
    if (role === 'empleado') {
      tasksQuery = tasksQuery.where('assignedTo', '==', uid);
    }

    // --- CORRECCIÓN APLICADA ---
    // Hemos quitado .orderBy('createdAt', 'desc') de la consulta directa
    // para evitar el error de índice compuesto en Firestore.
    const snapshot = await tasksQuery.get();
    
    const tasks = [];
    snapshot.forEach(doc => {
      tasks.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Ordenamos manualmente en JavaScript (del más nuevo al más antiguo)
    tasks.sort((a, b) => {
        const dateA = a.createdAt && a.createdAt.toDate ? a.createdAt.toDate() : new Date(0);
        const dateB = b.createdAt && b.createdAt.toDate ? b.createdAt.toDate() : new Date(0);
        return dateB - dateA; 
    });

    res.json({ tasks, count: tasks.length });
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ 
      error: 'Failed to get tasks',
      message: error.message
    });
  }
};

/**
 * Obtener una tarea específica
 * GET /api/tasks/:id
 */
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const taskDoc = await db().collection('tasks').doc(id).get();

    if (!taskDoc.exists) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const taskData = taskDoc.data();

    // Verificar permisos: empleado solo puede ver sus tareas
    if (req.user.role === 'empleado' && taskData.assignedTo !== req.user.uid) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'You can only view tasks assigned to you'
      });
    }

    res.json({
      id: taskDoc.id,
      ...taskData
    });
  } catch (error) {
    console.error('Error getting task:', error);
    res.status(500).json({ 
      error: 'Failed to get task',
      message: error.message
    });
  }
};

/**
 * Crear nueva tarea (solo gerente)
 * POST /api/tasks
 */
const createTask = async (req, res) => {
  try {
    const { title, description, priority, assignedTo, dueDate } = req.body;

    // Validar campos requeridos
    if (!title || !assignedTo) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'title and assignedTo are required'
      });
    }

    // Validar prioridad
    const validPriorities = ['alta', 'media', 'baja'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ 
        error: 'Invalid priority',
        message: 'Priority must be alta, media, or baja'
      });
    }

    // Verificar que el empleado asignado existe
    const assignedUserDoc = await db().collection('users').doc(assignedTo).get();
    if (!assignedUserDoc.exists) {
      return res.status(404).json({ 
        error: 'Assigned user not found',
        message: `User with id ${assignedTo} does not exist`
      });
    }

    // Crear la tarea
    const taskData = {
      title,
      description: description || '',
      priority: priority || 'media',
      status: 'pendiente', // Aseguramos que coincida con el frontend (pendiente/en_progreso/completada) o (todo/in_progress/done)
      assignedTo,
      createdBy: req.user.uid,
      dueDate: dueDate ? admin.firestore.Timestamp.fromDate(new Date(dueDate)) : null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      comments: []
    };

    const docRef = await db().collection('tasks').add(taskData);

    res.status(201).json({
      message: 'Task created successfully',
      task: {
        id: docRef.id,
        ...taskData
      }
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ 
      error: 'Failed to create task',
      message: error.message
    });
  }
};

/**
 * Actualizar tarea (solo gerente)
 * PUT /api/tasks/:id
 */
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, assignedTo, dueDate, status } = req.body;

    const taskDoc = await db().collection('tasks').doc(id).get();
    if (!taskDoc.exists) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Preparar datos actualizados
    const updates = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (priority !== undefined) {
      const validPriorities = ['alta', 'media', 'baja'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({ error: 'Invalid priority' });
      }
      updates.priority = priority;
    }
    if (assignedTo !== undefined) {
      // Verificar que el usuario existe
      const userDoc = await db().collection('users').doc(assignedTo).get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'Assigned user not found' });
      }
      updates.assignedTo = assignedTo;
    }
    if (dueDate !== undefined) {
      updates.dueDate = dueDate ? admin.firestore.Timestamp.fromDate(new Date(dueDate)) : null;
    }
    if (status !== undefined) {
      // Ajusta estos estados según lo que uses en el frontend (KanbanColumn)
      const validStatuses = ['pendiente', 'en_progreso', 'completada', 'todo', 'in_progress', 'done'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      updates.status = status;
    }

    await db().collection('tasks').doc(id).update(updates);

    res.json({
      message: 'Task updated successfully',
      task: {
        id,
        ...taskDoc.data(),
        ...updates
      }
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ 
      error: 'Failed to update task',
      message: error.message
    });
  }
};

/**
 * Actualizar estado de tarea
 * PATCH /api/tasks/:id/status
 * Tanto gerente como empleado pueden actualizar el estado de sus tareas
 */
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Ajusta estos estados según lo que uses en el frontend
    const validStatuses = ['pendiente', 'en_progreso', 'completada', 'todo', 'in_progress', 'done'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status',
        message: 'Status must be valid'
      });
    }

    const taskDoc = await db().collection('tasks').doc(id).get();
    if (!taskDoc.exists) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const taskData = taskDoc.data();

    // Verificar permisos: empleado solo puede actualizar sus tareas
    if (req.user.role === 'empleado' && taskData.assignedTo !== req.user.uid) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'You can only update status of tasks assigned to you'
      });
    }

    await db().collection('tasks').doc(id).update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      message: 'Task status updated successfully',
      task: {
        id,
        ...taskData,
        status
      }
    });
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ 
      error: 'Failed to update task status',
      message: error.message
    });
  }
};

/**
 * Eliminar tarea (solo gerente)
 * DELETE /api/tasks/:id
 */
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const taskDoc = await db().collection('tasks').doc(id).get();
    if (!taskDoc.exists) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await db().collection('tasks').doc(id).delete();

    res.json({
      message: 'Task deleted successfully',
      taskId: id
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ 
      error: 'Failed to delete task',
      message: error.message
    });
  }
};

/**
 * Agregar comentario a una tarea
 * POST /api/tasks/:id/comments
 */
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ 
        error: 'Missing text',
        message: 'Comment text is required'
      });
    }

    const taskDoc = await db().collection('tasks').doc(id).get();
    if (!taskDoc.exists) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const taskData = taskDoc.data();

    // Verificar permisos: empleado solo puede comentar sus tareas
    if (req.user.role === 'empleado' && taskData.assignedTo !== req.user.uid) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'You can only comment on tasks assigned to you'
      });
    }

    // Obtener información del usuario que comenta
    const userDoc = await db().collection('users').doc(req.user.uid).get();
    const userData = userDoc.data();

    const comment = {
      text,
      userId: req.user.uid,
      userName: userData.name,
      createdAt: admin.firestore.Timestamp.now()
    };

    await db().collection('tasks').doc(id).update({
      comments: admin.firestore.FieldValue.arrayUnion(comment),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({
      message: 'Comment added successfully',
      comment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ 
      error: 'Failed to add comment',
      message: error.message
    });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  addComment
};