import * as React from 'react';
import { Box,
  Button,
  Checkbox,
  Radio,
  RadioGroup,
  CssBaseline,
  Divider,
  FormControlLabel,
  FormLabel,
  FormControl,
  Link,
  TextField,
  Typography,
  Stack,
  FormHelperText,
  OutlinedInput ,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
  } from '@mui/material';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import {useNavigate } from 'react-router-dom';

import { GoogleIcon, FacebookIcon, AiSportIcon } from '../../../components/CustomIcons.jsx';
import LayoutBasic from '../../LayoutBasic.jsx'
import axiosInstance from "../../../services/axiosConfig.js";

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  // padding: theme.spacing(4),
  gap: theme.spacing(2),
  // margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
    gap: theme.spacing(2),
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  // height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh
  // padding: theme.spacing(1),
  // [theme.breakpoints.up('sm')]: {
  //   padding: theme.spacing(2),
  // },
  justifyContent:"space-between",
  margin: theme.spacing(6),
  [theme.breakpoints.up('sm')]: {
    margin: theme.spacing(3),
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
    // height: 'calc((1 - var(--template-frame-height, 0)) * 218vh)',
    [theme.breakpoints.up('sm')]: {
      height: 'calc((1 - var(--template-frame-height, 0)) * 100vh)',
      // height: 'calc((1 - var(--template-frame-height, 0)) * 157vh)',
    },
  },
}));

