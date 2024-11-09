import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');  // Recuperar el token
    return storedUser ? { ...JSON.parse(storedUser), token: storedToken } : null;
  });

  const login = (userData, token) => {
    setUser({ ...userData, token });
    localStorage.setItem('user', JSON.stringify(userData)); // Guarda el nombre de usuario para mantener su referencia 
    localStorage.setItem('token', token); // Guarda el token
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
