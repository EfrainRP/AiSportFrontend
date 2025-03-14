import React from 'react';
import {
  Typography,
  Box, 
  Container,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  List, 
  ListItem,
  Divider,
  IconButton,
} from '@mui/material';
import PropTypes from 'prop-types';

import axiosInstance from "../../../services/axiosConfig.js";
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../services/AuthContext.jsx'; //  AuthContext

import LayoutLogin from '../../LayoutLogin.jsx';
import LoadingView from '../../../components/Login/LoadingView.jsx'
import BackButton from '../../../components/Login/BackButton.jsx';

const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server

import EqualizerIcon from '@mui/icons-material/Equalizer';

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

const centerJustify = {display: 'flex', alignContent:'center', textAlign:'justify', justifyContent:'center'};

export default function TeamDashboard () {
  const { teamName, teamId  } = useParams();
  const [team, setTeam] = React.useState(null);
  
  const [error, setError] = React.useState(null);
  
  React.useEffect(() => {
    const fetchTeam = async () => {
      await axiosInstance.get(`/equipo/${teamName}/${teamId}`)
      .then((response)=>{
        setTeam(response.data);
      })
      .catch ((err) =>{
        setError('Error loading team');
        console.error('Error loading team:', err);
      });
    };

    fetchTeam();
  }, [teamId]);

  if(error || !team){ // En caso de que este vacio el torneo
      return (
      <LoadingView 
        message={error?'Error loading team':'The team you are trying to access may not exist.'}
      />);
  }

  return (
    <LayoutLogin>
      <Container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height:'100%'}}>
        <Card sx={{minWidth:280, width:'80%'}}>
          <CardContent>
            <Container sx={{...centerJustify, alignItems:'center'}}>
            <BackButton url={`/dashboard`}/>
              <Container>
                <Container sx={centerJustify}>
                  <Typography variant="h5" color='primary'>
                    <strong>Team's Detail: </strong>
                  </Typography>
                  <Typography variant="h6" sx={{mx:1}}>
                    {team.name}
                  </Typography>
                </Container>
                <Container sx={centerJustify}>
                  <Typography variant="subtitle1" color='primary'>
                    <strong>Organizer: </strong>
                  </Typography>
                  <Typography variant="subtitle1" sx={{mx:1}}>
                    { team.users?.name || 'Desconocido'}
                  </Typography>
                </Container>  
              </Container>
            </Container>
            <Divider sx={{my:1}}/>
            <CardMedia
              component="img"
              alt={`Team ${team.name}`} 
              height="295"
              image={`${URL_SERVER}/utils/uploads/${team && team.image !== 'logoEquipo.jpg' ? team.image : 'logoEquipo.jpg'}`} 
              crossOrigin="use-credentials"
            />
            <Divider sx={{my:2}}/>
            
            
            <Typography variant="subtitle1" color='primary'>
              <strong>Integrantes:</strong>
            </Typography>
            <List>
              {team?.miembro_equipos?.length > 0 ? (
                team.miembro_equipos.map((miembro) => {
                  return (<ListItem key={miembro.user_miembro}>
                    {miembro.user_miembro}
                  </ListItem>);
                })
              ) : (
                <ListItem>No hay integrantes aún unidos a este team.</ListItem>
              )}
            </List>

          </CardContent>
          <Divider sx={{my:2}}/>
          <CardActions sx={centerJustify}>
            <Button 
              size="small"
              endIcon={<EqualizerIcon/>}
              variant="contained"
              href={`/team/${team.name}/${teamId}/stats`}>
                Statistics
            </Button>
          </CardActions>
        </Card>
      </Container>
    </LayoutLogin>
  );
};