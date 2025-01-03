import React from 'react';
import axiosInstance from "../../../services/axiosConfig.js";
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../services/AuthContext'; //  AuthContext
import LayoutLogin from '../../LayoutLogin.jsx';

export default function TournamentDashboard () {
  const { user, logout } = useAuth(); // Accede al usuario autenticado y al método logout
  const { torneoName, torneoId } = useParams();
  const [torneo, setTorneo] = React.useState();
  const [partidos, setPartidos] = React.useState([]);
  const [equipos, setEquipos] = React.useState([]);
  const [selectedEquipo, setSelectedEquipo] = React.useState(null);
  const [notificacion, setNotificacion] = React.useState(null);

  React.useEffect(() => {
    const fetchTorneo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/sporthub/api/torneo/${torneoName}/${torneoId}`);
        setTorneo(response.data);
      } catch (err) {
        console.error('Error al cargar el torneo:', err);
      }
    };

    const fetchPartidos = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/sporthub/api/partidos/${torneoId}`);
        setPartidos(response.data);
      } catch (err) {
        console.error('Error al cargar los partidos del torneo:', err);
      }
    };

    const fetchEquipos = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/sporthub/api/equipos/${user.userId}`);
        setEquipos(response.data);
      } catch (err) {
        console.error('Error al cargar los equipos:', err);
      }
    };

    fetchTorneo();
    fetchPartidos();
    fetchEquipos();
  }, [torneoId, torneoName, user.userId]);

  const handleSendNotification = async () => {
    if (!selectedEquipo) {
      alert('Por favor selecciona un equipo antes de enviar la notificación.');
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/sporthub/api/notificacion/${user.userId}/${torneo.user_id}`,
        {
          equipoId: selectedEquipo,
          torneoId: torneoId,
        }
      );
      alert('¡Notificación enviada con éxito!');
    } catch (err) {
      console.error('Error al enviar la notificación:', err);
    
      // Verifica si hay una respuesta del servidor con un mensaje de error
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message); // Muestra el mensaje del backend
      } else {
        alert('Ocurrió un error al enviar la notificación.'); // Error genérico
      }
    }
  };

  const handleCancelNotification = async () => {
    try {
      await axios.delete(`http://localhost:5000/sporthub/api/notificacion/${user.userId}/${torneoId}`);
      alert('Notificación cancelada con éxito.');
    } catch (err) {
      console.error('Error al cancelar la notificación:', err);
    
      // Verifica si hay una respuesta del servidor con un mensaje de error
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message); // Muestra el mensaje del backend
      } else {
        alert('Ocurrió un error al cancelar la notificación.'); // Error genérico
      }
    }
  };

  const generateBracket = (partidos) => {
    let rounds = [];
    let roundSize = torneo.cantEquipo / 2;
    let roundPartidos = [...partidos];

    while (roundSize >= 1) {
      rounds.push(roundPartidos.slice(0, roundSize));
      roundPartidos = roundPartidos.slice(roundSize);
      roundSize /= 2;
    }

    return rounds;
  };

  if (!torneo) {
    return <div>... Cargando... Es posible que el torneo al que intentas acceder no exista.</div>;
  }

  const brackets = generateBracket(partidos);

  return (
    <LayoutLogin>
    <div>
      <h1>Detalles del Torneo</h1>
      <div>
        <h2>{torneoName}</h2>
        <p><strong>Ubicación:</strong> {torneo.ubicacion}</p>
        <p><strong>Descripción del Torneo:</strong> {torneo.descripcion}</p>
        <p><strong>Fecha de Inicio:</strong> {new Date(torneo.fechaInicio).toISOString().split('T')[0]}</p>
        <p><strong>Fecha de Fin:</strong> {new Date(torneo.fechaFin).toISOString().split('T')[0]}</p>
        <p><strong>Total de Equipos:</strong> {torneo.cantEquipo}</p>
      </div>

      <h2>Información de los Partidos del Torneo</h2>
      {brackets.map((round, index) => (
        <div key={index}>
          <h3>Ronda {index + 1}</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {round.map((partido, partidoIndex) => (
              <div
                key={partidoIndex}
                style={{
                  marginBottom: '20px',
                  border: '1px solid #ccc',
                  padding: '10px',
                  borderRadius: '5px',
                  width: '48%',
                }}
              >
                <p><strong>Fecha del Partido:</strong> {new Date(partido.fechaPartido).toISOString().split('T')[0]}</p>
                <p><strong>Hora:</strong> {new Date(partido.horaPartido).toLocaleTimeString()}</p>
                <p><strong>Equipo Local:</strong> {partido.equipos_partidos_equipoLocal_idToequipos.name}</p>
                <p><strong>Equipo Visitante:</strong> {partido.equipos_partidos_equipoVisitante_idToequipos.name}</p>
                <p><strong>Resultado:</strong> {partido.resLocal} - {partido.resVisitante}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <h2>Enviar Notificación de Participación</h2>
      <p>Puedes enviar una notificacion al organizador del torneo para participar en el mismo con uno de tus equipos.</p>
      <p>
        Nota: Enviar una notificación de inscripción al organizador no siempre asegura un lugar en el torneo, 
        puedes ponerte en contacto con: <strong>{torneo.users.email}</strong>.
      </p>
      <select onChange={(e) => setSelectedEquipo(e.target.value)} value={selectedEquipo}>
        <option value="">Selecciona uno de tus equipos</option>
        {equipos.map((equipo) => (
          <option key={equipo.id} value={equipo.id}>{equipo.name}</option>
        ))}
      </select>

      <button onClick={handleSendNotification} style={{ marginTop: '10px' }}>
        Enviar Notificación de Inscripción
      </button>
      <button onClick={handleCancelNotification} style={{ marginTop: '10px' }}>
            Cancelar Notificaciónd
      </button>
    </div>
    </LayoutLogin>
  );
};