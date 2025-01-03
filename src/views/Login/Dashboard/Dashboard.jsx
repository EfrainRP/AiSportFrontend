import React from 'react';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import { useAuth } from '../../../services/AuthContext.jsx'; // Importa el AuthContext
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

import axiosInstance from "../../../services/axiosConfig.js";

import LayoutLogin from '../../LayoutLogin.jsx';

import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";

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
    id: 'torneoDelPartido', 
    extraIndex: 'name', 
    label: 'Tournament', 
    align: 'center', 
    minWidth: 170 
  },
  { 
    id: 'torneoDelPartido', 
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
          }, 1500); // Simula 3 segundos de carga
          setData(response.data); // Establecer los datos en el estado
          // console.log(loading);

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
      <Typography variant='h2' sx={{ mb: 2 }}> {loading ? <Skeleton /> : `Welcome ${user.userName || 'invitado'} to you dashboard!`} </Typography>
      <Typography variant='subtitle2'>{loading ? <Skeleton /> : 'Here you can management your preferences and consult your information.'}</Typography>

      <Typography variant='h5' sx={{ mt: 6, mb: 3 }}>{loading ? <Skeleton /> : 'My Tournaments'}</Typography>
      <Box sx={{ width: '100%', height: 'auto', mx: 2 }}>
        {loading ? <Skeleton /> :
          <Carousel
            responsive={myResponsive}
            slidesToSlide={2}
            //autoPlay={true}
            //autoPlaySpeed={8000} //ms
            // infinite={true}
            removeArrowOnDeviceType={["tablet", "mobile"]}
          >
            {data.torneos.map((torneo, i) =>
              <Paper
                key={i}
                elevation={3}
                sx={{
                  direction: 'row',
                  width: '95%',
                  padding: 2,
                  textAlign: 'center',
                }}
                onClick={() => handleRowClick(`tournament/${torneo.id}`)}
              >
                <Typography variant="h6">{torneo.name}</Typography>
                <Typography variant='h4' component='strong'>{torneo.name}</Typography>
                <Typography><strong>Descripción: </strong>{torneo.descripcion}</Typography>
                <Typography><strong>Ubicación: </strong>{torneo.ubicacion}</Typography>
              </Paper>
            )}
          </Carousel>
        }
      </Box>

      <Typography variant='h5' sx={{ mt: 6, mb: 3 }}>{loading ? <Skeleton /> : 'My Teams'}</Typography>
      <Box className={'hola'} sx={{ width: '100%', height: 'auto', mx: 2 }}>
        {loading ? <Skeleton /> :
          <Carousel
            responsive={myResponsive}
            slidesToSlide={2}
            removeArrowOnDeviceType={["tablet", "mobile"]}
          >
            {data.equipos.map((equipo, i) =>
              <Paper
                key={i}
                elevation={3}
                sx={{
                  width: '95%',
                  padding: 2,
                  textAlign: 'center',
                }}
                onClick={() => handleRowClick(`teams/${equipo.id}`)}
              >
                <Typography variant="h6">{equipo.name}</Typography>
                <Typography variant='h4' component='strong'>{equipo.name}</Typography>
                <Typography><strong>Descripción: </strong>{equipo.descripcion}</Typography>
                <Typography><strong>Ubicación: </strong>{equipo.ubicacion}</Typography>
              </Paper>
            )}
          </Carousel>
        }
      </Box>

      <Typography variant='h5' sx={{ mt: 6, mb: 3 }}>{loading ? <Skeleton /> : 'My Matches'}</Typography>
      <Box>
        {loading ? <Skeleton /> :
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