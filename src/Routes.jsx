import React from 'react';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import { AuthProvider } from './services/AuthContext.jsx'; 
import AuthRoute from './Middleware/AuthRoute.jsx'; // Middlewares

import Welcome from './views/Basic/Welcome.jsx';

import AboutUs from './views/Basic/AboutUs.jsx';
import Terms from './views/Basic/Terms.jsx';
import Privacy from './views/Basic/Privacy.jsx';

import SignUp from './views/Basic/SignUp/SignUp.jsx';
import SignIn from "./views/Basic/SignIn/SignIn.jsx";
import ResetPassword from "./views/Basic/SignIn/ResetPassword.jsx";

import Dashboard from "./views/Login/Dashboard/Dashboard.jsx";
import TournamentDashboard from "./views/Login/Dashboard/TournamentDashboard.jsx";
import TeamDashboard from "./views/Login/Dashboard/TeamDashboard.jsx";
import Search from "./views/Login/Search/Search.jsx";

//  CRUD TORNEOS 
import IndexTournament from './views/Login/Tournaments/IndexTournament.jsx'; // Tournaments Index <-
import ShowTournament from './views/Login/Tournaments/ShowTournament.jsx';
import EditTournament from './views/Login/Tournaments/EditTournament.jsx';
import CreateTournament from './views/Login/Tournaments/CreateTournament.jsx';
//  CRUD EQUIPOS 
import IndexTeams from './views/Login/Teams/IndexTeam.jsx'; 
import ShowTeam from './views/Login/Teams/ShowTeam.jsx'; 
import EditTeam from './views/Login/Teams/EditTeam.jsx'; 
import CreateTeam from './views/Login/Teams/CreateTeam.jsx'; 
//  CRUD PARTIDOS 
import EditMatch from './views/Login/Matches/EditMatch.jsx'; 
import CreateMatch from './views/Login/Matches/CreateMatch.jsx'; 
//  CRUD NOTIFICACIONES 
import IndexNotifications from './views/Login/Notifications/IndexNotifications.jsx';
//  CRUD Estadisticas 
import Stadistics from './views/Login/Stadistics/Stadistics.jsx'; 
import StatTournament from './views/Login/Stadistics/StatTournament.jsx'; 
import StatTeam from './views/Login/Stadistics/StatTeam.jsx'; 
//  CRUD PERFIL 
import ShowProfile from './views/Login/Profile/ShowProfile.jsx'; 
import EditProfile from './views/Login/Profile/EditProfile.jsx'; 
//  CRUD IA 
import ShowAI from './views/Login/AI/ShowAI.jsx'; 
import IndexAI from './views/Login/AI/IndexAI.jsx'; 
import StatsAI from './views/Login/AI/StatsAI.jsx'; 

