import React from 'react';
import {
    Typography,
    Skeleton,
    Box,
    Card,
    CardActions,
    CardContent,
    CardActionArea,
    Button,
    IconButton,
    Fab,
    Stack,
    Avatar,
    TextField,
    Autocomplete,
    ButtonGroup,
    Grow,
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
    ListItemButton,
} from '@mui/material';
import PropTypes from 'prop-types';

import axiosInstance from "../../../services/axiosConfig.js";
import { useParams, } from 'react-router-dom';
import { useAuth } from '../../../services/AuthContext'; //  AuthContext

import LayoutLogin from '../../LayoutLogin.jsx';
import LoadingView from '../../../components/Login/LoadingView.jsx'
import BackButton from '../../../components/Login/BackButton.jsx'
import LoadingCard from '../../../components/Login/LodingCard.jsx';
import ConfirmDialog from '../../../components/Login/ConfirmDialog.jsx';
import MatchBracket from '../../../components/Login/MatchBracket.jsx';

import FolderIcon from '@mui/icons-material/Folder';
import GroupsIcon from '@mui/icons-material/Groups';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import EditIcon from '@mui/icons-material/Edit';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DoDisturbAltOutlinedIcon from '@mui/icons-material/DoDisturbAltOutlined';

function CustomTabPanel(props) {
    const { children, value, index, sx, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{...sx}}>{children}</Box>}
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
const centerJustify = { display: 'flex', textAlign: 'justify' };

export default function ShowTournament() {
    const { tournamentName, tournamentId } = useParams();
    const { user, loading, setLoading } = useAuth(); // Obtención del usuario autenticado
    const [tournament, setTournament] = React.useState([]); // Estado para los detalles del torneo
    const [notificaciones, setNotificaciones] = React.useState([]); // Estado para las notificaciones

    const [dataAlert, setDataAlert] = React.useState({}); //Mecanismo Alert //TO DO: checar si se usa
    const [openSnackBar, setOpenSnackBar] = React.useState(false); // Mecanismo snackbar //TO DO: checar si se usa

    const handleCloseSnackBar = (event, reason) => { //TO DO: checar si se usa
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
    };

    const [valueTab, setValueTab] = React.useState(() => {
        let initialTab = Number(localStorage.getItem("activeTabShowTournament")) || 0;
        localStorage.setItem("activeTabShowTournament", initialTab); // Guardar la pestaña activa

        return initialTab; // Devuelve el valor inicial del tab.
    });

    const handleChange = (event, newValue) => {
        setValueTab(newValue);
        localStorage.setItem("activeTabShowTournament", newValue); // Guardar la pestaña activa
    };
    
    const [check, setCheck] = React.useState(false);
    const [checkDelete, setCheckDelete] = React.useState(false);

    React.useEffect(() => {
        const fetchTournament = async () => { // Peticion SHOW Torneo
            await axiosInstance.get(`/torneo/${tournamentName}/${tournamentId}`)
                .then((response) => {
                    setTournament(response.data.torneo); // Datos del torneo
                    setNotificaciones(response.data.torneo.notifications); // Establecer notificaciones del torneo
                })
                .catch((err) => {
                    // console.error('Error al cargar el torneo:', err);
                    setLoading(true);
                })
        };
        fetchTournament(); // Llamada para obtener los detalles del torneo
    }, [tournamentId, tournamentName, notificaciones]);

    // Función para manejar la aceptación o rechazo de notificaciones <-
    const handleNotificationResponse = async (notificationId, status) => {
        if(status === 'accept') {
            setCheck(true);
        }else{
            setCheckDelete(true);
        }
        // Enviar solicitud PUT para actualizar el estado de la notificación
        await axiosInstance.put(`/notificaciones/${notificationId}`, {
            status, // Puede ser 'accepted' o 'rejected'
        })
        .then(() => {
            // Actualizar el estado local de las notificaciones después de la respuesta
            setNotificaciones((prevState) =>
                prevState.filter(notificacion => notificacion.id !== notificationId)
            );
        })
        .catch((err) => {
            console.error('Error responding to notification:', err);
            setCheckDelete(false);
            setCheck(false);
        })
    };

    if (!tournament) { // En caso de que este vacio el torneo
        return (
            <LoadingView
                message={`The tournament you are trying to access may not exist.`}
            />);
    }
    // console.log(matches[matches.length - 1].nextMatchId);
    // console.log(' count ',matchesCount);
    // console.log(' torneo ',tournament);
    return (
        <LayoutLogin>
            <Container sx={{ ...centerJustify }}>
                <BackButton url={`/tournaments`} />
                <Typography gutterBottom variant="h2" component="div" sx={{ ml: 2 }}>
                    {loading ?
                        <Skeleton variant="rounded" width={'30%'} />
                        : tournament.name}
                </Typography>
            </Container>
            <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnackBar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert
                    severity={dataAlert.severity}
                    variant='filled'
                    sx={{ width: '100%' }}
                    onClose={handleCloseSnackBar}
                >
                    {dataAlert.message}
                </Alert>
            </Snackbar>

            <Box sx={{ borderBottom: 3, borderColor: 'divider' }}>
                <Tabs centered value={valueTab} onChange={handleChange} >
                    <Tab icon={<FolderIcon />} label="Details" {...a11yProps(0)} />
                    <Tab icon={<GroupsIcon />} label="Matches" {...a11yProps(1)} />
                    <Tab icon={<NotificationAddIcon />} label="Notifications" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={valueTab} index={0} sx={{p:3}}> {/*Tab Details */}
                <Container sx={{ width: '70%' }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Container sx={{ ...centerJustify, gap: 2 }}>
                                <Typography variant='h5' color='primary'>
                                    <strong>Location:</strong>
                                </Typography>
                                <Typography variant='h6'>
                                    {tournament.ubicacion}
                                </Typography>
                            </Container>
                            <Divider variant="middle" sx={{ my: 2 }} />
                            <Container sx={{ ...centerJustify, gap: 2 }}>
                                <Typography variant='h5' color='primary'>
                                    <strong>Description:</strong>
                                </Typography>
                                <Typography variant='h6'>
                                    {tournament.descripcion}
                                </Typography>
                            </Container>
                            <Divider variant="middle" sx={{ my: 2 }} />
                            <Container sx={{ ...centerJustify, gap: 2 }}>
                                <Typography variant='h5' color='primary'>
                                    <strong>Start Date:</strong>
                                </Typography>
                                <Typography variant='h6'>
                                    {new Date(tournament.fechaInicio).toLocaleDateString()}
                                </Typography>
                            </Container>
                            <Divider variant="middle" sx={{ my: 2 }} />
                            <Container sx={{ ...centerJustify, gap: 2 }}>
                                <Typography variant='h5' color='primary'>
                                    <strong>End Date:</strong>
                                </Typography>
                                <Typography variant='h6'>
                                    {new Date(tournament.fechaFin).toLocaleDateString()}
                                </Typography>
                            </Container>
                            <Divider variant="middle" sx={{ my: 2 }} />
                            <Container sx={{ ...centerJustify, gap: 2 }}>
                                <Typography variant='h5' color='primary'>
                                    <strong>Total Teams:</strong>
                                </Typography>
                                <Typography variant='h6'>
                                    {tournament.cantEquipo}
                                </Typography>
                            </Container>
                            <Divider variant="middle" sx={{ my: 2 }} />
                        </CardContent>
                        <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Fab variant="extended" color='info' size="small" href={`/tournament/${tournamentName}/${tournamentId}/edit`} sx={{ color: 'white' }}><EditIcon sx={{ mr: 1 }} /> Edit</Fab>
                            <Fab variant="extended" color='warning' size="small" href={`/tournament/${tournamentName}/${tournamentId}/stats`}><EqualizerIcon sx={{ mr: 1 }} /> Stats</Fab>
                        </CardActions>
                    </Card>
                </Container>
            </CustomTabPanel>
            <CustomTabPanel value={valueTab} index={1} sx={{mt:3}}> {/*Tab Matches */}
                {/* <Container> */}
                {/* // Si es un torneo valido (4,8,16,32) genera los brackets <- 
                        // Brakets contiene los partidos como: brackets = [
                        // [{ partido1, partido2 }, { partido3, partido4 }],  // Ronda 1
                        //[{ partido5, partido6 }],  // Ronda 2
                        //[{ partido7 }]  // Ronda 3 */}
                <MatchBracket onwerTournament={tournament.user_id === user.userId} />

                {/* Mostrar ganador final solo si todos los partidos están completos, (se llego a countTeam-1)*/}
                {/* {isValidMatchesCount && matches.length && (
                        <Card variant="outlined">
                            <CardContent sx={{textAlign:'center'}}>
                                <Typography variant='h4'>Final Tournament Winner</Typography>
                                <Typography variant='h3'><strong>Champion:</strong> {getWinner(matches[matches.length - 1])}</Typography>
                            </CardContent>
                        </Card>
                    )} */}
                {/* </Container> */}

            </CustomTabPanel>
            <CustomTabPanel value={valueTab} index={2}> {/*Tab Matches */}
                <Container>
                    <Typography variant='h4' sx={{ textAlign: 'center', mb: 3 }}>Tournament Notifications</Typography>
                    <List component={Card} variant="outlined">
                        {notificaciones.length > 0 ? (
                            notificaciones.map((notificacion, i) => {
                                const colorStatus = notificacion.status == 'accepted' ? 'success' : 'warning';
                                return (
                                    <ListItem key={i}
                                        sx={{ display: "flex", padding: 2, }}
                                        alignItems="flex-start"
                                        disablePadding
                                        secondaryAction={
                                            notificacion.status === 'pending' && (
                                                //  Botones para aceptar o denegar la notificación
                                                <ButtonGroup edge="end" variant="contained">
                                                    <Button color="success" alt='accepted' startIcon={check ? <CheckCircleRoundedIcon /> : <RadioButtonUncheckedIcon />} onClick={() => handleNotificationResponse(notificacion.id, 'accepted')}>
                                                        Accept
                                                    </Button>
                                                    <Button color="error" alt='rejected' startIcon={checkDelete ? <CheckCircleRoundedIcon /> : <DoDisturbAltOutlinedIcon />} onClick={() => handleNotificationResponse(notificacion.id, 'rejected')}>
                                                        Deny
                                                    </Button>
                                                </ButtonGroup>)
                                        }
                                    >
                                        <ListItemText
                                            sx={{ maxWidth: '50%' }}
                                            primary={
                                                <Typography variant='body1' component="div">
                                                    Player <Typography component={'strong'} color={'primary'}>{notificacion.users_notifications_user_idTousers.name}</Typography> sent you a notification from team <Typography component={'strong'} color={'secondary'}>{notificacion.equipos.name}</Typography>
                                                </Typography>}

                                            secondary={
                                                <Typography
                                                    sx={{ display: 'flex', flexDirection: 'row', textAlign: 'justify', gap: 1 }}
                                                    component={'div'}
                                                >
                                                    <Typography component={'strong'}>Status:</Typography>
                                                    <Typography color={colorStatus}>{notificacion.status}</Typography>
                                                </Typography>
                                            }
                                        />
                                        <ListItemText
                                            sx={{ maxWidth: '40%' }}
                                            primary={
                                                <Typography
                                                    sx={{ display: 'flex', flexDirection: 'row', textAlign: 'justify', gap: 1 }}
                                                    component={'div'}
                                                >
                                                    <Typography component={'strong'} color={'pink'}>Email:</Typography>
                                                    <Typography>{notificacion.users_notifications_user_idTousers.email}</Typography>
                                                </Typography>} />

                                        {/* {notificacion.status === 'pending' && (
                                        <Container sx={{display: "flex", justifyContent: "center", gap: 1, width: "20%" }}>
                                            <ListItemButton alt='accepted' onClick={() => handleNotificationResponse(notificacion.id, 'accepted')}>Accept</ListItemButton>
                                            <ListItemButton alt='rejected' onClick={() => handleNotificationResponse(notificacion.id, 'rejected')}>Deny</ListItemButton>

                                        </Container>
                                    )} */}
                                    </ListItem>
                                );
                            })
                        ) : (
                            <ListItem sx={{ display: "flex", gap: 1, justifyContent: 'center' }}>
                                <LoadingCard CircularSize={'2%'} message={"Maybe there are no pending notifications for this tournament."} variant='info' />
                            </ListItem>
                        )}
                    </List>
                </Container>
            </CustomTabPanel>
        </LayoutLogin>
    );
};