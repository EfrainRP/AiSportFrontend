import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../../AuthContext'; // AuthContext
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const { user, logout } = useAuth(); // Accede al usuario autenticado y al método logout
  const navigate = useNavigate(); // Hook para redireccionar

  const [data, setData] = useState({ torneos: [], equipos: [] }); // Estado para almacenar torneos y equipos
  const [loading, setLoading] = useState(true); // Estado de carga
  const [notificaciones, setNotificaciones] = useState([]); // Estado para las notificaciones

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener torneos y equipos
        const response = await axios.get(`http://localhost:5000/sporthub/api/dashboard/${user.userId}`);
        setData(response.data); // Establecer los datos en el estado
        setLoading(false); // Cambiar el estado de carga

        // Obtener notificaciones
        const notificationsResponse = await axios.get(`http://localhost:5000/sporthub/api/notificaciones/${user.userId}`);
        setNotificaciones(notificationsResponse.data); // Establecer las notificaciones en el estado
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

  // Función para manejar la aceptación de notificaciones
  const acceptNotification = async (notificacionId, torneoId) => {
    try {
      // Enviar la solicitud DELETE para aceptar la notificación
      await axios.delete(`http://localhost:5000/sporthub/api/notificacion/${user.userId}/${torneoId}`);
      
      // Eliminar la notificación aceptada del estado
      setNotificaciones((prev) => prev.filter((n) => n.id !== notificacionId));
      
      alert('Notificación aceptada con éxito.');
    } catch (err) {
      console.error('Error al aceptar la notificación:', err);
      
      // Verifica si hay una respuesta del servidor con un mensaje de error
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message); // Muestra el mensaje del backend
      } else {
        alert('Ocurrió un error al aceptar la notificación.'); // Error genérico
      }
    }
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
              <div className="card-footer text-center">
                <p>
                  <Link to="/torneos">Ser Organizador</Link>
                </p>
                <p>
                  <Link to="/equipos">Ser Cápitan</Link>
                </p>
                <p>
                  <Link to={`/dashboard/perfil/${user.userName}`}>Perfil</Link>
                </p>
                <p>
                  <Link to={`/dashboard/estadisticas/`}>Estadisticas de Equipos SportHub</Link>
                </p>
                <p>
                  Pon a prueba tú rendimiento individual en como basquetbolista en SportHub
                  <Link to={`/dashboard/entrenamiento/IA`}> Entrenamiento Individual con IA</Link>
                </p>
                <button className="btn btn-primary">Perfil</button>
                <button className="btn btn-secondary ms-2" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </div>

              {/* Sección de Torneos */}
              <div className="mt-4">
                <h5>Torneos Sporthub</h5>
                {data.torneos.length > 0 ? (
                  <ul className="list-group">
                    {data.torneos.map((torneo) => (
                      <li key={torneo.id} className="list-group-item">
                        <Link to={`/dashboard/torneos/${torneo.name}/${torneo.id}`}>
                          {torneo.name} - {torneo.ubicacion}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay torneos disponibles.</p>
                )}
              </div>

              {/* Sección de Equipos */}
              <div className="mt-4">
                <h5>Equipos Sporthub</h5>
                {data.equipos.length > 0 ? (
                  <ul className="list-group">
                    {data.equipos.map((equipo) => (
                      <li key={equipo.id} className="list-group-item">
                        <Link to={`/dashboard/equipos/${equipo.name}/${equipo.id}`}>
                          {equipo.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay equipos disponibles.</p>
                )}
              </div>

              {/* Sección de Notificaciones */}
              <div className="mt-4">
                <h5>Notificaciones</h5>
                {notificaciones.length > 0 ? (
                  <ul className="list-group">
                    {notificaciones.map((notificacion) => (
                      <li key={notificacion.id} className="list-group-item">
                        <p>
                          Tú solicitud del equipo <strong>{notificacion.equipos?.name}</strong> fue <strong>{notificacion.status}</strong> para el torneo <strong>{notificacion.torneos?.name}.</strong>
                        </p>
                        <img 
                          src={`http://localhost:5000/sporthub/api/utils/uploads/${notificacion.equipos.image !== 'logoEquipo.jpg' ? notificacion.equipos.image : 'logoEquipo.jpg'}`} 
                          alt="Perfil" 
                          style={{ width: '250px', height: '100px' }} // Tamaño IMG
                        />
                        <p>
                          Para más información, ponte en contacto con el organizador <strong>{notificacion.torneos?.users?.name} ({notificacion.torneos?.users?.email})</strong>
                        </p>
                        <button
                          className="btn btn-success mt-2"
                          onClick={() => acceptNotification(notificacion.id, notificacion.torneo_id)}
                        >
                          Aceptar
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No tienes notificaciones.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
