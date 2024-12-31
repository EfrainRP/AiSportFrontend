import React from 'react';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      if (storedUser) {
        return { ...JSON.parse(storedUser), token: storedToken };
      }
    } catch (error) {
      console.warn("Clearing invalid user data from localStorage:", error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    return null;
  });

  const login = (userData, token) => {
    if (!token) {
      console.error("Token is required for login.");
      return;
    }
    setUser({ ...userData, token });
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
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
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);