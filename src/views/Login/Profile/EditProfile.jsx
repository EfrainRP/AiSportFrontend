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
    Input,
    Container,
    CardMedia,
    ButtonBase,
    FormHelperText,
    OutlinedInput ,
    InputAdornment,
} from '@mui/material';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';

import axiosInstance from "../../../services/axiosConfig.js";
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../services/AuthContext.jsx'; //  AuthContext

import LayoutLogin from '../../LayoutLogin.jsx';
import LoadingView from '../../../components/Login/LoadingView.jsx';
import ConfirmDialog from '../../../components/Login/ConfirmDialog.jsx';
import BackButton from '../../../components/Login/BackButton.jsx';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const ImageButton = styled(ButtonBase)(({ theme }) => ({
    position: 'relative',
    height: 100,
    left: '30%',
    [theme.breakpoints.down('sm')]: {
        width: '100% !important', // Overrides inline-style
        height: 100,
    },
    '&:hover, &.Mui-focusVisible': {
        zIndex: 1,
        '& .MuiImageBackdrop-root': {
            opacity: 0.15,
        },
        '& .MuiImageMarked-root': {
            opacity: 0,
        },
        '& .MuiTypography-root': {
            border: '1px solid currentColor',
        },
    },
}));

const ImageSrc = styled('span')({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
});

const Image = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.55,
    transition: theme.transitions.create('opacity'),
}));

const ImageMarked = styled('span')(({ theme }) => ({
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
}));

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

