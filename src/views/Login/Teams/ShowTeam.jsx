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
    ListItemText,
} from '@mui/material';

import axiosInstance from "../../../services/axiosConfig.js";
import { useAuth } from '../../../services/AuthContext.jsx'; //  AuthContext
import { useParams, Link, useNavigate } from 'react-router-dom';

import LayoutLogin from '../../LayoutLogin.jsx';
import LoadingView from '../../../components/Login/LoadingView.jsx';

const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server

export default function ShowTeam() {
    const [team, setTeam] = React.useState(null);
    const [error, setError] = React.useState(null);
    const { user, loading, setLoading } = useAuth(); // Accede al usuario autenticado 
    const { teamName, teamId } = useParams(); // Obtiene el equipoName desde la URL

    React.useEffect(() => { // Hace la solicitud al cargar la vista <-
        const fetchTeam = async () => {
            await axiosInstance.get(`equipo/${teamName}/${teamId}`)
                .then((response) => {
                    setTimeout(() => {
                        setLoading(false); // Cambia el estado para simular que la carga ha terminado
                      }, 1500); // Simula tiempo de carga
                    setTeam(response.data);
                })
                .catch((error) => {
                    console.error("Error al obtener los equipos:", error);
                    setLoading(false); // Cambiar el estado de carga incluso en caso de error
                })
        };
        fetchTeam();
    }, [teamId]);// Vuelve a ejecutar cuando el equipoId cambie

    if(!team){ // En caso de que este vacio el torneo
        return (
        <LoadingView 
            message={`The team you are trying to access may not exist.`}
        />);
    }

    return (
        <LayoutLogin>
            <Container sx={{width: {xs: '75vw', sm: '50vw'}}}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography gutterBottom variant="h2" component="div" >
                            {loading?
                                <Skeleton variant="rounded" width={'30%'} /> 
                                : team.name}
                        </Typography>
                        <Divider variant="middle" sx={{my:2}}/>
                        <CardMedia
                            component="img"
                            height={120}
                            // image={`http://localhost:3000/sporthub/api/utils/uploads/${equipo.image !== 'logoEquipo.jpg' ? equipo.image : 'logoEquipo.jpg'}`} 
                            image={URL_SERVER+`/utils/uploads/${team.image !== 'logoEquipo.jpg' ? team.image : 'logoEquipo.jpg'}`} 
                            alt={team.name}
                            sx={{height:'15rem'}}
                        />
                        <Divider variant="middle" sx={{my:2}}/>
                        <Container sx={{display:'flex', flexDirection: 'row', textAlign:'justify', gap:2}}>
                            <Typography variant='h5'> 
                                <strong>Founder:</strong>
                            </Typography>
                            <Typography variant='h6' sx={{color: 'text.secondary'}}> 
                                {team.users?.name || 'Desconocido'}
                            </Typography>
                        </Container>
                        <Divider variant="middle" sx={{my:2}}/>
                        <Container sx={{gap:2}}>
                            <Typography variant='h5'> 
                                <strong>Miembros:</strong>
                            </Typography>
                            <List>
                            {team?.miembro_equipos?.length > 0 ? (
                                team.miembro_equipos.map((miembro) => (
                                    <ListItemText key={miembro.user_miembro} sx={{textAlign:'center'}}>
                                        {miembro.user_miembro}
                                    </ListItemText>
                                ))
                            ) : (
                                <ListItem sx={{textAlign:'center'}}>
                                    <ListItemText>No hay miembros para mostrar.</ListItemText>
                                </ListItem>
                            )}
                            </List>
                        </Container>
                    </CardContent>
                    <CardActions>
                        <Button variant="contained" size="small" href={`/team/${teamName}/${team.id}/edit`}>Edit Team</Button>
                    </CardActions>
                </Card>
            </Container>
        </LayoutLogin>
    );
};