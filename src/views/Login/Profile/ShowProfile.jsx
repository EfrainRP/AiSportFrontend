import React from 'react';
import {
    Typography,
    Skeleton,
    Box,
    Button,
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
    Avatar
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
                        <Typography gutterBottom variant="h2" component="div" >
                            {loading?
                                <Skeleton variant="rounded" width={'30%'} /> 
                                : "Profile"}
                        </Typography>
                        <Divider variant="middle" sx={{my:2}}/>
                        <CardMedia
                            component="img"
                            height={120}
                            // image={`http://localhost:3000/sporthub/api/utils/uploads/${equipo.image !== 'logoEquipo.jpg' ? equipo.image : 'logoEquipo.jpg'}`} 
                            image={URL_SERVER+`/utils/uploads/${profile.image !== 'logoPerfil.jpg' ? profile.image : 'logoPerfil.jpg'}`} 
                            alt={"Profile"}
                            sx={{height:'15rem'}}
                        />
                        <Divider variant="middle" sx={{my:2}}/>
                        <Container sx={{display:'flex', flexDirection: 'row', textAlign:'justify', gap:2}}>
                            <Typography variant='h5'> 
                                <strong>Name:</strong>
                            </Typography>
                            <Typography variant='h6' sx={{color: 'text.secondary'}}> 
                                {profile.name} {profile.fsurname} {profile.msurname}
                            </Typography>
                        </Container>
                        <Divider variant="middle" sx={{my:2}}/>
                        <Container sx={{display:'flex', flexDirection: 'row', textAlign:'justify', gap:2}}>
                            <Typography variant='h5'> 
                                <strong>Email:</strong>
                            </Typography>
                            <Typography variant='h6' sx={{color: 'text.secondary'}}> 
                                {profile.email}
                            </Typography>
                        </Container>
                        <Divider variant="middle" sx={{my:2}}/>
                        <Container sx={{display:'flex', flexDirection: 'row', textAlign:'justify', gap:2}}>
                            <Typography variant='h5'> 
                                <strong>Gender:</strong>
                            </Typography>
                            <Typography variant='h6' sx={{color: 'text.secondary'}}> 
                                {profile.gender}
                            </Typography>
                        </Container>
                        <Divider variant="middle" sx={{my:2}}/>
                        <Container sx={{display:'flex', flexDirection: 'row', textAlign:'justify', gap:2}}>
                            <Typography variant='h5'> 
                                <strong>Birthdate:</strong>
                            </Typography>
                            <Typography variant='h6' sx={{color: 'text.secondary'}}> 
                                {new Date(profile.birthdate).toISOString().split('T')[0]}
                            </Typography>
                        </Container>
                        <Divider variant="middle" sx={{my:2}}/>
                        <Container sx={{display:'flex', flexDirection: 'row', textAlign:'justify', gap:2}}>
                            <Typography variant='h5'> 
                                <strong>NickName:</strong>
                            </Typography>
                            <Typography variant='h6' sx={{color: 'text.secondary'}}> 
                                {profile.nickname || 'No nickname set'}
                            </Typography>
                        </Container>
                        <Divider variant="middle" sx={{my:2}}/>
                    </CardContent>
                    <CardActions>
                        <Button variant="contained" size="small" href={`/dashboard/profile/${user.userName}/edit`}>Edit Profile</Button>
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
                                <ListItemAvatar>
                                    <Avatar src={URL_SERVER+`/utils/uploads/${team.image !== 'logoEquipo.jpg' ? team.image : 'logoEquipo.jpg'}`}/>
                                </ListItemAvatar>
                                <ListItemText primary={team.name}/>
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
                                    <ListItemText primary={torunament.name}/>
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
                    <Typography component="span"> {profile.notifications_notifications_user_idTousers?.length<0?"Your Notifications: ":"You don´t have notifications "}</Typography>
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