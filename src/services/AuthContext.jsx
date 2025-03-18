import React from 'react';
import Cookies from 'js-cookie'; // Importar js-cookie

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(() => {
    // Recupera el usuario y token desde las cookies
    const storedUser = Cookies.get('user');
    const storedToken = Cookies.get('token');
    return storedUser ? { ...JSON.parse(storedUser), token: storedToken } : null;
  });

  const login = (userData, token) => {
    // Establecer las cookies para el usuario y el token (cookies de sesión)
    setUser({ ...userData, token });
    Cookies.set('user', JSON.stringify(userData)); // Guarda el usuario en una cookie de sesión
    Cookies.set('token', token); // Guarda el token en una cookie de sesión
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('user'); // Eliminar la cookie del usuario
    Cookies.remove('token'); // Eliminar la cookie del token
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading, setLoading}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);