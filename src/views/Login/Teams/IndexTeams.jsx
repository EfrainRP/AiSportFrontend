import React from 'react';
import {
    Typography,
    Skeleton,
    Box,
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    Button,
    Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import axiosInstance from "../../../services/axiosConfig.js";
import { useAuth } from '../../../services/AuthContext.jsx'; //  AuthContext
import LayoutLogin from '../../LayoutLogin.jsx';

const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server

export default function IndexTeams() {
    const [equipos, setEquipos] = React.useState([]);
    const { user, loading, setLoading } = useAuth(); // Accede al usuario autenticado 

    React.useEffect(() => { // Hace la solicitud al cargar la vista <-
        const fetchEquipos = async () => {
            await axiosInstance.get(`/equipos/${user.userId}`)
                .then((response) => {
                    setTimeout(() => {
                        setLoading(false); // Cambia el estado para simular que la carga ha terminado
                      }, 1500); // Simula tiempo de carga
                    setEquipos(response.data);
                })
                .catch((error) => {
                    console.error("Error al obtener los equipos:", error);
                    setLoading(false); // Cambiar el estado de carga incluso en caso de error
                })
        };
        fetchEquipos();
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
                <Button href='/team/create' variant="contained" color='info' sx={{color:'white', my: 3}} startIcon={<AddIcon/>}> Add </Button>
            }  
            <Box sx={{ width: '100%', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                {loading ? 
                    <Skeleton variant="rounded" width={'95%'} height={350} /> 
                :
                    <Stack 
                        spacing={{ xs: 1, sm: 1.5 }}
                        direction="row"
                        useFlexGap
                        sx={{ flexWrap: 'wrap'}}
                    >
                        {equipos.length > 0 ? (
                            equipos.map((equipo) => {
                                return (
                                <Card variant="outlined" key={equipo.id} sx={{p:0}}>
                                    <CardActionArea href={`/team/${equipo.name}/${equipo.id}`} sx={{p:2}}>
                                        <CardMedia
                                            component="img"
                                            height={120}
                                            // image={`http://localhost:3000/sporthub/api/utils/uploads/${equipo.image !== 'logoEquipo.jpg' ? equipo.image : 'logoEquipo.jpg'}`} 
                                            image={URL_SERVER+`/utils/uploads/${equipo.image !== 'logoEquipo.jpg' ? equipo.image : 'logoEquipo.jpg'}`} 
                                            alt={equipo.name}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="span" sx={{mt:1, display: 'flex', justifyContent: 'center'}}>
                                                <strong>{equipo.name}</strong>
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