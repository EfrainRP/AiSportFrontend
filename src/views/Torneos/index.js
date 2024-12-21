import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../AuthContext'; //  AuthContext
import { Link } from 'react-router-dom';

const Torneos = () => {
  const [torneos, setTorneos] = useState([]);
  const { user, logout } = useAuth(); // Accede al usuario autenticado y al método logout

  useEffect(() => { // Hace la solicitud al cargar la vista <-
    const fetchTorneos = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/sporthub/api/torneos/${user.userId}`);
        setTorneos(response.data);
      } catch (error) {
        console.error("Error al obtener los torneos:", error);
      }
    };

    fetchTorneos();
  }, [user.userId]);

  return (
    <div>
      <h1>¡Bienvenido a tus Torneos {user.userName}!</h1>
      <h2><Link to="/torneo/create">Crear Torneo</Link></h2>
      {torneos.length > 0 ? (
        <ul>
          {torneos.map((torneo) => (
            <li key={torneo.id}>
              <h3>{torneo.name}</h3>
              <p>Ubicación: {torneo.ubicacion}</p>
              <p>Descripción: {torneo.descripcion}</p>
              <p>Fecha Inicio: {new Date(torneo.fechaInicio).toLocaleDateString()}</p>
              <p>Fecha Fin: {new Date(torneo.fechaFin).toLocaleDateString()}</p>
              <Link to={`/torneo/${torneo.name}/${torneo.id}`}>Ver Torneo</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p> No tienes ningun torneo registrado aun.</p>
      )}
    </div>
  );
};

export default Torneos;
