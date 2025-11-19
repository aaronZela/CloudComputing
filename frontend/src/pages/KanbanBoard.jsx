import { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { tasksAPI, usersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import KanbanColumn from '../components/kanban/KanbanColumn';
import CreateTaskModal from '../components/kanban/CreateTaskModal';
import Loading from '../components/common/Loading';
import toast from 'react-hot-toast';

function KanbanBoard() {
  const { currentUser } = useAuth(); 
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const columns = {
    pendiente: { id: 'pendiente', title: 'Pendiente', color: 'yellow' },
    en_progreso: { id: 'en_progreso', title: 'En Progreso', color: 'blue' },
    completada: { id: 'completada', title: 'Completada', color: 'green' }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 1. CARGAR TAREAS (Esto funciona para todos)
      const tasksRes = await tasksAPI.getAll();
      const tasksData = tasksRes.data.tasks || tasksRes.data;
      
      if (Array.isArray(tasksData)) {
        setTasks(tasksData);
      } else {
        setTasks([]);
      }

      // 2. INTENTAR CARGAR USUARIOS (Puede fallar si eres empleado)
      try {
        const usersRes = await usersAPI.getAll();
        let usersList = [];
        if (Array.isArray(usersRes.data)) usersList = usersRes.data;
        else if (usersRes.data?.users) usersList = usersRes.data.users;
        else if (usersRes.data?.data) usersList = usersRes.data.data;
        setUsers(usersList);
      } catch (userError) {
        // Si falla (Error 403), no rompemos nada, solo dejamos la lista vacía
        console.warn('No se pudo cargar la lista de usuarios (falta de permisos).');
        setUsers([]); 
      }

    } catch (error) {
      console.error('Error cargando el tablero:', error);
      toast.error('Error al cargar el tablero');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar el estado (se la pasaremos a los hijos)
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);

      await tasksAPI.updateStatus(taskId, newStatus);
      toast.success('Estado actualizado');
    } catch (error) {
      console.error('Error actualizando estado:', error);
      toast.error('No se pudo actualizar la tarea');
      loadData(); 
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    handleStatusChange(result.draggableId, result.destination.droppableId);
  };

  const handleCreateTask = async (taskData) => {
    try {
      await tasksAPI.create(taskData);
      loadData(); 
      setShowModal(false);
      toast.success('Tarea creada exitosamente');
    } catch (error) {
      console.error('Error creando tarea:', error);
      toast.error('Error al crear la tarea');
    }
  };

  const getUserName = (uid) => {
    if (!uid) return 'Sin asignar';
    const user = users.find(u => u.uid === uid || u.id === uid);
    return user ? (user.name || user.nombre || user.email) : 'Usuario';
  };

  if (loading) return <Loading />;

  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const enrichedTasks = safeTasks.map(task => ({
    ...task,
    assigneeName: getUserName(task.assignedTo || task.asignado_a)
  }));

  const isManager = currentUser?.role && currentUser.role.toLowerCase() === 'gerente';

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-auto p-6">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Tablero Kanban</h1>
            {isManager && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                + Nueva Tarea
              </button>
            )}
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.values(columns).map(column => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={enrichedTasks.filter(task => task.status === column.id)}
                  // IMPORTANTE: Aquí pasamos la función hacia abajo
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </DragDropContext>
        </main>
      </div>
      {showModal && (
        <CreateTaskModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateTask}
        />
      )}
    </div>
  );
}

export default KanbanBoard;