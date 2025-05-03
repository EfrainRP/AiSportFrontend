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
    Pagination, alpha, Avatar, useTheme
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
    console.log(teams[0]);
    return (
        <LayoutLogin>
            <WelcomeSection 
                user={user} 
                loading={loading} 
                subtitle="To your Teams!" 
                description="All your teams in one beautiful dashboard." 
                iconName="GroupsIcon"
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
                            boxShadow: '0px 4px 10px rgba(248, 242, 242, 0.3)',
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
                                  sx={(theme) => ({
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 2,
                                    transition: 'all 0.3s ease',
                                    background: theme.palette.mode === 'light'
                                      ? alpha(theme.palette.background.paper, 0.8)
                                      : alpha(theme.palette.background.default, 0.7),
                                    boxShadow: theme.shadows[4],
                                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                    '&:hover': {
                                      transform: 'translateY(-5px)',
                                      boxShadow: theme.shadows[8],
                                      borderColor: theme.palette.primary.main
                                    }
                                  })}
                                >
                                  <CardActionArea 
                                    href={`/team/${team.name}/${team.id}`} 
                                    sx={{
                                      p: 3,
                                      height: '100%',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center'
                                    }}
                                  >
                                      <Avatar
                                        src={`${URL_SERVER}/utils/uploads/${team && team.image !== 'logoEquipo.jpg' ? team.image : 'logoEquipo.jpg'}`}
                                        alt={team.name}
                                        sx={(theme) => ({
                                          width: 120,
                                          height: 120,
                                          mb: 3,
                                          borderRadius: '50%', // <-  Avatar circular
                                          border: `3px solid ${theme.palette.mode === 'dark'
                                            ? theme.palette.primary.light
                                            : theme.palette.primary.main}`,
                                          backgroundColor: 'transparent',
                                          '& .MuiAvatar-img': {
                                            objectFit: 'cover', // <- Mejor "cover" para que rellene bien el círculo
                                            borderRadius: '50%' 
                                          },
                                          '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: theme.shadows[4]
                                          },
                                          transition: 'all 0.3s ease'
                                        })}
                                      />
                                                  
                                    <CardContent sx={{ 
                                      flexGrow: 1, 
                                      textAlign: 'center',
                                      px: 0,
                                      width: '100%'
                                    }}>
                                      <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2
                                      }}>
                                        <Groups
                                          sx={(theme) => ({
                                            mr: 1.5,
                                            fontSize: '2rem',
                                            color: theme.palette.mode === 'light'
                                              ? theme.palette.secondary.dark
                                              : theme.palette.secondary.main
                                          })}
                                        />
                                        <Typography 
                                          variant="h6" 
                                          component="div"
                                          sx={(theme) => ({
                                            fontWeight: 700,
                                            color: theme.palette.mode === 'light'
                                              ? theme.palette.primary.dark
                                              : theme.palette.primary.light,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                          })}
                                        >
                                          {team.name}
                                        </Typography>
                                      </Box>
                                      
                                      <Box sx={(theme) => ({
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2,
                                        color: theme.palette.mode === 'light'
                                          ? theme.palette.text.secondary
                                          : theme.palette.text.primary
                                      })}>
                                        
                                      </Box>
                                      
                                      <Chip 
                                        label="Team Profile" 
                                        size="medium"
                                        sx={(theme) => ({
                                          mt: 1,
                                          fontWeight: 600,
                                          bgcolor: alpha(theme.palette.background.paper, 0.3),
                                          color: theme.palette.primary.main,
                                          border: `1px solid ${theme.palette.primary.dark}`,
                                          '&:hover': {
                                            bgcolor: alpha(theme.palette.primary.light, 0.2),
                                            borderColor: theme.palette.text.primary,
                                            transform: 'scale(1.05)'
                                          },
                                          transition: 'all 0.3s ease'
                                        })} 
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