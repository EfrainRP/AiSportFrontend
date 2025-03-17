import * as React from 'react';
import {
  Box,
  Snackbar,
  Alert,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  Divider,
  FormLabel,
  FormControl,
  Link,
  TextField,
  Typography,
  Stack,
  useTheme, 
  Container,
  OutlinedInput ,
  InputLabel,
  InputAdornment,
  IconButton,
  FormHelperText
} from '@mui/material';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword.jsx';
import { GoogleIcon, FacebookIcon, AiSportIcon } from '../../../components/CustomIcons.jsx';
import axiosInstance from "../../../services/axiosConfig.js";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../services/AuthContext.jsx'; // Importa el contexto
import LayoutBasic from '../../LayoutBasic.jsx';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const RecoverPassContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  // height: '100vh',
  justifyContent:"space-between",
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
    height: 'calc((1 - var(--template-frame-height, 0)) * 100vh)',
    [theme.breakpoints.up('sm')]: {
      height: 'calc((1 - var(--template-frame-height, 0)) * 100vh)',
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

export default function ResetPassword(props) {
  const [newPassword, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [token, setToken] = React.useState('');
  const [email, setEmail] = React.useState(''); // Añadir el estado para el email
  const [message, setMessage] = React.useState('');

  const [dataAlert, setDataAlert] = React.useState({}); //Mecanismo Alert
  const [openSnackBar, setOpenSnackBar] = React.useState(false); // Mecanismo snackbar

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
  };
  
  const navigate = useNavigate();

  const [showPassword0, setShowPassword0] = React.useState(false);
  const handleClickShowPassword0 = () => setShowPassword0((show) => !show);

  const [showPassword1, setShowPassword1] = React.useState(false);
  const handleClickShowPassword1 = () => setShowPassword1((show) => !show);

  const handleMouseDownPassword = (event) => {
  event.preventDefault();
  };
  const handleMouseUpPassword = (event) => {
  event.preventDefault();
  };

   // Capturar el token y el email de la URL cuando carga la página
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    const emailFromUrl = urlParams.get('email'); // Obtener el email

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }

    if (emailFromUrl) {
      setEmail(emailFromUrl); // Guardar el email
    }

    // Limpia el token y email de la URL (opcional, pero recomendable)
    window.history.replaceState({}, document.title, '/reset-password');
  }, []);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setDataAlert({ severity: "error"});
    // Validación de contraseñas
    if (newPassword !== confirmPassword) {
      setMessage('❌ The passwords do not match.');
      setOpenSnackBar(true);
      return;
    }

    if (!newPassword || !confirmPassword) {
      setMessage('❌ Please enter the passwords.');
      setOpenSnackBar(true);
      return;
    }
    console.log(message);
      // Llamada al backend para restablecer la contraseña
    await axiosInstance.put(`/restore-password`, {
      newPassword,
      confirmPassword, // Confirm pass
      token, // Enviar el token
      email, // Enviar el email
    })
    .then((response)=>{
      setDataAlert({ severity: "success"});
      setMessage(`✅ ${response.data.message}`); // Ej: "Contraseña actualizada con éxito"
      setOpenSnackBar(true);
    })
    .catch ((error) => {
      console.error(error);
      setMessage(`❌ ${error.response?.data?.message || 'Error resetting password.'}`);
      setOpenSnackBar(true);
    })
  };

  return (
    <LayoutBasic>
      <RecoverPassContainer>
        <Card variant="outlined">
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <AiSportIcon/>
          </div>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign:'center'}}
          >
            Recover password
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
          <FormControl>
            <FormLabel htmlFor="newPassword">New Password: </FormLabel>
            <OutlinedInput
                id="newPassword"
                name="newPassword"
                placeholder="••••••"
                type={showPassword0 ? 'text' : 'password'}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                <InputAdornment position="end">
                    <IconButton
                    aria-label={
                        showPassword0 ? 'hide the password' : 'display the password'
                    }
                    onClick={handleClickShowPassword0}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                    sx={{
                        backgroundColor: 'transparent', // Hace el fondo transparente
                        border: 'none',
                        outline: 'none', // Evita el contorno al hacer focus
                        boxShadow: 'none', // Elimina sombras
                        height:0,
                        width:1
                      }}
                    >
                      {showPassword0 ? <VisibilityOff fontSize="small"/> : <Visibility fontSize="small"/>}
                    </IconButton>
                </InputAdornment>
                }
                label="newPassword"
            />
            {/* {errors.newPassword && <FormHelperText sx={{color:'error.main'}} >{errors.newPassword}</FormHelperText>} */}
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="confirmPassword">Confirm Password: </FormLabel>
            <OutlinedInput
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••"
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showPassword1 ? 'text' : 'password'}
                endAdornment={
                <InputAdornment position="end">
                    <IconButton
                    aria-label={
                        showPassword1 ? 'hide the password' : 'display the password'
                    }
                    onClick={handleClickShowPassword1}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                    sx={{
                        backgroundColor: 'transparent', // Hace el fondo transparente
                        border: 'none',
                        outline: 'none', // Evita el contorno al hacer focus
                        boxShadow: 'none', // Elimina sombras
                        height:0,
                        width:1
                      }}
                    >
                      {showPassword1 ? <VisibilityOff fontSize="small"/> : <Visibility fontSize="small"/>}
                    </IconButton>
                </InputAdornment>
                }
                label="confirmPassword"
            />
            {/* {errors.confirmPassword && <FormHelperText sx={{color:'error.main'}} >{errors.confirmPassword}</FormHelperText>} */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="warning"
                sx={{mt:2}}
              >
                Confirm
              </Button>
            </FormControl>
            <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnackBar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert
                    severity={dataAlert.severity}
                    variant='filled'
                    sx={{ width: '100%' }}
                    onClose={handleCloseSnackBar}
                >
                    {message}
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
        </Card>
      </RecoverPassContainer>
      </LayoutBasic>
  );
}
