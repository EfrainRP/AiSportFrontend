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

const SignInContainer = styled(Stack)(({ theme }) => ({
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

export default function SignIn(props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');

  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');

  const [openForgotPass, setOpenForgotPass] = React.useState(false); //State forgot password
  
  const [messageSignIn, setMessage] = React.useState('');
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [validateInputs, setValidateInputs] = React.useState(true);

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

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

  const handleClickOpenForgotPass = () => {
    setOpenForgotPass(true);
  };

  const handleCloseForgotPass = () => {
    setOpenForgotPass(false);
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
      setMessage(error.response.data.message);
      handleClickSnackBar();
      console.log(error.response.data.message)
    });
  };

  const emailValidate = async () => {
    const email = document.getElementById('email').value;

    setEmailError(false);
    setEmailErrorMessage('');
    setValidateInputs(true);
    console.log(email);
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      setValidateInputs(false);
    } 
    // else{
    //   await axiosInstance.post('/email',{email: email}) // Conection to backend
    //   .then((response)=> {
    //     console.log(response.data);
    //     setValidateInputs(false);
    //   })
    //   .catch((error) => {
    //     setEmailError(true);
    //     setEmailErrorMessage('Email no valid');
    //     // setMessage('Error ');
    //     // handleClickSnackBar();
    //     console.log(error.response.data.message)
    //     setValidateInputs(true);
    //   });
    // }
  };
  
  const passwordValidate = () => {
    const password = document.getElementById('password').value;
    
    setPasswordError(false);
    setPasswordErrorMessage('');
    setValidateInputs(true);
  
    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      setValidateInputs(false);
    }
  };

  return (
    <LayoutBasic>
      <SignInContainer>
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
            Sign in
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
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                // onChange={emailValidate}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
                sx={{ ariaLabel: 'email' }}
              />
            </FormControl>
            <FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Link
                  component="button"
                  type="button"
                  onClick={handleClickOpenForgotPass}
                 // onChange={passwordValidate}
                  variant="body2"
                  sx={{ alignSelf: 'baseline', color:'white'}}
                >
                  Forgot your password?
                </Link>
              </Box>
              {/* <TextField
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
              /> */}
          <OutlinedInput
            id="password"
            name="password"
            placeholder="••••••••"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={handleClickShowPassword}
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
                  {showPassword ? <VisibilityOff fontSize="small"/> : <Visibility fontSize="small"/>}
                </IconButton>
              </InputAdornment>
            }
            label="password"
          />
          {passwordError && <FormHelperText sx={{color:'error.main'}} >{passwordErrorMessage}</FormHelperText>}
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="warning"
            >
              Sign in
            </Button>
            </FormControl>
            
            <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnackBar}
            anchorOrigin={{ vertical:'top', horizontal:'center' }} key={ {vertical:'top'} + {horizontal:'center'} }>
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
                  sx={{ alignSelf: 'center', color: 'secondary.main'}}
                >
                  Sign up
                </Link>
              </span>
            </Typography>
          </Box>
          <ForgotPassword open={openForgotPass} handleClose={handleCloseForgotPass} />

          {/* 
          TO DO: EXTRA SIGN with GOOGLE or FACEBOOK
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
            </Button>
          </Box> */}
        </Card>
      </SignInContainer>
      </LayoutBasic>
  );
}
