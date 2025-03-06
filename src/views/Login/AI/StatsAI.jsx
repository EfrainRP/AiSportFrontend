import React from 'react';
import {
    Typography,
    Skeleton,
    Box,
    CardActions,
    CardHeader,
    CardContent,
    CardActionArea,
    ToggleButton,
    ToggleButtonGroup,
    Button,
    IconButton,
    Stack,
    TextField,
    Snackbar,
    FormControl,
    FormLabel,
    InputLabel,
    Select,
    MenuItem,
    Link,
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Paper,

} from '@mui/material';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';

import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DoDisturbOnTwoToneIcon from '@mui/icons-material/DoDisturbOnTwoTone';

import axiosInstance from "../../../services/axiosConfig.js";
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../services/AuthContext.jsx'; //  AuthContext

import LayoutLogin from '../../LayoutLogin.jsx';
import LoadingView from '../../../components/Login/LoadingView.jsx';
import DialogComponent from '../../../components/Login/DialogComponent.jsx';

const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server

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
  
const StyledListNumber = styled(List)(({ theme }) => ({
    listStyleType: "decimal", 
    pl: 2,
    "& .MuiListItem-root": {
        display: "list-item",
    },
}));

const StyledList = styled(List)(({ theme }) => ({
    borderRadius: 0, 
    padding: 0,
    "& .MuiListItem-root": {
        borderBottom: "1px solid #dee2e6", // Línea entre elementos
        padding: "8px 16px",
    },
}));

