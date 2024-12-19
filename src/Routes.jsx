import React from 'react';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import { AuthProvider } from './services/AuthContext.jsx'; 
import AuthRoute from './middleware/AuthRoute.jsx'; // Middlewares

import Welcome from './views/Basic/Welcome.jsx';

import AboutUs from './views/Basic/AboutUs.jsx';
import Terms from './views/Basic/Terms.jsx';
import Privacy from './views/Basic/Privacy.jsx';

import SignUp from './views/Basic/SignUp/SignUp.jsx';
import SignIn from "./views/Basic/SignIn/SignIn.jsx";
import Dashboard from "./views/Login/Dashboard.jsx";

export default function MyRoute(){
    return (
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rutas con acceso general/invitados */}
            <Route index path="/" element={<Welcome/>}/>
            <Route path="/aboutus" element={<AboutUs/>}/>
            <Route path="/terms" element={<Terms/>}/>
            <Route path="/privacy" element={<Privacy/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>

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