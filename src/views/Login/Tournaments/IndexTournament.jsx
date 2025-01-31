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
import { useAuth } from '../../../services/AuthContext'; //  AuthContext
import { Link } from 'react-router-dom';

import LayoutLogin from '../../LayoutLogin.jsx';

const centerJustify = {display:'flex', flexDirection: 'row', textAlign:'justify'};

export default function IndexTournaments() {
    const [torneos, setTorneos] = React.useState([]);
    const { user, loading, setLoading } = useAuth(); // Accede al usuario autenticado 
    const [view, setView] = React.useState('list');
    const [openSearch, setSearch] = React.useState(false);
    const handleChange = (event, nextView) => {
        setView(nextView);
    };
    const [inputValue, setInputValue] = React.useState('');
    const toggleSearch = (flag) => { setSearch(!openSearch);};
    React.useEffect(() => { // Hace la solicitud al cargar la vista <-
        const fetchTorneos = async () => {
            await axiosInstance.get(`/torneos/${user.userId}`)
                .then((response) => {
                    setTimeout(() => {
                        setLoading(false); // Cambia el estado para simular que la carga ha terminado
                    }, 1500); // Simula tiempo de carga
                    setTorneos(response.data);
                })
                .catch((error) => {
                    console.error("Error al obtener los torneos:", error);
                    setLoading(false); // Cambiar el estado de carga incluso en caso de error
                })
        };
        fetchTorneos();
    }, [user.userId]);

    return (
        <LayoutLogin>
            <Typography variant='h2'> {loading ? <Skeleton variant="rounded" width={'30%'} /> : `Welcome admin: ${user.userName.toUpperCase() || 'invitado'}`} </Typography>
            <Typography variant='h3' sx={{ mb: 2, ml:10 }}> {loading ? <Skeleton variant="rounded" width={'20%'} sx={{my: 2}}/> : 'to your tournaments !'} </Typography>
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
                <Fab href='/tournament/create' variant="extended" color='info' sx={{color:'white', my: 3}}> <AddIcon/> Add </Fab>
            }  
                {/* <Stack direction={'row'} sx={{my:2}}> */}
                    {/* <Button variant="contained" color='info' sx={{color:'white'}} startIcon={<SearchIcon/>} onClick={toggleSearch}> Search </Button>
                    <Grow  in={openSearch}>
                    <Autocomplete
                        freeSolo
                        id="search-tournaments"
                        disableClearable
                        options={torneos.map((option) => option.name)}
                        sx={{width:'50%'}}
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
                    </Grow  > */}
                {/* </Stack> */}
            
            
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
                        {torneos.length > 0 ? (
                            torneos.map((torneo) => {
                                return (
                                <Card variant="outlined" key={torneo.id} sx={{p:0, width:'23%'}}>
                                    <CardActionArea href={`/tournament/${torneo.name}/${torneo.id}`} sx={{p:2}}>
                                        <Typography gutterBottom variant="h5" component="div" color='success.main' sx={{display: 'flex', justifyContent:'center'}}>
                                            <strong>{torneo.name}</strong>
                                        </Typography>
                                        <Typography sx={centerJustify}>
                                            <Typography variant='subtitle2' color='primary' sx={{mr:2}}>
                                                <strong>Location:</strong>
                                            </Typography >
                                            {torneo.ubicacion}
                                        </Typography >
                                        <Typography sx={centerJustify}>
                                            <Typography variant='subtitle2' color='primary' sx={{mr:2}}>
                                                <strong>Description:</strong>
                                            </Typography >
                                            {torneo.descripcion}
                                        </Typography >
                                        <Typography sx={centerJustify}>
                                            <Typography variant='subtitle2' color='primary' sx={{mr:2}}>
                                                <strong>Start date:</strong>
                                            </Typography >
                                            {new Date(torneo.fechaInicio).toLocaleDateString()}
                                        </Typography >
                                        <Typography sx={centerJustify}>
                                            <Typography variant='subtitle2' color='primary' sx={{mr:2}}>
                                                <strong>End date:</strong>
                                            </Typography >
                                            {new Date(torneo.fechaFin).toLocaleDateString()}
                                        </Typography >
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