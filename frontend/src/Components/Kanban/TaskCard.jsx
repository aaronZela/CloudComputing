import { Draggable } from 'react-beautiful-dnd';

const formatTaskDate = (dateData) => {
  if (!dateData) return 'Sin fecha';
  try {
    if (dateData && typeof dateData === 'object' && dateData.seconds) {
      return new Date(dateData.seconds * 1000).toLocaleDateString('es-ES');
    }
    const date = new Date(dateData);
    if (isNaN(date.getTime())) return 'Fecha no válida';
    return date.toLocaleDateString('es-ES');
  } catch (e) {
    console.error('Error formateando fecha:', e);
    return 'Error fecha';
  }
};

// Recibimos onStatusChange aquí para usarlo en el select
function TaskCard({ task, index, onStatusChange }) {
  const priorityColors = {
    baja: 'bg-green-100 text-green-800',
    media: 'bg-yellow-100 text-yellow-800',
    alta: 'bg-red-100 text-red-800'
  };

  const assigneeName = task.assigneeName || task.asignado_a_nombre || 'Sin asignar';
  const taskDate = task.dueDate || task.fecha_vencimiento;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition cursor-move ${
            snapshot.isDragging ? 'shadow-lg rotate-2' : ''
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-gray-900">
              {task.title || task.titulo}
            </h4>
            <span className={`px-2 py-1 text-xs rounded-full ${priorityColors[task.priority || task.prioridad] || 'bg-gray-100'}`}>
              {task.priority || task.prioridad || 'media'}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {task.description || task.descripcion}
          </p>
          
          <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1" title="Usuario asignado">
              👤 {assigneeName}
            </span>
            <span className="flex items-center gap-1" title="Fecha de vencimiento">
              📅 {formatTaskDate(taskDate)}
            </span>
          </div>

          {/* SELECTOR DE ESTADO */}
          <div className="pt-2 border-t border-gray-100">
            <select
              value={task.status}
              onChange={(e) => {
                 if (typeof onStatusChange === 'function') {
                    onStatusChange(task.id, e.target.value);
                 } else {
                    console.error("Error: onStatusChange no llegó a la tarjeta");
                 }
              }}
              onMouseDown={(e) => e.stopPropagation()} 
              className="w-full text-xs p-1 rounded border border-gray-300 bg-gray-50 text-gray-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="pendiente">⚪ Tarea Pendiente</option>
              <option value="en_progreso">🔵 Tarea En Progreso</option>
              <option value="completada">✅ Tarea Completada</option>
            </select>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default TaskCard;