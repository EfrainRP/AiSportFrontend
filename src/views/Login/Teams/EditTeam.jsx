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
    CardMedia
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

const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server

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

export default function EditTeam() {
    const navigate = useNavigate();
    const {loading, setLoading, user}  = useAuth();
    const { teamName, teamId } = useParams();
    const [file, setFile] = React.useState(null);
    const [team, setTeam] = React.useState({
        name: '',
        user_id: user?.userId || '',
        miembros: [], // Inicializa miembros como un arreglo vacío
    });
    const [fieldErrors, setFieldErrors] = React.useState({}); // Almacena errores específicos por campo desde el backend

    const [dataAlert, setDataAlert] = React.useState({}); //Mecanismo Alert
    const [openSnackBar, setOpenSnackBar] = React.useState(false); // Mecanismo snackbar

    const [openConfirm, setConfirm] = React.useState(false); //Mecanismo confirm
    const handleCloseConfirm = () => { //Boton cancel del dialog
        setConfirm(false);
    };
    React.useEffect(() => {
        const fetchTeam = async () => {
            await axiosInstance.get(`/equipo/${teamName}/${teamId}`)
                .then((response) => {
                    setTeam({
                        ...response.data,
                        miembros: response.data.miembro_equipos || [], // Usar la relación 'miembro_equipos'
                    });
                    setDataAlert({message:null});
                    setLoading(false);
                }).catch((err) => {
                    // console.error('Error loading tournament:', err);
                    setLoading(true);
                    setOpenSnackBar(true);
                    setDataAlert({severity:"error", message:'Error loading tournament'});
                })
        };
        fetchTeam();
    }, [teamId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTournament((prev) => ({
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
        setFile(selectedFile);
    };

    const handleAddMember = () => {
        setTeam((prev) => ({ ...prev, miembros: [...prev.miembros, { user_miembro: '', id: Date.now() }] }));
    };

    const handleRemoveMember = (index) => {
        setTeam((prev) => ({
            ...prev,
            miembros: prev.miembros.filter((_, i) => i !== index),
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});

        const formData = new FormData();
        // Filtra los miembros vacíos antes de enviar el formulario
        const memberValidate = team.miembros.filter(member => member.user_miembro.trim() !== '');
        const teamsWithMembers = { ...team, miembros: memberValidate };

        // Agrega los datos del equipo a FormData
        formData.append('name', teamsWithMembers.name);
        formData.append('user_id', teamsWithMembers.user_id);

      // Agrega los miembros a ser enviados
        teamsWithMembers.miembros.forEach((miembro, index) => {
            formData.append(`miembros[${index}][user_miembro]`, miembro.user_miembro);
        });
    
        // Agrega la imagen si se cargo
        if (file) {
            formData.append('image', file);
        }

        // Realizar la solicitud PUT con FormData <-
        await axiosInstance.put(
            `/equipo/${teamId}`,
            formData,
            {
            headers: {
                'Content-Type': 'multipart/form-data', // Se envia FormData para la carga de la IMG <-
            },
            }
        )
        .then((response) => {
            setOpenSnackBar(true);
            setDataAlert({severity:"success", message:'Success update Team!'});
            setTimeout(() => navigate(`/team/${team.name}/${teamId}`), 2000);})
        .catch ((err) => {
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
                setDataAlert({severity:"error", message:'Error update team.'});
            }
        })
    };

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
    };

    const handleDelete = async () => { 
        await axiosInstance.delete(`/equipo/${teamId}`)
        .then((response) => {
            setOpenSnackBar(true);
            setDataAlert({severity:"success", message:'Delete team success!'});
            setTimeout(() => navigate('/teams'), 2000); // Redirige a la lista de equipos después de 2 segundos
        }).catch ((err) => {
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
                setDataAlert({severity:"error", message:'Error update team.'});
            }
        });
        setConfirm(false);
    };
    console.log(team);
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
                    <Container sx={{display:'flex', textAlign:'justify', gap:3}}>
                        <BackButton/>
                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                        >
                            Edit {teamName}
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
                            <FormLabel htmlFor="file-input">
                                <Button >
                                    <CardMedia
                                        component="img"
                                        height={120}
                                        // image={`http://localhost:3000/ai/api/utils/uploads/${equipo.image !== 'logoEquipo.jpg' ? equipo.image : 'logoEquipo.jpg'}`} 
                                        image={URL_SERVER+`/utils/uploads/${team.image !== 'logoEquipo.jpg' ? team.image : 'logoEquipo.jpg'}`} 
                                        alt={team.name}
                                    />
                                </Button>
                            </FormLabel>
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="name">Name Team: </FormLabel>
                            <TextField
                                name="name"
                                id="name"
                                autoFocus
                                fullWidth
                                required
                                variant="outlined"
                                value={team.name}
                                placeholder={team.name}
                                onChange={handleChange}
                                error={!!fieldErrors.name} //detecta si tiene algo contenido
                                helperText={fieldErrors.name}
                                color={!!fieldErrors.name ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="miembros">Members: </FormLabel>
                            {team.miembros.length>0?
                            team.miembros.map((member, index) => (
                                <Box display="flex" alignItems="center" key={index}>
                                    <FormLabel htmlFor={`miembro-${index}`} sx={{ display: 'none' }}/>
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
                                        value={member.user_miembro || ''}
                                        placeholder={member.user_miembro || ''}
                                        onChange={(e) => handleMemberChange(index, { ...member, user_miembro: e.target.value })}
                                        sx={{display:"flex", gap:3}}
                                    />
                                    <Button variant="contained" color="error" onClick={() => handleRemoveMember(index)}>
                                        Delete
                                    </Button>
                                </Box>
                            ))
                            :
                                <Typography id={'miembros'} sx={{display:'flex', justifyContent: 'center'}}>No members register.</Typography>
                            }
                        </FormControl>
                        <Input
                            type="file"
                            onChange={handleImageChange}
                            inputProps={{ accept: 'image/*' }} // Puedes especificar tipos de archivos si lo necesitas
                            // error={!!fieldErrors.image}
                            // helperText={fieldErrors.image}
                            // color={!!fieldErrors.image ? 'error' : 'primary'}
                            sx={{ display: 'none' }}
                            id="file-input"
                        />
                        <Button fullWidth variant="contained" color="warning" onClick={handleAddMember}>
                            Add member
                        </Button>
                        <Box sx={{display:'flex',flexDirection:'row', gap:2}}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={()=>setConfirm(true)}
                            color='error'
                        >
                            Delete Team
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