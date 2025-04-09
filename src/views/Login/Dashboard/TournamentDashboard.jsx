import React from 'react';
import {
  Typography,
  Box, 
  Tab, 
  Tabs,
  Container,
  Card,
  CardContent,
  TextField,
  Autocomplete,
  Button,
  Alert,
  Snackbar, 
  Divider,
  Stack,
  Avatar,
} from '@mui/material';
import PropTypes from 'prop-types';

import axiosInstance from "../../../services/axiosConfig.js";
import { useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../../services/AuthContext'; //  AuthContext

import LayoutLogin from '../../LayoutLogin.jsx';
import LoadingView from '../../../components/Login/LoadingView.jsx'
import BackButton from '../../../components/Login/BackButton.jsx';
import MatchBracket from '../../../components/Login/MatchBracket.jsx';
import LoadingCard from '../../../components/Login/LodingCard.jsx';

import FolderIcon from '@mui/icons-material/Folder';
import GroupsIcon from '@mui/icons-material/Groups';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';

const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server
const centerJustify = {display:'flex', flexDirection: 'row', textAlign:'justify'}; //estilos guardados

function CustomTabPanel(props) { 
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function TournamentDashboard () {
  const {user} = useAuth(); // Accede al usuario autenticado y al método logout
  const { tournamentName, tournamentId } = useParams();
  const [tournament, setTournament] = React.useState(null);
  const [matches, setMatches] = React.useState(null);
  const [teams, setTeams] = React.useState(null);
  const [valueAutoComplete, setValueAutoComplete] = React.useState(null); //Mecanismo autocomplete
  
  const [dataAlert, setDataAlert] = React.useState({}); //Mecanismo Alert
  const [openSnackBar, setOpenSnackBar] = React.useState(false); // Mecanismo snackbar

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
  };
  
  const location = useLocation();
  const [matchesCount, setMatchesCount] = React.useState(0);
  
  const [valueTab, setValueTab] = React.useState(() => {
    let initialTab = location.state || 0; // Si hay un estado en location, usa ese valor; de lo contrario, usa 0.
    initialTab = Number(localStorage.getItem("activeTabShowTournament")) || initialTab;
    localStorage.setItem("activeTabShowTournament", initialTab); // Guardar la pestaña activa
    return initialTab; // Devuelve el valor inicial del tab.
  }); // Mecanismo del Tab
  
  const handleChange = (event, newValue) => {
      setValueTab(newValue);
      localStorage.setItem("activeTabShowTournament", newValue); // Guardar la pestaña activa
  };
  
  React.useEffect(() => {
      if (matchesCount === 0 && valueTab===1) {
        localStorage.setItem("activeTabShowTournament", 0); // Guarda en el localStorage para persistencia
        setValueTab(0); // Resetea el tab a 0
      }
      }, [matchesCount]);

  React.useEffect(() => {
    const fetchTournament = async () => {
      await axiosInstance.get(`/torneo/${tournamentName}/${tournamentId}`)
      .then((response) => {
        setTournament(response.data);
      })
      .catch ((err) => {
        console.error('Error loading tournament:', err);
      });
    };

    const fetchMatches = async () => {
      await axiosInstance.get(`/partidos/${tournamentId}`)
      .then((response) => {
        setMatches(response.data.brackets);
        setMatchesCount(response.data.getPartidosCount);
      })
      .catch ((err) => {
        console.error('Error loading tournament matches:', err);
      })
      
    };

    const fetchTeams = async () => {
      await axiosInstance.get(`/equipos/${user.userId}`)
      .then((response)=>{
        setTeams(response.data);
      })
      .catch ((err) =>{
        console.error('Error loading teams:', err);
      });
    };

    fetchTournament();
    fetchMatches();
    fetchTeams();
  }, [tournamentId, tournamentName, user.userId]);

  const handleSendNotification = async () => {
    if (!valueAutoComplete) {
      setOpenSnackBar(true);
      setDataAlert({severity:"warning", message:'Please select a team before sending the notification.'});
      return;
    }

      await axiosInstance.post(
        `/notificacion/${user.userId}/${tournament.user_id}`,
        {
          equipoId: valueAutoComplete.id,
          torneoId: tournamentId,
        }
      )
      .then(()=>{
        setOpenSnackBar(true);
        setDataAlert({severity:"success", message:'Notification sent successfully!'});
      })
      .catch ((err) =>{
        console.error('Error sending notification:', err);
      
        // Verifica si hay una respuesta del servidor con un mensaje de error
        if (err.response && err.response.data && err.response.data.message) {
          setOpenSnackBar(true);
          setDataAlert({severity:"error", message:err.response.data.message}); // Muestra el mensaje del backend
        } else {
          setOpenSnackBar(true);
          setDataAlert({severity:"error", message:'An error occurred while sending the notification.'}); // Error genérico
        }
      });
  };

  const handleCancelNotification = async () => {
      await axiosInstance.delete(`/notificacion/${user.userId}/${tournamentId}`)
      .then(()=>{
        setOpenSnackBar(true);
        setDataAlert({severity:"success", message:'Notification cancelled successfully.'});
      })
      .catch ((err) =>{
      console.error('Error canceling notification:', err);
    
      // Verifica si hay una respuesta del servidor con un mensaje de error
      if (err.response && err.response.data && err.response.data.message) {
        setOpenSnackBar(true);
        setDataAlert({severity:"error", message:err.response.data.message}); // Muestra el mensaje del backend
      } else {
        setOpenSnackBar(true);
        setDataAlert({severity:"error", message:'An error occurred while canceling the notification.'}); // Error genérico
      }
    });
  };

  if(!tournament){ // En caso de que este vacio el torneo
      return (
      <LoadingView 
        message={`The tournament you are trying to access may not exist.`}
      />);
  }

  return (
    <LayoutLogin>
      <Container sx={{display: 'center',m:2, gap:'5%'}}>
        <BackButton url={`/dashboard`}/>
        <Typography variant='h2'> 
            {`Tournament: ${tournament.name}`}
        </Typography>
      </Container>
      <Box sx={{ borderBottom: 3, borderColor: 'divider' }}>
        <Tabs centered value={valueTab} onChange={handleChange} >
          <Tab icon={<FolderIcon />} label="Details" {...a11yProps(0)} />
          <Tab icon={<GroupsIcon />} label="Matches" {...a11yProps(1)} disabled={matchesCount === 0}/>
          <Tab  icon={<NotificationAddIcon />} label="Send Notifications" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <CustomTabPanel value={valueTab} index={0}> {/*Tab Details */}
        <Container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height:'100%'}}>
          <Card sx={{minWidth:290, width:'80%'}}>
            <CardContent>
              <Container sx={{...centerJustify, gap:2}}>
                <Typography variant='h5' color='primary'> 
                  <strong>Location: </strong>
                </Typography>
                <Typography variant='h6' sx={{color: 'text.data'}}> 
                  {tournament.ubicacion}
                </Typography>
              </Container>
              <Divider variant="middle" sx={{my:2}}/>
            
              <Container sx={{...centerJustify, gap:2}}>
                <Typography variant='h5' color='primary'> 
                  <strong>Start Date:</strong>
                </Typography>
                <Typography variant='h6' sx={{color: 'text.data'}}> 
                  {new Date(tournament.fechaInicio).toISOString().split('T')[0]}
                </Typography>
              </Container>
              <Divider variant="middle" sx={{my:2}}/>

              <Container sx={{...centerJustify, gap:2}}>
                <Typography variant='h5' color='primary'> 
                  <strong>Final Date:</strong>
                </Typography>
                <Typography variant='h6' gutterBottom sx={{color: 'text.data'}}> 
                  {new Date(tournament.fechaFin).toISOString().split('T')[0]}
                </Typography>
              </Container>
              <Divider variant="middle" sx={{my:2}}/>

              <Container sx={{...centerJustify, gap:2}}>
                <Typography variant='h5' color='primary'> 
                  <strong>Total Teams:</strong>
                </Typography>
                <Typography variant='h6' gutterBottom sx={{color: 'text.data'}}> 
                  {tournament.cantEquipo}
                </Typography>
              </Container>
              <Divider variant="middle" sx={{my:2}}/>

              <Container sx={{...centerJustify, gap:2}}>
                <Typography variant='h5' color='primary'> 
                  <strong>Tournament Description:</strong>
                </Typography>
                <Typography variant='body1' gutterBottom sx={{color: 'text.data'}}> 
                {tournament.descripcion}
                </Typography>
              </Container> 
            </CardContent>
          </Card>
        </Container>
      </CustomTabPanel>

      <CustomTabPanel value={valueTab} index={1}> {/*Tab Matches */}
        <Container sx={{width:'80%'}}>
          {matchesCount>0?
            <MatchBracket matches={matches} onwerTournament={tournament.user_id === user.userId}/>
          :
            <LoadingCard CircularSize={'2%'} message={"Maybe no matches are scheduled for this tournament or the number of teams is invalid."}/>
            
          }
          {/* {brackets.map((round, index) => (
            <Card key={index}>
              <CardContent>
                <Typography variant='h6' gutterBottom > 
                  Round: {index + 1}
                </Typography>
                <Stack sx={{display:'flex', justifyContent: 'space-around', flexDirection:'row', my:1.5}} useFlexGap spacing={{ xs: 1, sm: 1.5 }}>
                  {round.map((match, i) => ( //TO DO: check format HTML
                    <Card
                      sx={[(theme)=>({
                        backgroundColor:theme.palette.warning.dark,
                        ...theme.applyStyles('dark', {
                          backgroundColor:theme.palette.secondary.dark,
                        }),
                      })]}
                      key={i}
                    >
                      <CardContent>
                        <Container sx={{...centerJustify, justifyContent: 'center', gap:2}}>
                          <Typography variant='subtitle2' color='primary'>
                              <strong>Date Match: </strong>
                          </Typography>
                          <Typography sx={{color: 'text.data'}}>
                              {new Date(match.fechaPartido).toISOString().split('T')[0]}
                          </Typography>
                        </Container>
                        <Container sx={{...centerJustify, justifyContent: 'center', gap:2}}>
                            <Typography variant='subtitle2' color='primary'>
                                <strong>Time: </strong>
                            </Typography>
                            <Typography sx={{color: 'text.data'}}>
                                {new Date(match.horaPartido).toLocaleTimeString()}
                            </Typography>
                        </Container>
                        <Container sx={{...centerJustify, justifyContent:'center', gap:2}}>
                            <Typography variant='subtitle2' color='warning'>
                                <strong>Result: </strong>
                            </Typography>
                            <Typography sx={{color: 'text.data'}}>
                                {match.resLocal} - {match.resVisitante}
                            </Typography>
                        </Container>

                        <Container sx={{...centerJustify, justifyContent: 'center', alignItems: 'center', my:1}}>
                            <Avatar
                                    src={`${URL_SERVER}/utils/uploads/${match.equipo && match.equipos_partidos_equipoLocal_idToequipos.image !== 'logoEquipo.jpg' ? match.equipos_partidos_equipoLocal_idToequipos.image : 'logoEquipo.jpg'}`}
                                    alt="Home team"
                                    sx={{ width: 40, height: 40 }}
                                    crossOrigin="use-credentials"
                                />
                            <Container sx={{...centerJustify, justifyContent: 'center', gap:2}}>
                                <Typography variant='subtitle2' color='success'>
                                    <strong>Home Team: </strong>
                                </Typography>
                                <Typography>
                                    {match.equipos_partidos_equipoLocal_idToequipos.name}
                                </Typography>
                            </Container>
                        </Container>

                        <Container sx={{...centerJustify, justifyContent: 'center', alignItems: 'center', my:1}}>
                            <Container sx={{...centerJustify, gap:2}}>
                                <Typography variant='subtitle2' color='error'>
                                    <strong>Guest Team: </strong>
                                </Typography>
                                <Typography>
                                    {match.equipos_partidos_equipoVisitante_idToequipos.name}
                                </Typography>
                            </Container>
                            <Avatar
                                src={`${URL_SERVER}/utils/uploads/${match.equipos_partidos_equipoVisitante_idToequipos && match.equipos_partidos_equipoVisitante_idToequipos.image !== 'logoEquipo.jpg' ? match.equipos_partidos_equipoVisitante_idToequipos.image : 'logoEquipo.jpg'}`}
                                alt="Guest team"
                                sx={{ width: 40, height: 40 }}
                                crossOrigin="use-credentials"
                            />
                        </Container>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          ))} */}
        </Container>
      </CustomTabPanel>
      <CustomTabPanel value={valueTab} index={2}> {/*Tab Notifications */}
        <Container sx={{width:'90%'}}>
          <Card sx={{minWidth:200, width:'100%'}}>
            <CardContent>
            <Typography variant='h4' color='primary' sx={{textAlign:'center'}}> 
              Enviar Notificación de Participación
            </Typography>
            <Divider variant="middle" sx={{my:2}}/>
            <Typography variant='subtitle2' gutterBottom > 
              You can send a notification to the tournament organizer to participate in the tournament with one of your teams.
            </Typography>
            <Typography variant='subtitle2' sx={{my:2}} > 
            <strong>NOTE:</strong> Sending a registration notification to the organizer does not always guarantee a place in the tournament, you can contact: <strong>{tournament.users.email}</strong>.
            </Typography>
            <Container sx={{display:'flex', justifyItems:'center', alignContent:'center', my:4, gap:2}}>
              <Autocomplete
                autoComplete
                autoSelect
                includeInputInList
                selectOnFocus
                options={teams}
                getOptionLabel={(option)=>option?.name} // Muestra el nombre como etiqueta
                isOptionEqualToValue={(option, value) => option?.id === value?.id} // Compara por `id`
                value={valueAutoComplete}
                onChange={(event, newValue) => setValueAutoComplete(newValue)}
                size="medium"
                sx={{ width: '50%'}}
                renderInput={(params) => <TextField {...params} label="Choose a team" color='dark' />}
              />
              {/* <select label="Select teams" onChange={(e) => setvalueAutoComplete(e.target.value)} value={valueAutoComplete}>
                <option value="">Select one of your teams:</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select> */}
              <Button variant="contained" endIcon={<SendIcon />} color="success" onClick={handleSendNotification}>
                Send Notification
              </Button>
              <Button variant="contained" startIcon={<DeleteIcon />} color="error" onClick={handleCancelNotification}>
                Cancel Notification
              </Button>
              </Container>
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
            </CardContent>
          </Card>
        </Container>
      </CustomTabPanel>
    </LayoutLogin>
  );
};