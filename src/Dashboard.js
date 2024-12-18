import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from './AuthContext'; //  AuthContext
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const { user, logout } = useAuth(); // Accede al usuario autenticado y al método logout
  const navigate = useNavigate(); // Hook para redireccionar

  const [data, setData] = useState({ torneos: [], equipos: [] }); // Estado para almacenar torneos y equipos
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/sporthub/api/dashboard/${user.userId}`);
        setData(response.data); // Establecer los datos en el estado
        setLoading(false); // Cambiar el estado de carga
      } catch (error) {
        console.error('Error al obtener los datos del dashboard:', error);
        setLoading(false); // Cambiar el estado de carga incluso en caso de error
      }
    };

    if (user) {
      fetchData(); // Llamar a la función solo si el usuario está definido
    }
  }, [user]);

  const handleLogout = () => {
    logout(); // Llama a la función logout del contexto
    navigate('/login'); // Redirecciona a la página de login
  };

  if (loading) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4 className="text-center">Dashboard</h4>
            </div>
            <div className="card-body text-center">
              <h1 className="text-center">¡Hola {user ? user.userName : 'invitado'} con ID {user.userId}!</h1>
              <p>Bienvenido al panel de control.</p>
              <p>Aquí podrás gestionar tus preferencias y consultar tu información.</p>

              <div className="mt-4">
                <h5>Torneos Disponibles</h5>
                {data.torneos.length > 0 ? (
                  <ul className="list-group">
                    {data.torneos.map((torneo) => (
                      <li key={torneo.id} className="list-group-item">
                        {torneo.name} - {torneo.ubicacion}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay torneos disponibles.</p>
                )}
              </div>

              <div className="mt-4">
                <h5>Equipos Disponibles</h5>
                {data.equipos.length > 0 ? (
                  <ul className="list-group">
                    {data.equipos.map((equipo) => (
                      <li key={equipo.id} className="list-group-item">
                        {equipo.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay equipos disponibles.</p>
                )}
              </div>
            </div>
            <div className="card-footer text-center">
              <p>
                <Link to="/torneos">Ser Organizador</Link>
              </p>
              <p>
                <Link to="/equipos">Ser Cápitan</Link>
              </p>
              <p>
                <Link to="/miembros">Ser Participante</Link>
              </p>
              <button className="btn btn-primary">Mis Preferencias</button>
              <button className="btn btn-secondary ms-2" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
