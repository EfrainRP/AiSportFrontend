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
    Grow  
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import axiosInstance from "../../../services/axiosConfig.js";
import { useAuth } from '../../../services/AuthContext.jsx'; //  AuthContext
import LayoutLogin from '../../LayoutLogin.jsx';

const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server

export default function Search() {
    // const [notifications, setNotifications] = React.useState([]);
    const { user, loading, setLoading } = useAuth(); // Accede al usuario autenticado 
    const [data, setData] = React.useState({ torneos: [], equipos: [], proximosPartidos: [] }); // Estado para almacenar torneos y equipos
    // const [check, setCheck] = React.useState(false);

    React.useEffect(() => {
        const fetchData = async () => {
            await axiosInstance.get(`/dashboard/${user.userId}`)
            .then((response) => {
                setTimeout(() => {
                  setLoading(false); // Cambia el estado para simular que la carga ha terminado
                }, 1500); // Simula tiempo de carga
                setData(response.data); // Establecer los datos en el estado
                console.log(response.data);
            }).catch((error) => {
                console.error('Error al obtener los datos del dashboard:', error);
                setLoading(false); // Cambiar el estado de carga incluso en caso de error
            });
        }
        if (user) {
            fetchData(); // Llamar a la función solo si el usuario está definido
        }
    }, [user]);

    return (
        <LayoutLogin>
            <Typography variant='h2'> 
                {loading ? <Skeleton variant="rounded" width={'30%'} /> : `Hello ${user.userName.toUpperCase() || 'invitado'}`} 
            </Typography>
            <Typography variant='subtitle2' sx={{ mt:3 }}>
                {loading ? 
                    <Skeleton variant="rounded" width={'31%'}/> 
                    : 
                    'Here you can search any tournaments or teams.'
                }
            <Autocomplete
                autoComplete
                autoSelect
                includeInputInList
                selectOnFocus
                options={data}
                getOptionLabel={(option)=>option.name} // Muestra el nombre como etiqueta
                isOptionEqualToValue={(option, value) => option.id === value.id} // Compara por `id`
                value={valueAutoComplete}
                onChange={(event, newValue) => setValueAutoComplete(newValue)}
                size="medium"
                sx={{ width: '50%'}}
                renderInput={(params) => <TextField {...params} label="Choose a team" color='dark' />}
                />
            </Typography>
        </LayoutLogin>
    );
};