import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../AuthContext'; //  AuthContext
import { Link } from 'react-router-dom';

const Equipos = () => {
  const [equipos, setEquipos] = useState([]);
  const { user, logout } = useAuth(); // Accede al usuario autenticado y al método logout

  useEffect(() => { // Hace la solicitud al cargar la vista <-
    const fetchEquipos = async () => { // Index Equipos <-
      try {
        const response = await axios.get(`http://localhost:5000/sporthub/api/equipos/${user.userId}`);
        setEquipos(response.data);
      } catch (error) {
        console.error("Error al obtener los equipos:", error);
      }
    };

    fetchEquipos();
  }, [user.userId]);

  return (
    <div>
      <h1>Equipos Relacionados</h1>
      <h2><Link to="/equipo/create">Crear Equipo</Link></h2>
      {equipos.length > 0 ? (
        <ul>
          {equipos.map((equipo) => (
            <li key={equipo.id}>
              <h3>{equipo.name}</h3>
              <Link to={`/equipo/${equipo.name}/${equipo.id}`}>Ver Equipo</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p> No tienes ningun equipo registrado aun.</p>
      )}
    </div>
  );
};

export default Equipos;
