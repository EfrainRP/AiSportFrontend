import React from 'react';
import {
    Typography,
    Skeleton,
    Box,
    Card,
    CardActions,
    CardContent,
    CardActionArea,
    IconButton,
    ToggleButtonGroup, 
    Fab,
    Stack,
    TextField ,
    Autocomplete,
    ButtonGroup,
    Grow ,
    Tab,
    Tabs,
    Container,
    Alert,
    Snackbar, 
    Divider,
    CardMedia,
    List,
    ListItem,
    ListItemText,
    ListItemButton
} from '@mui/material';
import PropTypes from 'prop-types';

import axiosInstance from "../../../services/axiosConfig.js";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../services/AuthContext'; //  AuthContext

import LayoutLogin from '../../LayoutLogin.jsx';
import LoadingView from '../../../components/Login/LoadingView.jsx'

import FolderIcon from '@mui/icons-material/Folder';
import GroupsIcon from '@mui/icons-material/Groups';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server
const centerJustify = {display:'flex', textAlign:'justify'};

export default function ShowTournament() {
    const { tournamentName, tournamentId } = useParams();
    const { user, loading, setLoading } = useAuth(); // Obtención del usuario autenticado
    const [tournament, setTournament] = React.useState([]); // Estado para los detalles del torneo
    const [matches, setMatches] = React.useState([]); // Estado para los partidos del torneo
    const [notificaciones, setNotificaciones] = React.useState([]); // Estado para las notificaciones
    const navigate = useNavigate();

    const [dataAlert, setDataAlert] = React.useState({}); //Mecanismo Alert
    const [openSnackBar, setOpenSnackBar] = React.useState(false); // Mecanismo snackbar

    const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }
    setOpenSnackBar(false);
    };
    
    const [valueTab, setValueTab] = React.useState(0); // Mecanismo del Tab
    const handleChange = (event, newValue) => {
    setValueTab(newValue);
    };
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

    console.log(matches);

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
            
            <Container sx={{...centerJustify}}>
                <IconButton onClick={() => navigate(-1)}><ArrowBackIcon/></IconButton>
                <Typography gutterBottom variant="h2" component="div" sx={{ml:2}}>
                    {loading?
                        <Skeleton variant="rounded" width={'30%'} /> 
                        : tournament.name}
                </Typography>
            </Container>
            <Box sx={{ borderBottom: 3, borderColor: 'divider' }}>
                <Tabs centered value={valueTab} onChange={handleChange} >
                    <Tab icon={<FolderIcon />} label="Details" {...a11yProps(0)} />
                    <Tab icon={<GroupsIcon />} label="Matches" {...a11yProps(1)}/>
                    <Tab  icon={<NotificationAddIcon />} label="Notifications" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={valueTab} index={0}> {/*Tab Details */}
                <Container sx={{width: '70%'}}>
                    <Card variant="outlined">
                        <CardContent>
                            <Container sx={{...centerJustify, gap:2}}>
                                <Typography variant='h5' color='primary'> 
                                    <strong>Location:</strong>
                                </Typography>
                                <Typography variant='h6'> 
                                    {tournament.ubicacion}
                                </Typography>
                            </Container>
                            <Divider variant="middle" sx={{my:2}}/>
                            <Container sx={{...centerJustify, gap:2}}>
                                <Typography variant='h5' color='primary'> 
                                    <strong>Description:</strong>
                                </Typography>
                                <Typography variant='h6'> 
                                    {tournament.descripcion}
                                </Typography>
                            </Container>
                            <Divider variant="middle" sx={{my:2}}/>
                            <Container sx={{...centerJustify, gap:2}}>
                                <Typography variant='h5' color='primary'> 
                                    <strong>Start Date:</strong>
                                </Typography>
                                <Typography variant='h6'> 
                                    {new Date(tournament.fechaInicio).toLocaleDateString()}
                                </Typography>
                            </Container>
                            <Divider variant="middle" sx={{my:2}}/>
                            <Container sx={{...centerJustify, gap:2}}>
                                <Typography variant='h5' color='primary'> 
                                    <strong>End Date:</strong>
                                </Typography>
                                <Typography variant='h6'> 
                                    {new Date(tournament.fechaFin).toLocaleDateString()}
                                </Typography>
                            </Container>
                            <Divider variant="middle" sx={{my:2}}/>
                            <Container sx={{...centerJustify, gap:2}}>
                                <Typography variant='h5' color='primary'> 
                                    <strong>Total Teams:</strong>
                                </Typography>
                                <Typography variant='h6'> 
                                    {tournament.cantEquipo}
                                </Typography>
                            </Container>
                            <Divider variant="middle" sx={{my:2}}/>
                        </CardContent>
                        <CardActions sx={{display: 'flex', justifyContent:'center'}}>
                            <Fab variant="extended" color='info' size="small" href={`/tournament/${tournamentName}/${tournamentId}/edit`} sx={{color:'white'}}><EditIcon sx={{ mr: 1 }}/> Edit</Fab>
                            <Fab variant="extended" color='success' size="small" href={`/partido/create/${tournamentName}/${tournamentId}`}> <AddIcon sx={{ mr: 1 }}/> match</Fab>
                            <Fab variant="extended" color='warning' size="small" href={`/tournament/${tournamentName}/${tournamentId}/stats`}><EqualizerIcon sx={{ mr: 1 }}/> Stats</Fab>
                        </CardActions>
                    </Card>
                </Container>
            </CustomTabPanel>
            <CustomTabPanel value={valueTab} index={1}> {/*Tab Matches */}
                <Typography variant='h4' sx={{textAlign:'center', mb:3}}>Tournament matches</Typography>
                <Container>
                    {isValidTeamCount ? ( // Si es un torneo valido (4,8,16,32) genera los brackets <-
                        // Brakets contiene los partidos como: brackets = [
                        // [{ partido1, partido2 }, { partido3, partido4 }],  // Ronda 1
                        //[{ partido5, partido6 }],  // Ronda 2
                        //[{ partido7 }]  // Ronda 3
                        // TODO: checar la vista de round con datos 
                        brackets.map((round, index) => ( // "Map" itera en el array, y "Round" es un array de "partidos" por ronda
                            <Card key={index}>     {/* Index indica la Ronda actual <- donde "key" actualiza el DOM (Interfaz de programacion) dinamicamente */}
                                <CardContent>
                                    <Typography variant='h5'>Round {index + 1}</Typography>
                                    <Container>
                                        {round.map((match, matchIndex) => (
                                            <Card
                                                key={matchIndex}
                                                // style={{
                                                //     marginBottom: '20px',
                                                //     border: '1px solid #ccc',
                                                //     padding: '10px',
                                                //     borderRadius: '5px',
                                                //     width: '48%',
                                                // }}
                                            >
                                                <Typography variant='body1'><strong>Match Date:</strong> {new Date(match.fechaPartido).toISOString().split('T')[0]}</Typography>
                                                <Typography variant='body1'><strong>Time:</strong> {new Date(match.horaPartido).toLocaleTimeString()}</Typography>
                                                <CardMedia
                                                    src={URL_SERVER+`/utils/uploads/${match.equipoLocal.image !== 'logoEquipo.jpg' ? match.equipoLocal.image : 'logoEquipo.jpg'}`}
                                                    alt="Perfil"
                                                    style={{ width: '120px', height: '50px' }} // Size IMG
                                                />
                                                <Typography variant='body1'><strong>Home Team:</strong> {match.equipoLocal.name}</Typography>
                                                <CardMedia
                                                    src={URL_SERVER+`/utils/uploads/${match.equipoVisitante.image !== 'logoEquipo.jpg' ? match.equipoVisitante.image : 'logoEquipo.jpg'}`}
                                                    alt="Perfil"
                                                    style={{ width: '120px', height: '50px' }} // Size IMG
                                                />
                                                <Typography variant='body1'><strong>Vist Team:</strong> {match.equipoVisitante.name}</Typography>

                                                <Typography variant='body1'><strong>Result:</strong> {match.resLocal} - {match.resVisitante}</Typography>
                                                {/* Botones de Editar y Eliminar */}
                                                <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Fab variant="extended" onClick={() => handleEdit(match.id)}>Edit</Fab>
                                                    <Fab variant="extended" onClick={() => handleEliminar(match.id)}>Delete</Fab>
                                                </CardActions>
                                            </Card>
                                        ))}
                                    </Container>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card variant="outlined">
                            <CardContent>
                            <Typography variant='subtitle2' sx={{textAlign: 'center'}}>There are no matches scheduled for this tournament or the number of teams is invalid.</Typography>
                            </CardContent>
                        </Card>
                        
                    )}

                    {/* Mostrar ganador final solo si todos los partidos están completos, (se llego a countTeam-1)*/}
                    {isValidMatchesCount && matches.length > 0 && (
                        <Card variant="outlined">
                            <CardContent sx={{textAlign:'center'}}>
                                <Typography variant='h4'>Final Tournament Winner</Typography>
                                <Typography variant='h3'><strong>Champion:</strong> {getWinner(matches[matches.length - 1])}</Typography>
                            </CardContent>
                        </Card>
                    )}
                </Container>
            </CustomTabPanel>
            <CustomTabPanel value={valueTab} index={2}> {/*Tab Matches */}
                <Container>
                    <Typography variant='h4' sx={{textAlign: 'center', mb:3}}>Tournament Notifications</Typography>
                    <List component={Card} variant="outlined">
                        {notificaciones.length > 0 ? ( //TODO: checar la vista notificaciones con datos
                            notificaciones.map((notificacion,i) => (
                                <ListItem key={i}>
                                    <ListItemText primary={`Team: ${notificacion.equipos.name}`}/>
                                    <ListItemText primary={`Player: ${notificacion.users_notifications_user_idTousers.name}`}/>
                                    <ListItemText primary={`Email: ${notificacion.users_notifications_user_idTousers.email}`}/>
                                    <ListItemText primary={`Status: ${notificacion.status}`}/>

                                    {/* Botones para aceptar o denegar la notificación */}
                                    {notificacion.status === 'pending' && (
                                        <Container>
                                            <ListItemButton alt='accepted' onClick={() => handleNotificationResponse(notificacion.id, 'accepted')}>Accept</ListItemButton>
                                            <ListItemButton alt='rejected' onClick={() => handleNotificationResponse(notificacion.id, 'rejected')}>Deny</ListItemButton>

                                        </Container>
                                    )}
                                </ListItem>
                            ))
                        ) : (
                            <ListItemText variant='body1' sx={{textAlign: 'center'}}>There are no pending notifications for this tournament.</ListItemText>
                        )}
                    </List>
                </Container>
            </CustomTabPanel>  
        </LayoutLogin>
    );
};