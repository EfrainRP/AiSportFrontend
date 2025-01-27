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
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../services/AuthContext.jsx'; //  AuthContext

import LayoutLogin from '../../LayoutLogin.jsx';
import LoadingView from '../../../components/Login/LoadingView.jsx';

export default function EditTournament() {
    const { tournamentName, tournamentId, matchId } = useParams();
    const {loading, setLoading } = useAuth(); // Obtención del usuario autenticado
    
    const [allTeams, setAllTeams] = React.useState([]); 
    const [formNames, setNames] = React.useState({
        homeTeam: '',
        guestTeam: '',
    }); 

    const [formData, setFormData] = useState({
        homeTeamId: '',
        guestTeamId: '',
        timeMatch: '',
        dateMatch: '',
        session: '',
        resHome: 0,
        resGuest: 0,
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [generalError, setGeneralError] = useState('');
    const navigate = useNavigate();

    // useEffect para hacer petición automática de los datos del torneo, partidos y notificaciones
    React.useEffect(() => {
        const fetchAllTeams = async () => {
        await axiosInstance.get(`/equipos/torneo/${tournamentName}`)
        .then((response) => {
            setAllTeams(response.data);
            setErrors(null);
        }).catch ((err) => {
            console.error('Error loading teams:', err);
            setLoading(true);
            setErrors("Error loading teams");
        })};
        
        const fetchMatches = async () => {
        await axiosInstance.get(`partido/${tournamentId}/${matchId}`)
        .then((response) => {
            const match = response.data;
            console.log("EQUIPOS",match.equipos_partidos_equipoLocal_idToequipos.name);
            setNames({
                homeTeam: match.equipos_partidos_equipoLocal_idToequipos.name,
                guestTeam: match.equipos_partidos_equipoVisitante_idToequipos.name,
            });
            
            // Formatear hora
            const timeMatch = match.horaPartido ? match.horaPartido.slice(11, 16) : ''; // HH:mm

            // Validar y formatear fecha (formato YYYY-MM-DD)
            const dateMatch = match.fechaPartido ? match.fechaPartido.slice(0, 10) : ''; // YYYY-MM-DD
            
            const session = match.jornada ? match.jornada.slice(0, 10) : ''; // YYYY-MM-DD
            // Toma los datos obtenidos y los reformatea para poderlos mostrar en la vista <-
            setFormData({
                homeTeamId: match.equipoLocal_id,
                guestTeamId: match.equipoVisitante_id,
                timeMatch, // Hora en formato HH:mm
                dateMatch, // Fecha en formato YYYY-MM-DD
                session, // Jornada cargada
                resHome: match.resLocal || 0,
                resGuest: match.resVisitante || 0,
            });
            setErrors(null);
        }).catch ((err) => {
            console.error('Error loading data matches:', err);
            setLoading(true);
            setErrors("Error loading data matches");
        })};

        fetchAllTeams();
        fetchMatches();
    }, [tournamentId, matchId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
        ...formData,
        [name]: value,
        });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axiosInstance.put(`/partido/${tournamentId}}/${matchId}`, formData)
        .then((response) =>{
            setSuccessMessage('Success update Match!');
            setTimeout(() => navigate(`/tournament/${tournamentName}/${tournamentId}}`), 2000);
        })
        .catch ((err) =>{
            if (err.response && err.response.data && err.response.data.field) {
                const { field, message } = err.response.data;
                setErrors({ [field]: message });
                console.log("Error in: ",field,message);
            } else {
                setGeneralError('Error update the match.', err);
            }
        })
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
                        <Button size="small" href={`/tournament/${tournamentName}/${tournamentId}stats`}>See statistics</Button>
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