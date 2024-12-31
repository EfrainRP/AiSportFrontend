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

          {/* Rutas que no deben ser accesibles para usuarios autenticados */}
          <Route
            path="/signin"
            element={
              <AuthRoute restricted={true}>
                <SignIn/>
              </AuthRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRoute restricted={true}>
                <SignUp />
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
          {/* <Route // Ruta para visualizacion de torneos general en Dash <-
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
          /> */}
        </Routes>
      </Router>
    </AuthProvider>
    )
}