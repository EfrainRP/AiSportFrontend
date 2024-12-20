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
//  -------------------------------------------------------------
//  VIEWS DASHBOARD 
import Dashboard from './views/Dashboard/Dashboard'; // Main Dashboard <-
import TorneoDashboard from './views/Dashboard/TorneoDashboard'; // Torneos acceso cualquier rol <-
import EquipoDashboard from './views/Dashboard/EquipoDashboard'; // Equipos acceso cualquier rol <-
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
//  CRUD PARTIDOS 
import PartidoEdit from './views/Partidos/edit'; // Partidos edit <-
import PartidoCreate from './views/Partidos/create'; // Partidos create <-
//  -------------------------------------------------------------
//  CRUD PERFIL 
import PerfilEdit from './views/Profile/edit'; // Perfil edit <-
import PerfilShow from './views/Profile/show'; // Perfil show <-
//  -------------------------------------------------------------
//  VIEWS ESTADISTICAS 
import Estadisticas from './views/Estadisticas/index'; // Estadisticas Index <-
import EstadisticasEquipo from './views/Estadisticas/equipo'; // Estadisticas Display <-
import EstadisticasTorneo from './views/Estadisticas/torneo'; // Estadisticas Show <-
//  -------------------------------------------------------------
//  VIEWS IA (SERVER) 
import AI from './views/AI/index'; // AI Index <-
import AIShow from './views/AI/show'; // AI Show <-

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
          <Route // DASHBOARD 
            path="/dashboard"
            element={
              <AuthRoute>
                <Dashboard />
              </AuthRoute>
            }
          /> 
          <Route // Ruta para visualizacion de torneos general en Dash <-
            path="/dashboard/torneos/:torneoName/:torneoId"
            element={
              <AuthRoute>
                <TorneoDashboard />
              </AuthRoute>
            }
          /> 
          <Route // Ruta para visualizacion de equipos general en Dash <-
            path="/dashboard/equipos/:equipoName/:equipoId"
            element={
              <AuthRoute>
                <EquipoDashboard />
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
          <Route // < ------------- CRUD PARTIDOS ------------------------------------ > 
            path="/partido/:torneoName/:torneoId/:partidoId/edit" // Ruta EDIT protegida mediante Police <-
            element={
              <AuthRoute requireTorneoOwnership={true}> 
                <PartidoEdit />
              </AuthRoute>
            }
          />
          <Route
            path="/partido/create/:torneoName/:torneoId" // Ruta CREATE protegida mediante Police <-
            element={
              <AuthRoute requireTorneoOwnership={true}> 
                <PartidoCreate />
              </AuthRoute>
            }
          />
          <Route //  < ------------- CRUD PERFIL ------------------------------------ >  
            path="/dashboard/perfil/:userName" // Ruta SHOW protegida mediante Police <-
            element={
              <AuthRoute > 
                <PerfilShow />
              </AuthRoute>
            }
          />
          <Route
            path="/dashboard/perfil/:userName/edit" // Ruta EDIT protegida mediante Police <-
            element={
              <AuthRoute > 
                <PerfilEdit />
              </AuthRoute>
            }
          />
          <Route //  < ------------- VIEWS ESTADISTICAS ------------------------------------ >  
            path="/dashboard/estadisticas" // Ruta INDEX (Equipos con estadisticas <-)
            element={
              <AuthRoute > 
                <Estadisticas />
              </AuthRoute>
            }
          />
          <Route
            path="/torneo/:torneoName/:torneoId/estadisticas" // Ruta SHOW (Estadisticas de un Torneo)
            element={ // Protegida Mediante Police al pertenecer a "Torneos" de un Usuario <-
              <AuthRoute requireTorneoOwnership={true}> 
                <EstadisticasTorneo />
              </AuthRoute>
            }
          />
          <Route
            path="/equipo/:equipoName/:equipoId/estadisticas" // Ruta DISPLAY (Estadisticas de un Equipo)
            element={ // No protegida, debido a que no requiere paso por un CRUD <-
              <AuthRoute > 
                <EstadisticasEquipo />
              </AuthRoute>
            }
          />
          <Route //  < ------------- VIEWS SERVER IA ------------------------------------ >  
            path="/dashboard/entrenamiento/IA" // Ruta INDEX <- (Antes de confirmación <-)
            element={
              <AuthRoute > 
                <AI />
              </AuthRoute>
            }
          />
          <Route 
            path="/dashboard/entrenamiento/IA/:equipoId/:equipoName" // Ruta SHOW <- (Confirmación del Server <-)
            element={ //  Entrenamiento de IA Estadisticas personalizado por equipo <- 
              <AuthRoute > 
                <AIShow />
              </AuthRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
