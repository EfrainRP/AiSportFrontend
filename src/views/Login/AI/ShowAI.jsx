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
    Alert,

} from '@mui/material';
// import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
const apiUrl = import.meta.env.VITE_URL_SERVER;
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DoDisturbOnTwoToneIcon from '@mui/icons-material/DoDisturbOnTwoTone';
import UploadIcon from '@mui/icons-material/Upload';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import PieChartIcon from '@mui/icons-material/PieChart';

import axiosInstance from "../../../services/axiosConfig.js";
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../services/AuthContext.jsx'; //  AuthContext
import WelcomeSection from '../../../components/Login/UserWelcome.jsx';
import LayoutLogin from '../../LayoutLogin.jsx';
import LoadingView from '../../../components/Login/LoadingView.jsx';
import DialogComponent from '../../../components/Login/DialogComponent.jsx';
import BackButton from '../../../components/Login/BackButton.jsx';

const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server
const centerJustifyAlign = { display: "flex", justifyContent: "center", alignContent: "center" };

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
    display: 'flex',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 2,
}));
const StyledBoxIMG = styled('img')(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 2, // Aplica border-radius
    filter: "grayscale(100%)",
    transition: "filter 0.3s ease", // Agrega animación al efecto
    "&:hover": {
        filter: "grayscale(50%)", // Quita el efecto al pasar el mouse
    },
}));
const MyVideo = styled('video')(({ theme }) => ({
    border: "3px solid",
    borderColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[3],
    // padding: theme.spacing(1, 3),
}));

