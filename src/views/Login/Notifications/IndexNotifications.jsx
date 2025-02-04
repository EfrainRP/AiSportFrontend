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

import axiosInstance from "../../../services/axiosConfig.js";
import { useAuth } from '../../../services/AuthContext.jsx'; //  AuthContext
import LayoutLogin from '../../LayoutLogin.jsx';

const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server

export default function IndexNotifications() {
    const [notifications, setNotifications] = React.useState([]);
    const { user, loading, setLoading } = useAuth(); // Accede al usuario autenticado 
    const [check, setCheck] = React.useState(false);
    const [checkDelete, setCheckDelete] = React.useState(false);

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
                console.error('Error al obtener las notificaciones:', error);
                //setLoading(false); // Cambiar el estado de carga incluso en caso de error
            });
        };

        if (user) {
            fetchData(); // Llamar a la función solo si el usuario está definido
        }
    }, [user]);

    // Función para manejar la actualizar de notificaciones
    const denyNotifications = async (notificacionId) => {
        setCheckDelete(true);
        await axiosInstance.put(`/notificaciones/${notificacionId}`, {status: "rejected"})
        .then((response)=>{
            console.log(response.data);
            alert('Notificación denegada con éxito.');
        }).catch((err)=>{
            console.error(err);
            setCheckDelete(false);
            // Verifica si hay una respuesta del servidor con un mensaje de error
            if (err.response && err.response.data && err.response.data.message) {
                alert(err.response.data.message); // Muestra el mensaje del backend
            } else {
                alert('Ocurrió un error al denegar la notificación.'); // Error genérico
            }
        });
    };
    // Función para manejar la aceptación de notificaciones
    const acceptNotification = async (notificacionId, torneoId) => {
        setCheck(true);
        // Enviar la solicitud DELETE para aceptar la notificación
        await axiosInstance.delete(`/notificacion/${user.userId}/${torneoId}`)
        .then((response)=>{
            // Eliminar la notificación aceptada del estado
            setNotifications((prev) => prev.filter((n) => n.id !== notificacionId));
            
            alert('Notificación aceptada con éxito.');
        }).catch((err)=>{
            console.error('Error al aceptar la notificación:', err);
            setCheck(false);
            // Verifica si hay una respuesta del servidor con un mensaje de error
            if (err.response && err.response.data && err.response.data.message) {
                alert(err.response.data.message); // Muestra el mensaje del backend
            } else {
                alert('Ocurrió un error al aceptar la notificación.'); // Error genérico
            }
        });
    };

    return (
        <LayoutLogin>
            <Typography variant='h2'> {loading ? <Skeleton variant="rounded" width={'30%'} /> : `Welcome ${user.userName.toUpperCase() || 'invitado'}`} </Typography>
            <Typography variant='h3' sx={{ mb: 2, ml:10 }}> {loading ? <Skeleton variant="rounded" width={'20%'} sx={{my: 2}}/> : 'to your notifications !'} </Typography>
            <Typography variant='subtitle2' sx={{ mt:3 }}>
                {loading ? 
                    <Skeleton variant="rounded" width={'31%'}/> 
                    : 
                    'Here you can see your notifications information.'
                }
            </Typography>
            <Box sx={{ width: '100%', height: 'auto', my:3, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                
                    {loading?
                        ( <Skeleton variant="rounded" width={'95%'} height={390}/> )
                        :
                        (notifications.length > 0?
                            (
                            <List component={Card} sx={{width:"93%"}}>
                                {notifications.map((note, i) => {
                                    const colorStatus = note.status == 'rejected'? 'error' : 'success';
                                return (
                                <ListItem key={i}
                                    secondaryAction={
                                        <ButtonGroup edge="end" variant="contained">
                                            <Button color="success" aria-label="actionNote" startIcon={ check? <CheckCircleRoundedIcon/> : <RadioButtonUncheckedIcon/> } onClick={() => acceptNotification(note.id, note.torneo_id)}>
                                                Accept
                                            </Button>
                                            <Button color="error" aria-label="actionNote" startIcon={checkDelete? <CheckCircleRoundedIcon/> : <DoDisturbAltOutlinedIcon/>} onClick={() => denyNotifications(note.id)}>
                                                Deny
                                            </Button>
                                        </ButtonGroup>
                                    } 
                                >
                                    <ListItemAvatar>
                                        <Avatar src={URL_SERVER+`/utils/uploads/${note.equipos.image !== 'logoEquipo.jpg' ? note.equipos.image : 'logoEquipo.jpg'}`}/>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={<Typography>Your request for <Typography component={'strong'} color={'primary'}>team {note.equipos?.name}</Typography> was <Typography component={'strong'} color={colorStatus}>{note.status}</Typography> for <Typography component={'strong'} color={'primary.light'}>tournament {note.torneos?.name}.</Typography></Typography>}
                                        secondary= {<Typography>For more information, please contact the admin <Typography component={'strong'} color={'secondary.main'}>{note.torneos?.users?.name} ({note.torneos?.users?.email})</Typography></Typography>}
                                    />
                                </ListItem>)
                                })}
                            </List>)
                            :
                            (<Card variant="outlined" sx={{display:'flex', justifyContent:'center'}}>
                                <CardContent>
                                    <Typography gutterBottom variant="subtitle2" component="div" sx={{textAlign: 'center' }}>
                                        You don't have any notifications registered yet.
                                    </Typography>
                                </CardContent>
                            </Card>
                            )
                        )
                    }
                
            </Box>
        </LayoutLogin>
    );
};