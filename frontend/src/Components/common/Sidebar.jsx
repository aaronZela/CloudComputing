import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Sidebar() {
  const location = useLocation();
  const { userRole } = useAuth();

  const links = [
    { path: '/kanban', label: 'Tablero Kanban', icon: '📋', roles: ['gerente', 'empleado'] },
    { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['gerente'] }
  ];

  const filteredLinks = links.filter(link => link.roles.includes(userRole));

  return (
    <aside className="w-64 bg-indigo-900 text-white">
      <div className="p-6">
        <h1 className="text-2xl font-bold">TaskFlow</h1>
        <p className="text-indigo-300 text-sm mt-1">Gestión de tareas</p>
      </div>
      
      <nav className="mt-6">
        {filteredLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-3 px-6 py-3 hover:bg-indigo-800 transition ${
              location.pathname === link.path ? 'bg-indigo-800 border-l-4 border-white' : ''
            }`}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;