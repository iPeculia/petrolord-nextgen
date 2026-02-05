import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const ADMIN_EMAILS = ['info@petrolord.com', 'nextgen@petrolord.com'];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('petrolord_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    if (ADMIN_EMAILS.includes(email) && password === 'admin123') {
      const userData = { email, role: 'admin' };
      setUser(userData);
      localStorage.setItem('petrolord_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('petrolord_user');
  };

  const isAdmin = () => {
    return user && ADMIN_EMAILS.includes(user.email);
  };

  const value = {
    user,
    login,
    logout,
    isAdmin,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};