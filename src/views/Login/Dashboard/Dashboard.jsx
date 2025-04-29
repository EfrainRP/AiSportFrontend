import React from 'react';
import {
  Typography,
  Skeleton,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Divider,
  Container,
  Grid,
  Chip,
  Avatar,
  alpha,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { useAuth } from '../../../services/AuthContext.jsx';
import axiosInstance from "../../../services/axiosConfig.js";
import LayoutLogin from '../../LayoutLogin.jsx';
import TrendingUpIcon from '@mui/icons-material/AnalyticsOutlined';
import LoadingCard from '../../../components/Login/LodingCard.jsx';
import Search from '../../../components/Login/Search.jsx';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server
const centerJustify = {display: 'flex', alignContent:'center', textAlign:'justify', justifyContent:'space-evenly'};

const TitleTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.success.dark,
  ...theme.applyStyles('dark', {
    color: theme.palette.warning.light,
  }),
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: 1,
  marginBottom: theme.spacing(3),
  position: 'relative',
  display: 'inline-block',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: '50%',
    height: 4,
    background: theme.palette.mode === 'dark' ? 
      `linear-gradient(to right, ${theme.palette.warning.light}, transparent)` :
      `linear-gradient(to right, ${theme.palette.success.dark}, transparent)`,
    borderRadius: 2
  }
}));

const GradientCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark' ?
    `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)` :
    `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.grey[300], 0.8)} 100%)`,
  borderRadius: 16,
  boxShadow: theme.shadows[4],
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8]
  }
}));

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    partialVisibilityGutter: 40
  },
  tablet: {
    breakpoint: { max: 1024, min: 600 },
    items: 2,
    partialVisibilityGutter: 30
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 1,
    partialVisibilityGutter: 20
  }
};
const columns = [
  { 
    id: 'torneos', 
    extraIndex: 'name', 
    label: '🏆Tournament', 
    align: 'center', 
    minWidth: 120 
  },
  { 
    id: 'torneos', 
    extraIndex: 'ubicacion', 
    label: '📍Location', 
    align: 'center', 
    minWidth: 120 
  },
  { 
    id: 'equipos_partidos_equipoLocal_idToequipos', 
    extraIndex: 'name', 
    label: '🏠Home\u00a0Team', 
    align: 'center', 
    minWidth: 130 
  },
  { 
    id: 'equipos_partidos_equipoVisitante_idToequipos', 
    extraIndex: 'name', 
    label: '🏨Guest\u00a0Team', 
    align: 'center', 
    minWidth: 130 
  },
  {
    id: 'fechaPartido',
    label: '📅Date',
    minWidth: 110,
    align: 'center',
    format: (value) => {
      return new Date(value).toLocaleDateString();
    },
  },
  {
    id: 'horaPartido',
    label: '🕡Time',
    minWidth: 110,
    align: 'center',
    format: (value) => {
      const hour = new Date(value);
      return new Intl.DateTimeFormat("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(hour);
    },
  }
];

export default function Dashboard() {
  const { user, loading, setLoading } = useAuth(); // Accede al usuario autenticado 

  const [data, setData] = React.useState({ torneos: [], equipos: [], proximosPartidos: [] }); // Estado para almacenar torneos y equipos
  const [activeTournamentSlide, setActiveTournamentSlide] = React.useState(0);
  const [activeTeamSlide, setActiveTeamSlide] = React.useState(0);
  const tournamentCarouselRef = React.useRef(null);
  const teamCarouselRef = React.useRef(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const theme = useTheme();
  const [selectedTournament, setSelectedTournament] = React.useState(null); // Estado para almacenar el searchTournament
  const [selectedTeam, setSelectedTeam] = React.useState(null); // Estado para almacenar el searchTeam
  
  const navigate = useNavigate();
  const handleRowClick = (id, name) => {
    navigate(`/dashboard/tournament/${name}/${id}`,{state:1}); // Redirige a la URL deseada, con valor 1 para el tab dashTournament
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Configuración del intervalo para el auto-desplazamiento
  React.useEffect(() => {
    const tournamentInterval = setInterval(() => {
      if (data.torneos.length > 0) {
        setActiveTournamentSlide(prev => (prev + 1) % data.torneos.length);
        if (tournamentCarouselRef.current) {
          tournamentCarouselRef.current.next();
        }
      }
    }, 4000); // 4 segundos

    const teamInterval = setInterval(() => {
      if (data.equipos.length > 0) {
        setActiveTeamSlide(prev => (prev + 1) % data.equipos.length);
        if (teamCarouselRef.current) {
          teamCarouselRef.current.next();
        }
      }
    }, 4500); // 4.5 segundos (ligeramente diferente para no sincronizarse)

    return () => {
      clearInterval(tournamentInterval);
      clearInterval(teamInterval);
    };
  }, [data.torneos.length, data.equipos.length]);
  React.useEffect(() => {
    const fetchData = async () => {
      await axiosInstance.get(`/dashboard/${user.userId}`)
        .then((response) => {
          setTimeout(() => {
            setLoading(false); // Cambia el estado para simular que la carga ha terminado
          }, 1500); // Simula tiempo de carga
          setData(response.data); // Establecer los datos en el estado
          // console.log(response.data);

        }).catch((error) => {
          // console.error('Error al obtener los datos del dashboard:', error);
          setLoading(false); // Cambiar el estado de carga incluso en caso de error
        });
    }
    if (user) {
      fetchData(); // Llamar a la función solo si el usuario está definido
    }
  }, [[user]]);
  return (
    <LayoutLogin>
     {/* Welcome Section */}
        <Box
          sx={(theme) => ({
            mb: 6,
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -16,
              left: 0,
              width: '100%',
              height: 1,
              background: `linear-gradient(to right, transparent, ${alpha(theme.palette.divider, 0.3)}, transparent)`
            }
          })}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box
                sx={(theme) => ({
                  p: 3,
                  borderRadius: 4,
                  background:
                    theme.palette.mode === 'light'
                      ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.info.light, 0.2)} 100%)`
                      : `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.primary.dark, 0.2)} 100%)`,
                  boxShadow: theme.shadows[2]
                })}
              >
                <Typography
                  variant="h4"
                  sx={(theme) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    fontWeight: 800,
                    background:
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(to right, hsl(210, 100%, 70%), hsl(143, 88.70%, 51.40%), gold)'
                        : 'linear-gradient(to right, hsl(219, 77%, 40%), hsl(340, 88.40%, 47.50%), goldenrod)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: 0.5
                  })}
                >
                  {loading ? (
                    <Skeleton variant="rounded" width={'70%'} height={48} />
                  ) : (
                    <>
                      Welcome back
                      <Box
                        component="span"
                        sx={(theme) => ({
                          background: theme.palette.mode === 'dark'
                            ? 'linear-gradient(to right, orange, gold, white)'
                            : 'linear-gradient(to right, dimgray, darkorange)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontWeight: 900
                        })}
                      >
                        {user?.userName?.toUpperCase() || 'GUEST'}
                      </Box>

                      <TrendingUpIcon
                        sx={(theme) => ({
                          fontSize: '2rem',
                          background: theme.palette.mode === 'dark'
                            ? 'linear-gradient(to right, orange, gold, gray)'
                            : 'linear-gradient(to right, darkorange, goldenrod, dimgray)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        })}
                      />

                    </>
                  )}
                </Typography>

                <Typography
                  variant="subtitle1"
                  sx={(theme) => ({
                    mt: 1.5,
                    color: theme.palette.mode === 'dark'
                      ? theme.palette.text.secondary
                      : 'linear-gradient(to right, orange, gold, yellow)',
                    fontWeight: 500,
                    textAlign: 'center',
                    transition: 'color 0.3s ease-in-out' 
                  })}
                >
                  {loading ? (
                    <Skeleton variant="rounded" width="60%" />
                  ) : (
                    'Manage your tournaments, teams and upcoming matches all in one place.'
                  )}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  height: '100%',
                  alignItems: 'center'
                }}
              >
                <Avatar
                  sx={(theme) => ({
                    width: 120,
                    height: 120,
                    bgcolor:
                      theme.palette.mode === 'dark'
                        ? alpha(theme.palette.primary.light, 0.9)
                        : alpha(theme.palette.primary.dark, 0.8),
                    border: `2px solid ${alpha(theme.palette.secondary.dark, 0.3)}`
                  })}
                >
                  <SmartToyOutlinedIcon sx={{ fontSize: 60 }} />
                </Avatar>
              </Box>
            </Grid>
          </Grid>
        </Box>

      {/* Tournaments Section */}
      <Box sx={{ mb: 8 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3
          }}
        >
          <StyledTitle
            variant="h4"
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              fontWeight: 800,
              color: theme.palette.text.primary,
            })}
          >
            <SportsSoccerIcon
              sx={(theme) => ({
                mr: 1.5,
                verticalAlign: 'middle',
                fontSize: '2rem',
                color:
                  theme.palette.mode === 'light'
                    ? theme.palette.warning.dark
                    : theme.palette.primary.main
              })}
            />
            TOURNAMENTS
          </StyledTitle>

          {!loading && data.torneos.length > 0 && (
            <Search
              myOptions={data.torneos}
              myValue={selectedTournament}
              onChange={(e, newValue) => setSelectedTournament(newValue || null)}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              myLabel={'Search Tournament'}
              toUrl={'tournament'}
            />
          )}
        </Box>

        {loading ? (
          <Skeleton variant="rounded" height={240} sx={{ borderRadius: 4 }} />
        ) : (
          <Carousel
            ref={tournamentCarouselRef}
            responsive={responsive}
            slidesToSlide={1}
            partialVisible={true}
            swipeable={true}
            draggable={true}
            containerClass="carousel-container"
            itemClass="carousel-item"
            additionalTransfrom={0}
            arrows
            centerMode={false}
            infinite
            keyBoardControl
            minimumTouchDrag={80}
            renderButtonGroupOutside={false}
            renderDotsOutside={false}
            showDots={false}
            sliderClass=""
            transitionDuration={500}
            customTransition="transform 500ms ease-in-out"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            beforeChange={(currentSlide) => setActiveTournamentSlide(currentSlide)}
          >
            {data.torneos.length > 0 ? (
              data.torneos.map((torneo) => (
                <Box key={torneo.id} sx={{ px: 1.5, py: 1 }}>
                  <GradientCard>
                    <CardActionArea
                      href={`/dashboard/tournament/${torneo.name}/${torneo.id}`}
                      sx={{ p: 3, height: '100%' }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Typography
                          variant="h5"
                          component="div"
                          sx={(theme) => ({
                            fontWeight: 700,
                            mb: 2,
                            color:
                              theme.palette.mode === 'light'
                                ? theme.palette.primary.dark
                                : theme.palette.primary.light
                          })}
                            > <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <EmojiEventsIcon 
                                    sx={(theme) => ({
                                      mr: 1.5,
                                      verticalAlign: 'middle',
                                      fontSize: '2.5rem',
                                      color:
                                        theme.palette.mode === 'light'
                                          ? theme.palette.warning.main
                                          : theme.palette.primary.main
                                    })}
                                  />
                                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'inherit' }}>
                                    {torneo.name}
                                  </Typography>
                          </Box>
                        </Typography>

                        <Box
                          sx={(theme) => ({
                            display: 'flex',
                            alignItems: 'center',
                            mb: 1.5,
                            color: theme.palette.mode === 'light' ? theme.palette.error.dark : 'text.secondary',
                          })}
                        >
                          <EventIcon sx={{ mr: 1, fontSize: 20 }} />
                          <Typography variant="body2">
                            {new Date(torneo.fechaInicio).toLocaleDateString()} - {new Date(torneo.fechaFin).toLocaleDateString()}
                          </Typography>
                        </Box>


                        <Box
                            sx={(theme) => ({
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                              color: theme.palette.mode === 'light' ? 'text.primary' : 'text.primary',
                            })}
                          >
                            <Box component="span" sx={{ mr: 1 }}>📍</Box>
                            <Typography variant="body2">{torneo.ubicacion}</Typography>
                          </Box>

                        <Divider sx={{ my: 1.5 }} />

                        <Typography
                          variant="body2"
                          sx={{
                            flexGrow: 1,
                            color: 'text.primary',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {torneo.descripcion}
                        </Typography>

                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                          <Chip
                            label="View Details"
                            size="small"
                            sx={(theme) => ({
                              fontWeight: 600,
                              bgcolor: alpha(theme.palette.background.paper, 0.3),
                              color: theme.palette.primary.main,
                              border: `1px solid ${theme.palette.primary.dark}`, // << Añadido borde azul fuerte
                              '&:hover': {
                                bgcolor: alpha(theme.palette.success.light, 0.4),
                                borderColor: theme.palette.text.primary, // Cambia el borde al hacer hover
                              }
                            })}
                          />
                        </Box>

                      </Box>
                    </CardActionArea>
                  </GradientCard>
                </Box>
              ))
            ) : (
              <LoadingCard message={'No tournaments found. Check back later!'} />
            )}
          </Carousel>
        )}
      </Box>

      {/* Teams Section */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <StyledTitle
            variant="h4"
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              fontWeight: 800,
              color: theme.palette.text.primary,
            })}
          >
            <GroupsIcon
              sx={(theme) => ({
                mr: 1.5,
                verticalAlign: 'middle',
                fontSize: '2rem',
                color:
                  theme.palette.mode === 'light'
                    ? theme.palette.error.dark
                    : theme.palette.secondary.main
              })}
            />
            TEAMS
          </StyledTitle>
          {!loading && data.equipos.length > 0 && 
            <Search 
              myOptions={data.equipos} 
              myValue={selectedTeam}
              onChange={(e, newValue) => setSelectedTeam(newValue || null)}
              isOptionEqualToValue={(option, value) => option.name === value.name}
              myLabel={'Search Team'}
              toUrl={'team'}
            />
          }
        </Box>

        {loading ? (
          <Skeleton variant="rounded" height={240} sx={{ borderRadius: 4 }} />
        ) : (
          <Carousel
            ref={teamCarouselRef}
            responsive={responsive}
            slidesToSlide={1}
            partialVisible={true}
            swipeable={true}
            draggable={true}
            containerClass="carousel-container"
            itemClass="carousel-item"
            additionalTransfrom={0}
            arrows
            centerMode={false}
            infinite
            keyBoardControl
            minimumTouchDrag={80}
            renderButtonGroupOutside={false}
            renderDotsOutside={false}
            showDots={false}
            sliderClass=""
            transitionDuration={600}
            customTransition="all 600ms ease-in-out"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            beforeChange={(currentSlide) => setActiveTeamSlide(currentSlide)}
          >
            {data.equipos.length > 0 ? 
              data.equipos.map((equipo) => (
                <Box key={equipo.id} sx={{ px: 1.5, py: 1 }}>
                  <GradientCard>
                    <CardActionArea 
                      href={`/dashboard/team/${equipo.name}/${equipo.id}`} 
                      sx={{ p: 3, height: '100%' }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        height: '100%'
                      }}>
                  
                        <Avatar
                          src={`${URL_SERVER}/utils/uploads/${equipo && equipo.image !== 'logoEquipo.jpg' ? equipo.image : 'logoEquipo.jpg'}`}

                          alt={equipo.name}
                          sx={{ 
                            width: 120, 
                            height: 120, 
                            mb: 3,
                            border: `3px solid ${alpha(theme.palette.primary.main, 0.4)}`,
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }}
                        />
                        
                        <Typography
                          variant="h5"
                          component="div"
                          sx={(theme) => ({
                            fontWeight: 700,
                            mb: 2,
                            color:
                              theme.palette.mode === 'light'
                                ? theme.palette.primary.dark
                                : theme.palette.primary.light
                          })}
                            ><GroupsIcon
                                sx={(theme) => ({
                                  mr: 1.5,
                                  verticalAlign: 'middle',
                                  fontSize: '2.5rem',
                                  color:
                                    theme.palette.mode === 'light'
                                      ? theme.palette.text.secondary
                                      : theme.palette.secondary.main
                                })}
                          />
                          {equipo.name}
                        </Typography>
                        
                        <Box
                          sx={(theme) => ({
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2,
                            color: theme.palette.mode === 'light' ? theme.palette.secondary.dark : 'text.secondary',
                          })}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Leader: {equipo['users'].name}
                          </Typography>
                        </Box>
                        <Box sx={{ 
                          mt: 'auto', 
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'center'
                        }}>
                          <Chip 
                            label="Team Profile" 
                            size="small" 
                            sx={(theme) => ({
                              fontWeight: 600,
                              bgcolor: alpha(theme.palette.background.paper, 0.3),
                              color: theme.palette.primary.main,
                              border: `1px solid ${theme.palette.primary.dark}`, // << Añadido borde azul fuerte
                              '&:hover': {
                                bgcolor: alpha(theme.palette.success.light, 0.4),
                                borderColor: theme.palette.text.primary, // Cambia el borde al hacer hover
                              },
                              transition: 'all 0.3s ease'
                            })} 
                          />
                        </Box>
                      </Box>
                    </CardActionArea>
                  </GradientCard>
                </Box>
              )) : 
              <LoadingCard message={'No teams found. Check back later!'} />
            }
          </Carousel>
        )}
      </Box>
      {/* Matches Section */}
      <Box sx={{ mb: 6 }}>
        <StyledTitle
          variant="h4"
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            fontWeight: 800,
            letterSpacing: '0.5px',
            mb: 3,
            color: theme.palette.mode === 'light' 
              ? theme.palette.success.dark 
              : theme.palette.warning.light,
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: '50%',
              height: '3px',
              background: theme.palette.mode === 'light'
                ? `linear-gradient(to right, ${theme.palette.success.dark}, transparent)`
                : `linear-gradient(to right, ${theme.palette.warning.light}, transparent)`,
              borderRadius: '2px'
            }
          })}
        >
          <EventIcon
            sx={(theme) => ({
              mr: 1.5,
              verticalAlign: 'middle',
              fontSize: '2rem',
              color: theme.palette.mode === 'light'
                ? theme.palette.success.dark
                : theme.palette.warning.light
            })}
          />
          UPCOMING MATCHES
        </StyledTitle>

        {loading ? (
          <Skeleton 
            variant="rounded" 
            height={440} 
            sx={{ 
              borderRadius: 4,
              boxShadow: (theme) => theme.shadows[2]
            }} 
          />
        ) : data.proximosPartidos.length > 0 ? (
          <Paper 
            sx={(theme) => ({ 
              width: '100%', 
              overflow: 'hidden',
              borderRadius: 4,
              background: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.9)
                : alpha(theme.palette.common.white, 0.95),
              boxShadow: theme.shadows[6],
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: theme.shadows[8]
              }
            })}
          >
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell 
                      align="center"
                      sx={(theme) => ({
                        fontWeight: 700,
                        backgroundColor: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.background.paper, 0.7)
                          : alpha(theme.palette.grey[100], 0.9),
                        color: theme.palette.mode === 'light'
                          ? theme.palette.secondary.dark
                          : theme.palette.warning.light,
                        borderBottom: `2px solid ${alpha(theme.palette.divider, 0.3)}`,
                        fontSize: '1.1rem',
                        py: 2
                      })}
                    >
                      #️⃣
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell
                        key={column.extraIndex ? column.id+'.'+column.extraIndex : column.id}
                        align={column.align}
                        sx={(theme) => ({
                          fontWeight: 700,
                          backgroundColor: theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.7)
                            : alpha(theme.palette.grey[100], 0.9),
                          color: theme.palette.mode === 'light'
                            ? theme.palette.text.primary
                            : theme.palette.warning.light,
                          borderBottom: `2px solid ${alpha(theme.palette.divider, 0.3)}`,
                          minWidth: column.minWidth,
                          fontSize: '1rem',
                          py: 2
                        })}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.proximosPartidos
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const tournament = row.torneos;
                      return (
                        <TableRow 
                          hover 
                          tabIndex={-1} 
                          key={index} 
                          onClick={() => handleRowClick(tournament.id, tournament.name)}
                          sx={(theme) => ({
                            '&:nth-of-type(even)': {
                              backgroundColor: theme.palette.mode === 'dark'
                                ? alpha(theme.palette.background.paper, 0.5)
                                : alpha(theme.palette.grey[100], 0.7) // Gris claro para filas pares
                            },
                            '&:nth-of-type(odd)': {
                              backgroundColor: theme.palette.mode === 'dark'
                                ? alpha(theme.palette.background.paper, 0.3)
                                : alpha(theme.palette.grey[50], 0.9) // Gris muy claro para filas impares
                            },
                            '&:hover': {
                              backgroundColor: theme.palette.mode === 'dark'
                                ? alpha(theme.palette.primary.main, 0.2)
                                : alpha(theme.palette.primary.light, 0.2),
                              transform: 'translateY(-1px)',
                              boxShadow: (theme) => theme.shadows[1]
                            },
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          })}
                        >
                          <TableCell 
                            align="center"
                            sx={(theme) => ({
                              fontWeight: 600,
                              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                              color: theme.palette.mode === 'dark'
                                ? theme.palette.text.secondary
                                : theme.palette.text.primary,
                              backgroundColor: 'inherit'
                            })}
                          >
                            {page * rowsPerPage + index + 1}
                          </TableCell>
                          {columns.map((column) => {
                            const value = column.extraIndex ? 
                              row[column.id][column.extraIndex] : 
                              row[column.id];
                            return (
                              <TableCell 
                                key={`${column.id}-${column.extraIndex || ''}-${index}`}
                                align={column.align}
                                sx={(theme) => {
                                  const isLight = theme.palette.mode === 'light';
                                  return {
                                    fontWeight: 500,
                                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                    color: column.id.includes('equipoLocal')
                                      ? (isLight ? theme.palette.secondary.dark : theme.palette.text.secondary)
                                      : column.id.includes('equipoVisitante')
                                        ? (isLight ? theme.palette.primary.dark : theme.palette.primary.light)
                                        : (isLight ? theme.palette.text.primary : theme.palette.text.primary),
                                    backgroundColor: 'inherit'
                                  };
                                }}
                              >
                                {column.format ? 
                                  column.format(value) : value
                                }
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={data.proximosPartidos.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={(theme) => ({
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  fontWeight: 500,
                  color: theme.palette.mode === 'dark'
                    ? theme.palette.text.secondary
                    : theme.palette.text.primary
                },
                backgroundColor: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.background.paper, 0.7)
                  : alpha(theme.palette.grey[50], 0.8),
                '& .MuiSvgIcon-root': {
                  color: theme.palette.mode === 'dark'
                    ? theme.palette.warning.light
                    : theme.palette.primary.dark
                }
              })}
            />
          </Paper>
        ) : (
          <LoadingCard 
            message={'No upcoming matches scheduled.'} 
            CircularSize='2%'
          />
        )}
      </Box>
    </LayoutLogin>
  );
}