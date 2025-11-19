import { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';

function CreateTaskModal({ onClose, onSubmit }) {
  // Inicializamos siempre como array vacío para evitar errores
  const [usuarios, setUsuarios] = useState([]);
  
  // CORRECCIÓN: Cambiamos las llaves a INGLÉS para coincidir con el Backend
  const [formData, setFormData] = useState({
    title: '',          // Antes: titulo
    description: '',    // Antes: descripcion
    priority: 'media',  // Antes: prioridad (el valor 'media' sí lo acepta el backend)
    assignedTo: '',     // Antes: asignado_a
    dueDate: ''         // Antes: fecha_vencimiento
  });

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      const response = await usersAPI.getAll();
      
      // Lógica defensiva para encontrar la lista de usuarios
      let usersList = [];
      
      if (Array.isArray(response.data)) {
        usersList = response.data;
      } else if (response.data && Array.isArray(response.data.users)) {
        usersList = response.data.users;
      } else if (response.data && Array.isArray(response.data.data)) {
        usersList = response.data.data;
      }

      setUsuarios(usersList);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setUsuarios([]); 
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ahora formData ya tiene las llaves correctas (title, assignedTo, etc.)
    onSubmit(formData);
  };

  // Protección para evitar que el mapa explote si usuarios es null
  const safeUsuarios = Array.isArray(usuarios) ? usuarios : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Nueva Tarea</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* CAMPO TÍTULO */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              type="text"
              name="title"       // CAMBIO: name="title"
              required
              value={formData.title} // CAMBIO: value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* CAMPO DESCRIPCIÓN */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              name="description" // CAMBIO: name="description"
              required
              value={formData.description} // CAMBIO: value={formData.description}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* CAMPO PRIORIDAD */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prioridad
            </label>
            <select
              name="priority" // CAMBIO: name="priority"
              value={formData.priority} // CAMBIO: value={formData.priority}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          {/* CAMPO ASIGNAR A */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Asignar a
            </label>
            <select
              name="assignedTo" // CAMBIO: name="assignedTo"
              required
              value={formData.assignedTo} // CAMBIO: value={formData.assignedTo}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Seleccionar usuario</option>
              {safeUsuarios.map(user => (
                <option key={user.uid} value={user.uid}>
                  {user.name || user.nombre || user.email} ({user.role || 'Sin rol'})
                </option>
              ))}
            </select>
          </div>

          {/* CAMPO FECHA DE VENCIMIENTO */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de vencimiento
            </label>
            <input
              type="date"
              name="dueDate" // CAMBIO: name="dueDate"
              required
              value={formData.dueDate} // CAMBIO: value={formData.dueDate}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Crear Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTaskModal;