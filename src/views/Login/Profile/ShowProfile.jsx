import React from 'react';
import {
    Typography,
    Skeleton,
    Box,
    Fab,
    Stack,
    Container,
    Divider,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Avatar,
    ListItemButton
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';

import axiosInstance from "../../../services/axiosConfig.js";
import { useAuth } from '../../../services/AuthContext.jsx'; //  AuthContext
import { Link, useNavigate } from 'react-router-dom';

import LayoutLogin from '../../LayoutLogin.jsx';
import LoadingView from '../../../components/Login/LoadingView.jsx';

const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server

export default function ShowProfile() {
    const [profile, setProfile] = React.useState(null);
    const { user, loading, setLoading } = useAuth(); // Accede al usuario autenticado 

    React.useEffect(() => { // Hace la solicitud al cargar la vista <-
        const fetchUser = async () => {
            await axiosInstance.get(`perfil/${user.userId}`)
                .then((response) => {
                    setTimeout(() => {
                        setLoading(false); // Cambia el estado para simular que la carga ha terminado
                      }, 1500); // Simula tiempo de carga
                    setProfile(response.data);
                })
                .catch((error) => {
                    console.error("Error al obtener los datos del usuario:", error);
                    setLoading(false); // Cambiar el estado de carga incluso en caso de error
                })
        };
        fetchUser();
    }, [user.userId, user.userName]);// Vuelve a ejecutar cuando el equipoId cambie

    if(!profile){ // En caso de que este vacio el torneo
        return (
        <LoadingView/>);
    }

    return (
        <LayoutLogin>
            <Container sx={{width: {xs: '75vw', sm: '50vw'}}}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography gutterBottom variant="h2" component="div" color='secondary' sx={{display:'flex', justifyContent:'center'}}>
                            {loading?
                                <Skeleton variant="rounded" width={'30%'} /> 
                                : "Profile"}
                        </Typography>
                        <Divider variant="middle" sx={{my:2}}/>
                        <CardMedia
                            component="img"
                            // image={`http://localhost:3000/ai/api/utils/uploads/${equipo.image !== 'logoEquipo.jpg' ? equipo.image : 'logoEquipo.jpg'}`} 
                            image={`${URL_SERVER}/utils/uploads/${profile && profile.image !== 'logoPerfil.jpg' ? profile.image : 'logoPerfil.jpg'}`} 
                            alt={"Profile"}
                            crossOrigin="use-credentials"
                            sx={{
                                height: '15rem',
                                width: '15rem', 
                                borderRadius: '50%', // Para hacer la imagen circular
                                objectFit: 'cover', // Asegura que la imagen se ajuste sin distorsión
                                objectPosition: 'center', // Centra la imagen dentro del contenedor
                                display: 'block', // Evita espacios debajo de la imagen
                                margin: '0 auto', // Centra la imagen dentro del contenedor 
                            }}
                        />
                        <Divider variant="middle" sx={{my:2}}/>
                        <Container sx={{display:'flex', flexDirection: 'row', textAlign:'justify', gap:2}}>
                            <Typography variant='h5' color='primary'> 
                                <strong>Name:</strong>
                            </Typography>
                            <Typography variant='h6'> 
                                {profile.name} {profile.fsurname} {profile.msurname}
                            </Typography>
                        </Container>
                        <Divider variant="middle" sx={{my:2}}/>
                        <Container sx={{display:'flex', flexDirection: 'row', textAlign:'justify', gap:2}}>
                            <Typography variant='h5' color='primary'> 
                                <strong>Email:</strong>
                            </Typography>
                            <Typography variant='h6'> 
                                {profile.email}
                            </Typography>
                        </Container>
                        <Divider variant="middle" sx={{my:2}}/>
                        <Container sx={{display:'flex', flexDirection: 'row', textAlign:'justify', gap:2}}>
                            <Typography variant='h5' color='primary'> 
                                <strong>Gender:</strong>
                            </Typography>
                            <Typography variant='h6'> 
                                {profile.gender}
                            </Typography>
                        </Container>
                        <Divider variant="middle" sx={{my:2}}/>
                        <Container sx={{display:'flex', flexDirection: 'row', textAlign:'justify', gap:2}}>
                            <Typography variant='h5' color='primary'> 
                                <strong>Birthdate:</strong>
                            </Typography>
                            <Typography variant='h6'> 
                                {new Date(profile.birthdate).toISOString().split('T')[0]}
                            </Typography>
                        </Container>
                        <Divider variant="middle" sx={{my:2}}/>
                        <Container sx={{display:'flex', flexDirection: 'row', textAlign:'justify', gap:2}}>
                            <Typography variant='h5' color='primary'> 
                                <strong>NickName:</strong>
                            </Typography>
                            <Typography variant='h6'> 
                                {profile.nickname || 'No nickname set'}
                            </Typography>
                        </Container>
                        <Divider variant="middle" sx={{my:2}}/>
                    </CardContent>
                    <CardActions sx={{display:'center', justifyContent: 'flex-end'}}>
                        
                        <Fab color='primary' variant="extended" size="small" href={`/dashboard/profile/${user.userName}/edit`}><EditIcon sx={{mr:1}}/>Edit</Fab>
                    </CardActions>
                </Card>
                <Accordion sx={{mt:2}}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="yourTeams"
                    id="yourTeams"
                    >
                    <Typography component="span">Your Teams: </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <List sx={{m:0,p:0}}>
                        {profile.equipos?.map((team, i) => (
                            <ListItem key={i}>
                                <ListItemButton href={`/team/${team.name}/${team.id}`}>
                                    <ListItemAvatar>
                                        <Avatar src={`${URL_SERVER}/utils/uploads/${team && team.image !== 'logoEquipo.jpg' ? team.image : 'logoEquipo.jpg'}`}/>
                                    </ListItemAvatar>
                                    <ListItemText primary={team.name}/>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="yourTournaments"
                    id="yourTournaments"
                    >
                    <Typography component="span">Your Tournaments: </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List sx={{m:0,p:0}}>
                            {profile.torneos?.map((torunament,i) => (
                                <ListItem key={i}>
                                    <ListItemButton href={`/tournament/${torunament.name}/${torunament.id}`}>
                                        <ListItemText primary={torunament.name}/>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </AccordionDetails>
                </Accordion>
                <Accordion disabled={profile.notifications_notifications_user_idTousers?.length<0?false:true}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="yourNotifications"
                    id="yourNotifications"
                    >
                        <Typography component="span"> {profile.notifications_notifications_user_idTousers?.length<0?"Your Notifications: ":<strong>You don´t have notifications </strong>}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List sx={{m:0,p:0}}> {/*TODO: checar notificaciones con datos */}
                            {profile.notifications_notifications_user_idTousers?.map((notification,i) => (
                                <ListItem key={i}>
                                    <ListItemText primary={notification.message}/>
                                </ListItem>
                            ))}
                        </List>
                    </AccordionDetails>
                </Accordion>
            </Container>
        </LayoutLogin>
    );
};