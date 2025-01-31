import React from 'react';
import {
    Typography,
    Skeleton,
    Container,
    Button,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';

import axiosInstance from "../../../services/axiosConfig.js";
import { useAuth } from '../../../services/AuthContext.jsx'; //  AuthContext

import LayoutLogin from '../../LayoutLogin.jsx';
import LoadingView from '../../../components/Login/LoadingView.jsx'

const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 13,
    },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function Stadistics() {
    const [stadistics, setStadistics] = React.useState([]);
    const [error, setError] = React.useState(null);
    const { user, loading, setLoading } = useAuth(); // Accede al usuario autenticado 

    React.useEffect(() => { // Hace la solicitud al cargar la vista <-
        const fetchStadistics = async () => {
            await axiosInstance.get(`/estadisticas/${user.userId}`)
                .then((response) => {
                    setTimeout(() => {
                        setLoading(false); // Cambia el estado para simular que la carga ha terminado
                      }, 1500); // Simula tiempo de carga
                    setStadistics(response.data.data);
                    setError(null);
                })
                .catch((err) => {
                    console.error("Error al obtener las estadísticas:", err);
                    setLoading(false); // Cambiar el estado de carga incluso en caso de error
                    setError('Error al obtener las estadísticas');
                })
        };
        fetchStadistics();
    }, [user.userId]);
    
    if(error){ // En caso de que este vacio
        return (
            <LoadingView 
                message={error}
            />);
    }

    return (
        <LayoutLogin>
            <Typography variant='h2'> {loading ? <Skeleton variant="rounded" width={'40%'} /> : `Welcome to AiSport Teams Statistics`} </Typography>
            <Typography variant='subtitle2' sx={{ mt:3 }}>
                {loading ? 
                    <Skeleton variant="rounded" width={'31%'}/> 
                    : 
                    'Here you can consult teams stadictics.'
                }
            </Typography>
            <Container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', mt:2}}>
            {loading ? 
                <Skeleton variant="rounded" width={'95%'} height={550} /> 
            :
                <TableContainer component={Paper} sx={{ width: {sm:'22rem'}, maxHeight:{xs:650, sm:'100%'}}}>
                    <Table stickyHeader>
                    <TableHead>
                        <TableRow sx={{color:'secondary.main'}}>
                            <StyledTableCell align="center"><strong>Name</strong></StyledTableCell>
                            <StyledTableCell align="center"><strong>Stats</strong></StyledTableCell>
                            <StyledTableCell align="center">{' '}</StyledTableCell>
                            {/* <StyledTableCell align="right">Fat</StyledTableCell>
                            <StyledTableCell align="right">Carbs</StyledTableCell>
                            <StyledTableCell align="right">Protein</StyledTableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stadistics.map((row,i) => (
                        <StyledTableRow key={i}>
                            <StyledTableCell component="th" scope="row" align="center">
                                {row.name}
                            </StyledTableCell>
                            <StyledTableCell align="center">{row.equipo_id}</StyledTableCell>
                            <StyledTableCell align="center">
                                <Button variant="contained" size="small" href={`/equipo/${row.name}/${row.equipo_id}/stats`}>
                                    See
                                </Button>
                            </StyledTableCell>
                            {/* <StyledTableCell align="right">{row.fat}</StyledTableCell>
                            <StyledTableCell align="right">{row.carbs}</StyledTableCell>
                            <StyledTableCell align="right">{row.protein}</StyledTableCell> */}
                        </StyledTableRow>
                        ))}
                    </TableBody>
                    </Table>
                </TableContainer>
            }
            </Container>
        </LayoutLogin>
    );
};