const StyledBox = styled('div')(({ theme }) => ({
    display:'flex',
    justifyContent:'center',
    marginTop:15,
    marginBottom:2,
}));
const StyledBoxIMG = styled('img')(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 2, // Aplica border-radius
    filter: "grayscale(100%)",
    transition: "filter 0.3s ease", // Agrega animación al efecto
    "&:hover": {
        filter: "grayscale(50%)", // Quita el efecto al pasar el mouse
    },
}));
const myVideo = styled('video')(({ theme }) => ({
    border: "3px solid",
    borderColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[3],
    padding: theme.spacing(1, 3),
}));

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    // height: '100%',
    //margin: theme.spacing(2),
    gap: theme.spacing(5),
    // margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
        gap: theme.spacing(2),
        // margin: theme.spacing(4),
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

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
                setEstadisticas(response.data.data); // Guarda las estadísticas en el estado
                setLoading(false); // Desactiva el indicador de carga
            }).catch ((err) => {
                setError('Error loading User stats.');
                setLoading(false);
            })};
        fetchEstadisticas()
    }, [user.userId]);

    
    if(loading){
        return (
        <LoadingView/>);
    }
    if(!!error){
        return (
            <LoadingView message={error}/>);
    }

    // Datos para el gráfico de líneas (Tiempo de entrenamiento por fecha)
    const fechas = stats.estadisticas.map((registro) =>
        new Date(registro.created_at).toLocaleDateString()
    );
    const tiempoEntrenamiento = stats.estadisticas.map((registro) => registro.TM);

    const lineChartData = {
        labels: fechas,
        datasets: [
        {
            label: 'Tiempo de Entrenamiento (TM) por Fecha',
            data: tiempoEntrenamiento,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
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
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(199, 199, 199, 0.6)',
            'rgba(83, 102, 255, 0.6)',
            'rgba(255, 99, 132, 0.6)',
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
            borderWidth: 1,
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

    // Estilo para el rendimiento más frecuente
    const rendimientoStyle = getRendimientoStyle(estadisticas.rendimientoFrecuente);

    return (
        <LayoutLogin>
            <Typography variant='h2'> {loading ? <Skeleton variant="rounded" width={'50%'} /> : `Stats AI Trainning`} </Typography>
            <Typography variant='subtitle2' sx={{ mt:3 }}>
                Here you can consult you stats analyzer.
            </Typography>

            {/* Controles de entrenamiento */}
            <Container sx={{width:"100%", display:"flex", justifyContent:"center", alignContent:"center", mt:4, flexDirection:'column', gap:2}}>
                <Card>
                    <CardContent sx={{display:"flex", justifyContent:"justify", alignContent:"center", flexDirection:'column', gap:2, }}>
                    
                    <Typography variant='h2' sx={rendimientoStyle}>
                        The most common implementation is: {stats.rendimientoFrecuente}
                    </Typography>

                    <Typography variant='h2'>Tiempo de Entrenamiento por Fecha</Typography>
                    <Line data={lineChartData} options={{ responsive: true }} />

                    <Typography variant='h2'>Estadísticas a lo largo de Entrenamientos</Typography>
                    <Bar data={barChartData} options={{ responsive: true }} />

                    {/* Poner tabla de estadisticas */}
                    </CardContent>
                </Card>
                
            </Container>

            {/*     	Section {Modal / Dialog}         */}
            <DialogComponent modalTittle={'Mensaje del sistema'} modalBody={modalMessage} open={showModal} handleClose={() => setShowModal(false)}/>

            <DialogComponent
                modalTittle={'Predicción del entrenamiento'}
                modalBody={prediction ? (
                    <Container>
                        <Typography variant='body1'><strong>Performance:</strong> {prediction.performance}</Typography>
                            {prediction.data[9] && (
                        <Typography variant='body1'><strong>Suggestion:</strong> {prediction.data[9]}</Typography>
                        )}
                    </Container>
                    ) : (
                        <Typography variant='body1'>No hay datos de predicción disponibles.</Typography>
                    )}
                open={showPredictionModal}
                handleClose={() => setShowPredictionModal(false)}/>

            <DialogComponent
                maxWidth={'md'}// ó lg
                modalTittle={'💡AiSport Tips'}
                open={false}///// showInfoModal
                handleClose={() => setShowInfoModal(false)}
                modalBody={
                <Container>
                    <Typography>Make sure you meet the following requirements before beginning your training. ✅</Typography>
                    <Typography>Individual training is focused on measuring <strong>the performance of a single player </strong>per training session and not of a team of players. 🏀</Typography>
                    <Typography>Camera placement recommendations for optimal analysis:</Typography>
                    <StyledBox>
                        <StyledBoxIMG
                        src={URL_SERVER+`/utils/uploads/tripie.jpg`}
                        alt="Cámara en trípode tomando una foto"
                        sx={{ width: "250px", height: "auto"}}
                        />
                    </StyledBox>
                    <StyledListNumber component='ol'>
                        <ListItem component='li'>
                            <ListItemText>The player must occupy at least <strong>60% of the frame</strong> or full body view during training. 🤾‍♂️</ListItemText>
                            <StyledBox>
                                <StyledBoxIMG 
                                    src={URL_SERVER+`/utils/uploads/60camara.png`}
                                    alt="60 de Camara"
                                    sx={{ width: "650px", height: "auto"}}
                                />
                            </StyledBox>
                        </ListItem>
                        <ListItem component='li'>
                            <ListItemText>The playing area should be as <strong>centered</strong> and focused as possible.📷</ListItemText>
                            <StyledBox>
                                <StyledBoxIMG
                                    src={URL_SERVER+`/utils/uploads/centro_camara.jpg`}
                                    alt="Centro de Camara"
                                    sx={{ width: "200px", height: "auto",}}
                                    
                                    />
                            </StyledBox>
                        </ListItem>
                        <ListItem component='li'>
                            <ListItemText>There should be a recommended distance of <strong>2-5 meters</strong> from the camera to the player and the basket location for a more optimal analysis. 📐
                            </ListItemText>
                            <StyledBox>
                                <StyledBoxIMG
                                    src={URL_SERVER+`/utils/uploads/distanciaCamara.png`}
                                    alt="Distancia de Camara"
                                    sx={{ width: "500px", height: "auto",}}
                                    
                                    />
                            </StyledBox>
                        </ListItem>
                        <ListItem component='li'>
                            <ListItemText>The height of the chamber should be between <strong>1.50 cm to 2 m</strong> ideally. 🎥
                            </ListItemText>
                            <StyledBox>
                            <StyledBoxIMG
                                src={URL_SERVER+`/utils/uploads/altura.jpg`}
                                alt="Altura de Camara"
                                sx={{ width: "500px", height: "auto",}}
                                
                                />
                            </StyledBox>
                        </ListItem>
                        <ListItem component='li'>
                            <ListItemText>The location must have <strong>good background lighting</strong> for optimal detection of the player, ball and basket.💡
                            </ListItemText>
                            <StyledBox>
                            <StyledBoxIMG
                                src={URL_SERVER+`/utils/uploads/iluminacion.jpg`}
                                alt="Iluminacion en cancha"
                                sx={{ width: "300px", height: "auto",}}
                                
                                />
                            </StyledBox>
                        </ListItem>
                        <ListItem component='li'>
                            <ListItemText>For increased blind spot coverage, adjust the camera focus <strong>laterally</strong> to the field:
                            </ListItemText>
                            <StyledBox>
                            ❌
                            <StyledBoxIMG
                                src={URL_SERVER+`/utils/uploads/cancha_frontal.jpg`}
                                alt="Cancha frontal" sx={{ width: "200px", height: "auto",}} 
                                />
                            ✅
                            <StyledBoxIMG
                                src={URL_SERVER+`/utils/uploads/cancha_lateral.jpg`}
                                alt="Cancha lateral" sx={{ width: "230px", height: "auto",}} 
                                />
                            </StyledBox>
                        </ListItem>
                    </StyledListNumber>
                    
                    <Typography sx={{textAlign:'justify'}}>Done! Now you can start testing your skills in the sport of basketball✅.</Typography>
                    <Divider sx={{my:2}}/>
                    <Typography sx={{mb:1}}><strong> *AiSport Note:</strong> </Typography>
                    <Typography sx={{textAlign:'justify'}}>
                    The statistics analyzed to calculate a player's performance are taken based on metrics used in the NBA (National Basketball Association), however, training time can significantly influence the results, which is not considered an official metric in itself, but is used because time is a key factor in the analysis of a measurable individual training.
                    </Typography>
                </Container>
                }/>

            <DialogComponent
                modalTittle={'Estado de la Cámara'}
                modalBody={cameraModalMessage}
                open={showPredictionModal}
                handleClose={() => setShowCameraModal(false)}/>

        </LayoutLogin>
    );
};