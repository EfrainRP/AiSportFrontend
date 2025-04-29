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
    CardHeader,
    Avatar, alpha
} from '@mui/material';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PsychologyIcon from '@mui/icons-material/Psychology';
import InsightsIcon from '@mui/icons-material/Insights';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WelcomeSection from '../../../components/Login/UserWelcome.jsx';
import axiosInstance from "../../../services/axiosConfig.js";
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../services/AuthContext.jsx'; //  AuthContext
import GroupsIcon from '@mui/icons-material/Groups';
import LayoutLogin from '../../LayoutLogin.jsx';
import LoadingView from '../../../components/Login/LoadingView.jsx';
import LoadingCard from '../../../components/Login/LodingCard.jsx';
const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server
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
            <WelcomeSection 
                user={user} 
                loading={loading} 
                subtitle="To AiSport Performance Analyzer!" 
                description="In this section you will be able to train." 
                />
            <Container 
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mt: 9,
                mb: 9,
                flexDirection: 'column',
                gap: 3,
                width: '100%',
                maxWidth: '800px'
            }}
            >
            {/* Main Card with AI Theme */}
            <Card
                variant="outlined"
                sx={(theme) => ({
                    width: '100%',
                    borderRadius: 2,
                    borderColor: (theme.palette.primary.light, 0.3),
                    boxShadow: theme.shadows[4],
                    background: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.8)  // Fondo en modo oscuro
                    : alpha(theme.palette.background.paper, 0.9),  // Fondo modo claro
                    transition: 'all 0.3s ease',
                    '&:hover': {
                    boxShadow: theme.shadows[8],
                    borderColor: theme.palette.primary.main
                    }
                })}
                >
                <CardHeader
                    avatar={
                    <Avatar
                        sx={(theme) => ({
                        bgcolor: theme.palette.mode === 'dark'
                            ? alpha(theme.palette.secondary.main, 0.2)
                            : alpha(theme.palette.info.dark, 0.4),
                        color: theme.palette.mode === 'dark'
                            ? theme.palette.secondary.main
                            : theme.palette.secondary.dark
                        })}
                    >
                        <SmartToyIcon />
                    </Avatar>
                    }
                    title={
                    <Typography
                        variant="h6"
                        sx={(theme) => ({
                        fontWeight: 700,
                        color: theme.palette.mode === 'dark'
                            ? theme.palette.text.secondary
                            : theme.palette.text.primary,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                        })}
                    >
                        <AutoAwesomeIcon fontSize="small" />
                        Team Performance Optimization
                    </Typography>
                    }
                    subheader="Select a team to analyze and improve with AI"
                    subheaderTypographyProps={{
                    sx: (theme) => ({
                        color: theme.palette.mode === 'dark'
                        ? theme.palette.text.primary
                        : theme.palette.text.secondary,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    })
                    }}
                />

                <Divider sx={{ mx: 2 }} />
                
                <CardContent>
                    <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2
                    }}>
                    <PsychologyIcon 
                    sx={(theme) => ({
                        color: theme.palette.mode === 'dark' 
                        ? theme.palette.secondary.main    // Color para modo dark
                        : theme.palette.primary.dark       // Color para modo light
                    })}
                    />
                    <Typography variant="body2" color="text.primary">
                        Our AI will analyze your team's performance and suggest improvements.
                    </Typography>
                    </Box>

                    <Autocomplete
                    fullWidth
                    autoComplete
                    autoSelect
                    includeInputInList
                    selectOnFocus
                    options={stats}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.equipo_id === value.equipo_id}
                    value={selectedTeam || null}
                    onChange={(e, newValue) => setSelectedTeam(newValue || null)}
                    size="medium"
                    renderInput={(params) => (
                        <TextField
                        {...params}
                        label=""
                        variant="outlined"
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                            <>
                                <GroupsIcon sx={(theme) => ({
                                mr: 1.5,
                                verticalAlign: 'middle',
                                fontSize: '1.5rem',
                                color: theme.palette.mode === 'light'
                                    ? theme.palette.text.secondary
                                    : theme.palette.text.secondary
                                })} />
                                {params.InputProps.startAdornment}
                            </>
                            )
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.5)
                            },
                            mt: 0
                        }}
                        />
                    )}
                    renderOption={(props, option) => (
                        <Box
                        component="li"
                        {...props}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            py: 1.5
                        }}
                        >
                        <Avatar
                            src={`${URL_SERVER}/utils/uploads/${option.image || 'logoEquipo.jpg'}`}
                            sx={{ width: 32, height: 32 }}
                        />
                        <Box>
                            <Typography variant="subtitle1">{option.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                            {option.members} members
                            </Typography>
                        </Box>
                        </Box>
                    )}
                    />
                </CardContent>

                {selectedTeam && (
                    <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<FitnessCenterIcon />}
                        endIcon={<ArrowForwardIcon />}
                        href={`/dashboard/trainning/IA/${selectedTeam.equipo_id}/${selectedTeam.name}`}
                        sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        background: (theme) => `linear-gradient(135deg, ${theme.palette.secondary.dark}, ${theme.palette.primary.main})`,
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: (theme) => theme.shadows[4]
                        },
                        transition: 'all 0.3s ease'
                        }}
                    >
                        AI Training Analysis
                    </Button>
                    </CardActions>
                )}
                </Card>


           {/* Personal Stats Card */}
            <Card
            sx={(theme) => ({
                width: '100%',
                borderRadius: 2,
                border: `1px solid ${theme.palette.secondary.light}`,
                boxShadow: theme.shadows[2],
                backgroundColor: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.5)
                : alpha(theme.palette.grey[50], 0.8),
                '&:hover': {
                boxShadow: theme.shadows[4],
                borderColor: theme.palette.primary.main
                }
            })}
            >
            <CardContent
                sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonSearchIcon
                    sx={(theme) => ({
                    mr: 1.5,
                    verticalAlign: 'middle',
                    fontSize: '2.5rem',
                    color: theme.palette.mode === 'light'
                        ? theme.palette.text.secondary
                        : theme.palette.warning.light
                    })}
                />
                <Typography
                    variant="h6"
                    sx={(theme) => ({
                        color: theme.palette.mode === 'light' 
                        ? theme.palette.primary.dark // Color para el modo claro
                        : theme.palette.primary.light // Mantener el color para el modo oscuro
                    })}
                            >
                    Individual Performance
                    </Typography>

                </Box>

                <Typography
                variant="body2"
                color="text.primary"
                textAlign="center"
                >
                Analyze and improve your personal stats with our AI assistant
                </Typography>

                <Button
                variant="outlined"
                size="large"
                fullWidth
                startIcon={<TrendingUpIcon />}
                endIcon={<InsightsIcon />}
                href={`/dashboard/trainning/personal/IA/${user.userName}`}
                sx={(theme) => ({
                    mt: 1,
                    borderRadius: 2,
                    py: 1.5,
                    borderWidth: 2,
                    borderColor: theme.palette.mode === 'light' 
                    ? theme.palette.success.main // Usando verde del tema para el modo claro
                    : theme.palette.success.light, // Usando verde más claro del tema para el modo oscuro
                    color: theme.palette.mode === 'light' 
                    ? theme.palette.text.primary 
                    : theme.palette.success.light, // Color del texto también en verde
                    '&:hover': {
                    borderWidth: 2,
                    backgroundColor: theme.palette.mode === 'light'
                        ? alpha(theme.palette.secondary.dark, 0.9)
                        : alpha(theme.palette.secondary.main, 0.15),
                    borderColor: theme.palette.success.main, // Hover con el verde del tema
                    color: theme.palette.success.main // Hover de texto en verde
                    }
                })}
                >
                My Personal Stats
                </Button>
            </CardContent>
            </Card>
            </Container>
        </LayoutLogin>
    );
};