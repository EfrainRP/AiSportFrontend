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
    const { teamName, teamId } = useParams();

    const [isTraining, setIsTraining] = React.useState(false);
    const [jsonData, setJsonData] = React.useState(null);
    const [prediction, setPrediction] = React.useState(null);
    const [selectedTime, setSelectedTime] = React.useState("30");

    const handleChangeSelect = (event) => {
        setSelectedTime(event.target.value);
    };

    const videoRef = React.useRef(null);
    const websocketRef = React.useRef(null);
    
    // Estados para controlar los modales
    const [showModal, setShowModal] = React.useState(false);
    const [modalMessage, setModalMessage] = React.useState("");
    const [showPredictionModal, setShowPredictionModal] = React.useState(false);
    const [isManualClose, setIsManualClose] = React.useState(false);
    const [showInfoModal, setShowInfoModal] = React.useState(true);
    const [showCameraModal, setShowCameraModal] = React.useState(false);
    const [cameraModalMessage, setCameraModalMessage] = React.useState("");

    // Devices
    const [devices, setDevices] = React.useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = React.useState(""); 
    
    React.useEffect(() => {
        // Obtener todas las cámaras disponibles
        navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
        const videoDevices = deviceInfos.filter(device => device.kind === "videoinput");
        setDevices(videoDevices);
        });
    }, []);

    const startCamera = (deviceId) => {
        // Detener la cámara actual si existe
        if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        }
    
        const constraints = {
        video: { deviceId: { exact: deviceId } } // Selecciona la cámara específica
        };
    
        navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            mediaStreamRef.current = stream;
            if (videoRef.current) {
            videoRef.current.srcObject = stream; // Asigna la cámara al video
            }
            setCameraModalMessage(`Cámara seleccionada: ${devices.find(d => d.deviceId === deviceId)?.label || "Desconocida"}`);
            setShowCameraModal(true);
        })
        .catch((error) => {
            setCameraModalMessage("No se pudo acceder a la cámara seleccionada.");
            setShowCameraModal(true);
            console.error("Error al acceder a la cámara:", error);
        });
    };
    
    const resetCameraSelection = () => {
        // Detener la cámara actual si existe
        if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
        }
    
        // Limpiar el video
        if (videoRef.current) {
        videoRef.current.srcObject = null;
        }
    
        // Reiniciar la selección de la cámara
        setSelectedDeviceId("");
    };
    
    const sendDataToServer = async (url, data, prediction) => {
        try {
            await axiosInstance.put(url, {
                datos: data,
                prediccion: prediction
            });
            console.log(`Datos enviados correctamente a ${url}`);
        } catch (error) {
            console.error(`Error al enviar datos a ${url}`, error);
        }
    };

    const startTraining = async () => {
        if (!selectedDeviceId) {
            setModalMessage("Por favor, selecciona una cámara antes de comenzar el entrenamiento.");
            setShowModal(true);
            return;
        }
    
        setIsTraining(true);
        setIsManualClose(false);
    
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: selectedDeviceId } } });
            mediaStreamRef.current = stream;
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();
        
            websocketRef.current = new WebSocket("ws://192.168.100.170:8765");
        
            websocketRef.current.onopen = () => {
                setModalMessage("SportAI: Conexión de entrenamiento exitosa.");
                setShowModal(true);
                websocketRef.current.send(JSON.stringify({
                start: true,
                time: parseInt(selectedTime),
                }));
        
                let lastSendTime = 0;
                const frameInterval = 1000 / 25;  // 25 FPS a 40 ms por frame
        
                const sendFrame = () => {
                if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
                    return; // No envía si el WebSocket no está abierto
                }
                const now = performance.now();
                if (now - lastSendTime >= frameInterval) {  
                    if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    const canvas = document.createElement('canvas');
                    canvas.width = 640;
                    canvas.height = 480;
                    const context = canvas.getContext('2d');
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageData = canvas.toDataURL('image/jpeg', 0.8);
                    
                    if (imageData.length > 100) {
                        websocketRef.current.send(imageData);
                    }
                    }
                    lastSendTime = now;
                }
                requestAnimationFrame(sendFrame);
                };
                
                sendFrame();
            };
        
            websocketRef.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
        
                if (data.prediction) {
                setPrediction(data.prediction);
                } else {
                setJsonData(data);
                }
        
                if (data && data.prediction) {
                    sendDataToServer(`/entrenamiento/equipo/AI/${equipoId}`, data, data.prediction);
                    sendDataToServer(`/entrenamiento/user/AI/${user.userId}`, data, data.prediction);
                }
        
                if (canvasRef.current && data.image) {
                const img = new Image();
                img.src = `data:image/jpeg;base64,${data.image}`;
                img.onload = () => {
                    const context = canvasRef.current.getContext("2d");
                    context.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                };
                }
            };
        
            websocketRef.current.onerror = (error) => {
                setModalMessage(`SportAI: WebSocket error: ${error.message}`);
                setShowModal(true);
            };
        
            websocketRef.current.onclose = () => {
                if (isManualClose) {
                    setModalMessage("El entrenamiento se ha interrumpido debido a un problema inesperado, la conexión ha sido finalizada.");
                } else if (prediction) {
                    setModalMessage("SportAI: Conexión finalizada exitosamente.");
                } else {
                    setModalMessage("El entrenamiento se ha interrumpido debido a un problema inesperado, la conexión ha sido finalizada.");
                }
                    setShowModal(true);
                
                // Reiniciar la selección de la cámara
                resetCameraSelection();
            };
        } catch (error) {
            console.error("Error al acceder a la cámara:", error);
            setModalMessage("Error al acceder a la cámara. Asegúrate de permitir el acceso a la cámara.");
            setShowModal(true);
            setIsTraining(false);
        }
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

    React.useEffect(() => {
        setShowInfoModal(true);
    }, []);

    if(loading){ 
        return (
        <LoadingView/>);
    }
    console.log(selectedTime);
    return (
        <LayoutLogin>
            <Typography variant='h2'> {loading ? <Skeleton variant="rounded" width={'50%'} /> : `AI Trainning`} </Typography>
            <Typography variant='subtitle2' sx={{ mt:3 }}>
                Here you can consult the general analyzer.
            </Typography>
            
            {/* Controles de entrenamiento */}
            <Container sx={{width:"100%", display:"flex", justifyContent:"center", alignContent:"center", mt:4}}>
                <Card>
                    <CardContent sx={{display:"flex", justifyContent:"space-around", alignContent:"center"}}>
                    <FormControl sx={{width:"30%"}} size="small" >
                        <FormLabel htmlFor="time">Time:</FormLabel>
                            <Select
                                value={selectedTime}
                                label="time"
                                onChange={handleChangeSelect}
                                displayEmpty
                            >
                                <MenuItem value={"30"}>30 seg</MenuItem>
                                <MenuItem value={"60"}>1 min</MenuItem>
                                <MenuItem value={"120"}>2 min</MenuItem>
                                <MenuItem value={"180"}>3 min</MenuItem>
                                <MenuItem value={"240"}>4 min</MenuItem>
                                <MenuItem value={"300"}>5 min</MenuItem>
                            </Select>
                        </FormControl>
                        <Button 
                            variant='contained'
                            color="secondary"
                            startIcon={<FitnessCenterIcon/>}
                            onClick={startTraining} 
                            disabled={isTraining}> 
                                Start
                        </Button>
                        <Button 
                            variant='contained'
                            color="warning"
                            onClick={stopTraining}  
                            disabled={!isTraining}
                            startIcon={<DoDisturbOnTwoToneIcon/>}
                            > 
                                Stop
                        </Button>
                    </CardContent>
                </Card>
            </Container>

            <DialogComponent modalTittle={'Mensaje del sistema'} modalBody={modalMessage} open={showModal} handleClose={() => setShowModal(false)}/>

            <DialogComponent 
                modalTittle={'Predicción del entrenamiento'} 
                modalBody={prediction ? (
                    <>
                        <p><strong>Rendimiento:</strong> {prediction.performance}</p>
                            {prediction.data[9] && (
                        <p><strong>Sugerencia:</strong> {prediction.data[9]}</p>
                        )}
                    </>
                    ) : (
                        <p>No hay datos de predicción disponibles.</p>
                    )} 
                open={showPredictionModal} 
                handleClose={() => setShowPredictionModal(false)}/>

            <DialogComponent 
                modalTittle={'💡SportAI Recomendaciones'} 
                modalBody={
                    <>
                        <p>Asegúrate de cumplir con los siguientes requerimientos antes de comenzar tu entrenamiento✅.</p>
          <p>El entrenamiento individual está enfocado a medir el <strong> rendimiento de un solo jugador </strong> por entrenamiento y no de un equipo de jugadores🏀.</p>
          <p>Recomendaciones de colocación de cámara para un análisis óptimo:</p>
          <div className="d-flex justify-content-around align-items-center mb-3">
            <img
              src={`/sporthub/api/utils/uploads/tripie.jpg`}
              alt="Cámara en trípode tomando una foto"
              style={{ width: "250px", height: "auto", filter: "grayscale(100%)" }}
              className="img-fluid rounded"
            />
          </div>
          <ol>
            <li>El jugador debe ocupar al menos un <strong>60% del cuadro</strong> o vista en cuerpo completo durante el entrenamiento.🤾‍♂️.</li>
            <div className="d-flex justify-content-center mb-3">
              <img
                src={`/sporthub/api/utils/uploads/60camara.png`}
                alt="60 de Camara"
                style={{ width: "650px", height: "auto", filter: "grayscale(100%)" }}
                className="img-fluid rounded"
              />
            </div>
            <li>El área de juego debe estar lo más <strong>centrada</strong> y enfocada posible📷.</li>
            <div className="d-flex justify-content-center mb-3">
              <img
                src={`/sporthub/api/utils/uploads/centro_camara.jpg`}
                alt="Centro de Camara"
                style={{ width: "200px", height: "auto", filter: "grayscale(100%)" }}
                className="img-fluid rounded"
              />
            </div>
            <li>Debe haber una distancia recomendable de <strong>2-5 metros</strong> desde la cámara al jugador y lugar de la canasta para un análisis más óptimo📐.</li>
            <div className="d-flex justify-content-center mb-3">
              <img
                src={`/sporthub/api/utils/uploads/distanciaCamara.png`}
                alt="Distancia de Camara"
                style={{ width: "500px", height: "auto", filter: "grayscale(100%)" }}
                className="img-fluid rounded"
              />
            </div>
            <li>La altura de la cámara debe ser de entre <strong>1.50 cm a 2 m</strong> idealmente🎥.</li>
            <div className="d-flex justify-content-center mb-3">
              <img
                src={`/sporthub/api/utils/uploads/altura.jpg`}
                alt="Altura de Camara"
                style={{ width: "500px", height: "auto", filter: "grayscale(100%)" }}
                className="img-fluid rounded"
              />
            </div>
            <li>El lugar debe contar con <strong>buena iluminación</strong>  de fondo para una detección óptima del jugador, pelota y cesta💡.</li>
            <div className="d-flex justify-content-center mb-3">
              <img
                src={`/sporthub/api/utils/uploads/iluminacion.jpg`}
                alt="Iluminacion en cancha"
                style={{ width: "300px", height: "auto", filter: "grayscale(100%)" }}
                className="img-fluid rounded"
              />
            </div>
            <li>Para una mayor cobertura de puntos ciegos, acomoda el enfoque de la cámara de manera <strong>lateral</strong>  a la cancha:</li>
            <div className="d-flex justify-content-center mb-3">
            ❌
              <img
                src={`/sporthub/api/utils/uploads/cancha_frontal.jpg`}
                alt="Cancha frontal" style={{ width: "200px", height: "auto", filter: "grayscale(100%)" }} className="img-fluid rounded"
              />
            ✅
              <img
                src={`/sporthub/api/utils/uploads/cancha_lateral.jpg`}
                alt="Cancha lateral" style={{ width: "230px", height: "auto", filter: "grayscale(100%)" }} className="img-fluid rounded"
              />
            </div>
          </ol>
          <p>¡Listo! Ahora puedes comenzar a poner a prueba tus habilidades en el deporte de baloncesto✅.</p>
          <p>-----------------------------------------------------------------------</p>
          <p><strong> ***SportAI Nota***</strong> </p>
          <p>Las estadísticas analizadas para el cálculo del rendimiento de un jugador son tomadas en base a 
                métricas usadas en la NBA (Asociación Nacional de Baloncesto) sin embargo, el <strong>tiempo </strong> 
                de entrenamiento puede influir considerablemente en los resultados, lo cual, <strong>no es considerado una métrica oficial</strong> en sí, 
                pero es usada debido a que el tiempo es un factor clave en el análisis de un entrenamiento individual medible.</p>
                    </>
                    } 
                open={showInfoModal} 
                handleClose={() => setShowInfoModal(false)}/>

            <DialogComponent 
                modalTittle={'Estado de la Cámara'} 
                modalBody={cameraModalMessage} 
                open={showPredictionModal} 
                handleClose={() => setShowCameraModal(false)}/>

        </LayoutLogin>
    );
};