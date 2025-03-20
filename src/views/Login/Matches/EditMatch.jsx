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
    Container
} from '@mui/material';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';

import axiosInstance from "../../../services/axiosConfig.js";
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../services/AuthContext.jsx'; //  AuthContext

import LayoutLogin from '../../LayoutLogin.jsx';
import BackButton from '../../../components/Login/BackButton.jsx';

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

export default function EditMatch() {
    const { tournamentName, tournamentId, matchId } = useParams();
    const { loading, setLoading } = useAuth(); // Obtención del usuario autenticado
    const navigate = useNavigate();

    const [allTeams, setAllTeams] = React.useState([]);
    const [formData, setFormData] = React.useState({
        equipoLocalId: '',
        equipoVisitanteId: '',
        horaPartido: '',
        fechaPartido: '',
        jornada: '',
        resLocal: 0,
        resVisitante: 0,
    });
    const [formTeam, setFormTeam] = React.useState({ //Autocomplete teams names
        equipoLocal:null,
        equipoVisitante: null,
    }); 

    const [fieldErrors, setFieldErrors] = React.useState({}); // Almacena errores específicos por campo desde el backend
    const [dataAlert, setDataAlert] = React.useState({}); //Mecanismo Alert
    const [openSnackBar, setOpenSnackBar] = React.useState(false); // Mecanismo snackbar
    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
    };
    // useEffect para hacer petición automática de los datos del torneo, partidos y notificaciones
    React.useEffect(() => {
        const fetchAllTeams = async () => {
            await axiosInstance.get(`/equipos/torneo/${tournamentId}`)
                .then((response) => {
                    setAllTeams(response.data);
                    setFieldErrors(null);
                }).catch((err) => {
                    // console.error('Error loading teams:', err);
                    setLoading(true);
                    setFieldErrors("Error loading teams");
                })
        };

        const fetchMatches = async () => {
            await axiosInstance.get(`/partido/${tournamentId}/${matchId}`)
                .then((response) => {
                    const match = response.data;
                    setFormTeam({
                        equipoVisitante: match.equipos_partidos_equipoVisitante_idToequipos,
                        equipoLocal: match.equipos_partidos_equipoLocal_idToequipos
                    });
                    // Formatear hora
                    const timeMatch = match.horaPartido ? match.horaPartido.slice(11, 16) : ''; // HH:mm

                    // Validar y formatear fecha (formato YYYY-MM-DD)
                    const dateMatch = match.fechaPartido ? match.fechaPartido.slice(0, 10) : ''; // YYYY-MM-DD

                    const session = match.jornada ? match.jornada.slice(0, 10) : ''; // YYYY-MM-DD
                    // Toma los datos obtenidos y los reformatea para poderlos mostrar en la vista <-
                    setFormData({
                        equipoLocalId: match.equipoLocal_id || '',
                        equipoVisitanteId: match.equipoVisitante_id || '',
                        horaPartido: match.horaPartido ? match.horaPartido.slice(11, 16) : '', // HH:mm
                        fechaPartido: match.fechaPartido ? match.fechaPartido.slice(0, 10) : '',
                        jornada: match.jornada ? match.jornada.slice(0, 10) : '',
                        resLocal: match.resLocal ?? 0,
                        resVisitante: match.resVisitante ?? 0,
                    });
                    setFieldErrors(null);
                }).catch((err) => {
                    // console.error('Error loading data matches:', err);
                    setLoading(true);
                    setFieldErrors("Error loading data matches");
                })
        };

        fetchAllTeams();
        fetchMatches();
    }, [tournamentId, matchId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axiosInstance.put(`/partido/${tournamentId}/${matchId}`, formData)
            .then((response) => {
                setOpenSnackBar(true);
                setDataAlert({ severity: "success", message: 'Success update Match!' });
                setTimeout(() => navigate(`/tournament/${tournamentName}/${tournamentId}`), 2000);
            })
            .catch((err) => {
                if (err.response && err.response.status === 400) {
                    const { field, message } = err.response.data;
                    if (field) {
                        setFieldErrors((prev) => ({ ...prev, [field]: message }));
                    } else {
                        setOpenSnackBar(true);
                        setDataAlert({severity:"error", message:message});
                    }
                } else {
                    setOpenSnackBar(true);
                    setDataAlert({ severity: "error", message: 'Error update the match.' });
                }
                console.log(err);
            })
    };
    console.log(formData);

    return (
        <LayoutLogin>
            <FormContainerEdit>
                <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnackBar} anchorOrigin={{ vertical: 'top', horizontal: 'center'}}>
                    <Alert
                        severity={dataAlert.severity}
                        variant='filled'
                        sx={{ width: '100%'}}
                        onClose={handleCloseSnackBar}
                    >
                        {dataAlert.message}
                    </Alert>
                </Snackbar>
                <Card variant="outlined">
                    <Container sx={{display:'flex', textAlign:'justify', gap:5}}>
                        <BackButton/>
                        <Typography
                            component="h1"
                            variant="h2"
                            sx={{fontSize: '160%' }}
                        >
                            Edit match to {tournamentName} Tournament
                        </Typography>
                    </Container>
                    
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 2,
                        }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="homeTeam">Home Team:</FormLabel>
                            <Autocomplete
                                autoComplete
                                autoSelect
                                includeInputInList
                                selectOnFocus
                                // inputValue={homeTeam}
                                // onInputChange={(event, newInputValue) => {
                                //     setHomeTeam(newInputValue)}}
                                value={formTeam.equipoLocal || null}
                                onChange={(e, newValue) => {
                                    setFormTeam({
                                        ...formTeam,
                                        equipoLocal: newValue,
                                    });
                                    setFormData({
                                        ...formData,
                                        equipoLocalId: newValue?.id,
                                    });
                                }}
                                options={allTeams}
                                getOptionLabel={(option)=>option?.name?? "The HomeTeam"} // Muestra el nombre como etiqueta
                                isOptionEqualToValue={(option, value) => option?.id === value.id} // Compara por `id`
                                renderInput={(params) => 
                                    <TextField {...params}
                                    placeholder='MyHomeTeam name'
                                    error={!!fieldErrors?.equipo}
                                    helperText={fieldErrors?.equipo}
                                    variant="outlined"
                                    color={!!fieldErrors?.equipo ? 'error' : 'primary'}
                                    />}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="guestTeam">Guest Team:</FormLabel>
                            <Autocomplete
                                autoComplete
                                autoSelect
                                includeInputInList
                                selectOnFocus
                                // inputValue={guestTeam}
                                // onInputChange={(event, newInputValue) => {
                                //     setGuestTeam(newInputValue)}}
                                value={formTeam.equipoVisitante || null}
                                onChange={(e, newValue) => {
                                    setFormTeam({
                                        ...formTeam,
                                        equipoVisitante: newValue,
                                    });
                                    setFormData({
                                        ...formData,
                                        equipoVisitanteId: newValue?.id,
                                    });
                                }}
                                options={allTeams}
                                getOptionLabel={(option)=>option?.name?? "The GuestTeam"} // Muestra el nombre como etiqueta
                                isOptionEqualToValue={(option, value) => option?.id === value.id} // Compara por `id`
                                renderInput={(params) => 
                                    <TextField {...params}
                                    placeholder='MyGuestTeam name'
                                    error={!!fieldErrors?.equipo}
                                    helperText={fieldErrors?.equipo}
                                    variant="outlined"
                                    color={!!fieldErrors?.equipo ? 'error' : 'primary'}
                                    />}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="horaPartido">Match time: </FormLabel>
                            <TextField
                                error={!!fieldErrors?.horaPartido}
                                helperText={fieldErrors?.horaPartido}
                                color={!!fieldErrors?.horaPartido ? 'error' : 'primary'}
                                name="horaPartido"
                                id="horaPartido"
                                type="time"
                                fullWidth
                                required
                                variant="outlined"
                                value={formData.horaPartido || ''}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="fechaPartido">Match day: </FormLabel>
                            <TextField
                                error={!!fieldErrors?.fechaPartido}
                                helperText={fieldErrors?.fechaPartido}
                                color={!!fieldErrors?.fechaPartido ? 'error' : 'primary'}
                                name="fechaPartido"
                                id="fechaPartido"
                                type="date"
                                fullWidth
                                required
                                variant="outlined"
                                value={formData.fechaPartido || ''}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="jornada">Match day: </FormLabel>
                            <TextField
                                error={!!fieldErrors?.jornada}
                                helperText={fieldErrors?.jornada}
                                color={!!fieldErrors?.jornada ? 'error' : 'primary'}
                                name="jornada"
                                id="jornada"
                                type="date"
                                fullWidth
                                required
                                variant="outlined"
                                value={formData.jornada || ''}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="resLocal">Home result: </FormLabel>
                            <TextField
                                error={!!fieldErrors?.resLocal}
                                helperText={fieldErrors?.resLocal}
                                color={!!fieldErrors?.resLocal ? 'error' : 'primary'}
                                name="resLocal"
                                id="resLocal"
                                type="number"
                                fullWidth
                                required
                                variant="outlined"
                                value={formData.resLocal>=0? formData.resLocal : ''}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="resVisitante">Guest result: </FormLabel>
                            <TextField
                                error={!!fieldErrors?.resVisitante}
                                helperText={fieldErrors?.resVisitante}
                                color={!!fieldErrors?.resVisitante ? 'error' : 'primary'}
                                name="resVisitante"
                                id="resVisitante"
                                type="number"
                                fullWidth
                                required
                                variant="outlined"
                                value={formData.resVisitante>=0? formData.resVisitante : ''}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <Box sx={{display:'flex',flexDirection:'row', gap:2}}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color='secondary'
                            >
                                Create Match
                            </Button>
                        </Box>
                    </Box>
                </Card>
            </FormContainerEdit>
        </LayoutLogin>
    );
};