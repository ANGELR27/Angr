import { useState, useEffect } from 'react';
import authService from '../services/authService';

/**
 * Hook para gestionar autenticación con Supabase
 * @returns {Object} - Estado y métodos de autenticación
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Verificar si Supabase está configurado
    const configured = authService.isConfigured();
    setIsConfigured(configured);

    if (!configured) {
      console.warn('⚠️ Supabase no está configurado - Autenticación deshabilitada');
      setLoading(false);
      return;
    }

    // Obtener usuario inicial
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        console.log('👤 Usuario inicial:', currentUser?.email || 'No autenticado');
        setUser(currentUser);
      } catch (error) {
        console.error('Error al inicializar auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      console.log('🔄 Auth event:', event);
      
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        console.log('✅ Usuario autenticado:', session?.user?.email);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        console.log('👋 Usuario desconectado');
      } else if (event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
        console.log('🔄 Token actualizado');
      }
      
      setLoading(false);
    });

    // Cleanup
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Login con email/password
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { user: loggedUser } = await authService.login(email, password);
      setUser(loggedUser);
      return loggedUser;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup con email/password
  const signup = async (email, password, displayName) => {
    try {
      setLoading(true);
      const { user: newUser } = await authService.signup(email, password, displayName);
      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error('Error en signup:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login con proveedor social
  const loginWithProvider = async (provider) => {
    try {
      setLoading(true);
      await authService.loginWithProvider(provider);
      // El usuario se actualizará automáticamente con onAuthStateChange
    } catch (error) {
      console.error(`Error en login con ${provider}:`, error);
      setLoading(false);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Obtener display name
  const getDisplayName = () => {
    return authService.getDisplayName(user);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isConfigured,
    login,
    signup,
    loginWithProvider,
    logout,
    getDisplayName
  };
}

export default useAuth;
