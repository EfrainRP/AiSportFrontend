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
//  -------------------------------------------------------------
//  CRUD TORNEOS 
import Torneos from './views/Torneos/index'; // Torneos Index <-
import TorneoShow from './views/Torneos/show'; // Torneos show <-
import TorneoEdit from './views/Torneos/edit'; // Torneos edit <-
import TorneoCreate from './views/Torneos/create'; // Torneos create <-
//  -------------------------------------------------------------
//  CRUD EQUIPOS 
import Equipos from './views/Equipos/index'; // Equipos Index <-
import EquipoShow from './views/Equipos/show'; // Equipos show <-
import EquipoEdit from './views/Equipos/edit'; // Equipos edit <-
import EquipoCreate from './views/Equipos/create'; // Equipos create <-
//  -------------------------------------------------------------
//  CRUD MIEMBROS 
import Miembros from './views/Miembros/index'; // Miembros Index <-
import MiembroShow from './views/Miembros/show'; // Miembros show <-
import MiembroEdit from './views/Miembros/edit'; // Miembros edit <-
import MiembroCreate from './views/Miembros/create'; // Miembros create <-
//  -------------------------------------------------------------
//  CRUD PARTIDOS 
import Partidos from './views/Partidos/index'; // Partidos Index <-
import PartidoShow from './views/Partidos/show'; // Partidos show <-
import PartidoEdit from './views/Partidos/edit'; // Partidos edit <-
import PartidoCreate from './views/Partidos/create'; // Partidos create <-
//  -------------------------------------------------------------

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
  
          {/* Rutas para usuarios autenticados ------------------------------------------------*/}
          <Route
            path="/dashboard"
            element={
              <AuthRoute>
                <Dashboard />
              </AuthRoute>
            }
          /> 
          <Route  // < ------------- CRUD TORNEOS ------------------------------------ >    
            path="/torneos"        // Ruta index 
            element={
              <AuthRoute>
                <Torneos />
              </AuthRoute>
            }
          />
          <Route
            path="/torneo/:torneoName/:torneoId" // Ruta show protegida mediante Policie <-
            element={
              <AuthRoute requireTorneoOwnership={true}> 
                <TorneoShow />
              </AuthRoute>
            }
          />
          <Route
            path="/torneo/:torneoName/:torneoId/edit" // Ruta edit protegida mediante Police <-
            element={
              <AuthRoute requireTorneoOwnership={true}>
                <TorneoEdit />
              </AuthRoute>
            }
          />
          <Route
            path="/torneo/create" // Ruta create
            element={
              <AuthRoute>
                <TorneoCreate />
              </AuthRoute>
            }
          />
          <Route  // < ------------- CRUD EQUIPOS ------------------------------------ >    
            path="/equipos"        // Ruta index 
            element={
              <AuthRoute>
                <Equipos />
              </AuthRoute>
            }
          />
          <Route
            path="/equipo/:equipoName/:equipoId" // Ruta show protegida mediante Police <-
            element={
              <AuthRoute requireEquipoOwnership={true}> 
                <EquipoShow />
              </AuthRoute>
            }
          />
          <Route
            path="/equipo/:equipoName/:equipoId/edit" // Ruta edit protegida mediante Police <-
            element={
              <AuthRoute requireEquipoOwnership={true}>
                <EquipoEdit />
              </AuthRoute>
            }
          />
          <Route
            path="/equipo/create" // Ruta create
            element={
              <AuthRoute>
                <EquipoCreate />
              </AuthRoute>
            }
          />
          <Route  // < ------------- CRUD PARTIDOS ------------------------------------ >    
            path="/partidos"        // Ruta index 
            element={
              <AuthRoute>
                <Partidos />
              </AuthRoute>
            }
          />
          <Route
            path="/partido/:partidoId" // Ruta show
            element={
              <AuthRoute>
                <PartidoShow />
              </AuthRoute>
            }
          />
          <Route
            path="/partido/:torneoName/:torneoId/:partidoId/edit" // Ruta edit
            element={
              <AuthRoute>
                <PartidoEdit />
              </AuthRoute>
            }
          />
          <Route
            path="/partido/create/:torneoName/:torneoId" // Ruta create
            element={
              <AuthRoute>
                <PartidoCreate />
              </AuthRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
