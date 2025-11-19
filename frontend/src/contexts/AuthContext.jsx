import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { authAPI } from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función de login
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserRole(null);
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  };

  // Función de registro
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  };

  // Listener de cambios de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // 1. Primero obtenemos los datos extra de Firestore (Rol, Nombre, etc)
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // CORRECCIÓN CLAVE: 
            // Le pegamos el rol y los datos al objeto usuario
            // para que 'currentUser.role' funcione en toda la app
            user.role = userData.role;
            user.name = userData.name || userData.nombre; // Unificamos nombre
            
            setUserRole(userData.role);
            setCurrentUser(user); // Guardamos el usuario CON el rol inyectado
          } else {
            // Si no hay doc en base de datos, guardamos solo el usuario básico
            setCurrentUser(user);
            setUserRole(null);
          }
        } catch (error) {
          console.error('Error obteniendo rol del usuario:', error);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    login,
    logout,
    register,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;