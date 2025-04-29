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
    Divider,
    Grid,
    Chip,
    Pagination
} from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import WelcomeSection from '../../../components/Login/UserWelcome.jsx'; 
import axiosInstance from "../../../services/axiosConfig.js";
import { useAuth } from '../../../services/AuthContext'; //  AuthContext
import { Link } from 'react-router-dom';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PlaceIcon from '@mui/icons-material/Place';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import LayoutLogin from '../../LayoutLogin.jsx';
import Search from '../../../components/Login/Search.jsx';
import LoadingCard from '../../../components/Login/LodingCard.jsx';

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
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(8); // 8 torneos por página
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
            <WelcomeSection 
                user={user} 
                loading={loading} 
                subtitle="To your Tournaments!" 
                description="All your tournaments in one beautiful dashboard." 
                iconName="EmojiEventsIcon"
                />
            {loading?
                <Skeleton variant="rounded" width={'5%'} height={40} sx={{my: 3}} /> 
            :
            <Container sx={{
                display: 'flex',
                alignItems: 'center',
                ml: 0,
                mt: 3,
                mb: 2,
                gap: 2
              }}>
               <IconButton
                    component="a"
                    href="/team/create"
                    sx={(theme) => ({
                        backgroundColor: 'primary.dark',
                        color: 'white',
                        paddingX: 5, // Espaciado horizontal para que no esté todo apretado
                        height: 50, // Altura suficiente
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '12px',
                        fontSize: '1.5rem',
                        gap: 1, // Espacio entre íconos y texto
                        '&:hover': {
                        backgroundColor: 'primary.main',
                        transform: 'scale(1.05)',
                        },
                        transition: 'all 0.3s ease',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
                        ...theme.applyStyles('dark', {
                        backgroundColor: 'primary.main',
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                            transform: 'scale(1.15)',
                        },
                        }),
                    })}
                    >
                    <AddIcon fontSize="inherit" />
                    <EmojiEventsIcon fontSize="inherit" />
                    </IconButton>
                    <Search myOptions={tournaments} myValue={selectedTournament} /*Se renderizara el buscador, si se cargo los datos correctamente*/
                        onChange={(e, newValue) => {
                            setSelectedTournament(newValue || null);
                        }}
                        isOptionEqualToValue = {(option, value) => option.name === value.name}
                        myLabel={'Search Tournament'}
                        urlOnwer={'tournament'}/>
                </Container>
            }   
            {/* Tournaments Grid */}
          <Box sx={{ width: '100%', my: 3 }}>
            {loading ? (
              <Skeleton variant="rounded" width={'95%'} height={350} />
            ) : (
              <>
                <Grid container spacing={3}>
                  {tournaments.length > 0 ? (
                    tournaments
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((tournament) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={tournament.id}>
                          <Card
                              variant="outlined"
                              sx={(theme) => ({
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: theme.palette.mode === 'dark'
                                  ? theme.palette.background.paper
                                  : theme.palette.background.paper,
                                borderColor: theme.palette.mode === 'dark'
                                  ? theme.palette.primary.dark
                                  : theme.palette.text.primary,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-5px)',
                                  boxShadow: theme.palette.mode === 'dark' ? 6 : 6,
                                  borderColor: theme.palette.mode === 'dark'
                                  ? theme.palette.primary.main
                                  : theme.palette.secondary.dark,
                                  backgroundColor: theme.palette.mode === 'dark'
                                    ? theme.palette.action.hover
                                    : theme.palette.secondary.hover
                                }
                              })}
                            >
                            <CardActionArea 
                              href={`/tournament/${tournament.name}/${tournament.id}`}
                              sx={{
                                height: '100%',
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column'
                              }}
                            >
                              <Typography 
                                variant="h5" 
                                component="div"
                                sx={{
                                  fontWeight: 700,
                                  color: 'text.primary',
                                  textAlign: 'center',
                                  mb: 2,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              > <EmojiEventsIcon 
                                    sx={(theme) => ({
                                    mr: 1.5,
                                    verticalAlign: 'middle',
                                    fontSize: '2.5rem',
                                    color:
                                        theme.palette.mode === 'light'
                                        ? theme.palette.warning.light
                                        : theme.palette.primary.main
                                    })}
                                />
                                {tournament.name}
                              </Typography>

                              <Divider sx={{ my: 1 }} />

                              <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PlaceIcon
                                  sx={(theme) => ({
                                    mr: 1,
                                    fontSize: 20,
                                    color: theme.palette.mode === 'dark'
                                      ? theme.palette.secondary.light
                                      : theme.palette.secondary.dark
                                  })}
                                />
                                 <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                    {tournament.ubicacion}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <EventAvailableIcon
                                  sx={(theme) => ({
                                    mr: 1,
                                    fontSize: 20,
                                    color: theme.palette.mode === 'dark'
                                      ? theme.palette.success.light
                                      : theme.palette.success.dark
                                  })}
                                />

                                  <Typography
                                      variant="body2"
                                      sx={(theme) => ({
                                        color: theme.palette.mode === 'dark'
                                          ? theme.palette.text.secondary
                                          : theme.palette.success.dark
                                      })}
                                    >
                                    {new Date(tournament.fechaInicio).toLocaleDateString()}
                                  </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <EventBusyIcon
                                  sx={(theme) => ({
                                    mr: 1,
                                    fontSize: 20,
                                    color: theme.palette.mode === 'dark'
                                      ? theme.palette.primary.light
                                      : theme.palette.error.dark
                                  })}
                                />
                                  <Typography
                                    variant="body2"
                                    sx={(theme) => ({
                                      color: theme.palette.mode === 'dark'
                                        ? theme.palette.primary.light
                                        : theme.palette.error.dark
                                    })}
                                  >
                                    {new Date(tournament.fechaFin).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Box>

                              <Box sx={{ 
                                flexGrow: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end'
                              }}>
                                <Typography 
                                  variant="body2"
                                  sx={{
                                    color: 'text.primary',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    mb: 2
                                  }}
                                >
                                  {tournament.descripcion}
                                </Typography>

                                <Chip 
                                  label="View Details" 
                                  size="small" 
                                  sx={(theme) => ({
                                    fontWeight: 600,
                                    bgcolor: theme.palette.background.paper, 
                                    color: theme.palette.primary.main,
                                    border: `1px solid ${theme.palette.primary.dark}`, // << Añadido borde azul fuerte
                                    '&:hover': {
                                      bgcolor: theme.palette.mode === 'dark'
                                      ? theme.palette.secondary.dark
                                      : theme.palette.primary.light,
                                      borderColor: theme.palette.text.primary, // Cambia el borde al hacer hover
                                    },
                                    transition: 'all 0.3s ease'
                                  })} 
                                />
                              </Box>
                            </CardActionArea>
                          </Card>
                        </Grid>
                      ))
                  ) : (
                    <Grid item xs={12}>
                      <LoadingCard message={"You don't have any tournaments registered yet."} />
                    </Grid>
                  )}
                </Grid>

                {/* Pagination */}
                {tournaments.length > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={Math.ceil(tournaments.length / rowsPerPage)}
                      page={page + 1}
                      onChange={(event, value) => setPage(value - 1)}
                      color="secondary"
                      size="large"
                      showFirstButton
                      showLastButton
                      sx={{
                        '& .MuiPaginationItem-root': {
                          fontSize: '1rem',
                          fontWeight: 600
                        }
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        </LayoutLogin>
    );
};