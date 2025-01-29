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

import Dashboard from "./views/Login/Dashboard/Dashboard.jsx";
import TournamentDashboard from "./views/Login/Dashboard/TournamentDashboard.jsx";
import TeamDashboard from "./views/Login/Dashboard/TeamDashboard.jsx";
import Search from "./views/Login/Search/Search.jsx";

//  CRUD TORNEOS 
import IndexTournament from './views/Login/Tournaments/IndexTournament.jsx'; // Tournaments Index <-
import ShowTournament from './views/Login/Tournaments/ShowTournament.jsx';
import EditTournament from './views/Login/Tournaments/EditTournament.jsx';
//  CRUD EQUIPOS 
import IndexTeams from './views/Login/Teams/IndexTeam.jsx'; 
import ShowTeam from './views/Login/Teams/ShowTeam.jsx'; 
//  CRUD PARTIDOS 
import EditMatch from './views/Login/Matches/EditMatches.jsx'; 
//  CRUD NOTIFICACIONES 
import IndexNotifications from './views/Login/Notifications/IndexNotifications.jsx';
//  CRUD Estadisticas 
import Stadistics from './views/Login/Stadistics/Stadistics.jsx'; 
import StatTournament from './views/Login/Stadistics/StatTournament.jsx'; 
import StatTeam from './views/Login/Stadistics/StatTeam.jsx'; 
//  CRUD PERFIL 
import ShowProfile from './views/Login/Profile/ShowProfile.jsx'; 
//  CRUD IA 
import IndexIA from './views/Login/IA/IndexIA.jsx'; 

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
          {/* <Route
            path="/tournament/create" // Ruta create
            element={
              <AuthRoute>
                <TorneoCreate />
              </AuthRoute>
            }
          />*/}
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
          {/* <Route
            path="/team/:teamName/:teamId/edit" // Ruta edit protegida mediante Police <-
            element={
              <AuthRoute requireEquipoOwnership={true}>
                <EquipoEdit />
              </AuthRoute>
            }
          />
          <Route
            path="/team/create" // Ruta create
            element={
              <AuthRoute>
                <EquipoCreate />
              </AuthRoute>
            }
          />          
          <Route // < ------------- CRUD PARTIDOS ------------------------------------ > 
            path="/match/:tournamentName/:tournamentId/:matchId/edit" // Ruta EDIT protegida mediante Police <-
            element={
              <AuthRoute requireTorneoOwnership={true}> 
                <EditMatch />
              </AuthRoute>
            }
          />
          {/*<Route
            path="/match/create/:tournamentName/:tournamentId" // Ruta CREATE protegida mediante Police <-
            element={
              <AuthRoute requireTorneoOwnership={true}> 
                <PartidoCreate />
              </AuthRoute>
            }
          />*/}
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
          {/* <Route
            path="/dashboard/perfil/:userName/edit" // Ruta EDIT protegida mediante Police <-
            element={
              <AuthRoute > 
                <PerfilEdit />
              </AuthRoute>
            }
          />*/}
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
                <IndexIA />
              </AuthRoute>
            }
          />
          {/* <Route 
            path="/dashboard/trainning/IA/:teamId/:teamName" // Ruta SHOW <- (Confirmación del Server <-)
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