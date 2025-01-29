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

import axiosInstance from "../../../services/axiosConfig.js";
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../services/AuthContext'; //  AuthContext

import LayoutLogin from '../../LayoutLogin.jsx';
import LoadingView from '../../../components/Login/LoadingView.jsx';
import ConfirmDialog from '../../../components/Login/ConfirmDialog.jsx';

const FormContainerEdit = styled(Stack)(({ theme }) => ({
    // height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    justifyContent: "space-between",
    margin: theme.spacing(6),
    [theme.breakpoints.up('sm')]: {
        margin: theme.spacing(5),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
        height: 'calc((1 - var(--template-frame-height, 0)) * 155vh)',
        [theme.breakpoints.up('sm')]: {
            height: 'calc((1 - var(--template-frame-height, 0)) * 105vh)',
        },
    },
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

export default function IndexIA() {
    const { user, loading, setLoading } = useAuth(); // Accede al usuario autenticado y al método logout
    const [stats, setStats] = React.useState([]);
    const [error, setError] = React.useState(null);

    const [selectedTeam, setSelectedTeam] = React.useState(null); // Estado para almacenar el equipo seleccionado
    const handleSelectTeam = (equipoId, equipoName) => {
        setSelectedTeam({ equipoId, equipoName }); // Almacena ambos valores
    };
    
    React.useEffect(() => {
        const fetchStats = async () => {
            await axiosInstance.get(`/estadisticas/${user.userId}`)
                .then((response) => {
                    setStats(response.data);
                    setLoading(false);
                }).catch((err) => {
                    setError("Error to get the stadistics.");
                    setLoading(true);
                })
        };
        fetchStats();
    }, [user.userId]);

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
    console.log(stats);
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
    return (
        <LayoutLogin>
            <Typography variant='h2'> {loading ? <Skeleton variant="rounded" width={'50%'} /> : `SportHub Individual Performance Analyzer`} </Typography>
            <Typography variant='subtitle2' sx={{ mt:3 }}>
                Here you can consult the general analyzer.
            </Typography>
            
        </LayoutLogin>
    );
};