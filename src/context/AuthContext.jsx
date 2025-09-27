import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const API_BASE = 'https://spot-check-backend-6.onrender.com';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // hydrate from localStorage
    const stored = localStorage.getItem('auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.token) setToken(parsed.token);
        if (parsed?.user) setUser(parsed.user);
      } catch (_) {
        // ignore
      }
    }
    setLoading(false);
  }, []);

  const saveAuth = (next) => {
    localStorage.setItem('auth', JSON.stringify(next));
    setToken(next.token || null);
    setUser(next.user || null);
  };

  // Helper function to get headers with authorization
  const getHeaders = (additionalHeaders = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...additionalHeaders
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  };

  // Helper function for authenticated API calls
  const authenticatedFetch = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(),
        ...(options.headers || {})
      }
    });
    
    // If unauthorized, clear auth data
    if (response.status === 401) {
      logout();
      throw new Error('Authentication required. Please log in again.');
    }
    
    return response;
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || 'Login failed');
    }
    const data = await res.json();
    // expects { token, user }
    saveAuth({ token: data.token, user: data.user });
    return data;
  };

  const register = async (payload) => {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || 'Registration failed');
    }
    const data = await res.json();
    // If registration returns token and user, save them
    if (data.token && data.user) {
      saveAuth({ token: data.token, user: data.user });
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setUser(null);
    setToken(null);
  };

  const value = useMemo(() => ({ 
    user, 
    token, 
    loading, 
    login, 
    logout, 
    register, 
    API_BASE,
    getHeaders,
    authenticatedFetch
  }), [user, token, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}