import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

const ShowTorneo = () => {
  const { torneoName, torneoId } = useParams();
  const { user } = useAuth(); // Obtención del usuario autenticado
  const [torneo, setTorneo] = useState(); // Estado para los detalles del torneo
  const [partidos, setPartidos] = useState([]); // Estado para los partidos del torneo
  const [notificaciones, setNotificaciones] = useState([]); // Estado para las notificaciones
  const navigate = useNavigate();

  // useEffect para hacer petición automática de los datos del torneo, partidos y notificaciones
  useEffect(() => {
    const fetchTorneo = async () => { // Peticion SHOW Torneo
      try {
        const response = await axios.get(`http://localhost:5000/sporthub/api/torneo/${torneoName}/${torneoId}`);
        setTorneo(response.data); // Datos del torneo
        setNotificaciones(response.data.notifications); // Establecer notificaciones del torneo
      } catch (err) {
        console.error('Error al cargar el torneo:', err);
      }
    };

    const fetchPartidos = async () => { // Peticion INDEX Partidos del torneo
      try {
        const response = await axios.get(`http://localhost:5000/sporthub/api/partidos/${torneoId}`);
        setPartidos(response.data); // Datos de los partidos
      } catch (err) {
        console.error('Error al cargar los partidos del torneo:', err);
      }
    };

    fetchTorneo(); // Llamada para obtener los detalles del torneo
    fetchPartidos(); // Llamada para obtener los partidos del torneo
  }, [torneoId, torneoName]);

  // Función para manejar la aceptación o rechazo de notificaciones <-
  const handleNotificacionResponse = async (notificacionId, status) => {
    try {
      // Enviar solicitud PUT para actualizar el estado de la notificación
      await axios.put(`http://localhost:5000/sporthub/api/notificaciones/${notificacionId}`, {
        status, // Puede ser 'accepted' o 'rejected'
      });

      // Actualizar el estado local de las notificaciones después de la respuesta
      setNotificaciones((prevState) =>
        prevState.map((notificacion) =>
          notificacion.id === notificacionId
            ? { ...notificacion, status }
            : notificacion
        )
      );
    } catch (err) {
      console.error('Error al responder la notificación:', err);
    }
  };

  // Validar si la cantidad de equipos del torneo es del rango válido (Front)
  const isValidEquipoCount = [4, 8, 16, 32].includes(torneo?.cantEquipo);

  // Validar la cantidad de partidos (Front) (debe ser torneo.cantEquipo - 1)
  const isValidPartidosCount = partidos.length === torneo?.cantEquipo - 1;

  // Organizar los partidos en brackets (Front)
  const generateBracket = (partidos) => {
    let rounds = [];
    let roundSize = torneo.cantEquipo / 2;
    let roundPartidos = [...partidos];

    while (roundSize >= 1) {
      rounds.push(roundPartidos.slice(0, roundSize));
      roundPartidos = roundPartidos.slice(roundSize);
      roundSize /= 2;
    }
    {/* Retorna la cantidad de rondas que tendra cada torneo */}
    return rounds;  
    {/* (Dividen en mitades al torneo, Ex: si cantEquipo = 8, Ronda 1 = 4, Ronda 2 = 2, Ronda 3 = 1) */}
    {/* donde {4,2,1} indican la cantidad de partidos en esa ronda <- */}
  };

  // Si el torneo no está cargado, mostrar un mensaje de carga (respuesta no dada en back)
  if (!torneo) {
    return <div>Cargando...</div>;
  }

  // Generar los brackets solo si es un torneo válido
  const brackets = isValidEquipoCount ? generateBracket(partidos) : [];

  // Calcular al ganador del torneo del ultimo partido basado en sus resultados "res" <-
  const getWinner = (partido) => {
    const localPts = partido.resLocal;
    const visitantePts = partido.resVisitante;
    return localPts > visitantePts ? partido.equipos_partidos_equipoLocal_idToequipos.name : partido.equipos_partidos_equipoVisitante_idToequipos.name;
  };

  const handleEliminar = async (partidoId) => { // Peticion DELETE Partido
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este partido?");
    
    if (confirmacion) { 
      try {  
        await axios.delete(`http://localhost:5000/sporthub/api/partido/${torneoId}/${partidoId}`);
        setPartidos(partidos.filter(partido => partido.id !== partidoId)); // Eliminar partido de la lista y actualizar el front <-
      } catch (err) {
        console.error('Error al eliminar el partido:', err);
      }
    } else {
      console.log("Eliminación cancelada");
    }
  };

  const handleEditar = (partidoId) => { // Cambio de vista a Edit form
    navigate(`/partido/${torneoName}/${torneoId}/${partidoId}/edit`);
  };

  return (
    <div>
      <h1>Detalles del Torneo</h1>
      <div>
        <h2>{torneoName}</h2>
        <p><strong>Ubicación:</strong> {torneo.ubicacion}</p>
        <p><strong>Descripción:</strong> {torneo.descripcion}</p>
        <p><strong>Fecha de Inicio:</strong> {new Date(torneo.fechaInicio).toISOString().split('T')[0]}</p>
        <p><strong>Fecha de Fin:</strong> {new Date(torneo.fechaFin).toISOString().split('T')[0]}</p>
        <p><strong>Cantidad de Equipos:</strong> {torneo.cantEquipo}</p>
        <p><Link to={`/torneo/${torneoName}/${torneoId}/edit`}>Editar Torneo</Link></p>
        <p><Link to={`/partido/create/${torneoName}/${torneoId}`}>Crear Partido</Link></p>
        <p><Link to={`/torneo/${torneoName}/${torneoId}/estadisticas`}>Ver estadisticas del Torneo</Link></p>
      </div>

      <h2>Notificaciones del Torneo</h2>
      <div>
        {notificaciones.length > 0 ? (
          notificaciones.map((notificacion) => (
            <div key={notificacion.id} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
              <p><strong>Equipo:</strong> {notificacion.equipos.name}</p>
              <p><strong>Usuario:</strong> {notificacion.users_notifications_user_idTousers.name}</p>
              <p><strong>Email:</strong> {notificacion.users_notifications_user_idTousers.email}</p>
              <p><strong>Status:</strong> {notificacion.status}</p>

              {/* Botones para aceptar o denegar la notificación */}
              {notificacion.status === 'pending' && (
                <div>
                  <button onClick={() => handleNotificacionResponse(notificacion.id, 'accepted')}>Aceptar</button>
                  <button onClick={() => handleNotificacionResponse(notificacion.id, 'rejected')}>Denegar</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No hay notificaciones pendientes para este torneo.</p>
        )}
      </div>

      <h2>Partidos del Torneo</h2>
      <div>
        {isValidEquipoCount ? ( // Si es un torneo valido (4,8,16,32) genera los brackets <-
         // Brakets contiene los partidos como: brackets = [
         // [{ partido1, partido2 }, { partido3, partido4 }],  // Ronda 1
          //[{ partido5, partido6 }],  // Ronda 2
          //[{ partido7 }]  // Ronda 3
          brackets.map((round, index) => ( // "Map" itera en el array, y "Round" es un array de "partidos" por ronda
            <div key={index}>     {/* Index indica la Ronda actual <- donde "key" actualiza el DOM (Interfaz de programacion) dinamicamente */}
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
                    {/* Botones de Editar y Eliminar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <button onClick={() => handleEditar(partido.id)}>Editar</button>
                      <button onClick={() => handleEliminar(partido.id)}>Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No hay partidos programados para este torneo o la cantidad de equipos no es válida.</p>
        )}

        {/* Mostrar ganador final solo si todos los partidos están completos, (se llego a cantEquipo-1)*/}
        {isValidPartidosCount && partidos.length > 0 && (
          <div>
            <h3>Ganador Final del Torneo</h3>
            <p><strong>Campeón:</strong> {getWinner(partidos[partidos.length - 1])}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowTorneo;
