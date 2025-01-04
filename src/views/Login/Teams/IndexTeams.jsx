import React from 'react';
import {
    Typography,
    Skeleton,
    Box,
    Card,
    CardMedia,
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
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

import axiosInstance from "../../../services/axiosConfig.js";
import { useAuth } from '../../../services/AuthContext.jsx'; //  AuthContext
import { Link } from 'react-router-dom';

import LayoutLogin from '../../LayoutLogin.jsx';

const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server

export default function IndexTeams() {
    const [equipos, setEquipos] = React.useState([]);
    const { user, loading, setLoading } = useAuth(); // Accede al usuario autenticado 

    const [openSearch, setSearch] = React.useState(false);
    const handleChange = (event, nextView) => {
        setView(nextView);
    };
    const [inputValue, setInputValue] = React.useState('');
    const toggleSearch = (flag) => { setSearch(!openSearch);};
    React.useEffect(() => { // Hace la solicitud al cargar la vista <-
        const fetchEquipos = async () => {
            await axiosInstance.get(`/equipos/${user.userId}`)
                .then((response) => {
                    setTimeout(() => {
                        setLoading(false); // Cambia el estado para simular que la carga ha terminado
                      }, 1500); // Simula 3 segundos de carga
                    setEquipos(response.data);
                })
                .catch((error) => {
                    console.error("Error al obtener los equipos:", error);
                })
        };
        fetchEquipos();
    }, [user.userId]);

    return (
        <LayoutLogin>
            <Typography variant='h2'> {loading ? <Skeleton variant="rounded" width={'30%'} /> : `Welcome ${user.userName || 'invitado'}`} </Typography>
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
            <Box sx={{ width: '100%', height: 'auto'}}>
                {loading ? 
                    <Skeleton variant="rounded" width={'100%'} height={350} /> 
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
                                        <CardContent sx={{mt:1, display: 'flex', justifyContent: 'center'}}>
                                            <Typography gutterBottom variant="h5" component="span">
                                                <strong>{equipo.name}</strong>
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    {/* <CardActions>
                                        <Button size="small" href={`/team/${equipo.name}/${equipo.id}`}>See</Button>
                                    </CardActions> */}
                                </Card>
                                );
                            }))
                            : (
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
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