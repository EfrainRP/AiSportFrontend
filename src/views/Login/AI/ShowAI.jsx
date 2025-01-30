import React from 'react';
import {
    Typography,
    Skeleton,
    Box,
    CardActions,
    CardContent,
    CardActionArea,
    ToggleButton,
    ToggleButtonGroup,
    Button,
    IconButton,
    Stack,
    TextField,
    Autocomplete,
    Fab,
    ButtonGroup,
    Grow,
    Snackbar,
    Alert,
    Checkbox,
    FormControlLabel,
    Divider,
    FormLabel,
    FormControl,
    Link,
    Container,
} from '@mui/material';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';

import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

import axiosInstance from "../../../services/axiosConfig.js";
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../services/AuthContext.jsx'; //  AuthContext

import LayoutLogin from '../../LayoutLogin.jsx';
import LoadingView from '../../../components/Login/LoadingView.jsx';
import ConfirmDialog from '../../../components/Login/ConfirmDialog.jsx';

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

export default function ShowAI() {
    const { user, loading, setLoading } = useAuth(); // Accede al usuario autenticado

    const [isTraining, setIsTraining] = React.useState(false);
    const [jsonData, setJsonData] = React.useState(null);
    const [prediction, setPrediction] = React.useState(null);
    const { teamName, teamId } = useParams();
    const [selectedTime, setSelectedTime] = React.useState("30");

    const videoRef = React.useRef(null);
    const websocketRef = React.useRef(null);
    
    // Estados para controlar los modales
    const [showModal, setShowModal] = React.useState(false);
    const [modalMessage, setModalMessage] = React.useState("");
    const [showPredictionModal, setShowPredictionModal] = React.useState(false);
    const [isManualClose, setIsManualClose] = React.useState(false); // Estado para controlar el cierre manual
    
    // Actualiza las estadisticas de entrenmiento para los equipos y el usuario <-
    const sendDataToServer = async (url, data, prediction) => {
        await axiosInstance.put(url, {
            datos: data,
            prediccion: prediction})
        .then((response)=>{console.log(`Datos enviados correctamente a ${url}`);})
        .catch ((error) => {
            console.error(`Error al enviar datos a ${url}`, error);
        })
    };

    const startTraining = () => {
        setIsTraining(true);
        setIsManualClose(false); // Reiniciar el estado de cierre manual
        // Conexion con la direccion IP del host en el puerto abierto configurado desde el host "8765"
        websocketRef.current = new WebSocket("ws://192.168.100.170:8765");
    
        websocketRef.current.onopen = () => {
            setModalMessage("SportAI: Conexión de entrenamiento exitosa.");
            setShowModal(true);
            websocketRef.current.send(JSON.stringify({
                start: true,
                time: parseInt(selectedTime),
            }));
        };
        websocketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.prediction) {
                setPrediction(data.prediction);
            } else {
                setJsonData(data);
            }
            // Si se tiene una prediccion o el "entrenamiento" ha finalizado, se actualizan los datos en la BD
            if (data && data.prediction) {
                sendDataToServer(`/entrenamiento/equipo/AI/${teamId}`, data, data.prediction);
                sendDataToServer(`/entrenamiento/user/AI/${user.userId}`, data, data.prediction);
            }
            // Muestra el frame de la IMG pasada en base64
            if (videoRef.current && data.image) {
                const img = new Image();
                img.src = `data:image/jpeg;base64,${data.image}`;
                img.onload = () => {
                    const context = videoRef.current.getContext("2d");
                    context.drawImage(img, 0, 0, videoRef.current.width, videoRef.current.height);
                };
            }
        };
    
        websocketRef.current.onerror = (error) => {
            setModalMessage(`SportAI: WebSocket error: ${error.message}`);
            setShowModal(true);
        };
        
        websocketRef.current.onclose = () => {
            if (isManualClose) {
                // Si el cierre fue manual, mostrar el mensaje de interrupción
                setModalMessage("El entrenamiento se ha interrumpido debido a un problema inesperado, la conexión ha sido finalizada.");
            } else if (prediction) {
                // Si el cierre fue automático y se tiene la predicción, mostrar el mensaje de éxito
                setModalMessage("SportAI: Conexión finalizada exitosamente.");
            } else {
                // Si el cierre fue automático pero no se tiene la predicción, mostrar un mensaje de error
                setModalMessage("El entrenamiento se ha interrumpido debido a un problema inesperado, la conexión ha sido finalizada.");
            }
            setShowModal(true);
        };
    };

    const stopTraining = () => {
        setIsTraining(false);
        setIsManualClose(true); // Indicar que el cierre fue manual
        if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
            websocketRef.current.send(JSON.stringify({ stop: true }));
            setTimeout(() => {
                websocketRef.current.close();
                setModalMessage("SportAI: Conexión finalizada exitosamente.");
                setShowModal(true);
        
                // Limpiar el canvas
                const context = videoRef.current.getContext("2d");
                context.clearRect(0, 0, videoRef.current.width, videoRef.current.height);
            }, 1000);
        } else {
        setModalMessage("La conexión con el servidor se encuentra finalizada.");
        setShowModal(true);
        }
    };

    // Función para determinar el estilo del modal según el rendimiento
    const getModalStyle = (performance) => {
        switch (performance?.toLowerCase()) {
        case "deficiente":
            return { backgroundColor: "#dc3545", color: "#fff" }; // Rojo
        case "mejorable":
            return { backgroundColor: "#ff8000", color: "#000" }; // Naranja
        case "bueno":
            return { backgroundColor: "#0d6efd", color: "#fff" }; // Azul
        case "muy bueno":
            return { backgroundColor: "#7be800", color: "#fff" }; // Verde claro
        case "excepcional":
            return { backgroundColor: "#198754", color: "#fff" }; // Verde fuerte
        default:
            return { backgroundColor: "#6c757d", color: "#fff" }; // Color por defecto
        }
    };

    // Efecto para abrir automáticamente el modal de predicción cuando prediction.performance deje de ser null
    React.useEffect(() => {
        if (prediction?.performance) {
        setShowPredictionModal(true); // Abre el modal cuando prediction.performance tenga un valor
        stopTraining(); // Cerrar la conexión automáticamente
        }
    }, [prediction]);

    if(loading){ 
        return (
        <LoadingView/>);
    }
    if(error){ 
        return (
        <LoadingView 
            message={error}
        />);
    }
    if(stats.length === 0){
        return (
            <LayoutLogin>
                <Typography variant='h2'> {loading ? <Skeleton variant="rounded" width={'50%'} /> : `SportHub Individual Performance Analyzer`} </Typography>
                <Typography variant='h5' sx={{ m:4, display:'flex', alignContent:'center', justifyContent: 'center'}}>
                    There are no available teams with a minimum match played that contain statistics for a training session.
                </Typography>
            </LayoutLogin>
        );
    }
    console.log(selectedTeam);
    return (
        <LayoutLogin>
            <Typography variant='h2'> {loading ? <Skeleton variant="rounded" width={'50%'} /> : `SportHub Individual Performance Analyzer`} </Typography>
            <Typography variant='subtitle2' sx={{ mt:3 }}>
                Here you can consult the general analyzer.
            </Typography>
            <Container sx={{display:'flex', alignContent:'center', justifyContent:'center', mt:4}}>
                <Card>
                    <Typography variant='h6'>
                        Choose your team to upgrade or add their stats:
                    </Typography>
                    <Autocomplete
                        autoComplete
                        autoSelect
                        includeInputInList
                        selectOnFocus
                        options={stats}
                        getOptionLabel={(option)=>option.name} // Muestra el nombre como etiqueta
                        isOptionEqualToValue={(option, value) => option.equipo_id === value.equipo_id} // Compara por `id`
                        value={selectedTeam || null}
                        onChange={(e, newValue) => {
                            setSelectedTeam(newValue || null);
                        }}
                        size="medium"
                        renderInput={(params) => <TextField {...params} label="Choose a team" sx={{fontSize: '1px'}}/>}
                    />
                    {selectedTeam && 
                        <CardActions sx={{display:'flex', justifyContent:'flex-end'}}>
                            {/* Pasa el ID y el nombre del equipo */}
                            <Button 
                                color='success' 
                                variant="contained"
                                startIcon={<FitnessCenterIcon/>}
                                href={`/dashboard/trainning/IA/${selectedTeam.equipo_id}/${selectedTeam.name}`}>
                                Trainning this team
                            </Button>
                        </CardActions>
                    }
                </Card>
            </Container>
        </LayoutLogin>
    );
};