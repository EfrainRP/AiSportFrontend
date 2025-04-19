import * as React from 'react';
import { 
  Typography, 
  Card, 
  CardContent, 
  CardActionArea, 
  Box, 
  Container, 
  Button, 
  ButtonGroup, 
  Avatar,
  Fab,
  Snackbar,
  Alert
} from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { useParams, useNavigate } from 'react-router-dom';
import { SingleEliminationBracket } from '@g-loot/react-tournament-brackets';
import axiosInstance from "../../services/axiosConfig.js";

import ConfirmDialog from './ConfirmDialog.jsx';
import DialogComponent from './DialogComponent.jsx';
import LoadingCard from './LodingCard.jsx';

import AddIcon from '@mui/icons-material/Add';

const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server

//TBD -----significa---->   to be decided

/*const example = [
  {
    id: 1,
    nextMatchId: 3,
    tournamentRoundText: "Round 1",
    myMatchDB:34,
    participants: [
      { id: "team1", resultText: "2", isWinner: false, name: "Team A" },
      { id: "team2", resultText: "3", isWinner: true, name: "Team B" },
    ],
  },
  {
    id: 2,
    nextMatchId: 3,
    tournamentRoundText: "Round 1",
    participants: [],
  },
  {
    id: 3,
    nextMatchId: null,
    tournamentRoundText: "Final",
    participants: [],
  },
];*/

