import React from 'react';
import {
    Typography,
    Skeleton,
    Box,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Snackbar,
    Alert,
    Card,
    CardActions,
    CardContent,
    CardActionArea,
    ToggleButton,
    ToggleButtonGroup, 
    Button,
    IconButton , 
    Stack,
    TextField ,
    Autocomplete,
    Fab,
    ButtonGroup,
    Grow, 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DoDisturbAltOutlinedIcon from '@mui/icons-material/DoDisturbAltOutlined';
import WelcomeSection from '../../../components/Login/UserWelcome.jsx';
import axiosInstance from "../../../services/axiosConfig.js";
import { useAuth } from '../../../services/AuthContext.jsx'; //  AuthContext
import LayoutLogin from '../../LayoutLogin.jsx';
import LoadingCard from '../../../components/Login/LodingCard.jsx';

const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server

export default function IndexNotifications() {
    const [notifications, setNotifications] = React.useState([]);
    const { user, loading, setLoading } = useAuth(); // Accede al usuario autenticado 
    const [dataAlert, setDataAlert] = React.useState({}); //Mecanismo Alert
    const [openSnackBar, setOpenSnackBar] = React.useState(false); // Mecanismo snackbar

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
    };

    React.useEffect(() => {
        const fetchData = async () => {
            // Obtener notificaciones
            await axiosInstance.get(`/notificaciones/${user.userId}`)
            .then((response) => {
                setNotifications(response.data); // Establecer las notificaciones en el estado
                // console.log(response.data);
                setTimeout(() => {
                    setLoading(false); // Cambia el estado para simular que la carga ha terminado
                }, 1500); // Simula tiempo de carga
            })
            .catch((error) => {
                console.error('Error loading notifications:', error);
                //setLoading(false); // Cambiar el estado de carga incluso en caso de error
            });
        };

        if (user) {
            fetchData(); // Llamar a la función solo si el usuario está definido
        }
    }, [user, notifications]);

    // Función para manejar la actualizar de notificaciones
    const denyNotifications = async (notificacionId) => {
        await axiosInstance.put(`/notificaciones/${notificacionId}`, {status: "rejected"})
        .then((response)=>{
            console.log(response.data);
            // alert('Notificación denegada con éxito.');
            setOpenSnackBar(true);
            setDataAlert({ severity: "warning", message: 'Notification successfully denied.' });
        }).catch((err)=>{
            console.error(err);
            // Verifica si hay una respuesta del servidor con un mensaje de error
            if (err.response && err.response.data && err.response.data.message) {
                // alert(err.response.data.message); // Muestra el mensaje del backend
                setOpenSnackBar(true);
                setDataAlert({ severity: "error", message: err.response.data.message });
            } else {
                // alert('Ocurrió un error al denegar la notificación.'); // Error genérico
                setOpenSnackBar(true);
                setDataAlert({ severity: "error", message: 'An error occurred while denying the notification.' });
            }
        });
    };
    // Función para manejar la aceptación de notificaciones
    const acceptNotification = async (notificacionId, torneoId) => {
        // Enviar la solicitud DELETE para aceptar la notificación
        await axiosInstance.delete(`/notificacion/${user.userId}/${torneoId}`)
        .then((response)=>{
            // Eliminar la notificación aceptada del estado
            setNotifications((prev) => prev.filter((n) => n.id !== notificacionId));
            setOpenSnackBar(true);
            setDataAlert({ severity: "success", message: 'Notificación aceptada con éxito.' });
            // alert('Notificación aceptada con éxito.');
        }).catch((err)=>{
            console.error('Error al aceptar la notificación:', err);
            // Verifica si hay una respuesta del servidor con un mensaje de error
            if (err.response && err.response.data && err.response.data.message) {
                // alert(err.response.data.message); // Muestra el mensaje del backend
                setOpenSnackBar(true);
                setDataAlert({ severity: "error", message: err.response.data.message });
            } else {
                // alert('Ocurrió un error al aceptar la notificación.'); // Error genérico
                setOpenSnackBar(true);
                setDataAlert({ severity: "error", message: 'Ocurrió un error al aceptar la notificación.'});
            }
        });
    };

    return (
        <LayoutLogin>
            <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnackBar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert
                    severity={dataAlert.severity}
                    variant='filled'
                    sx={{ width: '100%' }}
                    onClose={handleCloseSnackBar}
                >
                    {dataAlert.message}
                </Alert>
            </Snackbar>
            <WelcomeSection 
                user={user} 
                loading={loading} 
                subtitle="To your AiSport Notifications!" 
                description="In this section you will be able to administer your notifications." 
                iconName="NotificationsActiveIcon"
                />
            <Box sx={{ width: '100%', height: 'auto', my:3, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                
                    {loading?
                        ( <Skeleton variant="rounded" width={'95%'} height={390}/> )
                        :
                        (notifications.length > 0?
                            (
                            <List component={Card} sx={{width:"93%"}}>
                                {notifications.map((note, i) => {
                                    const colorStatus = note.status == 'rejected' ? 'lightcoral' : 'lightgreen';
                                return (
                                <ListItem key={i}
                                    secondaryAction={
                                        <ButtonGroup edge="end" variant="contained">
                                            <Button color="success" aria-label="actionNote" startIcon={ note.status != 'rejected'? <CheckCircleRoundedIcon/> : <RadioButtonUncheckedIcon/> } onClick={() => acceptNotification(note.id, note.torneo_id)}>
                                                Accept
                                            </Button>
                                            <Button color="error" aria-label="actionNote" startIcon={note.status == 'rejected'? <CheckCircleRoundedIcon/> : <DoDisturbAltOutlinedIcon/>} onClick={() => denyNotifications(note.id)}>
                                                Deny
                                            </Button>
                                        </ButtonGroup>
                                    } 
                                >
                                    <ListItemAvatar>
                                        <Avatar src={`${URL_SERVER}/utils/uploads/${note.equipos && note.equipos.image !== 'logoEquipo.jpg' ? note.equipos.image : 'logoEquipo.jpg'}`}/>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={<Typography>Your request for <Typography component={'strong'} color={'primary.light'}>team {note.equipos?.name}</Typography> was <Typography component={'strong'} color={colorStatus}>{note.status}</Typography> for <Typography component={'strong'} color={'primary.light'}>tournament {note.torneos?.name}.</Typography></Typography>}
                                        
                                        secondary= {<Typography>For more information, please contact the admin <Typography component={'strong'} color={'secondary.main'}>{note.torneos?.users?.name} ({note.torneos?.users?.email})</Typography></Typography>}
                                    />
                                </ListItem>)
                                })}
                            </List>)
                            :
                            (
                                <LoadingCard message={"Maybe you don't have any notifications registered yet."}/>
                            )
                        )
                    }
                
            </Box>
        </LayoutLogin>
    );
};