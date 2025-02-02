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
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAuth } from '../../../services/AuthContext.jsx'; // Importa el AuthContext
import axiosInstance from "../../../services/axiosConfig.js";
import LayoutLogin from '../../LayoutLogin.jsx';

import LoadingCard from '../../../components/Login/LodingCard.jsx';
import Search from '../../../components/Login/Search.jsx';

import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";

const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server
const centerJustify = {display: 'flex', alignContent:'center', textAlign:'justify', justifyContent:'space-evenly'};

const TitleTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.success.dark,
  ...theme.applyStyles('dark', {
    color: theme.palette.success.light,
  }),
}));

const myResponsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2
  }
};

const columns = [
  { 
    id: 'torneos', 
    extraIndex: 'name', 
    label: 'Tournament', 
    align: 'center', 
    minWidth: 120 
  },
  { 
    id: 'torneos', 
    extraIndex: 'ubicacion', 
    label: 'Location', 
    align: 'center', 
    minWidth: 120 
  },
  { 
    id: 'equipos_partidos_equipoLocal_idToequipos', 
    extraIndex: 'name', 
    label: 'Home\u00a0Team', 
    align: 'center', 
    minWidth: 130 
  },
  { 
    id: 'equipos_partidos_equipoVisitante_idToequipos', 
    extraIndex: 'name', 
    label: 'Guest\u00a0Team', 
    align: 'center', 
    minWidth: 130 
  },
  {
    id: 'fechaPartido',
    label: 'Date',
    minWidth: 110,
    align: 'center',
    format: (value) => {
      return new Date(value).toLocaleDateString();
    },
  },
  {
    id: 'horaPartido',
    label: 'Time',
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

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
  console.log(data.torneos);
  return (
    <LayoutLogin>
      {/* Tiene el skeleton para dar una animacion de carga al cargar los datos */}
      <Typography variant='h2' sx={{ mb: 2 }}> 
        {loading ? 
        <Skeleton variant="rounded" width={'50%'} height={40} /> 
        : 
        `Welcome ${user.userName.toUpperCase() || 'invitado'} to you dashboard!`} 
      </Typography>
      <Typography variant='subtitle2'>
        {loading ? 
          <Skeleton variant="rounded" width={'42%'}/> 
          : 
          'Here you can management your preferences and consult your information.'
        }
      </Typography>

        {/* CARUSEL DE TORNEOS*/}
      
      <TitleTypography variant='h4' 
        sx={{mt: 6, display: 'flex', flexDirection: 'row', alignItems: 'center'}}
      >
        {/* Tournaments Available  */}
        {loading ? <Skeleton variant="rounded" height={40} width={200}/> : 'Tournaments Available'}
        {!loading && data.torneos.length > 0 &&
          <Search myOptions={data.torneos} myValue={selectedTournament} /*Se renderizara el buscador, si se cargo los datos correctamente*/
            onChange={(e, newValue) => {
              setSelectedTournament(newValue || null);
            }}
            isOptionEqualToValue = {(option, value) => option.id === value.id}
            myLabel={'Search Tournament'}
            toUrl={'tournament'}/>
        } 
      </TitleTypography>
      <Box sx={{ width: '100%', height: 'auto', mx: 2 }}>
        {loading ? <Skeleton variant="rounded" sx={{mx:-2, width:'100%', height:150}}/> :
          <Carousel
            responsive={myResponsive}
            slidesToSlide={2}
            //autoPlay={true}
            //autoPlaySpeed={8000} //ms
            // infinite={true}
            removeArrowOnDeviceType={["tablet", "mobile"]}
          >
            {data.torneos.length > 0 ? 
              data.torneos.map((torneo, i) => {
                return (
                <Card
                  variant="outlined" 
                  sx={{p:0, m:1,}}
                  key={i}
                >
                  <CardActionArea href={`/dashboard/tournament/${torneo.name}/${torneo.id}`} sx={{p:2}}>
                    <Typography variant='h4' component='strong' sx={centerJustify} color='secondary'>{torneo.name}</Typography>
                    <Divider sx={{my:1}}/>
                    
                    <Container sx={centerJustify}>
                      <Typography variant='subtitle2' color='primary'> 
                        <strong>Location: </strong>
                      </Typography>
                      <Typography sx={{color: 'text.data'}}> 
                        {torneo.ubicacion}
                      </Typography>
                    </Container>

                    <Container sx={centerJustify}>
                      <Typography variant='subtitle2' color='primary'> 
                        <strong>Start date: </strong>
                      </Typography>
                      <Typography sx={{color: 'text.data'}}> 
                        {new Date(torneo.fechaInicio).toLocaleDateString()}
                      </Typography>
                    </Container>
                    
                    <Container sx={centerJustify}>
                      <Typography variant='subtitle2' color='primary'> 
                        <strong>End date: </strong>
                      </Typography>
                      <Typography sx={{color: 'text.data'}}> 
                        {new Date(torneo.fechaFin).toLocaleDateString()}
                      </Typography>
                    </Container>
                    
                    <Container sx={centerJustify}>
                      <Typography variant='subtitle2' color='primary' sx={{mr:2}}> 
                        <strong>Description: </strong>
                      </Typography>
                      <Typography sx={{color: 'text.data'}}> 
                        {torneo.descripcion}
                      </Typography>
                    </Container>
                  </CardActionArea>
                </Card>
                );})
            : 
              <LoadingCard message={'Maybe tournaments are not found.'}/>
            }
          </Carousel>
        }
      </Box>

        {/* CARUSEL DE EQUIPOS */}
      <TitleTypography variant='h4' 
        sx={{mt: 6, display: 'flex', flexDirection: 'row', alignItems: 'center'}}
      >
        {loading ? <Skeleton variant="rounded" height={40} width={200}/> : 'Teams Available'}
        {!loading && data.equipos.length > 0 && 
          <Search myOptions={data.equipos} myValue={selectedTeam} /*Se renderizara el buscador, si se cargo los datos correctamente*/
            onChange={(e, newValue) => {
              setSelectedTeam(newValue || null);
            }}
            isOptionEqualToValue = {(option, value) => option.name === value.name}
            myLabel={'Search Team'}
            toUrl={'team'}/>
        } 
      </TitleTypography>
      <Box sx={{ width: '100%', height: 'auto', mx: 2 }}>
        {loading ? <Skeleton variant="rounded" sx={{mx:-2, width:'100%', height:150}}/> :
          <Carousel
            responsive={myResponsive}
            slidesToSlide={2}
            removeArrowOnDeviceType={["tablet", "mobile"]}
          >
            {data.equipos.length > 0? (
              data.equipos.map((equipo, i) => {
                return (
                <Card 
                  variant="outlined" 
                  key={i} 
                  sx={{p:0, m:1}}
                >
                  <CardActionArea href={`/dashboard/team/${equipo.name}/${equipo.id}`} sx={{p:2}}>
                      <CardMedia
                          component="img"
                          height={120}
                          image={URL_SERVER+`/utils/uploads/${equipo.image !== 'logoEquipo.jpg' ? equipo.image : 'logoEquipo.jpg'}`} 
                          alt={equipo.name}
                      />
                      <CardContent>
                      
                          <Typography variant="h5" component="span" color='secondary' sx={{...centerJustify, my:0.5}}>
                              <strong>{equipo.name}</strong>
                          </Typography>
                          <Container sx={centerJustify}>
                            <Typography variant='subtitle2' color='primary'> 
                              <strong>Leader: </strong>
                            </Typography>
                            <Typography sx={{color: 'text.data'}}> 
                              {equipo['users'].name}
                            </Typography>
                          </Container>
                      </CardContent>
                  </CardActionArea>
              </Card>
            );})) 
            : 
            <LoadingCard message={'Maybe teams are not found.'}/>
            }
          </Carousel>
        }
      </Box>

        {/* TABLA DE PROXIMOS PARTIDOS */}
      <TitleTypography variant='h4' 
        sx={{mt: 6, mb: 2,}}
      >
          {loading ? <Skeleton variant="rounded" height={40} width={200}/> : 'My Matches'}
      </TitleTypography>
      <Box>
        {loading ? <Skeleton variant="rounded" height={440} />
          :
        data.proximosPartidos.length>0?
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440}}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{backgroundColor: 'rgb(171, 167, 165)'}}> {/*Celda para el numero de elementos de la tabla, lo cual esta vacia*/}
                      {""}
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell
                        sx={{backgroundColor: 'rgb(171, 167, 165)'}}
                        key={column.extraIndex? column.id+'.'+column.extraIndex : column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.proximosPartidos
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, i) => {
                      i+=1; //Recorremos 1 a los elementos
                      const tournament = row.torneos;
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={i} onClick={() => handleRowClick(tournament.id, tournament.name)} style={{ cursor: 'pointer' }}> 
                          <TableCell key={i} width={50} align='center'>
                            {i}
                          </TableCell>
                          {columns.map((column,i) => {
                            i+=1; //Recorremos 1 a los elementos
                            const value = column.extraIndex? row[column.id][column.extraIndex] : row[column.id];
                            return (
                              <TableCell key={i} align={column.align}>
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
            />
          </Paper>
          :
          <LoadingCard message={'Maybe matches are not found.'} CircularSize='2%'/>
        }
      </Box>

    </LayoutLogin>
  );
}