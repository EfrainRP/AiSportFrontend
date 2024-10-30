// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext'; 
import './index.css';
import './App.css';
// Middlewares
import AuthRoute from './Middleware/AuthRoute'; 
// Views and Routes
import Sporthub from './Sporthub';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas con acceso general/invitados */}
          <Route path="/" element={<Sporthub />} />

          {/* Rutas que no deben ser accesibles para usuarios autenticados */}
          <Route
            path="/login"
            element={
              <AuthRoute restricted={true}>
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRoute restricted={true}>
                <Register />
              </AuthRoute>
            }
          />

          {/* Rutas para usuarios autenticados */}
          <Route
            path="/dashboard"
            element={
              <AuthRoute>
                <Dashboard />
              </AuthRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
