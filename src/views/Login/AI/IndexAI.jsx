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
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import axiosInstance from "../../../services/axiosConfig.js";
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../services/AuthContext.jsx'; //  AuthContext

import LayoutLogin from '../../LayoutLogin.jsx';
import LoadingView from '../../../components/Login/LoadingView.jsx';
import LoadingCard from '../../../components/Login/LodingCard.jsx';

// const CustomAutocomplete = styled(Autocomplete)({
//     "& .MuiAutocomplete-popupIndicator": {
//         outline: "none",
//         border: "none",
//         "&:focus": {
//         outline: "none",
//         },
//         "&:active": {
//         outline: "none",
//         },
//         fontSize: "16px", // Tamaño del icono
//     width: "20px",    // Ancho más pequeño
//     height: "20px",   // Altura más pequeña
//     padding: "2px",   // Espaciado interno reducido
//     },
// });

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

export default function IndexAI() {
    const { user, loading, setLoading } = useAuth(); // Accede al usuario autenticado y al método logout
    const [stats, setStats] = React.useState([]);
    const [error, setError] = React.useState(null);

    const [selectedTeam, setSelectedTeam] = React.useState(null); // Estado para almacenar el equipo seleccionado
    
    React.useEffect(() => {
        const fetchStats = async () => {
            await axiosInstance.get(`/estadisticas/${user.userId}`)
                .then((response) => {
                    setStats(response.data.data);
                    setLoading(false);
                }).catch((err) => {
                    setError("Error to get the stadistics.");
                    setLoading(true);
                })
        };
        fetchStats();
    }, [user.userId]);
    if(error || loading){ 
        return (
        <LoadingView 
            message={error}
        />);
    }
    if(stats.length === 0){
        return (
            <LayoutLogin>
                <Typography variant='h2'> {loading ? <Skeleton variant="rounded" width={'50%'} /> : `AiSport Performance Analyzer`} </Typography>
                <Container sx={{ display:'flex', alignContent:'center', justifyContent: 'center', width:'45%', mt:10}} >
                    <LoadingCard sx={{textAlign:'center'}} message={"Maybe teams with a minimum match played may not be available that contain statistics for a training session."}/>
                </Container>
            </LayoutLogin>
        );
    }
    return (
        <LayoutLogin>
            <Typography variant='h2' sx={{ml:7}}> {loading ? <Skeleton variant="rounded" width={'50%'} /> : `AiSport Performance Analyzer`} </Typography>
            <Typography variant='subtitle2' sx={{ mt:3, ml:7 }}>
                Here you can consult the general analyzer.
            </Typography>
            <Container sx={{display:'flex', alignItems:'center', justifyItems:'center', mt:4, flexDirection:'column', gap:2}}>
                <Card variant='outlined'>
                    <Typography variant='h6'>
                        Choose your team to upgrade or add their stats:
                    </Typography>
                    <Typography 
                        component='label' 
                        variant='subtitle2' 
                        sx={[( theme ) => ({
                            color: (theme.vars || theme).palette.grey[400],
                            my:-1
                        })]}>
                            Choose a team:
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
                        renderInput={(params) => <TextField {...params} sx={{fontSize: '1px'}}
                        placeholder={'Select any team'}/>}
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
                <Button 
                    color='secondary' 
                    variant="contained"
                    sx={{width:'40%'}}
                    startIcon={<TrendingUpIcon/>}
                    href={`/dashboard/trainning/personal/IA/${user.userName}`}>
                    Personal Stats
                </Button>
            </Container>
        </LayoutLogin>
    );
};