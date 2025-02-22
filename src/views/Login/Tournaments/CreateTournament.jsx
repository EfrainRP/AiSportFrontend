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
    Container,
} from '@mui/material';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';

import axiosInstance from "../../../services/axiosConfig.js";
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../services/AuthContext'; //  AuthContext

import LayoutLogin from '../../LayoutLogin.jsx';
import ConfirmDialog from '../../../components/Login/ConfirmDialog.jsx';
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

export default function CreateTournament() {
    const navigate = useNavigate();
    const {loading, setLoading, user}  = useAuth();
    const [tournament, setTournament] = React.useState({
        name: '',
        ubicacion: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        cantEquipo: 0,
    });
    const [fieldErrors, setFieldErrors] = React.useState({}); // Almacena errores específicos por campo desde el backend

    const [dataAlert, setDataAlert] = React.useState({}); //Mecanismo Alert
    const [openSnackBar, setOpenSnackBar] = React.useState(false); // Mecanismo snackbar

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
        // console.log(tournament);
        // Incluye el userId en el objeto torneo antes de enviarlo
        const tournamentData = { ...tournament, userId: user.userId };
        await axiosInstance.post(`/torneo/create`, tournamentData) //TO DO: check the request, no working
            .then((response) => {
                setOpenSnackBar(true);
                setDataAlert({severity:"success", message:'Success create tournament!'});
                setTimeout(() => navigate(`/tournaments`), 2000);
            })
            .catch((err) => {
                console.log(err);
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
                    setDataAlert({severity:"error", message:'Error create tournament.'});
                }
            })
    };

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
    };
    
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
                            // component="h1"
                            variant="h1"
                            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                        >
                            Create Tournament
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
                            <FormLabel htmlFor="name">Name: </FormLabel>
                            <TextField
                                name="name"
                                id="name"
                                autoFocus
                                fullWidth
                                required
                                variant="outlined"
                                
                                placeholder='myTournament'
                                onChange={handleChange}
                                error={!!fieldErrors.name} //detecta si tiene algo contenido
                                helperText={fieldErrors.name}
                                color={!!fieldErrors.name ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="ubicacion">Locaticon: </FormLabel>
                            <TextField
                                error={!!fieldErrors.ubicacion}
                                helperText={fieldErrors.ubicacion}
                                color={!!fieldErrors.ubicacion ? 'error' : 'primary'}
                                name="ubicacion"
                                id="ubicacion"
                                required
                                fullWidth
                                variant="outlined"
                                placeholder='anyLocation'
                                value={tournament.ubicacion}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="descripcion">Description: </FormLabel>
                            <TextField
                                error={!!fieldErrors.descripcion}
                                helperText={fieldErrors.descripcion}
                                color={!!fieldErrors.descripcion ? 'error' : 'primary'}
                                name="descripcion"
                                id="descripcion"
                                sx={{
                                    "& .MuiInputBase-root": { minHeight: "7rem" },
                                }}
                                multiline
                                placeholder='Any description about tournament'
                                rows={5}
                                defaultValue={tournament.descripcion || ""}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="fechaInicio">Start Date: </FormLabel>
                            <TextField
                                error={!!fieldErrors.fechaInicio}
                                helperText={fieldErrors.fechaInicio}
                                color={!!fieldErrors.fechaInicio ? 'error' : 'primary'}
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
                                error={!!fieldErrors.fechaFin}
                                helperText={fieldErrors.fechaFin}
                                color={!!fieldErrors.fechaFin ? 'error' : 'primary'}
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
                                error={!!fieldErrors.cantEquipo}
                                helperText={fieldErrors.cantEquipo}
                                color={!!fieldErrors.cantEquipo ? 'error' : 'primary'}
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
                                color='secondary'
                            >
                                Save changes
                            </Button>
                        </Box>
                    </Box>
                </Card>
            </FormContainerEdit>
        </LayoutLogin>
    );
};