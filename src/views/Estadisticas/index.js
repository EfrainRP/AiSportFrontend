import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../AuthContext'; // Importa el contexto de autenticación
import { Link } from 'react-router-dom';

const Estadisticas = () => {
  const { user, logout } = useAuth(); // Accede al usuario autenticado y al método logout
  const [estadisticas, setEstadisticas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Realiza la consulta a la API
    const fetchEstadisticas = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/sporthub/api/estadisticas/${user.userId}`
        );
        setEstadisticas(response.data.data); // Guarda los datos obtenidos
      } catch (err) {
        setError('Error al obtener las estadísticas');
        console.error(err);
      } finally {
        setLoading(false); // Cambia el estado de carga
      }
    };

    fetchEstadisticas();
  }, [user.userId]); // Se ejecuta cuando `user.userId` cambia

  if (loading) return <p>Cargando estadísticas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Estadísticas de Equipos SportHub</h1>
      {estadisticas.length === 0 ? (
        <p>No hay estadísticas disponibles para mostrar.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre del Equipo</th>
              <p></p>
              <th>Estadisticas</th>
            </tr>
          </thead>
          <tbody>
            {estadisticas.map((equipo) => (
              <tr key={equipo.equipo_id}>
                <td>{equipo.name}</td>
                <p></p>
                <Link to={`/equipo/${equipo.name}/${equipo.equipo_id}/estadisticas`}>Estadisticas</Link>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
};

export default Estadisticas;
