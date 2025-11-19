const { db } = require('../config/firebase');

/**
 * Obtener todos los usuarios
 * GET /api/users
 * Solo gerentes pueden ver todos los usuarios
 */
const getUsers = async (req, res) => {
  try {
    const snapshot = await db().collection('users').get();
    
    const users = [];
    snapshot.forEach(doc => {
      const userData = doc.data();
      users.push({
        uid: userData.uid,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        createdAt: userData.createdAt
      });
    });

    res.json({ users, count: users.length });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ 
      error: 'Failed to get users',
      message: error.message
    });
  }
};

/**
 * Obtener usuarios por rol
 * GET /api/users/role/:role
 */
const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;

    if (!['gerente', 'empleado'].includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role',
        message: 'Role must be either gerente or empleado'
      });
    }

    const snapshot = await db().collection('users')
      .where('role', '==', role)
      .get();
    
    const users = [];
    snapshot.forEach(doc => {
      const userData = doc.data();
      users.push({
        uid: userData.uid,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        createdAt: userData.createdAt
      });
    });

    res.json({ users, count: users.length });
  } catch (error) {
    console.error('Error getting users by role:', error);
    res.status(500).json({ 
      error: 'Failed to get users',
      message: error.message
    });
  }
};

/**
 * Obtener un usuario específico
 * GET /api/users/:uid
 */
const getUserById = async (req, res) => {
  try {
    const { uid } = req.params;
    
    const userDoc = await db().collection('users').doc(uid).get();
    
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
    console.error('Error getting user:', error);
    res.status(500).json({ 
      error: 'Failed to get user',
      message: error.message
    });
  }
};

/**
 * Obtener métricas/estadísticas de usuarios
 * GET /api/users/metrics/summary
 * Solo para gerentes
 */
const getUserMetrics = async (req, res) => {
  try {
    // Obtener todos los usuarios
    const usersSnapshot = await db().collection('users').get();
    
    let totalUsers = 0;
    let gerentes = 0;
    let empleados = 0;

    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      totalUsers++;
      if (userData.role === 'gerente') {
        gerentes++;
      } else if (userData.role === 'empleado') {
        empleados++;
      }
    });

    // Obtener estadísticas de tareas por usuario
    const tasksSnapshot = await db().collection('tasks').get();
    
    const tasksByUser = {};
    tasksSnapshot.forEach(doc => {
      const taskData = doc.data();
      const assignedTo = taskData.assignedTo;
      
      if (!tasksByUser[assignedTo]) {
        tasksByUser[assignedTo] = {
          total: 0,
          todo: 0,
          in_progress: 0,
          done: 0
        };
      }
      
      tasksByUser[assignedTo].total++;
      tasksByUser[assignedTo][taskData.status]++;
    });

    res.json({
      users: {
        total: totalUsers,
        gerentes,
        empleados
      },
      taskDistribution: tasksByUser
    });
  } catch (error) {
    console.error('Error getting user metrics:', error);
    res.status(500).json({ 
      error: 'Failed to get metrics',
      message: error.message
    });
  }
};

module.exports = {
  getUsers,
  getUsersByRole,
  getUserById,
  getUserMetrics
};
