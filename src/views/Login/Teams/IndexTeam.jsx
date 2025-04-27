import React from 'react';
import {
    Typography,
    Skeleton,
    Box,
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    IconButton,
    Stack,
    Container,
    Grid,
    Chip,
    Pagination
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import WelcomeSection from '../../../components/Login/UserWelcome.jsx';
import axiosInstance from "../../../services/axiosConfig.js";
import { useAuth } from '../../../services/AuthContext.jsx'; //  AuthContext
import LayoutLogin from '../../LayoutLogin.jsx';
import LoadingCard from '../../../components/Login/LodingCard.jsx';
import Search from '../../../components/Login/Search.jsx';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server
const centerJustify = {display: 'flex', justifyContent: 'center'};
import SearchIcon from '@mui/icons-material/Search';
import { TextField, InputAdornment } from '@mui/material';
import Groups from '@mui/icons-material/Groups';
export default function IndexTeam() {
    const [teams, setTeams] = React.useState([]);
    const { user, loading, setLoading } = useAuth(); // Accede al usuario autenticado 
    const [selectedTeam, setSelectedTeam] = React.useState(null); // Estado para almacenar el searchTeam
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(8); 
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
            <WelcomeSection 
                user={user} 
                loading={loading} 
                subtitle="To your Teams!" 
                description="All your teams in one beautiful dashboard." 
                />
             {loading ? (
                 <Skeleton variant="rounded" width={'5%'} height={40} sx={{ my: 3 }} />
                ) : (
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
                        <GroupAddIcon fontSize="inherit" />
                        </IconButton>

                    
                    <Search 
                      myOptions={teams} 
                      myValue={selectedTeam}
                      onChange={(e, newValue) => setSelectedTeam(newValue || null)}
                      isOptionEqualToValue={(option, value) => option.name === value.name}
                      myLabel={'Search Team'}
                      urlOnwer={'team'}
                      sx={{ flexGrow: 1, maxWidth: 500 }}
                    />
                  </Container>
                )}  
              
                <Box sx={{ width: '100%', height: 'auto', my: 3 }}>
                  {loading ? (
                    <Skeleton variant="rounded" width={'95%'} height={350} />
                  ) : (
                    <>
                      <Grid container spacing={3}>
                        {teams.length > 0 ? (
                          teams.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((team) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={team.id}>
                              <Card 
                                variant="outlined" 
                                sx={{
                                  height: '100%',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: 3,
                                    borderColor: 'primary.main'
                                  }
                                }}
                              >
                                <CardActionArea 
                                  href={`/team/${team.name}/${team.id}`} 
                                  sx={{
                                    p: 2,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                  }}
                                >
                                  <Box sx={{
                                    position: 'relative',
                                    width: '100%',
                                    pt: '100%', // Mantener relación de aspecto 1:1
                                    mb: 2,
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    backgroundColor: 'background.paper'
                                  }}>
                                    <CardMedia
                                      component="img"
                                      crossOrigin="use-credentials"
                                      image={`${URL_SERVER}/utils/uploads/${team && team.image !== 'logoEquipo.jpg' ? team.image : 'logoEquipo.jpg'}`}
                                      alt={team.name}
                                      sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        p: 2
                                      }}
                                    />
                                  </Box>
                                  
                                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                    <Typography 
                                      gutterBottom 
                                      variant="h6" 
                                      component="div"
                                      sx={{
                                        fontWeight: 700,
                                        color: 'text.primary',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                      }}
                                    > <Groups
                                            sx={(theme) => ({
                                              mr: 1.5,
                                              verticalAlign: 'middle',
                                              fontSize: '2.5rem',
                                              color:
                                                theme.palette.mode === 'light'
                                                  ? theme.palette.secondary.dark
                                                  : theme.palette.primary.light
                                            })}
                                      />
                                      {team.name}
                                    </Typography>
                                    
                                    <Chip
                                      label="View Details"
                                      size="small"
                                      sx={{
                                        mt: 1,
                                        fontWeight: 600,
                                        backgroundColor: 'primary.light',
                                        color: 'primary.contrastText'
                                      }}
                                    />
                                  </CardContent>
                                </CardActionArea>
                              </Card>
                            </Grid>
                          ))
                        ) : (
                          <Grid item xs={12}>
                            <LoadingCard message={"You don't have any teams registered yet."} />
                          </Grid>
                        )}
                      </Grid>
              
                      {teams.length > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                          <Pagination
                            count={Math.ceil(teams.length / rowsPerPage)}
                            page={page + 1}
                            onChange={(event, value) => setPage(value - 1)}
                            color="primary"
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