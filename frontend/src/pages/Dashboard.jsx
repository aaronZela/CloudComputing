import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI, tasksAPI } from '../services/api';
import Navbar from '../Components/common/Navbar';
import Sidebar from '../Components/common/Sidebar';
import MetricsCard from '../Components/dashboard/MetricsCard';
import TasksChart from '../Components/dashboard/TasksChart';
import Loading from '../Components/common/Loading';
import toast from 'react-hot-toast';

function Dashboard() {
  const { currentUser } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [metricsRes, tasksRes] = await Promise.all([
        usersAPI.getMetrics(),
        tasksAPI.getAll()
      ]);
      
      setMetrics(metricsRes.data);

      // CORRECCIÓN: Extraer el array de tareas correctamente
      // Buscamos tasksRes.data.tasks o usamos tasksRes.data si ya es array
      const tasksData = tasksRes.data.tasks || tasksRes.data;
      
      if (Array.isArray(tasksData)) {
        setTasks(tasksData);
      } else {
        console.warn('Dashboard: Las tareas no son un array', tasksData);
        setTasks([]);
      }

    } catch (error) {
      console.error('Error cargando datos:', error);
      // No mostramos toast de error si es solo que está vacío al inicio
      if (error.response?.status !== 404) {
         toast.error('Error al cargar el dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  // PROTECCIÓN: Aseguramos que sea un array antes de usar .filter
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const tasksByStatus = {
    pendiente: safeTasks.filter(t => t.status === 'pendiente').length,
    en_progreso: safeTasks.filter(t => t.status === 'en_progreso').length,
    completada: safeTasks.filter(t => t.status === 'completada').length
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Dashboard - {currentUser?.email}
            </h1>

            {/* Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <MetricsCard
                title="Tareas Pendientes"
                value={tasksByStatus.pendiente}
                icon="📋"
                color="yellow"
              />
              <MetricsCard
                title="En Progreso"
                value={tasksByStatus.en_progreso}
                icon="⚙️"
                color="blue"
              />
              <MetricsCard
                title="Completadas"
                value={tasksByStatus.completada}
                icon="✅"
                color="green"
              />
            </div>

            {/* Gráfico */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Estado de Tareas
              </h2>
              <TasksChart data={tasksByStatus} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
