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
import BackButton from '../../../components/Login/BackButton.jsx';

const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server

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

    const videoRef = React.useRef(null); // Referencia para el elemento <video>
    const canvasRef = React.useRef(null); // Referencia para el elemento <canvas>
    const websocketRef = React.useRef(null);
    const mediaStreamRef = React.useRef(null);

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
            setCameraModalMessage(`Selected camera: ${devices.find(d => d.deviceId === deviceId)?.label || "Unknow"}`);
            setShowCameraModal(true);
        })
        .catch((error) => {
            setCameraModalMessage("The selected camera could not be accessed.");
            setShowCameraModal(true);
            console.error("Error accessing camera:", error);
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
            console.log(`Data sent successfully to ${url}`);
        } catch (error) {
            console.error(`Error sending data to ${url}`, error);
        }
    };

    const startTraining = async () => {
        if (!selectedDeviceId) {
            setModalMessage("Please select a camera before starting training.");
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
                setModalMessage("AiSport: Successful training connection.");
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
                setModalMessage(`AiSport: WebSocket error: ${error.message}`);
                setShowModal(true);
            };

            websocketRef.current.onclose = () => {
                if (isManualClose) {
                    setModalMessage("Training has been interrupted due to an unexpected problem, the connection has been terminated.");
                } else if (prediction) {
                    setModalMessage("AiSport: Connection completed successfully.");
                } else {
                    setModalMessage("Training has been interrupted due to an unexpected problem, the connection has been terminated.");
                }
                    setShowModal(true);

                // Reiniciar la selección de la cámara
                resetCameraSelection();
            };
        } catch (error) {
            console.error("Error accessing the camera:", error);
            setModalMessage("Error accessing the camera. Make sure to allow camera access.");
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
                setModalMessage("AiSport: Connection completed successfully.");
                setShowModal(true);

                // Limpiar el canvas
                const context = videoRef.current.getContext("2d");
                context.clearRect(0, 0, videoRef.current.width, videoRef.current.height);
            }, 1000);
        } else {
        setModalMessage("The connection to the server is terminated.");
        setShowModal(true);
        }
    };

    // Función para determinar el estilo del modal según el rendimiento
    const getModalStyle = (performance) => {
        switch (performance?.toLowerCase()) {
        case "deficient":
            return { backgroundColor: "#dc3545", color: "#fff" }; // Rojo
        case "improvable":
            return { backgroundColor: "#ff8000", color: "#000" }; // Naranja
        case "good":
            return { backgroundColor: "#0d6efd", color: "#fff" }; // Azul
        case "very good":
            return { backgroundColor: "#7be800", color: "#fff" }; // Verde claro
        case "exceptional":
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
    return (
        <LayoutLogin>
            <Container sx={{display:'flex', textAlign:'justify',m:1, gap:'5%'}}>
                <BackButton url={`/dashboard/trainning/IA`}/>
                <Typography variant='h2'> {loading ? <Skeleton variant="rounded" width={'50%'} /> : `AI Trainning`} </Typography>
            </Container>
            <Typography variant='subtitle2' sx={{ mt:3, ml:20 }}>
                Here you can consult the general analyzer.
            </Typography>

            {/* Controles de entrenamiento */}
            <Container sx={{width:"100%", display:"flex", justifyContent:"center", alignContent:"center", mt:4, flexDirection:'column', gap:2}}>
                <Card>
                    <CardContent sx={{display:"flex", justifyContent:"justify", alignContent:"center", flexDirection:'column', gap:2, }}>
                    {/* Selección de cámara */}
                    <FormControl size="small" >
                        <FormLabel htmlFor="camaraSelect">📷 Select camera::</FormLabel>
                            <Select
                                value={selectedDeviceId}
                                label="cameraSelect"
                                id="cameraSelect"
                                onChange={
                                    (e) => {
                                        const selectedId = e.target.value;
                                        setSelectedDeviceId(selectedId);
                                        startCamera(selectedId); // Cambiar a la nueva cámara seleccionada
                                    }
                                }
                                displayEmpty
                            >
                                {devices.map((device, index) => (
                                    <MenuItem key={device.deviceId} value={device.deviceId}>
                                        {device.label || `Cámara ${index + 1}`}
                                    </MenuItem>
                                ))}
                            </Select>
                    </FormControl>
                    {!isTraining && selectedDeviceId && (
                        <Container>
                            <myVideo ref={videoRef} autoPlay playsInline className="border border-3 border-primary rounded shadow"></myVideo>
                        </Container>
                    )}
                    <FormControl sx={{width:"30%"}} size="small" >
                        <FormLabel htmlFor="time">Time:</FormLabel>
                            <Select
                                value={selectedTime}
                                label="time"
                                id="time"
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
                    <Container sx={{display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px",}}>
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
                            startIcon={<DoDisturbOnTwoToneIcon/>}
                            onClick={stopTraining}
                            disabled={!isTraining}>
                                Stop
                        </Button>
                    </Container>
                    </CardContent>
                </Card>
                {/* {jsonData && //TO DO: checar con datos */}
                    <Container sx={{display:"flex", justifyContent:"center", alignContent:"center", flexDirection:'row', gap:2}}>
                        <Paper 
                            sx={{display:"flex", justifyContent:"center", alignContent:"center"}}>
                            <canvas 
                                ref={canvasRef} 
                                width="840" 
                                height="580" 
                                className="border border-3 border-primary rounded shadow"
                            ></canvas>
                        </Paper>
                        <Card>
                            <CardHeader
                                title='Data and Prediction: '/>
                            <CardContent>
                                <Typography>Current Stats: </Typography>
                                {jsonData ? (//className="list-group list-group-flush" TO DO: checar con datos
                                <StyledList >  
                                    <ListItem>
                                        <ListItemText>Shots: <strong>{jsonData.shots < 0 ? 0 : jsonData.shots}</strong></ListItemText>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText>Shooting attempts: <strong>{jsonData.attempted_shot < 0 ? 0 : jsonData.attempted_shot}</strong></ListItemText>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText>Elapsed time: <strong>{jsonData.time < 0 ? 0 : jsonData.time}s</strong></ListItemText>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText>Duration with ball held: <strong>{jsonData.ball_held < 0 ? 0 : jsonData.ball_held}s</strong></ListItemText>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText>Dribbles: <strong>{jsonData.dribbles < 0 ? 0 : jsonData.dribbles}</strong></ListItemText>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText>Toques: <strong>{jsonData.touches < 0 ? 0 : jsonData.touches}</strong></ListItemText>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText>Steps: <strong>{jsonData.steps < 0 ? 0 : jsonData.steps}</strong></ListItemText>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText>Double: <strong>{jsonData.double_dribbles < 0 ? 0 : jsonData.double_dribbles}</strong></ListItemText>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText>Travels: <strong>{jsonData.travels < 0 ? 0 : jsonData.travels}</strong></ListItemText>
                                    </ListItem>
                                </StyledList>
                                ) : (
                                    <Typography variant='body1' sx={{ml:5}}>No data yet...</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Container>
                {/* } */}
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
                open={showInfoModal}///// showInfoModal
                handleClose={() => setShowInfoModal(false)}
                modalBody={
                <Container>
                    <Typography>Make sure you meet the following requirements before beginning your training. ✅</Typography>
                    <Typography>Individual training is focused on measuring <strong>the performance of a single player </strong>per training session and not of a team of players. 🏀</Typography>
                    <Typography>Camera placement recommendations for optimal analysis:</Typography>
                    <StyledBox>
                        <StyledBoxIMG
                        src={`${URL_SERVER}/utils/uploads/tripie.jpg`}
                        alt="Cámara en trípode tomando una foto"
                        sx={{ width: "250px", height: "auto"}}
                        />
                    </StyledBox>
                    <StyledListNumber component='ol'>
                        <ListItem component='li'>
                            <ListItemText>The player must occupy at least <strong>60% of the frame</strong> or full body view during training. 🤾‍♂️</ListItemText>
                            <StyledBox>
                                <StyledBoxIMG 
                                    src={`${URL_SERVER}/utils/uploads/60camara.png`}
                                    alt="60 de Camara"
                                    sx={{ width: "650px", height: "auto"}}
                                />
                            </StyledBox>
                        </ListItem>
                        <ListItem component='li'>
                            <ListItemText>The playing area should be as <strong>centered</strong> and focused as possible.📷</ListItemText>
                            <StyledBox>
                                <StyledBoxIMG
                                    src={`${URL_SERVER}/utils/uploads/centro_camara.jpg`}
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
                                    src={`${URL_SERVER}/utils/uploads/distanciaCamara.png`}
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
                                src={`${URL_SERVER}/utils/uploads/altura.jpg`}
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
                                src={`${URL_SERVER}/utils/uploads/iluminacion.jpg`}
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
                                src={`${URL_SERVER}/utils/uploads/cancha_frontal.jpg`}
                                alt="Cancha frontal" sx={{ width: "200px", height: "auto",}} 
                                />
                            ✅
                            <StyledBoxIMG
                                src={`${URL_SERVER}/utils/uploads/cancha_lateral.jpg`}
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