// const Card = styled(MuiCard)(({ theme }) => ({
//     display: 'flex',
//     flexDirection: 'column',
//     alignSelf: 'center',
//     // width: '100%',
//     // height: '100%',
//     //margin: theme.spacing(2),
//     gap: theme.spacing(5),
//     // margin: 'auto',
//     [theme.breakpoints.up('sm')]: {
//         maxWidth: '450px',
//         gap: theme.spacing(2),
//         // margin: theme.spacing(4),
//     },
//     boxShadow:
//         'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
//     ...theme.applyStyles('dark', {
//         boxShadow:
//             'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
//     }),
// }));

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
    const [dataAlert, setDataAlert] = React.useState({}); //Mecanismo Alert
    const [openSnackBar, setOpenSnackBar] = React.useState(false); // Mecanismo snackbar
    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
    };

    const videoRef = React.useRef(null); // Referencia para el elemento <video>
    const canvasRef = React.useRef(null); // Referencia para el elemento <canvas>
    const websocketRef = React.useRef(null);
    const mediaStreamRef = React.useRef(null);

    // Estados para controlar los modales
    const [showPredictionModal, setShowPredictionModal] = React.useState(false);
    const [isManualClose, setIsManualClose] = React.useState(false);
    const [showInfoModal, setShowInfoModal] = React.useState(() => {
        // Lee el valor de localStorage y conviértelo a booleano
        const storedValue = localStorage.getItem("stateModalTip");
        const stateModalTip = storedValue === null ? true : JSON.parse(storedValue);
        return stateModalTip;  // Devuelve el valor booleano
    });
    const [isAnalyzing, setIsAnalyzing] = React.useState(false); // Estado para controlar el spinner

    // Devices
    const [devices, setDevices] = React.useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = React.useState("");

    const [hasPermission, setHasPermission] = React.useState(null);
    const [stream, setStream] = React.useState(null);

    const [uploadedVideo, setUploadedVideo] = React.useState(null); // Estado para el archivo de video subido
    const [videoFile, setVideoFile] = React.useState(null); // Estado para el archivo de video subido
    const [videoDuration, setVideoDuration] = React.useState(0); // Duración del video subido

    React.useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(() => {
                navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
                    const videoDevices = deviceInfos.filter(device => device.kind === "videoinput");
                    setDevices(videoDevices);
                });
            })
            .catch((error) => {
                console.error("Permiso de cámara denegado:", error);
            });
    }, []);

    // React.useEffect(() => {
    //     // Obtener todas las cámaras disponibles
    //     navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
    //         const videoDevices = deviceInfos.filter(
    //             device => device.kind === "videoinput" && device.deviceId !== "");
    //         setDevices(videoDevices);
    //     });
    // },[hasPermission]);

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
                setDataAlert({ severity: "info", message: `Selected camera: ${devices.find(d => d.deviceId === deviceId)?.label}` });
                setOpenSnackBar(true);
                // Si hay un video subido, descartarlo
                if (videoFile) {
                    setVideoFile(null);
                    setUploadedVideo(null);
                    setVideoDuration(0);
                }
            })
            .catch((error) => {
                setOpenSnackBar(true);
                setDataAlert({ severity: "error", message: "The selected camera could not be accessed." });
                
                console.error("Error accessing the camera:", error);
            });
    };

    // // Función para detener la cámara
    // const stopCamera = (stream) => {
    //     stream.getTracks().forEach(track => {
    //         track.stop();  // Detener cada pista (video o audio)
    //     });
    //     console.log("Cámara apagada");
    // };

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
        await axiosInstance.put(url, {
            datos: data,
            prediccion: prediction
        })
        .then((res)=>{
            console.log(`Datos enviados correctamente a ${url}`);
        })
        .catch((err)=>{
            console.error(`Error al enviar datos a ${url}`, err);
        });

    };

    const startTraining = async () => {
        if (!selectedDeviceId && !videoFile) {
            setDataAlert({ severity: "warning", message: "Please select a camera before starting training."});
            setOpenSnackBar(true);
            return;
        }

        setIsTraining(true);
        setIsManualClose(false);

        try {
            if (videoFile) {
                // Si se subió un video, usarlo en lugar de la cámara
                setIsAnalyzing(true); // Mostrar el spinner
                const video = document.createElement('video');
                video.src = URL.createObjectURL(videoFile);
                video.play();

                // Esperar a que el video cargue la duración
                video.onloadedmetadata = () => {
                    setVideoDuration(video.duration); // Guardar la duración del video
                };

                websocketRef.current = new WebSocket(import.meta.env.VITE_URL_IA);
                websocketRef.current.onopen = () => {
                    setDataAlert({ severity: "success", message: "AiSport: Successful Training Connection."});
                    setOpenSnackBar(true);
                    websocketRef.current.send(JSON.stringify({
                        start: true,
                        time: Math.ceil(videoDuration), // Enviar la duración del video
                    }));

                    let lastSendTime = 0;
                    const frameInterval = 1 / 155;  // 15 FPS

                    const sendFrame = async () => {
                        if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
                            return; // No envía si el WebSocket no está abierto
                        }

                        const now = performance.now();
                        if (now - lastSendTime >= frameInterval) {
                            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                                const canvas = new OffscreenCanvas(640, 480);
                                const context = canvas.getContext('2d');
                                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                                // Convertir el frame a WebP usando convertToBlob()
                                const blob = await canvas.convertToBlob({ type: 'image/webp', quality: 0.7 });

                                // Convertir Blob a Base64 para enviarlo por WebSocket
                                const reader = new FileReader();
                                reader.readAsDataURL(blob);
                                reader.onloadend = () => {
                                    const imageData = reader.result;
                                    if (imageData.length > 100) {
                                        websocketRef.current.send(imageData);
                                    }
                                };

                                lastSendTime = now; // Actualiza el tiempo del último envío
                            }
                        }

                        if (!video.ended) {
                            requestAnimationFrame(sendFrame);
                        }
                    };

                    sendFrame();
                };
            } else {
                // Si no se subió un video, usar la cámara
                setIsAnalyzing(false); // No mostrar el spinner
                const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: selectedDeviceId } } });
                mediaStreamRef.current = stream;
                const video = document.createElement('video');
                video.srcObject = stream;
                video.play();

                websocketRef.current = new WebSocket(import.meta.env.VITE_URL_IA);
                websocketRef.current.onopen = () => {
                    setDataAlert({ severity: "success", message: "AiSport: Successful Training Connection."});
                    setOpenSnackBar(true);
                    websocketRef.current.send(JSON.stringify({
                        start: true,
                        time: parseInt(selectedTime), // Enviar el tiempo seleccionado
                    }));

                    let lastSendTime = 0;
                    const frameInterval = 1 / 155;  // 15 FPS

                    const sendFrame = async () => {
                        if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
                            return; // No envía si el WebSocket no está abierto
                        }

                        const now = performance.now();
                        if (now - lastSendTime >= frameInterval) {
                            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                                const canvas = new OffscreenCanvas(640, 480);
                                const context = canvas.getContext('2d');
                                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                                // Convertir el frame a WebP usando convertToBlob()
                                const blob = await canvas.convertToBlob({ type: 'image/webp', quality: 0.7 });

                                // Convertir Blob a Base64 para enviarlo por WebSocket
                                const reader = new FileReader();
                                reader.readAsDataURL(blob);
                                reader.onloadend = () => {
                                    const imageData = reader.result;
                                    if (imageData.length > 100) {
                                        websocketRef.current.send(imageData);
                                    }
                                };

                                lastSendTime = now; // Actualiza el tiempo del último envío
                            }
                        }

                        requestAnimationFrame(sendFrame);
                    };

                    sendFrame();
                };
            }

            websocketRef.current.onmessage = (event) => {
                const data = JSON.parse(event.data);

                if (data.prediction) {
                    setPrediction(data.prediction);
                    setIsAnalyzing(false); // Ocultar el spinner cuando se recibe la predicción
                } else {
                    setJsonData(data);
                }

                if (data && data.prediction) {
                    console.log(data);
                    console.log(data.prediction);
                    sendDataToServer(`${apiUrl}/entrenamiento/equipo/AI/${teamId}`, data, data.prediction);
                    sendDataToServer(`${apiUrl}/entrenamiento/user/AI/${user.userId}`, data, data.prediction);
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
                setDataAlert({ severity: "error", message: `AiSport: WebSocket error: ${error.message}`});
                setOpenSnackBar(true);
                setIsAnalyzing(false); // Ocultar el spinner en caso de error
            };

            websocketRef.current.onclose = () => {
                if (isManualClose) {
                    setDataAlert({ severity: "error", message: "The training has been interrupted due to an unexpected problem, the connection has been terminated."});
                } else if (prediction) {
                    setDataAlert({ severity: "success", message: "AiSport: Connection completed successfully."});
                } else {
                    setDataAlert({ severity: "error", message: "The training has been interrupted due to an unexpected problem, the connection has been terminated."});
                }
                setOpenSnackBar(true);
                setIsAnalyzing(false); // Ocultar el spinner en caso de error
                // Reiniciar la selección de la cámara
                resetCameraSelection();
            };
        } catch (error) {
            console.error("Error al acceder a la cámara:", error);
            setDataAlert({ severity: "error", message: "Error accessing the camera. Make sure you allow camera access."});
            setOpenSnackBar(true);
            setIsTraining(false);
            setIsAnalyzing(false); // Ocultar el spinner en caso de error
        }
    };

    const stopTraining = () => {
        setIsTraining(false);
        setIsManualClose(true);
        setIsAnalyzing(false); // Ocultar el spinner en caso de error
        if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
            websocketRef.current.send(JSON.stringify({ stop: true }));
            setTimeout(() => {
            websocketRef.current.close();
            setDataAlert({ severity: "success", message: "AiSport: Connection completed successfully."});
            setOpenSnackBar(true);
    
            const context = canvasRef.current.getContext("2d");
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
            // Reiniciar la selección de la cámara
            resetCameraSelection();
        }, 1000);
        } else {
            setDataAlert({ severity: "info", message: "The connection to the server is terminated."});
            setOpenSnackBar(true);
            // Reiniciar la selección de la cámara
            resetCameraSelection();
        }
    
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
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

    const handleVideoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setVideoFile(file);
            setUploadedVideo(URL.createObjectURL(file));
    
            // Obtener la duración del video
            const video = document.createElement('video');
            video.src = URL.createObjectURL(file);
            video.onloadedmetadata = () => {
                setVideoDuration(video.duration); // Guardar la duración del video
            };
    
            // Si hay una cámara seleccionada, restablecerla
            if (selectedDeviceId) {
                resetCameraSelection();
                setSelectedDeviceId("");
            }
        }
    };

    // Efecto para abrir automáticamente el modal de predicción cuando prediction.performance deje de ser null
    React.useEffect(() => {
        if (prediction?.performance) {
            setShowPredictionModal(true); // Abre el modal cuando prediction.performance tenga un valor
            stopTraining(); // Cerrar la conexión automáticamente
        }
    }, [prediction]);

    // React.useEffect(() => {
    //     setShowInfoModal(true);
    // }, []);

    if (loading) {
        return (
            <LoadingView />);
    }
    return (
        <LayoutLogin>
            {/* Aqui puso un spinner de carga */}
            <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnackBar} anchorOrigin={{ vertical: 'top', horizontal: 'center'}}>
                <Alert
                    severity={dataAlert.severity}
                    variant='filled'
                    sx={{ width: '70%', display: 'flex', textAlign: 'center'}}
                    onClose={handleCloseSnackBar}
                >
                    {dataAlert.message}
                </Alert>
            </Snackbar>
            <BackButton url={`/dashboard/trainning/IA`} />
             <WelcomeSection 
                            user={user} 
                            loading={loading} 
                            subtitle="To AI Training" 
                            description="In this section you will be able to train and prove your habilities." 
                            />
            {/* Controles de entrenamiento */}
            <Stack useFlexGap spacing={2} sx={{ ...centerJustifyAlign, mt: 4 }}>
                <Container>
                    <Card sx={{ ...centerJustifyAlign, flexDirection: 'row', gap: 2 }}>
                        <CardContent sx={{ ...centerJustifyAlign, gap: 1 }}>
                            <FormControl sx={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
                                <input
                                    id="videoUpload"
                                    type="file"
                                    accept="video/*"
                                    onChange={handleVideoUpload}
                                    disabled={isTraining}
                                    style={{ display: 'none' }} // ocultamos el input nativo, para utilizar nuestro boton, enlazado con label y nuestro boton Material UI
                                />
                                <FormLabel htmlFor="videoUpload" sx={{m:0}}>
                                    <Button
                                        variant="contained"
                                        component="span"
                                        startIcon={<UploadIcon />}
                                        disabled={isTraining}
                                    >
                                        Upload video
                                    </Button>
                                </FormLabel>
                            </FormControl>
                            
                            {/* Selección de cámara */}
                            <FormControl>
                                <FormLabel htmlFor="camaraSelect">📷 Select camera:</FormLabel>
                                <Select
                                    value={selectedDeviceId}
                                    label="cameraSelect"
                                    id="cameraSelect"
                                    onChange={
                                        (e) => {
                                            setSelectedDeviceId(e.target.value);
                                            startCamera(e.target.value); // Cambiar a la nueva cámara seleccionada
                                        }
                                    }
                                    // sx={{width:500}}
                                    displayEmpty
                                    disabled={!!jsonData}
                                // renderValue={(selected)=>{
                                //     if (selected?.length === 0){
                                //         return <em>No camera</em>
                                //     }
                                //     const selectedDevice = devices.find(device => device.deviceId === selected);
                                //     return selectedDevice ? selectedDevice.label : selected; // Muestra el nombre de la cámara, si existe
                                // }}
                                >
                                    <MenuItem key={0} value=''>No camera</MenuItem>
                                    {devices.map((device, index) => {

                                        return (<MenuItem key={device.deviceId} value={device.deviceId}>
                                            {device.label || `Camera ${index + 1}`
                                            }
                                        </MenuItem>);
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl size="small" >
                                <FormLabel htmlFor="time">Time:</FormLabel>
                                <Select
                                    value={selectedTime}
                                    label="time"
                                    id="time"
                                    onChange={handleChangeSelect}
                                    displayEmpty
                                    disabled={!!jsonData}
                                >
                                    <MenuItem value={"30"}>30 seg</MenuItem>
                                    <MenuItem value={"60"}>1 min</MenuItem>
                                    <MenuItem value={"120"}>2 min</MenuItem>
                                    <MenuItem value={"180"}>3 min</MenuItem>
                                    <MenuItem value={"240"}>4 min</MenuItem>
                                    <MenuItem value={"300"}>5 min</MenuItem>
                                </Select>
                            </FormControl>
                        </CardContent>
                        {/* sx={{display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px",}} */}
                        <CardActions sx={centerJustifyAlign}>
                            <Button
                                variant='contained'
                                color="secondary"
                                startIcon={<FitnessCenterIcon />}
                                onClick={startTraining}
                                disabled={isTraining}>
                                Start
                            </Button>
                            <Button
                                variant='contained'
                                color="warning"
                                startIcon={<DoDisturbOnTwoToneIcon />}
                                onClick={stopTraining}
                                disabled={!isTraining}>
                                Stop
                            </Button>
                        </CardActions>
                    </Card>
                </Container>
                {!isTraining && selectedDeviceId && (
                    <Container sx={{ ...centerJustifyAlign }}>
                        <MyVideo ref={videoRef} autoPlay playsInline/>
                    </Container>
                )}
                {uploadedVideo && (
                    <Container sx={{ ...centerJustifyAlign }}>
                        <MyVideo src={uploadedVideo} controls sx={{width: 300}}/>
                    </Container>
                )}
                {jsonData && //TO DO: checar con datos */}
                    <Container sx={{ ...centerJustifyAlign, flexDirection: 'row', gap: 2 }}>
                        <Paper
                            sx={{ ...centerJustifyAlign }}>
                            <canvas
                                ref={canvasRef}
                                width="840"
                                height="580"
                                className="border border-3 border-primary rounded shadow"
                            ></canvas>
                        </Paper>
                        <Container sx={{ display: 'flex', alignItems: 'center', width: ' 100%' }}>
                            <Card sx={{ height: jsonData ? 'auto' : '25%', width: '100%' }}>
                                <CardHeader sx={{ mb: 2 }}
                                    title='Data and Prediction: ' />
                                <CardContent sx={{ ...centerJustifyAlign, flexDirection: 'column' }}>
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
                                        <Typography variant='body1' sx={{ ml: 5, mt: 2 }}>No data yet...</Typography>
                                    )}
                                </CardContent>
                                {!isTraining &&
                                    <CardActions sx={{display: 'flex', justifyContent: 'center', mt:3}}>
                                        <Button variant='contained' sx={{fontSize:9}} startIcon={<InsertChartIcon/>} href={`/dashboard/trainning/personal/IA/${user.userName}`}>Ind. Stats</Button>
                                        <Button variant='contained' sx={{fontSize:9}} startIcon={<PieChartIcon fontSize='small'/>} href={`/team/${teamName}/${teamId}/stats`}>Team Stats</Button>
                                    </CardActions>
                                }
                            </Card>
                        </Container>
                    </Container>
                }
            </Stack>

            {/*     	Section {Modal / Dialog}         */}

            <DialogComponent
                modalTittle={'Training prediction'}
                modalBody={prediction ? (
                    <Container>
                        <Typography variant='body1'><strong>Performance:</strong> {prediction.performance}</Typography>
                        {prediction.data[9] && (
                            <Typography variant='body1'><strong>Suggestion:</strong> {prediction.data[9]}</Typography>
                        )}
                        <Container sx={{display: 'flex', flexDirection:'row', justifyContent: 'center', mt:1}}>
                            <Button variant='outlined' startIcon={<InsertChartIcon/>} href={`/dashboard/trainning/personal/IA/${user.userName}`}>See Stats</Button>
                            <Button variant='outlined' startIcon={<PieChartIcon fontSize='small'/>} href={`/team/${teamName}/${teamId}/stats`}>See Team Stats</Button>
                        </Container>
                    </Container>
                ) : (
                    <Typography variant='body1'>No prediction data available.</Typography>
                )}
                open={showPredictionModal}
                handleClose={() => setShowPredictionModal(false)} />

            <DialogComponent
                maxWidth={'md'}// ó lg
                modalTittle={'💡AiSport Tips'}
                open={showInfoModal}///// showInfoModal
                handleClose={() => {
                    setShowInfoModal(prevState => {
                        const newState = !prevState;
                        localStorage.setItem("stateModalTip", JSON.stringify(newState));  // Guarda el nuevo estado como string
                        return newState;
                    });
                }}
                modalBody={
                    <Container>
                        <Typography>Make sure you meet the following requirements before beginning your training. ✅</Typography>
                        <Typography>Individual training is focused on measuring <strong>the performance of a single player </strong>per training session and not of a team of players. 🏀</Typography>
                        <Typography>Camera placement recommendations for optimal analysis:</Typography>
                        <StyledBox>
                            <StyledBoxIMG
                                src={`${URL_SERVER}/utils/uploads/tripie.jpg`}
                                alt="Cámara en trípode tomando una foto"
                                sx={{ width: "250px", height: "auto" }}
                            />
                        </StyledBox>
                        <StyledListNumber component='ol'>
                            <ListItem component='li'>
                                <ListItemText>The player must occupy at least <strong>60% of the frame</strong> or full body view during training. 🤾‍♂️</ListItemText>
                                <StyledBox>
                                    <StyledBoxIMG
                                        src={`${URL_SERVER}/utils/uploads/60camara.png`}
                                        alt="60 de Camara"
                                        sx={{ width: "650px", height: "auto" }}
                                    />
                                </StyledBox>
                            </ListItem>
                            <ListItem component='li'>
                                <ListItemText>The playing area should be as <strong>centered</strong> and focused as possible.📷</ListItemText>
                                <StyledBox>
                                    <StyledBoxIMG
                                        src={`${URL_SERVER}/utils/uploads/centro_camara.jpg`}
                                        alt="Centro de Camara"
                                        sx={{ width: "200px", height: "auto", }}

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
                                        sx={{ width: "500px", height: "auto", }}

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
                                        sx={{ width: "500px", height: "auto", }}

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
                                        sx={{ width: "300px", height: "auto", }}

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
                                        alt="Cancha frontal" sx={{ width: "200px", height: "auto", }}
                                    />
                                    ✅
                                    <StyledBoxIMG
                                        src={`${URL_SERVER}/utils/uploads/cancha_lateral.jpg`}
                                        alt="Cancha lateral" sx={{ width: "230px", height: "auto", }}
                                    />
                                </StyledBox>
                            </ListItem>
                        </StyledListNumber>

                        <Typography sx={{ textAlign: 'justify' }}>Done! Now you can start testing your skills in the sport of basketball✅.</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography sx={{ mb: 1 }}><strong> *AiSport Note:</strong> </Typography>
                        <Typography sx={{ textAlign: 'justify' }}>
                            The statistics analyzed to calculate a player's performance are taken based on metrics used in the NBA (National Basketball Association), however, training time can significantly influence the results, which is not considered an official metric in itself, but is used because time is a key factor in the analysis of a measurable individual training.
                        </Typography>
                    </Container>
                } />
        </LayoutLogin>
    );
};