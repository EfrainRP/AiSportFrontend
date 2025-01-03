import React from 'react';
import {
    Typography,
    Skeleton,
    Box,
    Card,
    CardActions,
    CardContent,
    ToggleButton,
    ToggleButtonGroup, 
    Button, 
    Stack
} from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';

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
            <ToggleButtonGroup
                orientation="horizontal"
                value={view}
                exclusive
                onChange={handleChange}
                >
                <ToggleButton value="list" aria-label="list">
                    <ViewListIcon />
                </ToggleButton>
                <ToggleButton value="module" aria-label="module">
                    <ViewModuleIcon />
                </ToggleButton>
            </ToggleButtonGroup>

            <Typography variant='h2' sx={{ mb: 2 }}> {loading ? <Skeleton /> : `Welcome ${user.userName || 'invitado'} to you tournaments!`} </Typography>
            <h2><Link to="/torneo/create">Crear Torneo</Link></h2>
            <Box sx={{ width: '100%', height: 'auto', mx: 2 }}>
                {loading ? <Skeleton /> :
                    <Stack 
                        spacing={{ xs: 1, sm: 2 }}
                        direction="row"
                        useFlexGap
                        sx={{ flexWrap: 'wrap' }}
                    >
                        {torneos.length > 0 ? (
                            torneos.map((torneo) => {
                                return <Card variant="outlined" key={torneo.id}>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                        {torneo.name}
                                        </Typography>
                                        <Typography>Ubicación: {torneo.ubicacion}</Typography>
                                        <Typography>Descripción: {torneo.descripcion}</Typography>
                                        <Typography>Fecha Inicio: {new Date(torneo.fechaInicio).toLocaleDateString()}</Typography>
                                        <Typography>Fecha Fin: {new Date(torneo.fechaFin).toLocaleDateString()}</Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" href={`/torneo/${torneo.name}/${torneo.id}`}>See</Button>
                                    </CardActions>
                                </Card>
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
                    </Stack>}
            </Box>
        </LayoutLogin>
    );
};