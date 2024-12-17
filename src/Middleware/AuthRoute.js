import React, { useEffect, useState } from 'react';
import { Navigate, useParams, useLocation } from 'react-router-dom'; 
import { useAuth } from '../AuthContext'; // Hook de autenticación
import axios from 'axios';

const AuthRoute = ({ children, restricted = false, requireTorneoOwnership = false, requireEquipoOwnership = false }) => {
  const { user, isAuthenticated } = useAuth(); // Accede al usuario autenticado y al método isAuthenticated
  const { torneoName, torneoId, equipoName , equipoId } = useParams(); // Obtiene los parametros desde la URL
  const location = useLocation(); // Hook para obtener la ubicación actual
  const [isLoading, setIsLoading] = useState(true);
  const [isValidTorneo, setIsValidTorneo] = useState(true); // Estado para verificar si el usuario es dueño del torneo
  const [isValidEquipo, setIsValidEquipo] = useState(true); // Estado para verificar si el usuario es dueño del equipo

  useEffect(() => {
    // Reinicia el estado cada vez que cambie la ruta
    setIsLoading(true);
    setIsValidTorneo(true);
    setIsValidEquipo(true);

    // Verificación de propiedad del torneo <-
    const checkTorneoOwnership = async () => {
      if (requireTorneoOwnership && user && torneoId) {
        try {
          const response = await axios.get(`http://localhost:5000/sporthub/api/torneo/${torneoName}/${torneoId}`);
          const torneo = response.data;
          console.log("Torneo", torneo);
          // Si el user_id del torneo no coincide con el userId del usuario autenticado, redirigir al dashboard
          if (torneo.user_id !== user.userId) {
            setIsValidTorneo(false);
          } else {
            setIsValidTorneo(true);
          }
        } catch (err) {
          console.error('Error fetching torneo:', err);
          setIsValidTorneo(false);
        }
      }
    };

    // Verificación de propiedad del equipo <-
    const checkEquipoOwnership = async () => {
      if (requireEquipoOwnership && user && equipoId) {
        try {
          const response = await axios.get(`http://localhost:5000/sporthub/api/equipo/${equipoName}/${equipoId}`);
          const equipo = response.data;
          console.log("Equipo", equipo);
          // Si el user_id del equipo no coincide con el userId del usuario autenticado, redirigir al dashboard
          if (equipo.user_id !== user.userId) {
            setIsValidEquipo(false);
          } else {
            setIsValidEquipo(true);
          }
        } catch (err) {
          console.error('Error fetching equipo:', err);
          setIsValidEquipo(false);
        }
      }
    };

    // Llamar ambas funciones de validación
    checkTorneoOwnership();
    checkEquipoOwnership();

    setIsLoading(false);
  }, [user, torneoId, torneoName, equipoId, requireTorneoOwnership, requireEquipoOwnership, location]); // Añadir `location` como dependencia para que se refresque al cambiar de ruta

  // Cargando datos
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Si el acceso está restringido y el usuario está autenticado, redirigir al dashboard
  if (restricted && isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si no está autenticado y se intenta acceder a una ruta restringida, redirigir al login
  if (!isAuthenticated() && !restricted) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario no es dueño del torneo, redirigir al dashboard
  if (requireTorneoOwnership && !isValidTorneo) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si el usuario no es dueño del equipo, redirigir al dashboard
  if (requireEquipoOwnership && !isValidEquipo) {
    return <Navigate to="/dashboard" replace />;
  }

  return children; // Si pasa todas las validaciones, renderiza los componentes hijos
};

export default AuthRoute;
