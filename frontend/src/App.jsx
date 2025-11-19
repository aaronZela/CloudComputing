import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import KanbanBoard from './pages/KanbanBoard';

// Componente para rutas protegidas
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

// Componente para rutas solo de gerente
const GerenteRoute = ({ children }) => {
  const { currentUser, userRole } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (userRole !== 'gerente') {
    return <Navigate to="/kanban" />;
  }
  
  return children;
};

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route 
        path="/login" 
        element={currentUser ? <Navigate to="/dashboard" /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={currentUser ? <Navigate to="/dashboard" /> : <Register />} 
      />

      {/* Rutas protegidas */}
      <Route
        path="/dashboard"
        element={
          <GerenteRoute>
            <Dashboard />
          </GerenteRoute>
        }
      />
      <Route
        path="/kanban"
        element={
          <PrivateRoute>
            <KanbanBoard />
          </PrivateRoute>
        }
      />

      {/* Redirección por defecto */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
