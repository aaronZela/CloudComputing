import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import RegisterForm from '../Components/auth/RegisterForm';

function Register() {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (userData) => {
    setLoading(true);
    try {
      await register(userData);
      toast.success('¡Cuenta creada exitosamente!');
      navigate('/login');
    } catch (error) {
      console.error('Error en registro:', error);
      toast.error(error.response?.data?.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Crear cuenta</h2>
          <p className="mt-2 text-sm text-gray-600">
            Únete a TaskFlow
          </p>
        </div>
        
        <RegisterForm onSubmit={handleRegister} loading={loading} />
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link 
              to="/login" 
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