export default function MyRoute(){
    return (
      <AuthProvider>
      <Router future={{
        v7_startTransition: true, //maneja las actualizaciones de estado de manera optimizada para la transición entre vistas
        v7_relativeSplatPath: true // Habilita el flag para la resolución de rutas relativas
        }}> 
        <Routes>
          {/* Rutas con acceso general/invitados */}
          <Route index path="/" element={<Welcome/>}/>
          <Route path="/aboutus" element={<AboutUs/>}/>
          <Route path="/terms" element={<Terms/>}/>
          <Route path="/privacy" element={<Privacy/>}/>

          {/* Rutas que no deben ser accesibles para usuarios autenticados */}
          <Route
            path="/reset-password"
            element={
              <AuthRoute restricted={true}>
                <ResetPassword/>
              </AuthRoute>
            }
          />
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
          <Route // Ruta para visualizacion de torneos general en Dash <-
            path="/dashboard/tournament/:tournamentName/:tournamentId"
            element={
              <AuthRoute>
                <TournamentDashboard />
              </AuthRoute>
            }
          /> 
          <Route // Ruta para visualizacion de equipos general en Dash <-
            path="/dashboard/team/:teamName/:teamId"
            element={
              <AuthRoute>
                <TeamDashboard />
              </AuthRoute>
            }
          />
          <Route
            path="/dashboard/search" // Ruta para busqueda <-
            element={
              <AuthRoute> 
                <Search/>
              </AuthRoute>
            }
          />
          <Route  // < ------------- CRUD TORNEOS ------------------------------------ >    
            path="/tournaments"        // Ruta index 
            element={
              <AuthRoute>
                <IndexTournament />
              </AuthRoute>
            }
          />
          <Route
            path="/tournament/:tournamentName/:tournamentId" // Ruta show protegida mediante Policie <-
            element={
              <AuthRoute requireTorneoOwnership={true}> 
                <ShowTournament/>
              </AuthRoute>
            }
          />
          <Route
            path="/tournament/:tournamentName/:tournamentId/edit" // Ruta edit protegida mediante Police <-
            element={
              <AuthRoute requireTorneoOwnership={true}>
                <EditTournament />
              </AuthRoute>
            }
          />
          <Route
            path="/tournament/create" // Ruta create
            element={
              <AuthRoute>
                <CreateTournament />
              </AuthRoute>
            }
          />
          <Route  // < ------------- CRUD EQUIPOS ------------------------------------ >    
            path="/teams"        // Ruta index 
            element={
              <AuthRoute>
                <IndexTeams />
              </AuthRoute>
            }
          />
          <Route
            path="/team/:teamName/:teamId" // Ruta show protegida mediante Police <-
            element={
              <AuthRoute requireEquipoOwnership={true}> 
                <ShowTeam />
              </AuthRoute>
            }
          />
          <Route
            path="/team/:teamName/:teamId/edit" // Ruta edit protegida mediante Police <-
            element={
              <AuthRoute requireEquipoOwnership={true}>
                <EditTeam />
              </AuthRoute>
            }
          />
          <Route
            path="/team/create" // Ruta create
            element={
              <AuthRoute>
                <CreateTeam />
              </AuthRoute>
            }
          />        
          <Route // < ------------- CRUD PARTIDOS ------------------------------------ > 
            path="/match/:tournamentName/:tournamentId/:matchId/edit" // Ruta EDIT protegida mediante Police <-
            element={
              <AuthRoute requireTorneoOwnership={true}> 
                <EditMatch /> {/*TO DO: Checar funcionamiento */}
              </AuthRoute>
            }
          />
          <Route
            path="/match/create/:tournamentName/:tournamentId" // Ruta CREATE protegida mediante Police <-
            element={
              <AuthRoute requireTorneoOwnership={true}> 
                <CreateMatch />
              </AuthRoute>
            }
          />
          <Route  // < ------------- NOTIFICACIONES ------------------------------------ >    
            path="/notifications"  
            element={
              <AuthRoute>
                <IndexNotifications />
              </AuthRoute>
            }
          />
          <Route //  < ------------- CRUD PERFIL ------------------------------------ >  
            path="/dashboard/profile/:userName" // Ruta SHOW protegida mediante Police <-
            element={
              <AuthRoute > 
                <ShowProfile />
              </AuthRoute>
            }
          />
          <Route
            path="/dashboard/profile/:userName/edit" // Ruta EDIT protegida mediante Police <-
            element={
              <AuthRoute > 
                <EditProfile />
              </AuthRoute>
            }
          />
          <Route //  < ------------- VIEWS ESTADISTICAS ------------------------------------ >  
            path="/dashboard/statistics" // Ruta INDEX (Equipos con estadisticas <-)
            element={
              <AuthRoute > 
                <Stadistics />
              </AuthRoute>
            }
          />
          <Route
            path="/tournament/:tournamentName/:tournamentId/stats" // Ruta SHOW (Estadisticas de un Torneo)
            element={ // Protegida Mediante Police al pertenecer a "Torneos" de un Usuario <-
              <AuthRoute requireTorneoOwnership={true}> 
                <StatTournament />
              </AuthRoute>
            }
          />
          <Route
            path="/team/:teamName/:teamId/stats" // Ruta DISPLAY (Estadisticas de un Equipo)
            element={ // No protegida, debido a que no requiere paso por un CRUD <-
              <AuthRoute > 
                <StatTeam />
              </AuthRoute>
            }
          />
          <Route //  < ------------- VIEWS SERVER IA ------------------------------------ >  
            path="/dashboard/trainning/IA" // Ruta INDEX <- (Antes de confirmación <-)
            element={
              <AuthRoute > 
                <IndexAI />
              </AuthRoute>
            }
          />
          <Route 
            path="/dashboard/trainning/IA/:teamId/:teamName" // Ruta SHOW <- (Confirmación del Server <-)
            element={ //  Entrenamiento de IA Estadisticas personalizado por equipo <- 
              <AuthRoute > 
                <ShowAI />{/* Checar con datos en la grafica */}
              </AuthRoute>
            }
          />
          <Route 
            path="/dashboard/trainning/personal/IA/:userName" // Ruta SHOWUser <- (Estadisticas de entrenamiento individual <-)
            element={ //  Entrenamiento de IA Estadisticas personalizado por usuario <- 
              <AuthRoute > 
                <StatsAI />
              </AuthRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
    )
}