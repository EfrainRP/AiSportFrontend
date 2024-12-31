import React from 'react';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { useAuth } from '../../services/AuthContext.jsx'; // Importa el AuthContext
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

import axiosInstance from "../../services/axiosConfig.js";

import LayoutLogin from '../LayoutLogin';
import MyCarousel from '../../components/Login/MyCarousel.jsx';

export default function Dashboard() {
  const { user, loading, setLoading } = useAuth(); // Accede al usuario autenticado 

  const [data, setData] = React.useState({ torneos: [], equipos: [] }); // Estado para almacenar torneos y equipos


  React.useEffect(() => {
    const fetchData = async () => {
      await axiosInstance.get(`/dashboard/${user.userId}`)
      .then((response)=>{
        console.log(response.data);
        setTimeout(() => {
          setLoading(false); // Cambia el estado para simular que la carga ha terminado
        }, 2500); // Simula 3 segundos de carga
        setData(response.data); // Establecer los datos en el estado
        // console.log(loading);

      }).catch((error)=>{
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
      <Typography variant='h2' sx={{mb:2}}> {loading ? <Skeleton /> : `Welcome ${user.userName || 'invitado'} to you dashboard!`} </Typography>
      <Typography variant='subtitle2'>{loading ? <Skeleton /> : 'Here you can management your preferences and consult your information.'}</Typography>

      <Typography variant='h5' sx={{mt:6, mb:3}}>{loading ? <Skeleton /> : 'My Tournaments'}</Typography>        
          <MyCarousel item={data.torneos}/>
          

      <Typography variant='h5' sx={{mt:6, mb:3}}>{loading ? <Skeleton /> : 'My Teams'}</Typography>
      <MyCarousel item={data.equipos}/>

      <Typography variant='h5' sx={{mt:6, mb:3}}>{loading ? <Skeleton /> : 'My Matches'}</Typography>
      <Box>
        {loading ? <Skeleton /> :
        <Box sx={{ width: '100%' }}>
          {/* <Paper sx={{ width: '100%', mb: 2 }}>
            <EnhancedTableToolbar numSelected={selected.length} />
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {visibleRows.map((row, index) => {
                    const isItemSelected = selected.includes(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.name}
                        </TableCell>
                        <TableCell align="right">{row.calories}</TableCell>
                        <TableCell align="right">{row.fat}</TableCell>
                        <TableCell align="right">{row.carbs}</TableCell>
                        <TableCell align="right">{row.protein}</TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
          /> */}
        </Box>
        }
      </Box>

    </LayoutLogin>
  );
}