export default function SignUp(props) {
  const navigate = useNavigate();
  const [errors, setErrors] = React.useState({}); // Almacena errores específicos por campo desde el backend
  const [dataAlert, setDataAlert] = React.useState({}); //Mecanismo Alert
  const [openSnackBar, setOpenSnackBar] = React.useState(false); // Mecanismo snackbar
  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }
    setOpenSnackBar(false);
  };

  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const validateName = ()=>{
    const name = document.getElementById('name');
    if (!name.value || name.value.length < 1) {
      // setNameError(true);
      // setNameErrorMessage('Name is required.');
      setErrors((prev) => ({ ...prev, ['name']: 'Name is required.' }));
    
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }
  }
  const [fsurnameError, setFsurnameError] = React.useState(false);
  const [fsurnameErrorMessage, setFsurnameErrorMessage] = React.useState('');
  const validateFsurname = ()=>{
    const fsurname = document.getElementById('fsurname');
    if (!fsurname.value || fsurname.value.length < 1) {
      setFsurnameError(true);
      setFsurnameErrorMessage('Fsurname is required.');
      setErrors((prev) => ({ ...prev, ['fsurname']: 'Fsurname is required.' }));
    } else {
      setFsurnameError(false);
      setFsurnameErrorMessage('');
    }
  }
  const [msurnameError, setMsurnameError] = React.useState(false);
  const [msurnameErrorMessage, setMsurnameErrorMessage] = React.useState('');
  const validateMsurname = ()=>{
    const msurname = document.getElementById('msurname');
    if (!msurname.value || msurname.value.length < 1) {
      setMsurnameError(true);
      setMsurnameErrorMessage('Musrname is required.');
      setErrors((prev) => ({ ...prev, ['msurname']: 'Musrname is required.' }));

    } else {
      setMsurnameError(false);
      setMsurnameErrorMessage('');
    }
  }
  const [birthdateError, setBirthdateError] = React.useState(false);
  const [birthdateErrorMessage, setBirthdateErrorMessage] = React.useState('');
  
  const validateBirthdate = ()=>{
    const birthdate = document.getElementById('birthdate').value;
    const [year, month, day] = birthdate.split('-').map(Number);// Creamos la fecha localmente, evitando problemas de zona horaria
    const birthDate = new Date(year, month, day); // Obtenemos la fecha de hoy para compararla
    const today = new Date();
    
    if (isNaN(birthDate) || birthDate >= today) {
      setBirthdateError(true);
      setBirthdateErrorMessage(birthDate >= today? 'Birthdate is incorrect.': 'Birthdate is required.'); 
      setErrors((prev) => ({ ...prev, ['birthdate']: birthDate >= today? 'Birthdate is incorrect.': 'Birthdate is required.' }));

    }else{
      setBirthdateError(false);
      setBirthdateErrorMessage('');
    }
  }
  const [gender, setGender] = React.useState('');
  const radioChange = (event) => { setGender(event.target.value);};
  const [genderError, setGenderError] = React.useState(false);
  const [genderErrorMessage, setGenderErrorMessage] = React.useState('');
  const validateGender = ()=>{
    // const gender = document.getElementById('gender');
    // console.log(gender);
    if (gender.length ===0){
      setGenderError(true);
      setGenderErrorMessage('Gender input is required.');
      setErrors((prev) => ({ ...prev, ['gender']: 'Gender input is required.' }));

    } else {
      setGenderError(false);
      setGenderErrorMessage('');
    }
  }
  const [nicknameError, setNicknameError] = React.useState(false);
  const [nicknameErrorMessage, setNicknameErrorMessage] = React.useState('');
  const validateNickname = ()=>{
    const nickname = document.getElementById('nickname');
    if (!nickname.value || nickname.value.length < 8) {
      setNicknameError(true);
      setNicknameErrorMessage('Nickname is required.');
      setErrors((prev) => ({ ...prev, ['nickname']: 'Nickname is required.' }));

    } else {
      setNicknameError(false);
      setNicknameErrorMessage('');
    }
  }

  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const validateEmail = ()=>{
    const email = document.getElementById('email');
    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      setErrors((prev) => ({ ...prev, ['email']: 'Please enter a valid email address.'}));

    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }
  }

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const validatePass = ()=>{
    const password = document.getElementById('password');
    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      setErrors((prev) => ({ ...prev, ['password']: 'Password must be at least 6 characters long.'}));

    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }
  }
  const validateInputs = () => {
    let isValid = true;
    validateName();
    validateFsurname();
    validateMsurname();
    validateBirthdate();
    validateGender();
    validateNickname();
    validateEmail();
    validatePass();
    validateGender();
    // console.log(nameError, fsurnameError, msurnameError, birthdateError, genderError, nicknameError, emailError, passwordError);
    if (nameError || fsurnameError || msurnameError || birthdateError || genderError || nicknameError || emailError || passwordError) {
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs) {
      console.log(' error');
      return;
    }
    const data = new FormData(event.currentTarget);
    console.log(data.get('birthdate'));
    await axiosInstance.post('/register', {
      name: data.get('name'),
      fsurname: data.get('fsurname'),
      msurname: data.get('msurname'),
      nickname: data.get('nickname'),
      email: data.get('email'),
      gender: data.get('gender'),
      password: data.get('password'),
      birthdate: data.get('birthdate'),
  })
  .then((response)=>{
    if (response.status === 201) {
      // Manejo del éxito
      console.log('Registro exitoso:', response.data);
      setOpenSnackBar(true);
      setDataAlert({ severity: "success", message: 'Success register. You can sign in now.' });

      setTimeout(() => navigate(`/signin`), 3000);
    }
  })
  .catch((error)=>{
    // Manejo del error
    
    if (error.response) {
      console.error('Error registrando:', error.response.data);
      if(error.response.data.errors){
        const backendErrors = error.response.data.errors || {}; // Suponiendo que los errores vienen en este formato
        let nError = errors;
        // Recorre los errores del backend y los asigna al objeto de errores
        for (const key in backendErrors) {
            if (backendErrors.hasOwnProperty(key)) {
              nError[key] = backendErrors[key];
            }
        }
  
        setErrors(nError);
      }else{
        setOpenSnackBar(true);
        setDataAlert({ severity: "error", message: error.response.data.message});
      }

      // if (err.response && err.response.status === 400) {
      //   const { field, message } = err.response.data;
      //   if (field) {
      //       setErrors((prev) => ({ ...prev, [field]: message }));
      //   } else {
      //       setOpenSnackBar(true);
      //       setDataAlert({ severity: "error", message: message });
      //   }
    // } else {
    //     setOpenSnackBar(true);
    //     setDataAlert({ severity: "error", message: 'Error update profile.' });
    // }
    } else {
      console.error('Error registrando:', error);
      setOpenSnackBar(true);
      setDataAlert({ severity: "error", message: 'Error register.' });
    }
  });
  };

  return (
    <LayoutBasic>
      <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnackBar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert
            severity={dataAlert.severity}
            variant='filled'
            sx={{ width: '100%' }}
            onClose={handleCloseSnackBar}
        >
            {dataAlert.message}
        </Alert>
      </Snackbar>
      <SignUpContainer>
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
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)',textAlign:'center'}}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Name:</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Peter"
                onChange={validateName}
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="fsurname">Fsurname</FormLabel>
              <TextField
                autoComplete="fsurname"
                name="fsurname"
                required
                fullWidth
                id="fsurname"
                placeholder="Smith"
                onChange={validateFsurname}
                error={fsurnameError}
                helperText={fsurnameErrorMessage}
                color={fsurnameError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="msurname">Msurname</FormLabel>
              <TextField
                autoComplete="msurname"
                name="msurname"
                required
                fullWidth
                id="msurname"
                placeholder="Carson"
                onChange={validateMsurname}
                error={msurnameError}
                helperText={msurnameErrorMessage}
                color={msurnameError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="birthdate">Birthdate</FormLabel>
              <TextField
                autoComplete="birthdate"
                name="birthdate"
                required
                fullWidth
                id="birthdate"
                type="date"
                onChange={validateBirthdate}
                error={birthdateError}
                helperText={birthdateErrorMessage}
                color={birthdateError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl >
              <FormLabel id="gender">Gender</FormLabel>
              <RadioGroup
                row
                sx={{ display:"flex",justifyContent:"center", alignItems:"center"}}
                aria-labelledby="gender"
                name="gender"
                value={gender}
                // onChange={validateGender}
                onChange={radioChange}
              >
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="other" control={<Radio />} label="Other" />
              </RadioGroup>
              <FormHelperText error={genderError}>{genderErrorMessage}</FormHelperText>
              {/* {genderError && <Typography color="error">{genderErrorMessage}</Typography>} */}
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="nickname">Nickname:</FormLabel>
              <TextField
                autoComplete="nickname"
                name="nickname"
                required
                fullWidth
                id="nickname"
                placeholder="Noob"
                onChange={validateNickname}
                error={nicknameError}
                helperText={nicknameErrorMessage}
                color={nicknameError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                onChange={validateEmail}
                error={emailError}
                helperText={emailErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <OutlinedInput
                id="password"
                name="password"
                placeholder="••••••"
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
              {/* <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                onChange={validatePass}
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              /> */}
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" />}
              label="I want to receive updates via email."
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
              color="warning"
            >
              Sign up
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <span>
                <Link
                  href="/signin"
                  variant="body2"
                  sx={{ alignSelf: 'center' }}
                >
                  Sign in
                </Link>
              </span>
            </Typography>
          </Box>

          {/* 
          TO DO: EXTRA SIGN with GOOGLE or FACEBOOK
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign up with Google')}
              startIcon={<GoogleIcon />}
            >
              Sign up with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign up with Facebook')}
              startIcon={<FacebookIcon />}
            >
              Sign up with Facebook
            </Button>
          </Box> */}
        </Card>
      </SignUpContainer>
    </LayoutBasic>
  );
}
