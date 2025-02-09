import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../AuthContext'; // Importa el contexto de autenticación
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Solo el CSS de Bootstrap

const AIEquipo = () => {
  const { user, logout } = useAuth(); // Accede al usuario autenticado y al método logout
  const [estadisticas, setEstadisticas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null); // Estado para almacenar el equipo seleccionado

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
  }, [user.userId]);

  if (loading) return <div className="text-center"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <p>{error}</p>;

  const handleSelectTeam = (equipoId, equipoName) => {
    setSelectedTeam({ equipoId, equipoName }); // Almacena ambos valores
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Analizador de Rendimiento Individual AiSport</h1>
      
      {estadisticas.length === 0 ? (
        <div className="card text-center">
          <div className="card-body">
            <h5>No hay equipos disponibles con un partido mínimo jugado que contengan estadísticas para un entrenamiento.</h5>
          </div>
        </div>
      ) : (
        <div className="card p-4 shadow-lg" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="card-body">
            <h5 className="mb-4">Elige tu equipo para actualizar o sumar sus estadísticas</h5>
            <div className="form-group mb-4">
            <select
                className="form-control form-control-lg"
                value={selectedTeam?.equipoId || ''}
                onChange={(e) => {
                    const selectedOption = estadisticas.find(
                    (equipo) => String(equipo.equipo_id) === e.target.value
                    );

                    // Validar que el equipo seleccionado exista
                    if (selectedOption) {
                    handleSelectTeam(selectedOption.equipo_id, selectedOption.name);
                    } else {
                    setSelectedTeam(null); // Restablecer si no hay una selección válida
                    }
                }}
                >
                <option value="">Selecciona un equipo</option>
                {estadisticas.map((equipo) => (
                    <option key={equipo.equipo_id} value={equipo.equipo_id}>
                    {equipo.name}
                    </option>
                ))}
                </select>
            </div>

            {selectedTeam && (
              <div className="text-center mt-4">
                {/* Pasa el ID y el nombre del equipo */}
                <Link to={`/dashboard/entrenamiento/IA/${selectedTeam.equipoId}/${selectedTeam.equipoName}`}>
                  <button className="btn btn-success btn-lg">
                    Entrenar para este equipo
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="text-center mt-4">
        <button className="btn btn-danger" onClick={logout}>Cerrar sesión</button>
      </div>
    </div>
  );
};

export default AIEquipo;
