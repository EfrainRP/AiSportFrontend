import React from 'react';
import {
    Typography,
    Skeleton,
    Box,
    Card,
    CardActions,
    CardContent,
    CardActionArea,
    ToggleButton,
    ToggleButtonGroup, 
    Button,
    IconButton , 
    Stack,
    TextField ,
    Autocomplete,
    Fab,
    ButtonGroup,
    Grow  
} from '@mui/material';
import axiosInstance from "../../../services/axiosConfig.js";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../services/AuthContext.jsx'; //  AuthContext

import LayoutLogin from '../../LayoutLogin.jsx';

export default function EditTournament() {
    const { tournamentName, tournamentId } = useParams();
    const { user, loading, setLoading } = useAuth(); // Obtención del usuario autenticado
    const [tournaments, setTournament] = React.useState([]); // Estado para los detalles del torneo
    const [matches, setMatch] = React.useState([]); // Estado para los partidos del torneo
    const [notificaciones, setNotificaciones] = React.useState([]); // Estado para las notificaciones
    const navigate = useNavigate();

    // useEffect para hacer petición automática de los datos del torneo, partidos y notificaciones
    React.useEffect(() => {
        const fetchTorneo = async () => { // Peticion SHOW Torneo
            try {
                const response = await axiosInstance.get(`/torneo/${tournamentName}/${tournamentId}`);
                setTournament(response.data); // Datos del torneo
                setNotificaciones(response.data.notifications); // Establecer notificaciones del torneo
            } catch (err) {
                console.error('Error al cargar el torneo:', err);
                setLoading(true);
            }
        };

        const fetchPartidos = async () => { // Peticion INDEX Partidos del torneo
            try {
                const response = await axiosInstance.get(`/partidos/${tournamentId}`);
                setMatch(response.data); // Datos de los partidos
            } catch (err) {
                console.error('Error al cargar los partidos del torneo:', err);
                setLoading(true);
            }
        };

        fetchTorneo(); // Llamada para obtener los detalles del torneo
        fetchPartidos(); // Llamada para obtener los partidos del torneo
    }, [tournamentId, tournamentName]);

    // Función para manejar la aceptación o rechazo de notificaciones <-
    const handleNotificacionResponse = async (notificacionId, status) => {
        try {
            // Enviar solicitud PUT para actualizar el estado de la notificación
            await axios.put(`/notificaciones/${notificacionId}`, {
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
    const isValidEquipoCount = [4, 8, 16, 32].includes(tournaments?.cantEquipo);

    // Validar la cantidad de partidos (Front) (debe ser torneo.cantEquipo - 1)
    const isValidPartidosCount = matches.length === tournaments?.cantEquipo - 1;

    // Organizar los partidos en brackets (Front)
    const generateBracket = (matches) => {
        let rounds = [];
        let roundSize = tournaments.cantEquipo / 2;
        let roundPartidos = [...matches];

        while (roundSize >= 1) {
            rounds.push(roundPartidos.slice(0, roundSize));
            roundPartidos = roundPartidos.slice(roundSize);
            roundSize /= 2;
        }
        {/* Retorna la cantidad de rondas que tendra cada torneo */ }
        return rounds;
        {/* (Dividen en mitades al torneo, Ex: si cantEquipo = 8, Ronda 1 = 4, Ronda 2 = 2, Ronda 3 = 1) */ }
        {/* donde {4,2,1} indican la cantidad de partidos en esa ronda <- */ }
    };

    // Si el torneo no está cargado, mostrar un mensaje de carga (respuesta no dada en back)
    // if (!tournaments) {
    //     setLoading(true);
    //     return <div>Cargando...</div>;
    // }

    // Generar los brackets solo si es un torneo válido
    const brackets = isValidEquipoCount ? generateBracket(matches) : [];

    // Calcular al ganador del torneo del ultimo partido basado en sus resultados "res" <-
    const getWinner = (match) => {
        const localPts = match.resLocal;
        const visitantePts = match.resVisitante;
        return localPts > visitantePts ? match.equipoLocal.name : partido.equipoVisitante.name;
    };

    const handleEliminar = async (partidoId) => { // Peticion DELETE Partido
        const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este partido?");

        if (confirmacion) {
            try {
                await axiosInstance.delete(`/partido/${tournamentId}/${partidoId}`);
                setMatches(partidos.filter(partido => partido.id !== partidoId)); // Eliminar partido de la lista y actualizar el front <-
            } catch (err) {
                console.error('Error al eliminar el partido:', err);
            }
        } else {
            console.log("Eliminación cancelada");
        }
    };

    const handleEditar = (partidoId) => { // Cambio de vista a Edit form
        navigate(`/partido/${tournamentName}/${tournamentId}/${partidoId}/edit`);
    };

    return (
        <LayoutLogin>
            <Typography variant='h2'> {loading ? <Skeleton variant="rounded" width={'40%'} /> : 'Tournament Details'} </Typography>

            {loading ?
                <Skeleton variant="rounded" width={'40%'} />
                :
                <Card variant="outlined">
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {tournaments.name}
                        </Typography>
                        <Typography><strong>Location:</strong> {tournaments.ubicacion}</Typography>
                        <Typography><strong>Description:</strong> {tournaments.descripcion}</Typography>
                        <Typography><strong>Start Date:</strong> {new Date(tournaments.fechaInicio).toLocaleDateString()}</Typography>
                        <Typography><strong>End Date:</strong> {new Date(tournaments.fechaFin).toLocaleDateString()}</Typography>
                        <Typography><strong>Total Teams:</strong> {tournaments.cantEquipo}</Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" href={`/tournament/${tournamentName}/${tournamentId}/edit`}>Edit</Button>
                        <Button size="small" href={`/partido/create/${tournamentName}/${tournamentId}`}>Create match</Button>
                        <Button size="small" href={`/tournament/${tournamentName}/${tournamentId}/estadisticas`}>See statistics</Button>
                    </CardActions>
                </Card>
            }

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
                                        <img
                                            src={`http://localhost:5000/sporthub/api/utils/uploads/${partido.equipoLocal.image !== 'logoEquipo.jpg' ? partido.equipoLocal.image : 'logoEquipo.jpg'}`}
                                            alt="Perfil"
                                            style={{ width: '120px', height: '50px' }} // Size IMG
                                        />
                                        <p><strong>Equipo Local:</strong> {partido.equipoLocal.name}</p>
                                        <img
                                            src={`http://localhost:5000/sporthub/api/utils/uploads/${partido.equipoVisitante.image !== 'logoEquipo.jpg' ? partido.equipoVisitante.image : 'logoEquipo.jpg'}`}
                                            alt="Perfil"
                                            style={{ width: '120px', height: '50px' }} // Size IMG
                                        />
                                        <p><strong>Equipo Visitante:</strong> {partido.equipoVisitante.name}</p>

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
        </LayoutLogin>
    );
};