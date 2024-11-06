import React from 'react';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import { AuthProvider } from './services/AuthContext.jsx'; 
import AuthRoute from './middleware/AuthRoute.jsx'; // Middlewares

import Welcome from './views/Inicio/Welcome.jsx';
import SignUp from './views/Inicio/SignUp/SignUp.jsx';
import SignIn from "./views/Inicio/SignIn/SignIn.jsx";
import Dashboard from "./views/Dashboard/Dashboard.jsx";

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