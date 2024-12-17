import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../AuthContext'; // AuthContext
import { Link } from 'react-router-dom';

const Miembros = () => {
  const [equipos, setEquipos] = useState([]);
  const [equiposMiembro, setEquiposMiembro] = useState([]);
  const { user, logout } = useAuth(); // Accede al usuario autenticado y al método logout

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/sporthub/api/miembros`, {
          params: { userName: user.userName }, // Envia el userName como parámetro
        });

        setEquipos(response.data.equipos);
        setEquiposMiembro(response.data.equiposMiembro);
      } catch (error) {
        console.error("Error al obtener los equipos:", error);
      }
    };

    fetchEquipos();
  }, [user.userId, user.userName]);

  return (
    <div>
      <h1>Equipos en SportHub</h1>
      <section>
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
          <p>No hay equipos creados en SportHub aún.</p>
        )}
      </section>

      <section>
        <h2>Equipos donde soy Miembro</h2>
        {equiposMiembro.length > 0 ? (
          <ul>
            {equiposMiembro.map((equipo) => (
              <li key={equipo.id}>
                <h3>{equipo.name}</h3>
                <Link to={`/equipo/${equipo.name}/${equipo.id}`}>Ver Equipo</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No perteneces a ningún equipo aún.</p>
        )}
      </section>
    </div>
  );
};

export default Miembros;