const MatchBracket = ({onwerTournament}) => { //TO DO: falta hacer el proceso de eliminacion y verificar el mecanismo de Editar
  const navigate = useNavigate();
  const { tournamentName, tournamentId } = useParams();
  const theme = useTheme();

  const [matches, setMatches] = React.useState([]);
  const [matchesCount, setMatchesCount] = React.useState(0);
  const [cantEquipoTorneo, setCantEquipoTorneo] = React.useState(0);
  const [flag, setFlag] = React.useState(true); // State para controlar el componente MatchBracket, evitar re-renders

  React.useEffect(() => {
    if(flag){
      const fetchMatches = async () => { // Peticion INDEX Partidos del torneo
        await axiosInstance.get(`/partidos/${tournamentId}`).
        then((res)=> {
            setMatches(res.data.brackets); // Datos de los partidos
            // console.log(res.data.brackets);
            // console.log('res',res.data.getPartidosCount);
            setMatchesCount(res.data.getPartidosCount);
            setCantEquipoTorneo(res.data.cantEquipoTorneo);
        })
        .catch ((err)=>{
            // console.error('Error al cargar los partidos del torneo:', err);
            setMatchesCount(0);
            setCantEquipoTorneo(0);
        })
    };
    fetchMatches(); // Llamada para obtener los partidos del torneo
    setFlag(false);  
  }
  },[flag]);

  const [dataAlert, setDataAlert] = React.useState({}); //Mecanismo Alert
  const [openSnackBar, setOpenSnackBar] = React.useState(false); // Mecanismo snackbar
    
  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }
    setOpenSnackBar(false);
  };
  
  const [selectedMatch, setSelectedMatch] = React.useState(null);
  const handleOpenDialog = (match) => {
    setSelectedMatch(match);
    setConfirm(true);
  };
  const [openConfirm, setConfirm] = React.useState(false); //Mecanismo confirm
  const handleCloseConfirm = () => { //Boton cancel del dialog
      setSelectedMatch(null);
      setConfirm(false);
  };
  const handleDelete = () => { // Peticion DELETE Partido
    setShowModal(false);
    if(!selectedMatch) return;
    axiosInstance.delete(`/partido/${tournamentId}/${selectedMatch.myIdMatch}`)
      .then((res)=>{
          setOpenSnackBar(true);
          setDataAlert({severity:"success", message:'Delete match success!'});
      })
      .catch ((err) => {
          // console.error('Error deleting the match:', err);
          setOpenSnackBar(true);
          setDataAlert({severity:"error", message:'Error delete match.'});
      });
    setFlag(true);
    setConfirm(false);
    handleCloseConfirm;
  };

  const handleEdit = (match) => { // Cambio de vista a Edit form
    navigate(`/match/${tournamentName}/${tournamentId}/${match.myIdMatch}/edit`,{state:{ matchIdBracket: match.id }});
  };

  const [showModal, setShowModal] = React.useState(false);
  const [modalTittle, setModalTittle] = React.useState("");
  const [modalMessage, setModalMessage] = React.useState("");

  const MatchTheme = {
    roundHeader: {
      backgroundColor: theme.palette.mode === "light" ? theme.palette.primary.main : theme.palette.grey[800],
      fontColor: theme.palette.mode === "light" ? theme.palette.common.white : theme.palette.common.white,
    },
    connectorColor: theme.palette.mode === "light" ? theme.palette.secondary.light : theme.palette.secondary.dark,
    connectorColorHighlight: theme.palette.mode === "light" ? theme.palette.secondary.dark : theme.palette.grey[500],
  };

  const MyMatch = (props) => {
    const {
      match,
      onMatchClick,
      onPartyClick,
      onMouseEnter,
      onMouseLeave,
      topParty,
      bottomParty,
      topWon,
      bottomWon,
      topHovered,
      bottomHovered,
      topText,
      bottomText,
      connectorColor,
      computedStyles,
      teamNameFallback,
      resultFallback,
    } = props;

    // console.log(props)
    const centerJustify = {display:'flex', justifyContent:'space-between', alignContent:'center', gap:1};
    const message = (
      <Container sx={{p:0,m:0}}>
        <Container sx={{...centerJustify}}>
            <Typography variant='subtitle2' color='primary'>
              <strong>Home team:</strong>
            </Typography>
            <Typography variant='body2'>
              {topParty?.name || teamNameFallback}
            </Typography>
        </Container>

        <Container sx={{...centerJustify}}>
            <Typography variant='subtitle2' color='secondary'>
              <strong>Home result:</strong>
            </Typography>
            <Typography variant='body2' color='primary'>
              <strong>{topParty?.resultText || 'No result'}</strong>
            </Typography>
        </Container>

        <Container sx={{...centerJustify}}>
            <Typography variant='subtitle2' color='primary'>
              <strong>Guest team:</strong>
            </Typography>
            <Typography variant='body2'>
              {bottomParty?.name || teamNameFallback}
            </Typography>
        </Container>

        <Container sx={{...centerJustify}}>
            <Typography variant='subtitle2' color='secondary'>
              <strong>Guest result:</strong>
            </Typography>
            <Typography variant='body2' color='primary'>
              <strong>{bottomParty?.resultText || 'No result'}</strong>
            </Typography>
        </Container>

        <Container sx={{...centerJustify}}>
            <Typography variant='subtitle2' color='primary'>
              <strong>Match time:</strong>
            </Typography>
            <Typography variant='body2'>
              {match.horaPartido || 'No data'}
            </Typography>
        </Container>

        <Container sx={{...centerJustify}}>
            <Typography variant='subtitle2' color='primary'>
              <strong>Match date:</strong>
            </Typography>
            <Typography variant='body2'>
              {match.fechaPartido || 'No data'}
            </Typography>
        </Container>

        <Container sx={{...centerJustify}}>
            <Typography variant='subtitle2' color='primary'>
              <strong>Match day:</strong>
            </Typography>
            <Typography variant='body2'>
              {match.jornada || 'No data'}
            </Typography>
        </Container>
      </Container>
    );
    return (
      <Box>
        <Container sx={[{display:'flex', textAlign: 'center', alignItems: 'center'}, match?.myIdMatch ?{justifyContent:'space-between'}:{justifyContent:'center'}]}>
          {match?.myIdMatch ?
            (<>
              <Typography variant="caption">{match.fechaPartido}</Typography>
              <Typography variant="caption" >{match.horaPartido}</Typography>
              {/* <Typography variant="caption" >{match.myIdMatch}</Typography> */}
            </>)
          :
            (<Fab variant="extended" color='success' sx={{height:20, fontSize:12}} 
              onClick={
                () => navigate(`/match/create/${tournamentName}/${tournamentId}`, {state:{ matchIdBracket: match.id }}) }> 
              <AddIcon sx={{ mr: 1, fontSize:18}} /> match
            </Fab>)
          }
        </Container>
        <Card sx={{
          p: 1,
          // backgroundColor: isWinner ? '#87b2c4' : '#f5f5f5',
          boxShadow: 3,
          borderRadius: 2,
        }}>

        <CardActionArea 
          sx={[match.id === (cantEquipoTorneo - 2) && (match.myIdMatch) ? //Cambia el color si es el partido ganador
            (theme) => ({
              backgroundColor: theme.palette.grey[800],
              ...theme.applyStyles('dark', {
                backgroundColor: theme.palette.secondary.dark,
              }),
            })
            : null,
          ]}
          onClick={() => {
            setModalTittle(match.name?? "TBD"); 
            setModalMessage(message); 
            setSelectedMatch(match);
            setShowModal(true);
          }}>
            <Container 
              sx={{display:'flex', justifyContent:'space-between', textAlign: 'center', alignItems: 'center'}}>
                <Avatar
                  // src={`${URL_SERVER}/utils/uploads/logoEquipo.jpg`}
                  src={`${URL_SERVER}/utils/uploads/${topParty?.image || 'logoEquipo.jpg'}`}
                  alt="Guest team"
                  sx={{ width: 35, height: 35 }}
                  crossOrigin="use-credentials"
                />
                <Typography variant='body2'>{topParty?.name || teamNameFallback}</Typography>
                <Typography variant='body2' color={topWon? 'success' : (topWon === bottomWon? topParty?.resultText : 'error')}>
                  <strong>{topWon? 'WIN' : (topWon === bottomWon? topParty?.resultText : 'LOST')}</strong>
                </Typography>
            </Container>
            <Container 
              sx={{display:'flex', justifyContent:'space-between', textAlign: 'center', alignItems: 'center'}}>
                <Avatar
                  // src={`${URL_SERVER}/utils/uploads/logoEquipo.jpg`}
                  src={`${URL_SERVER}/utils/uploads/${bottomParty?.image || 'logoEquipo.jpg'}`}
                  alt="Guest team"
                  sx={{ width: 35, height: 35 }}
                  crossOrigin="use-credentials"
                />
                <Typography variant='body2'>{bottomParty.name || teamNameFallback}</Typography>
                <Typography variant='body2' color={bottomParty?.isWinner? 'success' : (topWon === bottomWon? bottomParty?.resultText : 'error')}>
                <strong>{bottomParty?.isWinner? 'WIN' : (topWon === bottomWon? bottomParty?.resultText : 'LOST')}</strong>
                </Typography>
            </Container>
          </CardActionArea>
        </Card>
      </Box>
    );
  };
  const getWinner = (match) =>{
    const home = match.participants[0];
    const guest = match.participants[1];
    const champion = home.isWinner !== guest.isWinner ? (home.isWinner? home.name : guest.name) : 'Error';
    return champion.toUpperCase();
  }
  // console.log(matchesCount);
  // console.log(cantEquipoTorneo);
  // console.log(selectedMatch);
  // console.log(matches);
  return (
    <>
      {/*     	Section {Modal / Dialog}         */}
      <DialogComponent 
        modalTittle={modalTittle}
        modalBody={modalMessage} 
        open={showModal} 
        handleClose={() => setShowModal(false)} 
        buttons={onwerTournament && matchesCount < cantEquipoTorneo-1 && // valida si es el admin del torneo y esten completos los partidos del TORNEO
          <Container sx={{display:'flex', justifyContent:'center', gap:1}}>
            {!selectedMatch?.myIdMatch ?
              <Fab variant="extended" color='success' size='small' 
                onClick={
                  () => navigate(`/match/create/${tournamentName}/${tournamentId}`, {state: { matchIdBracket: selectedMatch.id }})}> 
                <AddIcon sx={{ mr: 1}} /> match
              </Fab>
              :
              <>
                <Fab variant="extended" size="small" color="primary" onClick={() => handleEdit(selectedMatch)}>Edit</Fab>
                <Fab variant="extended" size="small" color="error" onClick={() => handleOpenDialog(selectedMatch)}>Delete</Fab>
              </>
            }
          </Container>
        }/>

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

      <ConfirmDialog open={openConfirm} handleClose={handleCloseConfirm} handleConfirm={handleDelete} messageTitle={'Delete match'} message={'Are you sure to delete this match?'}/>

      {matchesCount > 0 ?
        <>
          {matchesCount === cantEquipoTorneo-1?
            <Typography variant='h3' sx={{textAlign: 'center'}}>
              <strong>
                🏆 <u> Champion team: {getWinner(matches[cantEquipoTorneo-2])} </u> 🏆
              </strong>
            </Typography>
            :
            <Typography variant='caption'>
                * TBD - to be decided
            </Typography>
          }
          <SingleEliminationBracket
            matches={matches}
            matchComponent={MyMatch}
            // theme={MatchTheme}
            options={{
              style: {
                roundHeader: {
                  backgroundColor: MatchTheme.roundHeader.backgroundColor,
                  fontColor: MatchTheme.roundHeader.fontColor,
                },
                connectorColor: MatchTheme.connectorColor,
                connectorColorHighlight: MatchTheme.connectorColorHighlight,
              },
            }}
            svgWrapper={({ children }) => (
              <Box 
                sx={{
                  overflowX: "auto", // Permite el scroll horizontal
                  width: "100%", // Asegura que el contenedor ocupe todo el ancho disponible
                  display: {sm: "flex" },
                  justifyContent: {sm: "center" }
                }}
              >{children}</Box>
            )}
          />
        </>
      :
        <LoadingCard CircularSize={'2%'} message={"Maybe no matches are scheduled for this tournament or the number of teams is invalid."}/>
      }
    </>
  );
};

export default React.memo(MatchBracket);