import React from 'react';
import {
    Box,
    Tab, 
    Tabs,
    Typography,
    Skeleton,
    Container,
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    Button,
    Stack,
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
import PropTypes from 'prop-types';

import FolderIcon from '@mui/icons-material/Folder';
import ShowChartIcon from '@mui/icons-material/ShowChart';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { Line, Bar } from 'react-chartjs-2';

// Registrar los componentes de Chart.js para Graficar importado mediante npm install bootstrap chart.js react-chartjs-2 <- 
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

import axiosInstance from "../../../services/axiosConfig.js";
import { useAuth } from '../../../services/AuthContext.jsx'; //  AuthContext
import { useParams } from 'react-router-dom';

import LayoutLogin from '../../LayoutLogin.jsx';
import LoadingView from '../../../components/Login/LoadingView.jsx'

const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
    <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
    >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
    };
}

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

export default function StatsTeam() {
    const {teamId, teamName} = useParams();
    const [stadistics, setStadistics] = React.useState([]);
    const [error, setError] = React.useState(null);
    const {loading, setLoading } = useAuth(); // Accede al usuario autenticado 

    const [valueTab, setValueTab] = React.useState(0); // Mecanismo del Tab
    const handleChange = (event, newValue) => {
        setValueTab(newValue);
    };

    React.useEffect(() => { // Hace la solicitud al cargar la vista <-
        const fetchStadistics = async () => {
            await axiosInstance.get(`estadisticas/equipo/${teamId}/${teamName}`)
                .then((response) => {
                    setLoading(false); // Cambiar el estado de carga incluso en caso de error
                    setStadistics(response.data.data);
                    setError(null);
                })
                .catch((err) => {
                    console.error("Error loading team statistics: ",err);
                    setLoading(false); // Cambiar el estado de carga incluso en caso de error
                    setError('Error loading team stats, you may not have played a match yet to have stats.');
                })
        };
        fetchStadistics();
    }, [equipoId]);
    
    if(error){ // En caso de que este vacio
        return (
            <LoadingView 
                message={error}
            />);
    }
    if(loading){
        return (
            <LoadingView 
                message={'There may be a connection error on the server.'}
            />);
    }

    if(stadistics.length <= 0){
        return (
            <LayoutLogin>
                <Typography variant='h2'> {loading ? <Skeleton variant="rounded" width={'50%'} /> : `Statistics of the ${teamName} Team`} </Typography>
                <Typography variant='subtitle2' sx={{ mt:3 }}>
                    Here you can consult the general stadictics team.
                </Typography>
                <Typography variant='h5' sx={{ m:4, display:'flex', alignContent:'center', justifyContent: 'center'}}>
                    No individual statistics were found for this team.
                </Typography>
            </LayoutLogin>
        );
    }
    //  Datos para el gráfico de líneas (PT por fecha)
    const fechas = stadistics.estadisticas.map((register) =>
        new Date(register.created_at).toLocaleDateString()
    );
    const puntosTotales = stadistics.estadisticas.map((register) => register.PT);

    const lineChartData = {
        labels: fechas,
        datasets: [
        {
            label: 'Puntos Totales (PT) por Fecha',
            data: puntosTotales,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
        },
        ],
    };
    
    // Datos para el gráfico de barras (sumatorias totales)
    const barChartData = {
        labels: ['PT', 'CA', 'DC', 'CC'],
        datasets: [
        {
            label: 'Totales',
            data: [stadistics.totales.PT, stadistics.totales.CA, stadistics.totales.DC, stadistics.totales.CC],
            backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            ],
            borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1,
        },
        ],
    };

    return (
        <LayoutLogin>
            <Typography variant='h2'> {loading ? <Skeleton variant="rounded" width={'50%'} /> : `Statistics of the ${teamName} Team`} </Typography>
            <Typography variant='subtitle2' sx={{ mt:3 }}>
                Here you can consult the general stadictics team.
            </Typography>
            <Box sx={{ borderBottom: 3, borderColor: 'divider' }}>
                <Tabs centered value={valueTab} onChange={handleChange} >
                <Tab icon={<FolderIcon />} label="Details" {...a11yProps(0)} />
                <Tab icon={<ShowChartIcon />} label="Graphics" {...a11yProps(1)}/>
                </Tabs>
            </Box>
            <CustomTabPanel value={valueTab} index={0}> {/* Details */}
                <Container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', mt:2}}>
                    <TableContainer component={Paper} sx={{maxHeight:{xs:650, sm:'100%'}}}>
                        <Table stickyHeader>
                        <TableHead>
                            <TableRow sx={{color:'secondary.main'}}>
                                <StyledTableCell align="center"><strong>Date</strong></StyledTableCell>
                                <StyledTableCell align="center"><strong>Total Points (PT)</strong></StyledTableCell>
                                <StyledTableCell align="center"><strong>Baskets Scored (CA)</strong></StyledTableCell>
                                <StyledTableCell align="center"><strong>Defenses Completed (DC)</strong></StyledTableCell>
                                <StyledTableCell align="center"><strong>Fields Completed (CC)</strong></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stadistics.map((row,i) => {
                                return (
                                <StyledTableRow key={i}>
                                    <StyledTableCell align="center">{new Date(registro.created_at).toLocaleDateString()}</StyledTableCell>
                                    <StyledTableCell align="center">{row.PT}</StyledTableCell>
                                    <StyledTableCell align="center">{row.CA}</StyledTableCell>
                                    <StyledTableCell align="center">{row.DC}</StyledTableCell>
                                    <StyledTableCell align="center">{row.CC}</StyledTableCell>
                                </StyledTableRow>);
                            })}
                        </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </CustomTabPanel>

            <CustomTabPanel value={valueTab} index={1}> {/* Stadistics */}
                <Paper elevation={10} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', mt:2, bgcolor: 'secondary', minHeight: 350}}>
                    <Typography variant='h5'>Total Points by Date</Typography>
                    <Line data={lineChartData} options={{ responsive: true }} />                   
                </Paper>

                <Paper elevation={10} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', mt:2, bgcolor: 'secondary', minHeight: 350}}>
                    <Typography variant='h5'>Total Sums</Typography>
                    <Bar data={barChartData} options={{ responsive: true }} />                   
                </Paper>
            </CustomTabPanel>
        </LayoutLogin>
    );
};