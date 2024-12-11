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
  useTheme 
} from '@mui/material';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword.jsx';
import { GoogleIcon, FacebookIcon, SporthubIcon } from '../../../components/CustomIcons.jsx';
import AppTheme from '../../../components/shared-theme/AppTheme.jsx';
import axiosInstance from "../../../services/axiosConfig.js";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../services/AuthContext.jsx'; // Importa el contexto
import HeaderAppBar from '../../../components/HeaderAppBar.jsx';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  // height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
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
  },
}));

export default function SignIn(props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  
  const [messageSignIn, setMessage] = React.useState('');
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => { //TO DO add axios
    event.preventDefault();
    if (emailError || passwordError) {
      setMessage('Empty data');
      handleClickSnackBar();
      return;
    }

    const data = new FormData(event.currentTarget);
    console.log(data.get("email"));

    await axiosInstance.post('/login',{
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
      setMessage(error.response.data.message);
      handleClickSnackBar();
      console.log(error.response.data.message)
    });
  };

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <HeaderAppBar />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
          }}>
          <SporthubIcon/>
          </div>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
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
                  onClick={handleClickOpen}
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
              onClick={validateInputs}
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
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
