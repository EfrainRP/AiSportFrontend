import React from 'react';
import {
    Typography,
    Skeleton,
    Box,
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    Fab,
    Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import axiosInstance from "../../../services/axiosConfig.js";
import { useAuth } from '../../../services/AuthContext.jsx'; //  AuthContext
import LayoutLogin from '../../LayoutLogin.jsx';

const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server
const centerJustify = {display: 'flex', justifyContent: 'center'};

export default function IndexTeam() {
    const [teams, setTeams] = React.useState([]);
    const { user, loading, setLoading } = useAuth(); // Accede al usuario autenticado 

    React.useEffect(() => { // Hace la solicitud al cargar la vista <-
        const fetchTeams = async () => {
            await axiosInstance.get(`/equipos/${user.userId}`)
                .then((response) => {
                    setTimeout(() => {
                        setLoading(false); // Cambia el estado para simular que la carga ha terminado
                      }, 1500); // Simula tiempo de carga
                    setTeams(response.data);
                })
                .catch((error) => {
                    console.error("Error al obtener los equipos:", error);
                    setLoading(false); // Cambiar el estado de carga incluso en caso de error
                })
        };
        fetchTeams();
    }, [user.userId]);

    return (
        <LayoutLogin>
            <Typography variant='h2'> {loading ? <Skeleton variant="rounded" width={'30%'} /> : `Welcome admin: ${user.userName.toUpperCase() || 'invitado'}`} </Typography>
            <Typography variant='h3' sx={{ mb: 2, ml:10 }}> {loading ? <Skeleton variant="rounded" width={'20%'} sx={{my: 2}}/> : 'to your teams !'} </Typography>
            <Typography variant='subtitle2' sx={{ mt:3 }}>
                {loading ? 
                    <Skeleton variant="rounded" width={'31%'}/> 
                    : 
                    'Here you can management your tournaments and consult your information.'
                }
            </Typography>
            {loading?
                <Skeleton variant="rounded" width={'5%'} height={40} sx={{my: 3}} /> 
            :
                <Fab  href='/team/create' variant="extended" color='info' sx={{color:'white', my: 3}}><AddIcon/> Add</Fab>
            }  
            <Box sx={{ ...centerJustify, width: '100%', height: 'auto', alignItems: 'center'}}>
                {loading ? 
                    <Skeleton variant="rounded" width={'95%'} height={350} /> 
                :
                    <Stack 
                        spacing={{ xs: 1, sm: 1.5 }}
                        direction="row"
                        useFlexGap
                        sx={{ flexWrap: 'wrap'}}
                    >
                        {teams.length > 0 ? (
                            teams.map((team) => {
                                return (
                                <Card variant="outlined" key={team.id} sx={{p:0}}>
                                    <CardActionArea href={`/team/${team.name}/${team.id}`} sx={{p:2}}>
                                        <CardMedia
                                            component="img"
                                            height={120}
                                            // image={`http://localhost:3000/aiSport/api/utils/uploads/${team.image !== 'logoEquipo.jpg' ? team.image : 'logoEquipo.jpg'}`} 
                                            image={URL_SERVER+`/utils/uploads/${team.image !== 'logoEquipo.jpg' ? team.image : 'logoEquipo.jpg'}`} 
                                            alt={team.name}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="span" color='secondary' sx={{...centerJustify, mt:1}}>
                                                <strong>{team.name}</strong>
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                                );
                            }))
                            : (
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography gutterBottom variant="subtitle2" component="div">
                                            You don't have any tournaments registered yet.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )}
                    </Stack>
                }
            </Box>
        </LayoutLogin>
    );
};