export default function EditProfile() {
    const navigate = useNavigate();
    const { loading, setLoading, user } = useAuth();
    const [profile, setProfile] = React.useState({
        name: '',
        fsurname: '',
        msurname: '',
        email: '',
        gender: '',
        birthdate: '',
        nickname: '',
        image: null,
        currentPassword: '', // Nueva propiedad para la contraseña actual
        newPassword: '',     // Nueva propiedad para la nueva contraseña
        confirmPassword: ''  // Nueva propiedad para la confirmación de la nueva contraseña
    });
    const [previewImage, setPreviewImage] = React.useState(null);
    const [errors, setErrors] = React.useState({}); // Almacena errores específicos por campo desde el backend

    const [dataAlert, setDataAlert] = React.useState({}); //Mecanismo Alert
    const [openSnackBar, setOpenSnackBar] = React.useState(false); // Mecanismo snackbar

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

    React.useEffect(() => {
        const fetchUser = async () => {
            await axiosInstance.get(`/perfil/${user.userId}`)
                .then((response) => {
                    const userProfile = response.data;
                    // Formatea la fecha de nacimiento a 'YYYY-MM-DD' si existe
                    const formattedBirthdate = userProfile.birthdate ? userProfile.birthdate.slice(0, 10) : '';

                    // Establece los los datos del perfil en el estado
                    setProfile({
                        ...userProfile,
                        birthdate: formattedBirthdate // Usa la fecha formateada
                    });
                    setDataAlert({ message: null });
                    setLoading(false);
                }).catch((err) => {
                    // console.error('Error loading profile.:', err);
                    setLoading(true);
                    setOpenSnackBar(true);
                    setDataAlert({ severity: "error", message: 'Error loading profile' });
                })
        };
        if(user && user.userId){
            fetchUser();
        }
    }, [user.userId]);

    // const handleImageChange = (e) => {
    //     const selectedFile = e.target.files[0];
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //         setFile((prevState) => ({
    //             ...prevState,
    //             image: selectedFile, 
    //             previewImage: reader.result, 
    //         }));
    //     };
    //     reader.readAsDataURL(selectedFile);
    // };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setProfile((prevState) => ({
            ...prevState,
            [name]: value || "",
        }));

        if(files && files[0]){
            const reader = new FileReader(); // Crear una vista previa de la imagen
            reader.onloadend = () => {
                setProfile((prevState) => ({
                    ...prevState,
                    [name]: files[0], // Guarda el archivo si es una imagen, de lo contrario, guarda el valor
                    
                }));
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(files[0]);
        }
        
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validar que la nueva contraseña y la confirmación coincidan
        if (profile.newPassword !== profile.confirmPassword) {
            alert('La nueva contraseña y la confirmación no coinciden.');
            return;
        }
    
        // Crea un objeto FormData
        const formData = new FormData();
        formData.append('name', profile.name);
        formData.append('fsurname', profile.fsurname);
        formData.append('msurname', profile.msurname);
        formData.append('email', profile.email);
        formData.append('gender', profile.gender);
        formData.append('birthdate', profile.birthdate);
        formData.append('nickname', profile.nickname);
        if (profile.currentPassword) formData.append('currentPassword', profile.currentPassword);
        if (profile.newPassword) formData.append('newPassword', profile.newPassword);
        if (profile.confirmPassword) formData.append('confirmPassword', profile.confirmPassword);
        if (profile.image) formData.append('image', profile.image); // Adjunta el archivo de imagen

        // Realizar la solicitud PUT con FormData <-
        await axiosInstance.put(
            `/perfil/${user.userId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data', // Se envia FormData para la carga de la IMG <-
                },
            }
        )
            .then((response) => {
                setOpenSnackBar(true);
                setDataAlert({ severity: "success", message: 'Success update Profile!' });
                setTimeout(() => navigate(`/dashboard/profile/${user.userName}`), 2000);
            })
            .catch((err) => {
                if (err.response && err.response.status === 400) {
                    const { field, message } = err.response.data;
                    if (field) {
                        setErrors((prev) => ({ ...prev, [field]: message }));
                    } else {
                        setOpenSnackBar(true);
                        setDataAlert({ severity: "error", message: message });
                    }
                } else {
                    setOpenSnackBar(true);
                    setDataAlert({ severity: "error", message: 'Error update profile.' });
                }
            })
    };

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
    };

    if(loading || !profile){ // En caso de que este vacio
        return (
        <LoadingView/>);
    }

    return (
        <LayoutLogin>
            <FormContainerEdit>
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
                <Card variant="outlined">
                    <Container sx={{ display: 'flex', textAlign: 'justify', gap: 3 }}>
                        <BackButton url={`/dashboard/profile/${profile.name}`}/>
                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                        >
                            Edit Profile
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
                        {/* TO DO: Checar el mecanismo de imagen */}
                        <ImageButton
                            component="label"
                            focusRipple
                            key={profile.image}
                            style={{
                                height: '15rem',
                                width: '15rem', 
                            }}
                        >
                            <ImageSrc style={{ 
                                backgroundImage: 
                                    previewImage?
                                    `url(${previewImage})` :
                                    `url(${URL_SERVER}/utils/uploads/${profile.image!=null && profile.image !== 'logoPerfil.jpg' ? profile.image : 'logoPerfil.jpg'})`,
                                borderRadius: '50%', // Para hacer la imagen circular
                                objectFit: 'cover', // Asegura que la imagen se ajuste sin distorsión
                                objectPosition: 'center', // Centra la imagen dentro del contenedor
                                display: 'block', // Evita espacios debajo de la imagen
                                margin: '0 auto', // Centra la imagen dentro del contenedor 
                            }} />
                            <ImageBackdrop className="MuiImageBackdrop-root"/>
                            <Image>
                                <Typography
                                    component="span"
                                    variant="subtitle2"
                                    color="inherit"
                                    sx={(theme) => ({
                                        position: 'relative',
                                        p: 4,
                                        pt: 2,
                                        pb: `calc(${theme.spacing(1)} + 6px)`,
                                    })}
                                >
                                    Edit image
                                    <ImageMarked className="MuiImageMarked-root" />
                                </Typography>
                            </Image>
                            {/*component input */}
                            <VisuallyHiddenInput 
                                type="file"
                                name="image"
                                onChange={handleChange}
                                accept="image/*"
                            />
                        </ImageButton>
                        
                        <FormControl>
                            <FormLabel htmlFor="name">Name: </FormLabel>
                            <TextField
                                name="name"
                                id="name"
                                fullWidth
                                required
                                variant="outlined"
                                value={profile.name}
                                placeholder={profile.name}
                                onChange={handleChange}
                                error={!!errors.name} //detecta si tiene algo contenido
                                helperText={errors.name}
                                color={!!errors.name ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="fsurname">First Surname: </FormLabel>
                            <TextField
                                name="fsurname"
                                id="fsurname"
                                fullWidth
                                required
                                variant="outlined"
                                value={profile.fsurname}
                                placeholder={profile.fsurname}
                                onChange={handleChange}
                                error={!!errors.fsurname} //detecta si tiene algo contenido
                                helperText={errors.fsurname}
                                color={!!errors.fsurname ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="msurname">Second Surname: </FormLabel>
                            <TextField
                                name="msurname"
                                id="msurname"
                                fullWidth
                                required
                                variant="outlined"
                                value={profile.msurname}
                                placeholder={profile.msurname}
                                onChange={handleChange}
                                error={!!errors.msurname} //detecta si tiene algo contenido
                                helperText={errors.msurname}
                                color={!!errors.msurname ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="email">Email: </FormLabel>
                            <TextField
                                name="email"
                                id="email"
                                type="email"
                                fullWidth
                                required
                                variant="outlined"
                                value={profile.email}
                                placeholder={profile.email}
                                onChange={handleChange}
                                error={!!errors.email} //detecta si tiene algo contenido
                                helperText={errors.email}
                                color={!!errors.email ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="gender">Gender: </FormLabel>
                            <TextField
                                name="gender"
                                id="gender"
                                fullWidth
                                required
                                variant="outlined"
                                // value={profile.gender}
                                placeholder={profile.gender}
                                onChange={handleChange}
                                error={!!errors.gender} //detecta si tiene algo contenido
                                helperText={errors.gender}
                                color={!!errors.gender ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="birthdate">Birthdate: </FormLabel>
                            <TextField
                                name="birthdate"
                                id="birthdate"
                                type="date"
                                fullWidth
                                required
                                variant="outlined"
                                // value={profile.birthdate}
                                // placeholder={profile.birthdate}
                                onChange={handleChange}
                                error={!!errors.birthdate} //detecta si tiene algo contenido
                                helperText={errors.birthdate}
                                color={!!errors.birthdate ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="nickname">Nickname: </FormLabel>
                            <TextField
                                name="nickname"
                                id="nickname"
                                fullWidth
                                required
                                variant="outlined"
                                // value={profile.nickname}
                                placeholder={profile.nickname}
                                onChange={handleChange}
                                error={!!errors.nickname} //detecta si tiene algo contenido
                                helperText={errors.nickname}
                                color={!!errors.nickname ? 'error' : 'primary'}
                            />
                        </FormControl>
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
                            {/* <TextField
                                name="currentPassword"
                                id="currentPassword"
                                type="password"
                                fullWidth
                                required
                                variant="outlined"
                                placeholder='Current Password'
                                onChange={handleChange}
                                error={!!errors.currentPassword} //detecta si tiene algo contenido
                                helperText={errors.currentPassword}
                                color={!!errors.currentPassword ? 'error' : 'primary'}
                            /> */}
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="newPassword">New Password: </FormLabel>
                            {/* <TextField
                                name="newPassword"
                                id="newPassword"
                                type="password"
                                fullWidth
                                required
                                variant="outlined"
                                placeholder='New Password'
                                onChange={handleChange}
                                error={!!errors.newPassword} //detecta si tiene algo contenido
                                helperText={errors.newPassword}
                                color={!!errors.newPassword ? 'error' : 'primary'}
                            /> */}
                            <OutlinedInput
                                id="newPassword"
                                name="newPassword"
                                placeholder="••••••"
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
                                label="currentPassword"
                            />
                            {errors.newPassword && <FormHelperText sx={{color:'error.main'}} >{errors.newPassword}</FormHelperText>}
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="confirmPassword">Confirm New Password: </FormLabel>
                            {/* <TextField
                                name="confirmPassword"
                                id="confirmPassword"
                                type="password"
                                fullWidth
                                required
                                variant="outlined"
                                placeholder='Confirm Password'
                                onChange={handleChange}
                                error={!!errors.confirmPassword} //detecta si tiene algo contenido
                                helperText={errors.confirmPassword}
                                color={!!errors.confirmPassword ? 'error' : 'primary'}
                            /> */}
                            <OutlinedInput
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="••••••"
                                type={showPassword2 ? 'text' : 'password'}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label={
                                        showPassword2 ? 'hide the password' : 'display the password'
                                    }
                                    onClick={handleClickShowPassword2}
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
                                    {showPassword2 ? <VisibilityOff fontSize="small"/> : <Visibility fontSize="small"/>}
                                    </IconButton>
                                </InputAdornment>
                                }
                                label="currentPassword"
                            />
                            {errors.confirmPassword  && <FormHelperText sx={{color:'error.main'}} >{errors.confirmPassword }</FormHelperText>}
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color='secondary'
                        >
                            Save changes
                        </Button>
                    </Box>
                </Card>
            </FormContainerEdit>
        </LayoutLogin>
    );
};