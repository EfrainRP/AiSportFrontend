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

import { Line } from 'react-chartjs-2';

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

export default function StatsTournament() {
    const {tournamentId, tournamentName} = useParams();
    const [stadistics, setStadistics] = React.useState([]);
    const [error, setError] = React.useState(null);
    const {loading, setLoading } = useAuth(); // Accede al usuario autenticado 

    const [valueTab, setValueTab] = React.useState(0); // Mecanismo del Tab
    const handleChange = (event, newValue) => {
        setValueTab(newValue);
    };

    React.useEffect(() => { // Hace la solicitud al cargar la vista <-
        const fetchStadistics = async () => {
            await axiosInstance.get(`estadisticas/torneo/${tournamentId}`)
                .then((response) => {
                    setLoading(false); // Cambiar el estado de carga incluso en caso de error
                    setStadistics(response.data.data);
                    setError(null);
                })
                .catch((err) => {
                    console.error("Error loading tournament statistics: ",err);
                    setLoading(false); // Cambiar el estado de carga incluso en caso de error
                    setError('Error loading tournament statistics.');
                })
        };
        fetchStadistics();
    }, [tournamentId]);
    
    // Datos para la gráfica <-
    const prepareGraphData = () => {
        const rounds = [];
        const labels = [];
        const datasets = [];

        // Agrupar estadísticas por rondas (pares de equipos)
        for (let i = 0; i < stadistics.length; i += 2) {
            const match = stadistics.slice(i, i + 2);
            rounds.push(match);
            if((Math.floor(i / 2) + 1) < 6){ // Muestra horizontalmente la cantidad de rondas máximas de un torneo (5) <-
                labels.push(`Ronda ${Math.floor(i / 2) + 1}`);
            }
        }   

        // Crear datasets para cada equipo
        const teamsMap = new Map();
        rounds.forEach((match, index) => { // Recorre para mostrar el nombre de los equipos de cada partido y su PT en la grafica <-
            match.forEach((stats) => {
                if (!teamsMap.has(stats.equipos.name)) {
                teamsMap.set(stats.equipos.name, []);
                }
                teamsMap.get(stats.equipos.name).push(stats.PT);
            });
        });

    // Convierte los datos de equipos en datasets
    teamsMap.forEach((pts, name) => {
        datasets.push({ // Labels e información visual de la Grafica 
            label: name,
            data: pts,
            borderColor: getRandomColor(), // Color aleatorio para cada equipo
            backgroundColor: 'rgba(0,0,0,0)',
            fill: false,
            tension: 0.4,
        });
        });

    return {
        labels,
        datasets,
        };
    };

    // Función para generar colores aleatorios para las líneas
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
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
    const graphData = prepareGraphData();

    if(stadistics.length < 0){
        return (
            <LayoutLogin>
                <Typography variant='h2'> {loading ? <Skeleton variant="rounded" width={'50%'} /> : `Statistics of the ${tournamentName} Tournament`} </Typography>
                <Typography variant='subtitle2' sx={{ mt:3 }}>
                    Here you can consult the general stadictics.
                </Typography>
                <Typography variant='h5' sx={{ m:4, display:'flex', alignContent:'center', justifyContent: 'center'}}>
                    No statistics found for this tournament.
                </Typography>
            </LayoutLogin>
        );
    }

    return (
        <LayoutLogin>
            <Typography variant='h2'> {loading ? <Skeleton variant="rounded" width={'50%'} /> : `Statistics of the ${tournamentName} Tournament`} </Typography>
            <Typography variant='subtitle2' sx={{ mt:3 }}>
                Here you can consult the general stadictics.
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
                                <StyledTableCell align="center"><strong>MATCH</strong></StyledTableCell>
                                <StyledTableCell align="center"><strong>Name Team</strong></StyledTableCell>
                                <StyledTableCell align="center"><strong>Total Points (PT)</strong></StyledTableCell>
                                <StyledTableCell align="center"><strong>Creation Date</strong></StyledTableCell>
                                <StyledTableCell align="center"><strong>Last Update Date</strong></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stadistics.map((row,i) => {
                                const numberMatch = Math.floor(i / 2) + 1; // Número del partido
                                const isFirstTeam = i % 2 === 0;
                                
                                return (
                                <StyledTableRow key={i}>
                                    {isFirstTeam && (
                                        <StyledTableCell rowSpan={2} align="center">Partido {numberMatch}</StyledTableCell>
                                    )}
                                    <StyledTableCell align="center">{row.equipos.name}</StyledTableCell>
                                    <StyledTableCell align="center">{row.PT}</StyledTableCell>
                                    <StyledTableCell align="center">{new Date(row.created_at).toLocaleDateString()}</StyledTableCell>
                                    <StyledTableCell align="center">{new Date(row.updated_at).toLocaleDateString()}</StyledTableCell>
                                </StyledTableRow>);
                            })}
                        </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </CustomTabPanel>

            <CustomTabPanel value={valueTab} index={1}> {/* Stadistics */}
                <Paper elevation={10} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', mt:2, bgcolor: 'secondary', minHeight: 350}}>
                        <Line
                            data={graphData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                            }}
                        />                    
                </Paper>
            </CustomTabPanel>
        </LayoutLogin>
    );
};