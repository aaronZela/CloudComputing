import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

// 1. Recibimos onStatusChange
function KanbanColumn({ column, tasks, onStatusChange }) {
  const colorClasses = {
    yellow: 'border-yellow-400 bg-yellow-50',
    blue: 'border-blue-400 bg-blue-50',
    green: 'border-green-400 bg-green-50'
  };

  return (
    <div className={`rounded-lg border-2 ${colorClasses[column.color]} p-4`}>
      <h3 className="font-semibold text-lg mb-4 text-gray-800">
        {column.title} ({tasks.length})
      </h3>
      
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 min-h-[200px] ${
              snapshot.isDraggingOver ? 'bg-gray-100 rounded-lg' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                index={index}
                // 2. Pasamos la función a la tarjeta
                onStatusChange={onStatusChange}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default KanbanColumn;