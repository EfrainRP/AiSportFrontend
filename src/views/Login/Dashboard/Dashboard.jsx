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
} from '@mui/material';

import { useAuth } from '../../../services/AuthContext.jsx'; // Importa el AuthContext
import axiosInstance from "../../../services/axiosConfig.js";
import LayoutLogin from '../../LayoutLogin.jsx';

import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";

const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server

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
    minWidth: 170 
  },
  { 
    id: 'torneos', 
    extraIndex: 'ubicacion', 
    label: 'Location', 
    align: 'center', 
    minWidth: 100 
  },
  { 
    id: 'equipoLocal', 
    extraIndex: 'name', 
    label: 'Home\u00a0Team', 
    align: 'center', 
    minWidth: 100 
  },
  { 
    id: 'equipoVisitante', 
    extraIndex: 'name', 
    label: 'Guest\u00a0Team', 
    align: 'center', 
    minWidth: 100 
  },
  {
    id: 'fechaPartido',
    label: 'Date',
    minWidth: 170,
    align: 'center',
    format: (value) => {
      return new Date(value).toLocaleDateString();
    },
  },
  {
    id: 'horaPartido',
    label: 'Time',
    minWidth: 170,
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
// const columns = [
//   { id: 'name', label: 'Name', minWidth: 170 },
//   { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
//   {
//     id: 'population',
//     label: 'Population',
//     minWidth: 170,
//     align: 'right',
//     format: (value) => value.toLocaleString('en-US'),
//   },
//   {
//     id: 'size',
//     label: 'Size\u00a0(km\u00b2)',
//     minWidth: 170,
//     align: 'right',
//     format: (value) => value.toLocaleString('en-US'),
//   },
//   {
//     id: 'density',
//     label: 'Density',
//     minWidth: 170,
//     align: 'right',
//     format: (value) => value.toFixed(2),
//   },
// ];

export default function Dashboard() {
  const { user, loading, setLoading } = useAuth(); // Accede al usuario autenticado 

  const [data, setData] = React.useState({ torneos: [], equipos: [], proximosPartidos: [] }); // Estado para almacenar torneos y equipos

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const navigate = useNavigate(); // Hook para navegar

  const handleRowClick = (id) => {
    navigate(`#`); // Redirige a la URL deseada
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
          console.log(response.data);

        }).catch((error) => {
          console.error('Error al obtener los datos del dashboard:', error);
          setLoading(false); // Cambiar el estado de carga incluso en caso de error
        });
    }
    if (user) {
      fetchData(); // Llamar a la función solo si el usuario está definido
    }
  }, [[user]]);

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
      <Typography variant='h4' sx={{ mt: 6, mb: 2}}>{loading ? <Skeleton variant="rounded" height={40} width={200}/> : 'Tournaments Available'}</Typography>
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
                  <CardActionArea href={`tournament/${torneo.id}`} sx={{p:2}}>
                    <Typography variant='h4' component='strong' sx={{display: 'flex', justifyContent:'center'}}>{torneo.name}</Typography>
                    <Typography><strong>Description: </strong>{torneo.descripcion}</Typography>
                    <Typography><strong>Ubicación: </strong>{torneo.ubicacion}</Typography>
                    <Typography><strong>Start date:</strong> {new Date(torneo.fechaInicio).toLocaleDateString()}</Typography>
                    <Typography><strong>End date:</strong> {new Date(torneo.fechaFin).toLocaleDateString()}</Typography>
                  </CardActionArea>
                </Card>
                );})
            : 
              <Card variant="outlined">
                  <CardContent>
                      <Typography gutterBottom variant="subtitle2" component="div">
                          You don't have any tournaments registered yet.
                      </Typography>
                  </CardContent>
              </Card>
            }
          </Carousel>
        }
      </Box>

        {/* CARUSEL DE EQUIPOS */}
      <Typography variant='h4' sx={{ mt: 6, mb: 2}}>{loading ? <Skeleton variant="rounded" height={40} width={200}/> : 'Teams Available'}</Typography>
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
                  key={equipo.id} 
                  sx={{p:0, m:1}}
                >
                  <CardActionArea href={`/team/${equipo.name}/${equipo.id}`} sx={{p:2}}>
                      <CardMedia
                          component="img"
                          height={120}
                          image={URL_SERVER+`/utils/uploads/${equipo.image !== 'logoEquipo.jpg' ? equipo.image : 'logoEquipo.jpg'}`} 
                          alt={equipo.name}
                      />
                      <CardContent>
                          <Typography variant="h5" component="span" sx={{display: 'flex', justifyContent: 'center'}}>
                              <strong>{equipo.name}</strong>
                          </Typography>
                          <Typography variant="subtitle" component="span" sx={{display: 'flex', justifyContent: 'center'}}>
                              {equipo['users'].name}
                          </Typography>
                      </CardContent>
                  </CardActionArea>
              </Card>
            );})) 
            : 
              <Card variant="outlined">
                <CardContent>
                    <Typography gutterBottom variant="subtitle2" component="div">
                        You don't have any tournaments registered yet.
                    </Typography>
                </CardContent>
              </Card>
            }
          </Carousel>
        }
      </Box>

        {/* TABLA DE PROXIMOS PARTIDOS */}
      <Typography variant='h5' sx={{ mt: 6, mb: 2 }}>{loading ? <Skeleton variant="rounded" height={40} width={200}/> : 'My Matches'}</Typography>
      <Box>
        {loading ? <Skeleton variant="rounded" height={440} /> :
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        sx={{backgroundColor: 'grey'}}
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
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={i} onClick={() => handleRowClick(`matches/${row.id}`)}>
                          {columns.map((column,i) => {
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
        }
      </Box>

    </LayoutLogin>
  );
}