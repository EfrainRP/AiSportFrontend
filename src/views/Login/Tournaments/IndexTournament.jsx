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
    Container, 
    Divider 
} from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

import axiosInstance from "../../../services/axiosConfig.js";
import { useAuth } from '../../../services/AuthContext'; //  AuthContext
import { Link } from 'react-router-dom';

import LayoutLogin from '../../LayoutLogin.jsx';
import Search from '../../../components/Login/Search.jsx';

const centerJustify = {display:'flex', alignContent:'center', textAlign:'justify', justifyContent:'space-evenly'};

export default function IndexTournaments() {
    const [tournaments, setTorneos] = React.useState([]);
    const { user, loading, setLoading } = useAuth(); // Accede al usuario autenticado 
    const [view, setView] = React.useState('list');
    const [openSearch, setSearch] = React.useState(false);
    const handleChange = (event, nextView) => {
        setView(nextView);
    };
    const [inputValue, setInputValue] = React.useState('');
    const toggleSearch = (flag) => { setSearch(!openSearch);};

    const [selectedTournament, setSelectedTournament] = React.useState(null); // Estado para almacenar el searchTournament
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
                    console.error("Error loading tournaments:", error);
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
                <Container sx={{display:'flex', justifyContent: 'flex-start', alignContent:'center', ml:0, mt: 3, mb:2,}}>
                    <IconButton  component="a" href='/tournament/create' 
                    sx={(theme)=>({
                        mt: 1.5,
                        backgroundColor: 'primary.dark',
                        color:'white',
                        '&:hover': { backgroundColor: 'primary.main' },
                        ...theme.applyStyles('dark', {
                            backgroundColor: 'primary.main',
                            '&:hover': { backgroundColor: 'primary.dark' },
                        }),
                    })}>
                        <AddIcon/>
                    </IconButton>
                    <Search myOptions={tournaments} myValue={selectedTournament} /*Se renderizara el buscador, si se cargo los datos correctamente*/
                        onChange={(e, newValue) => {
                            setSelectedTournament(newValue || null);
                        }}
                        isOptionEqualToValue = {(option, value) => option.name === value.name}
                        myLabel={'Search Tournament'}
                        toUrl={'tournament'}/>
                </Container>
            }   
                {/* <Stack direction={'row'} sx={{my:2}}> */}
                    {/* <Button variant="contained" color='info' sx={{color:'white'}} startIcon={<SearchIcon/>} onClick={toggleSearch}> Search </Button>
                    <Grow  in={openSearch}>
                    <Autocomplete
                        freeSolo
                        id="search-tournaments"
                        disableClearable
                        options={tournaments.map((option) => option.name)}
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
                        {tournaments.length > 0 ? (
                            tournaments.map((tournament) => {
                                return (
                                <Card variant="outlined" key={tournament.id} sx={{p:0}}>
                                    <CardActionArea href={`/tournament/${tournament.name}/${tournament.id}`} sx={{p:2}}>
                                        <Typography gutterBottom variant="h5" component="div" color='secondary' sx={{display: 'flex', justifyContent:'center'}}>
                                            <strong>{tournament.name}</strong>
                                        </Typography>

                                        <Divider sx={{my:1}}/>

                                        <Container sx={centerJustify}>
                                            <Typography variant='subtitle2' color='primary'> 
                                            <strong>Location: </strong>
                                            </Typography>
                                            <Typography sx={{color: 'text.data'}}> 
                                            {tournament.ubicacion}
                                            </Typography>
                                        </Container>
                    
                                        <Container sx={centerJustify}>
                                            <Typography variant='subtitle2' color='primary'> 
                                            <strong>Start date: </strong>
                                            </Typography>
                                            <Typography sx={{color: 'text.data'}}> 
                                            {new Date(tournament.fechaInicio).toLocaleDateString()}
                                            </Typography>
                                        </Container>
                                        
                                        <Container sx={centerJustify}>
                                            <Typography variant='subtitle2' color='primary'> 
                                            <strong>End date: </strong>
                                            </Typography>
                                            <Typography sx={{color: 'text.data'}}> 
                                            {new Date(tournament.fechaFin).toLocaleDateString()}
                                            </Typography>
                                        </Container>
                                        
                                        <Container sx={centerJustify}>
                                            <Typography variant='subtitle2' color='primary' sx={{mr:2}}> 
                                            <strong>Description: </strong>
                                            </Typography>
                                            <Typography sx={{color: 'text.data'}}> 
                                            {tournament.descripcion}
                                            </Typography>
                                        </Container>
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