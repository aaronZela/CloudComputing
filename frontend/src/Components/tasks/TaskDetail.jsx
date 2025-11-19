import { formatDate } from '../../utils/formatters';

function TaskDetail({ task }) {
  if (!task) return null;

  const priorityColors = {
    baja: 'bg-green-100 text-green-800',
    media: 'bg-yellow-100 text-yellow-800',
    alta: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    pendiente: 'Pendiente',
    en_progreso: 'En Progreso',
    completada: 'Completada'
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{task.titulo}</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[task.prioridad]}`}>
          {task.prioridad}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-500">Descripción</label>
          <p className="mt-1 text-gray-900">{task.descripcion}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Estado</label>
            <p className="mt-1 text-gray-900">{statusLabels[task.status]}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Asignado a</label>
            <p className="mt-1 text-gray-900">{task.asignado_a_nombre || 'Sin asignar'}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Fecha de vencimiento</label>
            <p className="mt-1 text-gray-900">{formatDate(task.fecha_vencimiento)}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Creado</label>
            <p className="mt-1 text-gray-900">{formatDate(task.creado_en)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;