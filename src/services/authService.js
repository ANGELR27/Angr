import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance = null;

// Singleton de Supabase para Auth
function getSupabase() {
  if (!supabaseInstance && SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
  }
  return supabaseInstance;
}

class AuthService {
  constructor() {
    this.supabase = getSupabase();
  }

  // Verificar si Supabase está configurado
  isConfigured() {
    return !!(SUPABASE_URL && SUPABASE_ANON_KEY && this.supabase);
  }

  // Login con email/password
  async login(email, password) {
    if (!this.isConfigured()) {
      throw new Error('Supabase no está configurado. Configura las variables de entorno.');
    }

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    console.log('✅ Login exitoso:', data.user.email);
    return data;
  }

  // Signup con email/password
  async signup(email, password, displayName) {
    if (!this.isConfigured()) {
      throw new Error('Supabase no está configurado. Configura las variables de entorno.');
    }

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName
        }
      }
    });
    
    if (error) throw error;
    
    console.log('✅ Registro exitoso:', data.user?.email);
    return data;
  }

  // Login con proveedor social (Google, GitHub)
  async loginWithProvider(provider) {
    if (!this.isConfigured()) {
      throw new Error('Supabase no está configurado. Configura las variables de entorno.');
    }

    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin
      }
    });
    
    if (error) throw error;
    
    console.log('✅ Login con', provider, 'iniciado');
    return data;
  }

  // Logout
  async logout() {
    if (!this.isConfigured()) {
      return;
    }

    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    
    console.log('✅ Logout exitoso');
  }

  // Obtener usuario actual
  async getCurrentUser() {
    if (!this.isConfigured()) {
      return null;
    }

    const { data: { user }, error } = await this.supabase.auth.getUser();
    
    if (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
    
    return user;
  }

  // Obtener sesión actual
  async getSession() {
    if (!this.isConfigured()) {
      return null;
    }

    const { data: { session }, error } = await this.supabase.auth.getSession();
    
    if (error) {
      console.error('Error al obtener sesión:', error);
      return null;
    }
    
    return session;
  }

  // Escuchar cambios de autenticación
  onAuthStateChange(callback) {
    if (!this.isConfigured()) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }

    return this.supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state change:', event);
      callback(event, session);
    });
  }

  // Obtener display name del usuario
  getDisplayName(user) {
    if (!user) return 'Usuario';
    
    return user.user_metadata?.display_name 
      || user.email?.split('@')[0] 
      || 'Usuario';
  }
}

// Exportar instancia única
const authService = new AuthService();
export default authService;
