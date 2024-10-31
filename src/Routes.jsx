import React from 'react';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import { AuthProvider } from './AuthContext'; 
import AuthRoute from './Middleware/AuthRoute.jsx'; // Middlewares

import Welcome from './Inicio/Welcome.jsx';
import SignUp from './Inicio/SignUp/SignUp.jsx';
import SignIn from "./Inicio/SignIn/SignIn.jsx";
import Dashboard from "./Dashboard/Dashboard.jsx";

export default function MyRoute(){
    return (
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rutas con acceso general/invitados */}
            <Route index path="/" element={<Welcome/>}/>

            {/* Rutas que no deben ser accesibles para usuarios autenticados */}
            <Route 
              path="/signin" 
              element={<AuthRoute restricted={true}> 
                        <SignIn/>
                      </AuthRoute>} 
            />
            <Route 
              path="/signup" 
              element={<AuthRoute restricted={true}> 
                        <SignUp/>
                      </AuthRoute>} 
            />

            {/* Rutas para usuarios autenticados */}
            <Route 
              path="/dashboard" 
              element={<AuthRoute> 
                        <Dashboard/>
                      </AuthRoute>} 
            />
          </Routes>
        </Router>
      </AuthProvider>
    )
}