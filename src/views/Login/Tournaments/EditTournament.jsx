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
import { useAuth } from '../../../services/AuthContext'; //  AuthContext

import LayoutLogin from '../../LayoutLogin.jsx';
import LoadingView from '../../../components/Login/LoadingView.jsx';

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
        location: '',
        description: '',
        StartDate: '',
        EndDate: '',
        countTeams: 0,
    });

    const [fieldErrors, setFieldErrors] = React.useState({}); // Almacena errores específicos por campo desde el backend
    const [generalError, setGeneralError] = React.useState(''); // Almacena errores generales
    const [successMessage, setSuccessMessage] = React.useState(''); // Almacena el mensaje de éxito

    React.useEffect(() => {
        const fetchTournament = async () => {
            await axiosInstance.get(`torneo/${tournamentName}/${tournamentId}`)
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
        await axiosInstance.put(`/torneo/${tournamentId}`, tournament)
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
    const handleDelete = async () => { // Metodo DELETE <-
        const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este torneo?');
        if (confirmDelete) {
            await axios.delete(`http://localhost:5000/sporthub/api/torneo/${tournamentId}`)
            .then((response) => {
                setSuccessMessage('Delete tournament success!');
                setTimeout(() => navigate('/tournaments'), 2000); // Redirige a la lista de torneos después de 2 segundos
            }).catch ((err) => {
                setGeneralError('Error al eliminar el torneo.');
                console.error(err);
            });
        }
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
                                // error={passwordError}
                                // helperText={passwordErrorMessage}
                                name="name"
                                placeholder={tournamentName}
                                id="name"
                                fullWidth
                                required
                                variant="outlined"
                                value={tournament.name}
                                onChange={handleChange}
                            />
                        </FormControl>
                        {/* <FormControl>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <FormLabel htmlFor="password">Password</FormLabel>
                                <Link
                                    component="button"
                                    type="button"
                                    onClick={handleClickOpen}
                                    onChange={passwordValidate}
                                    variant="body2"
                                    sx={{ alignSelf: 'baseline' }}
                                >
                                    Forgot your password?
                                </Link>
                            </Box>
                                <TextField
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                name="password"
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={passwordError ? 'error' : 'primary'}
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <ForgotPassword open={open} handleClose={handleClose} />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                onClick={() => { emailValidate(); passwordValidate(); }}
                            >
                                Sign in
                            </Button>
                        </FormControl>
                        <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnackBar}
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }} key={{ vertical: 'top' } + { horizontal: 'center' }}>
                            <Alert
                                onClose={handleCloseSnackBar}
                                severity="error"
                            // sx={[
                            //   (theme) => ({
                            //     backgroundColor: theme.palette.error.light,
                            //     border: `2px solid ${theme.palette.error.light}`,
                            //     ...theme.applyStyles('dark', {
                            //       backgroundColor: theme.palette.error.main,
                            //       border: `2px solid ${theme.palette.error.main}`,
                            //     }),
                            //     '&:hover': {
                            //       boxShadow: theme.shadows[2],
                            //       backgroundColor: theme.palette.error.main,
                            //       border: `2px solid ${theme.palette.error.main}`,
                            //       ...theme.applyStyles('dark', {
                            //         backgroundColor: theme.palette.error.dark,
                            //         border: `2px solid ${theme.palette.error.dark}`
                            //       }),
                            //     },
                            //   }),
                            // ]}
                            >
                                {messageSignIn}
                            </Alert>
                        </Snackbar>
                        <Typography sx={{ textAlign: 'center' }}>
                            Don&apos;t have an account?{' '}
                            <span>
                                <Link
                                    href="/signup"
                                    variant="body2"
                                    sx={{ alignSelf: 'center' }}
                                >
                                    Sign up
                                </Link>
                            </span>
                        </Typography>
                    </Box>
                    <Divider>or</Divider>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => alert('Sign in with Google')}
                            startIcon={<GoogleIcon />}
                        >
                            Sign in with Google
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => alert('Sign in with Facebook')}
                            startIcon={<FacebookIcon />}
                        >
                            Sign in with Facebook
                        </Button> */}
                    </Box>
                </Card>
            </FormContainerEdit>
        </LayoutLogin>
    );
};