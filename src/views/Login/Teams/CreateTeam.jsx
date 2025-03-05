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
    ButtonBase
} from '@mui/material';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';

import axiosInstance from "../../../services/axiosConfig.js";
import {useNavigate } from 'react-router-dom';
import { useAuth } from '../../../services/AuthContext.jsx'; //  AuthContext

import LayoutLogin from '../../LayoutLogin.jsx';
import LoadingView from '../../../components/Login/LoadingView.jsx';
import ConfirmDialog from '../../../components/Login/ConfirmDialog.jsx';
import BackButton from '../../../components/Login/BackButton.jsx';


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

export default function CreateTeam() {
    const navigate = useNavigate();
    const { loading, setLoading, user } = useAuth();
    const [file, setFile] = React.useState([]);
    const [team, setTeam] = React.useState({
        name: '',
        user_id: user?.userId || '',
        image:null,
        miembros: ['', ''],// Inicializa miembros como un arreglo vacío
    });
    const [previewImage, setPreviewImage] = React.useState(null);
    const [fieldErrors, setFieldErrors] = React.useState({}); // Almacena errores específicos por campo desde el backend

    const [dataAlert, setDataAlert] = React.useState({}); //Mecanismo Alert
    const [openSnackBar, setOpenSnackBar] = React.useState(false); // Mecanismo snackbar

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTeam((prev) => ({
            ...prev,
            [name]: value,
        }));
        setFieldErrors((prev) => ({ ...prev, [name]: '' })); // Limpia errores del campo modificado
    };

    const handleMemberChange = (index, value) => {
        const newMembers = [...team.miembros];
        newMembers[index] = value;
        setTeam((prev) => ({ ...prev, miembros: newMembers }));
    };

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
            setTeam((prevState) => ({
                ...prevState,
                image: selectedFile,
            }));
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        // Filtra los miembros vacíos antes de enviar el formulario
        const memberValidate = team.miembros.filter(member => member.trim() !== '');
        const teamsWithMembers = { ...team, miembros: memberValidate };

        // Realizar la solicitud
        await axiosInstance.post(
            `/equipo/create`,
            teamsWithMembers,
        )
            .then((response) => {
                setOpenSnackBar(true);
                setDataAlert({ severity: "success", message: 'Success create team!' });
                setTimeout(() => navigate(`/teams`), 2000);
            })
            .catch((err) => {
                if (err.response && err.response.status === 400) {
                    const { field, message } = err.response.data;
                    if (field) {
                        setFieldErrors((prev) => ({ ...prev, [field]: message }));
                    } else {
                        setOpenSnackBar(true);
                        setDataAlert({ severity: "error", message: message });
                    }
                } else {
                    setOpenSnackBar(true);
                    setDataAlert({ severity: "error", message: 'Error create team.' });
                }
            })
    };

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
    };
    console.log(team);
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
                        <BackButton url={`/teams`}/>
                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                        >
                            Create Team
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
                            style={{
                                width: '40%',
                            }}
                        >
                            <ImageSrc style={{ 
                                backgroundImage: 
                                previewImage? 
                                `url(${previewImage})` :
                                `url(${URL_SERVER}/utils/uploads/${team.image !== 'logoEquipo.jpg' ? team.image : 'logoEquipo.jpg'})` }} />
                            <ImageBackdrop className="MuiImageBackdrop-root" />
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
                                    Edit photo
                                    <ImageMarked className="MuiImageMarked-root" />
                                </Typography>
                            </Image>
                            
                            <VisuallyHiddenInput 
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                        </ImageButton>
                        
                        <FormControl>
                            <FormLabel htmlFor="name">Name Team: </FormLabel>
                            <TextField
                                name="name"
                                id="name"
                                autoFocus
                                fullWidth
                                required
                                variant="outlined"
                                // value={team.name}
                                placeholder={'my Team'}
                                onChange={handleChange}
                                error={!!fieldErrors.name} //detecta si tiene algo contenido
                                helperText={fieldErrors.name}
                                color={!!fieldErrors.name ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="miembros">Members: </FormLabel>
                            {team.miembros.map((member, index) => (
                                <Box display="flex" alignItems="center" key={index}>
                                    <FormLabel htmlFor={`miembro-${index}`} sx={{ display: 'none' }} />
                                    <TextField
                                        // error={!!fieldErrors.ubicacion}
                                        // helperText={fieldErrors.ubicacion}
                                        // color={!!fieldErrors.ubicacion ? 'error' : 'primary'}
                                        name={`miembro-${index}`}
                                        id={`miembro-${index}`}
                                        autoFocus
                                        required
                                        fullWidth
                                        variant="outlined"
                                        value={member || ''}
                                        placeholder={member || `mymember${index+1}`}
                                        onChange={(e) => handleMemberChange(index, e.target.value)}
                                        sx={{ display: "flex", gap: 3 }}
                                    />
                                </Box>
                            ))
                            }
                        </FormControl>
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
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