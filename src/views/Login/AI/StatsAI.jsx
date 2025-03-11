import React from 'react';
import {
    Typography,
    Skeleton,
    Box,
    Card,
    CardActions,
    CardHeader,
    CardContent,
    CardActionArea,
    Button,
    IconButton,
    Snackbar,
    Container,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Divider,
    Paper,

} from '@mui/material';
// import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';

import axiosInstance from "../../../services/axiosConfig.js";
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../services/AuthContext.jsx'; //  AuthContext

import LayoutLogin from '../../LayoutLogin.jsx';
import LoadingView from '../../../components/Login/LoadingView.jsx';

const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server
const centerSX = {display:"flex", justifyContent:"center", alignContent:"center"}

import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

  // Registra los elementos de Chart.js para la gráfica
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function StatsAI() {
    const { user, loading, setLoading } = useAuth(); // Accede al usuario autenticado
    const { teamName, teamId } = useParams();

    const [stats, setStats] = React.useState(null);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        // Llama al endpoint del controlador para obtener las estadísticas del usuario
        const fetchEstadisticas = async () => {
            await axiosInstance.get(`/estadisticas/AI/${user.userId}`)
            .then((response) => {
                setStats(response.data.data); // Guarda las estadísticas en el estado
                console.log(response.data.data);
                setLoading(false); // Desactiva el indicador de carga
            }).catch ((err) => {
                console.log(err);
                setError('Error loading User stats.');
                setLoading(false);
            })};
        fetchEstadisticas();
        
    }, [user.userId]);

    if(loading || !stats){
        return (<LoadingView/>);
    }
    if(error){
        return (<LoadingView message={error}/>);
    }

    // Datos para el gráfico de líneas (Tiempo de entrenamiento por fecha)
    const fechas = stats.estadisticas.map((registro) =>
        new Date(registro.created_at).toLocaleDateString()
    );
    const tiempoEntrenamiento = stats.estadisticas.map((registro) => registro.TM);

    const options = {
        plugins: {
            legend: {
                labels: {
                    color: "white", // Cambia el color del texto de la leyenda
                },
            },
        },
        scales: {
            x: {
                ticks: { color: "white" }, // Color de los labels del eje X
                grid: { color: "rgba(255, 255, 255, 0.2)" }, // Color de la cuadrícula
            },
            y: {
                ticks: { color: "white" }, // Color de los labels del eje Y
                grid: { color: "rgba(255, 255, 255, 0.2)" },
            },
        },
    };

    const lineChartData = {
        labels: fechas,
        datasets: [
        {
            label: 'Tiempo de Entrenamiento (TM) por Fecha',
            data: tiempoEntrenamiento,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.57)',
            fill: true,
        },
        ],
    };

    // Datos para el gráfico de barras (sumatorias totales)
    const barChartData = {
        labels: ['SS', 'SA', 'BC', 'DR', 'TO', 'ST', 'DD', 'TR', 'TC'],
        datasets: [
        {
            label: 'Totales',
            data: [
            stats.totales.SS,
            stats.totales.SA,
            stats.totales.BC,
            stats.totales.DR,
            stats.totales.TO,
            stats.totales.ST,
            stats.totales.DD,
            stats.totales.TR,
            stats.totales.PF,
            ],
            backgroundColor: [
            'rgba(255, 99, 132, 0.9)',
            'rgba(54, 162, 235, 0.9)',
            'rgba(255, 206, 86, 0.9)',
            'rgba(75, 192, 192, 0.9)',
            'rgba(153, 102, 255, 0.9)',
            'rgba(255, 159, 64, 0.9)',
            'rgba(199, 199, 199, 0.9)',
            'rgba(83, 103, 255, 0.9)',
            'rgba(255, 99, 132, 0.9)',
            ],
            borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)',
            'rgba(83, 102, 255, 1)',
            'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 2,
        },
        ],
    };

    // Función para obtener el estilo según el rendimiento
    const getRendimientoStyle = (rendimiento) => {
        switch (rendimiento) {
        case "DEFICIENTE":
            return { backgroundColor: "#dc3545", color: "#fff" }; // Rojo
        case "MEJORABLE":
            return { backgroundColor: "#ff8000", color: "#000" }; // Naranja
        case "BUENO":
            return { backgroundColor: "#0d6efd", color: "#fff" }; // Azul
        case "MUY_BUENO":
            return { backgroundColor: "#198754", color: "#fff" }; // Verde fuerte
        case "EXCEPCIONAL":
            return { backgroundColor: "#ff006c", color: "#fff" }; // Rosa semi fuerte
        default:
            return { backgroundColor: "#6c757d", color: "#fff" }; // Color por defecto
        }
    };

    return (
        <LayoutLogin>
            <Typography variant='h2'> {loading ? <Skeleton variant="rounded" width={'50%'} /> : `Stats AI Trainning`} </Typography>
            <Typography variant='subtitle2' sx={{ mt:3 }}>
                Here you can consult you stats analyzer.
            </Typography>

            {/* Controles de entrenamiento */}
            <Container sx={{width:"100%", mt:4, flexDirection:'column', gap:2}}>
                <Card>
                    <CardContent sx={{...centerSX, flexDirection:'column', gap:2, }}>
                    
                    <Typography variant='h2' sx={{...centerSX,...getRendimientoStyle(stats.rendimientoFrecuente), fontSize: { xs: '1.5em', sm: '2.5em'}}}>
                        The most common implementation is: {stats.rendimientoFrecuente}
                    </Typography>

                    <Divider sx={{backgroundColor:'white'}}/>

                    <Typography variant='h2' sx={{...centerSX, fontSize: { xs: '1.5em', sm: '2.5em'}}}>Tiempo de Entrenamiento por Fecha</Typography>
                    <Line data={lineChartData} options={{ ...options, responsive: true }}/>

                    <Divider sx={{backgroundColor:'white'}}/>

                    <Typography variant='h2' sx={{...centerSX,fontSize: { xs: '1.5em', sm: '2.5em'}}}>Estadísticas a lo largo de Entrenamientos</Typography>
                    <Bar data={barChartData} options={{ ...options, responsive: true }} />

                    {stats.estadisticas.length > 0? (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Date</TableCell>
                                        <TableCell align="center">Baskets Scored (SS)</TableCell>
                                        <TableCell align="center">Shot Attempts (SA)</TableCell>
                                        <TableCell align="center">Training Time (TM)</TableCell>
                                        <TableCell align="center">Ball Control (BC)</TableCell>
                                        <TableCell align="center">Dribbles (DR)</TableCell>
                                        <TableCell align="center">Toques (TO)</TableCell>
                                        <TableCell align="center">Steps (ST)</TableCell>
                                        <TableCell align="center">Doubles (DD)</TableCell>
                                        <TableCell align="center">Travels (TR)</TableCell>
                                        <TableCell align="center">Performance (PF)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {stats.estadisticas.map((register, index) => {
                                    const styleRendimiento = getRendimientoStyle(register.PF); // Obtener el estilo para cada rendimiento
                                    return (
                                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell component="th" scope="row">{new Date(register.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell align="center">{register.SS}</TableCell>
                                            <TableCell align="center">{register.SA}</TableCell>
                                            <TableCell align="center">{register.TM}</TableCell>
                                            <TableCell align="center">{register.BC}</TableCell>
                                            <TableCell align="center">{register.DR}</TableCell>
                                            <TableCell align="center">{register.TO}</TableCell>
                                            <TableCell align="center">{register.ST}</TableCell>
                                            <TableCell align="center">{register.DD}</TableCell>
                                            <TableCell align="center">{register.TR}</TableCell>
                                            <TableCell align="center" sx={styleRendimiento}>{register.PF}</TableCell> {/* Aplicar estilo aquí */}
                                        </TableRow>
                                    );
                                })}
                                </TableBody>
                            </Table>
                            </TableContainer>
                    ) :
                    (
                        <Typography variant='body1' sx={{...centerSX,fontSize: { xs: '1.5em', sm: '2.5em'}}}>No data stats trainning</Typography>
                    )}
                    </CardContent>
                </Card>
                
            </Container>
        </LayoutLogin>
    );
};