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
    Stack,
    TextField ,
    Autocomplete,
    Fab  
} from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import AddIcon from '@mui/icons-material/Add';

import axiosInstance from "../../../services/axiosConfig.js";
import { useAuth } from '../../../services/AuthContext'; //  AuthContext
import { Link } from 'react-router-dom';

import LayoutLogin from '../../LayoutLogin.jsx';

export default function IndexTournaments() {
    const [torneos, setTorneos] = React.useState([]);
    const { user, loading, setLoading } = useAuth(); // Accede al usuario autenticado 
    const [view, setView] = React.useState('list');

    const handleChange = (event, nextView) => {
        setView(nextView);
    };
    const [inputValue, setInputValue] = React.useState('');

    React.useEffect(() => { // Hace la solicitud al cargar la vista <-
        const fetchTorneos = async () => {
            await axiosInstance.get(`/torneos/${user.userId}`)
                .then((response) => {
                    setTimeout(() => {
                        setLoading(false); // Cambia el estado para simular que la carga ha terminado
                      }, 1500); // Simula 3 segundos de carga
                    setTorneos(response.data);
                })
                .catch((error) => {
                    console.error("Error al obtener los torneos:", error);
                })
        };
        fetchTorneos();
    }, [user.userId]);

    return (
        <LayoutLogin>
            <Typography variant='h2' sx={{ mb: 2 }}> {loading ? <Skeleton variant="rounded" width={'60%'} /> : `Welcome ${user.userName || 'invitado'} to you tournaments!`} </Typography>
            {loading? 
                <Box>
                    <Skeleton variant="rounded" width={'50%'} height={40} sx={{my: 2}} />
                    <Skeleton variant="circular" width={50} height={50} sx={{position: 'fixed', bottom: '3%', right: '3%'}}/>
                </Box>
            :
                <Box>
                    <Autocomplete
                        freeSolo
                        id="search-tournaments"
                        disableClearable
                        options={torneos.map((option) => option.name)}
                        sx={{width:'50%', my: 3}}
                        inputValue={inputValue}
                        onInputChange={(event, newInputValue) => {
                            setInputValue(newInputValue);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search"
                                slotProps={{
                                input: {
                                    ...params.InputProps,
                                    type: 'search',
                                    },
                                }}
                            />
                        )}
                    />

                    <Fab color="primary" aria-label="add" size='medium' href='/torneo/create' sx={{position: 'fixed', bottom: '3%', right: '3%'}}>
                        <AddIcon />
                    </Fab>
                </Box>
            }

            <Box sx={{ width: '100%', height: 'auto' }}>
                {loading ? <Skeleton variant="rounded" width={'100%'} height={370} /> :
                    <Stack 
                        spacing={{ xs: 1, sm: 1.5 }}
                        direction="row"
                        useFlexGap
                        sx={{ flexWrap: 'wrap' }}
                    >
                        {torneos.length > 0 ? (
                            torneos.map((torneo) => {
                                return (
                                <Card variant="outlined" key={torneo.id} sx={{p:1}}>
                                    <CardActionArea sx={{p:'6%', height:'100%'}}>
                                        <Typography gutterBottom variant="h5" component="div">
                                            <strong>{torneo.name}</strong>
                                        </Typography>
                                        <Typography><strong>Ubicación:</strong> {torneo.ubicacion}</Typography>
                                        <Typography><strong>Descripción:</strong> {torneo.descripcion}</Typography>
                                        <Typography><strong>Fecha Inicio:</strong> {new Date(torneo.fechaInicio).toLocaleDateString()}</Typography>
                                        <Typography><strong>Fecha Fin:</strong> {new Date(torneo.fechaFin).toLocaleDateString()}</Typography>
                                    </CardActionArea>
                                    {/* <CardActions>
                                        <Button size="small" href={`/torneo/${torneo.name}/${torneo.id}`}>See</Button>
                                    </CardActions> */}
                                </Card>
                                );
                            }))
                            : (
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            No tienes ningun torneo registrado aun.
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