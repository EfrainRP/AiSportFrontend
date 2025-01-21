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
  Divider
} from '@mui/material';
import PropTypes from 'prop-types';

import axiosInstance from "../../../services/axiosConfig.js";
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../services/AuthContext'; //  AuthContext

import LayoutLogin from '../../LayoutLogin.jsx';
import LoadingView from '../../../components/Login/LoadingView.jsx'

import FolderIcon from '@mui/icons-material/Folder';
import GroupsIcon from '@mui/icons-material/Groups';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';

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
  
  const [valueTab, setValueTab] = React.useState(0); // Mecanismo del Tab
  const handleChange = (event, newValue) => {
    setValueTab(newValue);
  };
  
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
        setMatches(response.data);
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
          teamId: valueAutoComplete,
          tournamentId: tournamentId,
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

  const generateBracket = (matches) => {
    let rounds = [];
    let roundSize = tournament.cantEquipo / 2;
    let roundMatches = [...matches];

    while (roundSize >= 1) {
      rounds.push(roundMatches.slice(0, roundSize));
      roundMatches = roundMatches.slice(roundSize);
      roundSize /= 2;
    }

    return rounds;
  };

  if(!tournament){ // En caso de que este vacio el torneo
      return (
      <LoadingView 
        message={`The tournament you are trying to access may not exist.`}
      />);
  }
  console.log(matches);
  const brackets = generateBracket(matches);

  return (
    <LayoutLogin>
      <Typography variant='h2' sx={{ mt:2, mb:4 }}> 
          {`Tournament: ${tournament.name}`}
      </Typography>

      <Box sx={{ borderBottom: 3, borderColor: 'divider' }}>
        <Tabs centered value={valueTab} onChange={handleChange} >
          <Tab icon={<FolderIcon />} label="Details" {...a11yProps(0)} />
          {matches.legnth>0?
            <Tab icon={<GroupsIcon />} label="Matches" {...a11yProps(1)}/>
            :
            <Tab icon={<GroupsIcon />} label="Matches" {...a11yProps(1)} disabled/>
          }
          <Tab  icon={<NotificationAddIcon />} label="Send Notifications" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <CustomTabPanel value={valueTab} index={0}> {/*Tab Details */}
        <Container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height:'100%'}}>
          <Card sx={{minWidth:290, width:'80%'}}>
            <CardContent>
              <Container sx={{display:'flex', flexDirection: 'row', textAlign:'justify', gap:2}}>
                <Typography variant='h5'> 
                  <strong>Location: </strong>
                </Typography>
                <Typography variant='h6' sx={{color: 'text.secondary'}}> 
                  {tournament.ubicacion}
                </Typography>
              </Container>
              <Divider variant="middle" sx={{my:2}}/>
            
              <Container sx={{display:'flex', flexDirection: 'row', textAlign:'justify', gap:2}}>
                <Typography variant='h5'> 
                  <strong>Start Date:</strong>
                </Typography>
                <Typography variant='h6' sx={{color: 'text.secondary'}}> 
                  {new Date(tournament.fechaInicio).toISOString().split('T')[0]}
                </Typography>
              </Container>
              <Divider variant="middle" sx={{my:2}}/>

              <Container sx={{display:'flex', flexDirection: 'row', textAlign:'justify', gap:2}}>
                <Typography variant='h5'> 
                  <strong>Final Date:</strong>
                </Typography>
                <Typography variant='h6' gutterBottom sx={{color: 'text.secondary'}}> 
                  {new Date(tournament.fechaFin).toISOString().split('T')[0]}
                </Typography>
              </Container>
              <Divider variant="middle" sx={{my:2}}/>

              <Container sx={{display:'flex', flexDirection: 'row', textAlign:'justify', gap:2}}>
                <Typography variant='h5'> 
                  <strong>Total Teams:</strong>
                </Typography>
                <Typography variant='h6' gutterBottom sx={{color: 'text.secondary'}}> 
                  {tournament.cantEquipo}
                </Typography>
              </Container>
              <Divider variant="middle" sx={{my:2}}/>

              <Container sx={{display:'flex', flexDirection: 'row', textAlign:'justify', gap:2}}>
                <Typography variant='h5'> 
                  <strong>Tournament Description:</strong>
                </Typography>
                <Typography variant='body1' gutterBottom sx={{color: 'text.secondary'}}> 
                {tournament.descripcion}
                </Typography>
              </Container>
            </CardContent>
          </Card>
        </Container>
      </CustomTabPanel>

      <CustomTabPanel value={valueTab} index={1}> {/*Tab Matches */}
        <Container sx={{width:'80%'}}>
          <Typography variant='h4'> 
            <strong>Tournament's Matches:</strong>
          </Typography>

          {brackets.map((round, index) => (
            <Card key={index}>
              <CardContent style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='h6' gutterBottom > 
                  Round: {index + 1}
                </Typography>
                {round.map((match, i) => ( //TO DO: check format HTML
                  <Card
                    key={i}
                  >
                    <CardContent>
                      <Typography><strong>Fecha del Partido:</strong> {new Date(match.fechaPartido).toISOString().split('T')[0]}</Typography>
                      <Typography><strong>Hora:</strong> {new Date(match.horaPartido).toLocaleTimeString()}</Typography>
                      <Typography><strong>Equipo Local:</strong> {match.equipos_partidos_equipoLocal_idToequipos.name}</Typography>
                      <Typography><strong>Equipo Visitante:</strong> {match.equipos_partidos_equipoVisitante_idToequipos.name}</Typography>
                      <Typography><strong>Resultado:</strong> {match.resLocal} - {match.resVisitante}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          ))}
        </Container>
      </CustomTabPanel>
      <CustomTabPanel value={valueTab} index={2}> {/*Tab Notifications */}
        <Container sx={{width:'90%'}}>
          <Card sx={{minWidth:200, width:'100%'}}>
            <CardContent>
            <Typography variant='h4' sx={{textAlign:'center'}}> 
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
                getOptionLabel={(option)=>option.name} // Muestra el nombre como etiqueta
                isOptionEqualToValue={(option, value) => option.id === value.id} // Compara por `id`
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