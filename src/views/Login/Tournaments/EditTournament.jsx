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

export default function EditTournament() {
    const navigate = useNavigate();
    const {loading, setLoading}  = useAuth();
    const { tournamentName, tournamentId } = useParams();
    const [tournament, setTournament] = React.useState({
        name: '',
        ubicacion: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        cantEquipo: 0,
    });
    const [fieldErrors, setFieldErrors] = React.useState({}); // Almacena errores específicos por campo desde el backend
    const [generalError, setGeneralError] = React.useState(''); // Almacena errores generales
    const [successMessage, setSuccessMessage] = React.useState(''); // Almacena el mensaje de éxito

    React.useEffect(() => {
        const fetchTournament = async () => {
            await axiosInstance.get(`/torneo/${tournamentName}/${tournamentId}`)
                .then((response) => {
                    setTournament(response.data);
                    setGeneralError(null);
                    setLoading(false);
                }).catch((err) => {
                    console.error('Error loading tournament:', err);
                    setLoading(true);
                    setGeneralError("Error loading tournament");
                })
        };
        fetchTournament();
    }, [tournamentId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTournament((prev) => ({
            ...prev,
            [name]: value,
        }));
        setFieldErrors((prev) => ({ ...prev, [name]: '' })); // Limpia errores del campo modificado
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        setGeneralError('');
        setSuccessMessage(''); // Limpiar mensaje de éxito previo
        console.log(tournament);
        await axiosInstance.put(`/torneo/${tournamentId}`, tournament) //TO DO: check the request, no working
            .then((response) => {
                setSuccessMessage('Success update Tournament!');
                setTimeout(() => navigate(`/tournament/${tournament.name}/${tournamentId}}`), 2000);
            })
            .catch((err) => {
                if (err.response && err.response.status === 400) {
                    const { field, message } = err.response.data;
                    if (field) {
                        setFieldErrors((prev) => ({ ...prev, [field]: message }));
                    } else {
                        setGeneralError(message);
                    }
                } else {
                    setGeneralError('Error update tournament.');
                }
            })
    };

    

    const [openConfirm, setConfirm] = React.useState(false); //Mecanismo Alert
    
    const handleCloseConfirm = () => { //Boton cancel del dialog
        setConfirm(false);
    };
    const handleDelete = async () => { // Metodo DELETE <- //Boton confirm del dialog
        await axiosInstance.delete(`/torneo/${tournamentId}`)
        .then((response) => {
            setSuccessMessage('Delete tournament success!');
            setTimeout(() => navigate('/tournaments'), 2000); // Redirige a la lista de torneos después de 2 segundos
        }).catch ((err) => {
            setGeneralError('Error al eliminar el torneo.');
            console.error(err);
        });
        setConfirm(false);
    };
    
    const [homeTeam, setHomeTeam] = React.useState(""); //Autocomplete home team
    const [guestTeam, setGuestTeam] = React.useState(""); //Autocomplete guest team

    return (
        <LayoutLogin>
            <FormContainerEdit>
                <Card variant="outlined">
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                    >
                        Edit {tournamentName}
                    </Typography>
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
                        {generalError && <p>{generalError}</p>}
                        {successMessage && <p>{successMessage}</p>} {/* Muestra el mensaje de éxito */}
                        <FormControl>
                            <FormLabel htmlFor="name">Name: </FormLabel>
                            <TextField
                                name="name"
                                id="name"
                                autoFocus
                                fullWidth
                                required
                                variant="outlined"
                                value={tournament.name}
                                placeholder={tournament.name}
                                onChange={handleChange}
                                error={!!fieldErrors.name} //detecta si tiene algo contenido
                                helperText={fieldErrors.name}
                                color={!!fieldErrors.name ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="ubicacion">Locaticon: </FormLabel>
                            <TextField
                                // error={passwordError}
                                // helperText={passwordErrorMessage}
                                // color={passwordError ? 'error' : 'primary'}
                                name="ubicacion"
                                id="ubicacion"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                value={tournament.ubicacion}
                                placeholder={tournament.ubicacion}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="descripcion">Description: </FormLabel>
                            <TextField
                                // error={passwordError}
                                // helperText={passwordErrorMessage}
                                name="descripcion"
                                id="descripcion"
                                sx={{
                                    "& .MuiInputBase-root": { minHeight: "7rem" },
                                }}
                                multiline
                                rows={5}
                                defaultValue={tournament.descripcion || ""}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="fechaInicio">Start Date: </FormLabel>
                            <TextField
                                // error={passwordError}
                                // helperText={passwordErrorMessage}
                                name="fechaInicio"
                                id="fechaInicio"
                                type="date"
                                fullWidth
                                required
                                variant="outlined"
                                value={tournament.fechaInicio.split('T')[0]}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="fechaFin">End Date: </FormLabel>
                            <TextField
                                // error={passwordError}
                                // helperText={passwordErrorMessage}
                                name="fechaFin"
                                id="fechaFin"
                                type="date"
                                fullWidth
                                required
                                variant="outlined"
                                value={tournament.fechaFin.split('T')[0]}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="cantEquipo">Number of Equipment: </FormLabel>
                            <TextField
                                // error={passwordError}
                                // helperText={passwordErrorMessage}
                                name="cantEquipo"
                                id="cantEquipo"
                                type="number"
                                fullWidth
                                required
                                variant="outlined"
                                value={tournament.cantEquipo}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <Box sx={{display:'flex',flexDirection:'row', gap:2}}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={()=>setConfirm(true)}
                            color='error'
                        >
                            Delete Tournament
                        </Button>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color='secondary'
                        >
                            Save changes
                        </Button>
                        </Box>
                    </Box>
                    <ConfirmDialog open={openConfirm} handleClose={handleCloseConfirm} handleConfirm={handleDelete} messageTitle={'Are you sure to delete?'}/>
                </Card>
            </FormContainerEdit>
        </LayoutLogin>
    );
};