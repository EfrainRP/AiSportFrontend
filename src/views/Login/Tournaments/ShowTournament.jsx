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
import { useAuth } from '../../../services/AuthContext'; //  AuthContext

import LayoutLogin from '../../LayoutLogin.jsx';
import LoadingView from '../../../components/Login/LoadingView.jsx'

export default function ShowTournament() {
    const { tournamentName, tournamentId } = useParams();
    const { user, loading, setLoading } = useAuth(); // Obtención del usuario autenticado
    const [tournament, setTournament] = React.useState([]); // Estado para los detalles del torneo
    const [matches, setMatches] = React.useState([]); // Estado para los partidos del torneo
    const [notificaciones, setNotificaciones] = React.useState([]); // Estado para las notificaciones
    const navigate = useNavigate();

    // useEffect para hacer petición automática de los datos del torneo, partidos y notificaciones
    React.useEffect(() => {
        const fetchTournament = async () => { // Peticion SHOW Torneo
            await axiosInstance.get(`/torneo/${tournamentName}/${tournamentId}`)
            .then((response)=>{
                setTournament(response.data); // Datos del torneo
                setNotificaciones(response.data.notifications); // Establecer notificaciones del torneo
            })
            .catch ((err) =>{
                console.error('Error al cargar el torneo:', err);
                setLoading(true);
            })
        };

        const fetchMatches = async () => { // Peticion INDEX Partidos del torneo
            await axiosInstance.get(`/partidos/${tournamentId}`).
            then((response)=> {
                setMatches(response.data); // Datos de los partidos
                setLoading(false);
            })
            .catch ((err)=>{
                console.error('Error al cargar los partidos del torneo:', err);
                setLoading(true);
            })
        };

        fetchTournament(); // Llamada para obtener los detalles del torneo
        fetchMatches(); // Llamada para obtener los partidos del torneo
    }, [tournamentId, tournamentName]);

    // Función para manejar la aceptación o rechazo de notificaciones <-
    const handleNotificationResponse = async (notificationId, status) => {
            // Enviar solicitud PUT para actualizar el estado de la notificación
        await axios.put(`/notificaciones/${notificationId}`, {
            status, // Puede ser 'accepted' o 'rejected'
        })
        .then(()=>{
            // Actualizar el estado local de las notificaciones después de la respuesta
            setNotificaciones((prevState) =>
                prevState.map((notificacion) =>
                    notificacion.id === notificationId
                        ? { ...notificacion, status }
                        : notificacion
                )
            );
        })
        .catch ((err) => {
            console.error('Error al responder la notificación:', err);
        })
    };

    // Validar si la cantidad de equipos del torneo es del rango válido (Front)
    const isValidTeamCount = [4, 8, 16, 32].includes(tournament?.countTeam);

    // Validar la cantidad de partidos (Front) (debe ser torneo.countTeam - 1)
    const isValidMatchesCount = matches.length === tournament?.countTeam - 1;

    // Organizar los partidos en brackets (Front)
    const generateBracket = (matches) => {
        let rounds = [];
        let roundSize = tournament.countTeam / 2;
        let roundMatches = [...matches];

        while (roundSize >= 1) {
            rounds.push(roundMatches.slice(0, roundSize));
            roundMatches = roundMatches.slice(roundSize);
            roundSize /= 2;
        }
        {/* Retorna la cantidad de rondas que tendra cada torneo */ }
        return rounds;
        {/* (Dividen en mitades al torneo, Ex: si countTeam = 8, Ronda 1 = 4, Ronda 2 = 2, Ronda 3 = 1) */ }
        {/* donde {4,2,1} indican la cantidad de partidos en esa ronda <- */ }
    };

    if(!tournament){ // En caso de que este vacio el torneo
        return (
        <LoadingView 
        message={`The tournament you are trying to access may not exist.`}
        />);
    }

    // Generar los brackets solo si es un torneo válido
    const brackets = isValidTeamCount ? generateBracket(matches) : [];

    // Calcular al ganador del torneo del ultimo partido basado en sus resultados "res" <-
    const getWinner = (match) => {
        const localPts = match.resLocal;
        const visitantePts = match.resVisitante;
        return localPts > visitantePts ? match.equipoLocal.name : partido.equipoVisitante.name;
    };

    const handleEliminar = async (matchId) => { // Peticion DELETE Partido
        const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este partido?");

        if (confirmacion) {
            await axiosInstance.delete(`/partido/${tournamentId}/${matchId}`)
            .then(()=>{
                setMatches(partidos.filter(partido => partido.id !== matchId)); // Eliminar partido de la lista y actualizar el front <-
            })
            .catch ((err) => {
                console.error('Error al eliminar el partido:', err);
            });
        } else {
            console.log("Eliminación cancelada");
        }
    };

    const handleEdit = (matchId) => { // Cambio de vista a Edit form
        navigate(`/partido/${tournamentName}/${tournamentId}/${matchId}/edit`);
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
                            {tournament.name}
                        </Typography>
                        <Typography><strong>Location:</strong> {tournament.ubicacion}</Typography>
                        <Typography><strong>Description:</strong> {tournament.descripcion}</Typography>
                        <Typography><strong>Start Date:</strong> {new Date(tournament.fechaInicio).toLocaleDateString()}</Typography>
                        <Typography><strong>End Date:</strong> {new Date(tournament.fechaFin).toLocaleDateString()}</Typography>
                        <Typography><strong>Total Teams:</strong> {tournament.countTeam}</Typography>
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
                                    <button onClick={() => handleNotificationResponse(notificacion.id, 'accepted')}>Aceptar</button>
                                    <button onClick={() => handleNotificationResponse(notificacion.id, 'rejected')}>Denegar</button>
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
                {isValidTeamCount ? ( // Si es un torneo valido (4,8,16,32) genera los brackets <-
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
                                            <button onClick={() => handleEdit(partido.id)}>Editar</button>
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

                {/* Mostrar ganador final solo si todos los partidos están completos, (se llego a countTeam-1)*/}
                {isValidMatchesCount && partidos.length > 0 && (
                    <div>
                        <h3>Ganador Final del Torneo</h3>
                        <p><strong>Campeón:</strong> {getWinner(partidos[partidos.length - 1])}</p>
                    </div>
                )}
            </div>
        </LayoutLogin>
    );
};