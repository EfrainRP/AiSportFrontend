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
  // height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
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

export default function RecoverPassword(props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');

  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');

  const [openForgotPass, setOpenForgotPass] = React.useState(false); //State forgot password
  
  const [messageSignIn, setMessage] = React.useState('');
  const [openSnackBar, setOpenSnackBar] = React.useState(false);

  const [errors, setErrors] = React.useState({}); // Almacena errores específicos por campo desde el backend
  
  // Component SnackBar State
  const handleClickSnackBar = () => {
    setOpenSnackBar(true);
  };
  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
  };
  
  const { login } = useAuth(); // Accede a la función de login
  const navigate = useNavigate();

  const [showPassword0, setShowPassword0] = React.useState(false);
  const handleClickShowPassword0 = () => setShowPassword0((show) => !show);

  const [showPassword1, setShowPassword1] = React.useState(false);
  const handleClickShowPassword1 = () => setShowPassword1((show) => !show);

  const [showPassword2, setShowPassword2] = React.useState(false);
  const handleClickShowPassword2 = () => setShowPassword2((show) => !show);
  const handleMouseDownPassword = (event) => {
  event.preventDefault();
  };
  const handleMouseUpPassword = (event) => {
  event.preventDefault();
  };

  const handleSubmit = async (event) => { // Function to access AiSport
    event.preventDefault();

    emailValidate(); 
    passwordValidate();
    if (emailError || passwordError) { // Error Input
      handleClickSnackBar();
      return;
    }
    const data = new FormData(event.currentTarget);
    // console.log(data.get("email"));
    console.log(data.get('password'));
    await axiosInstance.post('/login',{ // Conection to backend
      email: data.get('email'), 
      password: data.get('password')
    })
    .then((response)=> {
        setMessage('Login successful');
        handleClickSnackBar();
        console.log(response.data);
        login(response.data.params, response.data.token); // Guarda el usuario autenticado
        navigate('/dashboard');
    })
    .catch((error) => {
      // setMessage(error.response.data.message);
      setMessage("Invalid Data");
      handleClickSnackBar();
      console.log(error.response.data.message)
    });
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
              <FormLabel htmlFor="currentPassword">Current Password: </FormLabel>
              <OutlinedInput
                  id="currentPassword"
                  name="currentPassword"
                  placeholder="••••••"
                  type={showPassword0 ? 'text' : 'password'}
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
                  label="currentPassword"
              />
              {errors.currentPassword && <FormHelperText sx={{color:'error.main'}} >{errors.currentPassword}</FormHelperText>}
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="newPassword">New Password: </FormLabel>
            <OutlinedInput
                id="newPassword"
                name="newPassword"
                placeholder="••••••"
                type={showPassword0 ? 'text' : 'password'}
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
            {errors.newPassword && <FormHelperText sx={{color:'error.main'}} >{errors.newPassword}</FormHelperText>}
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="confirmPassword">Confirm Password: </FormLabel>
            <OutlinedInput
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••"
                type={showPassword0 ? 'text' : 'password'}
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
                label="confirmPassword"
            />
            {errors.confirmPassword && <FormHelperText sx={{color:'error.main'}} >{errors.confirmPassword}</FormHelperText>}
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
            <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnackBar}
            anchorOrigin={{ vertical:'top', horizontal:'center' }} key={ {vertical:'top'} + {horizontal:'center'} }>
                <Alert
                    onClose={handleCloseSnackBar}
                    severity="error"                   
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
        </Card>
      </RecoverPassContainer>
      </LayoutBasic>
  );
}
