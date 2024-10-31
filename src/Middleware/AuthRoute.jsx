// src/Middleware/AuthRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const AuthRoute = ({ children, restricted = false }) => {
  const { isAuthenticated } = useAuth();

  // Si hay acceso restringido y el usuario está autenticado, redirigir al dashboard
  if (restricted && isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si no está autenticado y se intenta acceder a una ruta restringida, redirigir al login
  if (!isAuthenticated() && !restricted) {
    return <Navigate to="/login" replace />;
  }

  return children; // Permitir acceso a la ruta
};

export default AuthRoute;
