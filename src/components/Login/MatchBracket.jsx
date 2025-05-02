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
  Alert,
  Paper,
  Divider,
  Chip,
  Grid,
  useMediaQuery
} from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { useParams, useNavigate } from 'react-router-dom';
import { SingleEliminationBracket } from '@g-loot/react-tournament-brackets';
import axiosInstance from "../../services/axiosConfig.js";

import ConfirmDialog from './ConfirmDialog.jsx';
import DialogComponent from './DialogComponent.jsx';
import LoadingCard from './LodingCard.jsx';

import AddIcon from '@mui/icons-material/Add';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EventIcon from '@mui/icons-material/Event';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const URL_SERVER = import.meta.env.VITE_URL_SERVER;

const MatchBracket = ({onwerTournament}) => {
  const navigate = useNavigate();
  const { tournamentName, tournamentId } = useParams();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [matches, setMatches] = React.useState([]);
  const [matchesCount, setMatchesCount] = React.useState(0);
  const [cantEquipoTorneo, setCantEquipoTorneo] = React.useState(0);
  const [flag, setFlag] = React.useState(true);

  React.useEffect(() => {
    if(flag){
      const fetchMatches = async () => {
        await axiosInstance.get(`/partidos/${tournamentId}`)
        .then((res)=> {
            setMatches(res.data.brackets);
            setMatchesCount(res.data.getPartidosCount);
            setCantEquipoTorneo(res.data.cantEquipoTorneo);
        })
        .catch ((err)=>{
            setMatchesCount(0);
            setCantEquipoTorneo(0);
        })
    };
    fetchMatches(); // Llamada para obtener los partidos del torneo
    setFlag(false);  
  }
  },[flag]);

  const [dataAlert, setDataAlert] = React.useState({});
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
    
  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackBar(false);
  };
  
  const [selectedMatch, setSelectedMatch] = React.useState(null);
  const handleOpenDialog = (match) => {
    setSelectedMatch(match);
    setConfirm(true);
  };
  const [openConfirm, setConfirm] = React.useState(false);
  const handleCloseConfirm = () => {
      setSelectedMatch(null);
      setConfirm(false);
  };
  const handleDelete = () => {
    setShowModal(false);
    if(!selectedMatch) return;
    axiosInstance.delete(`/partido/${tournamentId}/${selectedMatch.myIdMatch}`)
      .then((res)=>{
          setOpenSnackBar(true);
          setDataAlert({severity:"success", message:'Match deleted successfully!'});
      })
      .catch ((err) => {
          setOpenSnackBar(true);
          setDataAlert({severity:"error", message:'Error deleting match.'});
      });
    setFlag(true);
    setConfirm(false);
    handleCloseConfirm;
  };

  const handleEdit = (match) => {
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
    connectorColor: theme.palette.mode === "light" ? theme.palette.primary.dark : theme.palette.warning.main,
    connectorColorHighlight: theme.palette.mode === "light" ? theme.palette.text.primary : theme.palette.grey[500],
  };

  const MatchDetailItem = ({ icon, label, value }) => (
    <Grid container alignItems="center" spacing={1} sx={{ mb: 1 }}>
      <Grid item>
        {icon}
      </Grid>
      <Grid item xs>
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body2" fontWeight="medium">
          {value || 'N/A'}
        </Typography>
      </Grid>
    </Grid>
  );

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

    const message = (
      <Paper
        elevation={3}
        sx={(theme) => ({
          p: 2,
          borderRadius: 3,
          backgroundColor: theme.palette.background.paper,
          minWidth: 320,
          maxWidth: 420,
          mx: 'auto',
          boxShadow: theme.shadows[4],
        })}
      >
        <MatchDetailItem 
          icon={<SportsSoccerIcon color="primary" fontSize="small" />} 
          label="Home team:" 
          value={topParty?.name || teamNameFallback} 
        />
        <MatchDetailItem 
          icon={
            <Typography 
              color="secondary" 
              sx={{ width: 24, textAlign: 'center', fontWeight: 'bold' }}
            >
              H
            </Typography>
          } 
          label="Home result:" 
          value={topParty?.resultText || 'No result'} 
        />
    
        <Divider sx={{ my: 2 }} />
    
        <MatchDetailItem 
          icon={<SportsSoccerIcon color="primary" fontSize="small" />} 
          label="Guest team:" 
          value={bottomParty?.name || teamNameFallback} 
        />
        <MatchDetailItem 
          icon={
            <Typography 
              color="secondary" 
              sx={{ width: 24, textAlign: 'center', fontWeight: 'bold' }}
            >
              G
            </Typography>
          } 
          label="Guest result:" 
          value={bottomParty?.resultText || 'No result'} 
        />
    
        <Divider sx={{ my: 2 }} />
    
        <MatchDetailItem 
          icon={<ScheduleIcon color="primary" fontSize="small" />} 
          label="Match time:" 
          value={match.horaPartido || 'N/A'} 
        />
        <MatchDetailItem 
          icon={<EventIcon color="primary" fontSize="small" />} 
          label="Match date:" 
          value={match.fechaPartido || 'N/A'} 
        />
        <MatchDetailItem 
          icon={
            <Typography 
              color="primary" 
              sx={{ width: 24, textAlign: 'center', fontWeight: 'bold' }}
            >
              #
            </Typography>
          } 
          label="Match day:" 
          value={match.jornada || 'N/A'} 
        />
      </Paper>
    );
    

    const TeamRow = ({ party, isWinner, isTop }) => (
      <Grid
        container
        alignItems="center"
        spacing={1}
        sx={(theme) => ({
          p: 1,
          backgroundColor: isWinner
            ? theme.palette.mode === 'dark'
              ? theme.palette.success.dark
              : theme.palette.success.main
            : 'transparent',
          borderRadius: 2,
          transition: 'background-color 0.3s ease',
          '&:hover': {
            backgroundColor: isWinner
              ? theme.palette.mode === 'dark'
                ? theme.palette.success.main
                : theme.palette.success.main
              : theme.palette.action.hover,
            cursor: 'pointer',
          },
          width: '100%',
        })}
      >
        <Grid item>
          <Avatar
            src={`${URL_SERVER}/utils/uploads/${party?.image || 'logoEquipo.jpg'}`}
            alt={party?.name || 'Team'}
            sx={{ width: 34, height: 25 }}
            crossOrigin="use-credentials"
          />
        </Grid>
        <Grid item xs>
          <Typography
            variant="body2"
            fontWeight="medium"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: '0.875rem',
            }}
          >
            {party?.name || teamNameFallback}
          </Typography>
        </Grid>
        <Grid item>
          {party.name != 'TBD' &&
          <Chip
            label={isWinner ? 'WIN' : (topWon === bottomWon ? party?.resultText : 'LOST')}
            size="small"
            color={isWinner ? 'success' : (topWon === bottomWon ? 'default' : 'error')}
            sx={{
              minWidth: 69,
              fontWeight: 'bold',
              fontSize: '0.75rem',
            }}
          />}
        </Grid>
      </Grid>
    );
    return (
      <Box sx={{ position: 'relative' }}>
        {match?.partidosHijos && 
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: match?.myIdMatch ? 'space-between' : 'center',
            mb: 1,
            px: 1
          }}>
            {match?.myIdMatch ? (
              <>
                <Chip 
                  label={match.fechaPartido} 
                  size="small" 
                  icon={<EventIcon fontSize="small" />}
                />
                <Chip 
                  label={match.horaPartido} 
                  size="small" 
                  icon={<ScheduleIcon fontSize="small" />}
                  sx={{ ml: 1 }}
                />
              </>
            ) : onwerTournament && 
              <Fab 
                variant="extended" 
                color="success" 
                size="small"
                sx={{ 
                  height: 28, 
                  fontSize: 12,
                  '& .MuiSvgIcon-root': { fontSize: 16 }
                }} 
                onClick={() => navigate(`/match/create/${tournamentName}/${tournamentId}`, {state:{ matchIdBracket: match.id }})}
              > 
                <AddIcon sx={{ mr: 0.5 }} /> Add Match
              </Fab>
            }
          </Box>
        }
        
        <Card sx={{
          p: 0,
          borderRadius: 4,
          boxShadow: 9,
          overflow: 'hidden',
          border: match.id === (cantEquipoTorneo - 2) && match.myIdMatch ? 
            `2px solid ${theme.palette.secondary.main}` : 'none'
        }}>
          <CardActionArea 
            onClick={() => {
              setModalTittle(match.name?? "TBD"); 
              setModalMessage(message); 
              setSelectedMatch(match);
              setShowModal(true);
            }}
          >
            <Box sx={{ 
              backgroundColor: match.id === (cantEquipoTorneo - 2) && match.myIdMatch ? 
                theme.palette.mode === 'light' ? 
                  theme.palette.error.main : 
                  theme.palette.error.dark : 
                'transparent'
            }}>
              <TeamRow 
                party={topParty} 
                isWinner={topWon} 
                isTop={true} 
              />
              <Divider />
              <TeamRow 
                party={bottomParty} 
                isWinner={bottomParty?.isWinner} 
                isTop={false} 
              />
            </Box>
          </CardActionArea>
        </Card>
      </Box>
    );
  };

  const getWinner = (match) => {
    const home = match.participants[0];
    const guest = match.participants[1];
    const champion = home.isWinner !== guest.isWinner ? (home.isWinner ? home.name : guest.name) : 'Error';
    return champion.toUpperCase();
  }

  return (
    <>
      <DialogComponent 
        modalTittle={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SportsSoccerIcon color="primary" sx={{ mr: 1 }} />
            {modalTittle}
          </Box>
        }
        modalBody={modalMessage} 
        open={showModal} 
        handleClose={() => setShowModal(false)} 
        buttons={onwerTournament && matchesCount < cantEquipoTorneo-1 && selectedMatch?.partidosHijos &&
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            {!selectedMatch?.myIdMatch ? (
              <Button
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
                onClick={() => navigate(`/match/create/${tournamentName}/${tournamentId}`, {state: { matchIdBracket: selectedMatch.id }})}
                size={isSmallScreen ? 'small' : 'medium'}
              >
                Add Match
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEdit(selectedMatch)}
                  size={isSmallScreen ? 'small' : 'medium'}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleOpenDialog(selectedMatch)}
                  size={isSmallScreen ? 'small' : 'medium'}
                >
                  Delete
                </Button>
              </>
            )}
          </Box>
        }
      />

      <Snackbar 
        open={openSnackBar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackBar} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={dataAlert.severity}
          variant="filled"
          sx={{ width: '100%' }}
          onClose={handleCloseSnackBar}
        >
          {dataAlert.message}
        </Alert>
      </Snackbar>

      <ConfirmDialog 
        open={openConfirm} 
        handleClose={handleCloseConfirm} 
        handleConfirm={handleDelete} 
        messageTitle="Delete Match"
        message="Are you sure you want to delete this match?"
      />

{matches.length ? (
  <>
    {matchesCount === cantEquipoTorneo - 1 ? (
      <Paper
        elevation={3}
        sx={(theme) => ({
          p: 2,
          mb: 3,
          textAlign: 'center',
          backgroundColor:
            theme.palette.mode === 'light'
              ? theme.palette.success.light
              : theme.palette.success.dark,
          borderRadius: 2,
        })}
      >
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          <EmojiEventsIcon
            sx={{
              fontSize: '2rem',
              verticalAlign: 'middle',
              mr: 1,
              color: theme.palette.warning.main,
            }}
          />
          CHAMPION TEAM: {getWinner(matches[cantEquipoTorneo - 2])}
          <EmojiEventsIcon
            sx={{
              fontSize: '2rem',
              verticalAlign: 'middle',
              ml: 1,
              color: theme.palette.warning.main,
            }}
          />
        </Typography>
      </Paper>
    ) : (
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mb: 1 }}
      >
        * TBD - to be decided
      </Typography>
    )}

    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <SingleEliminationBracket
        matches={matches}
        matchComponent={MyMatch}
        options={{
          style: {
            roundHeader: {
              backgroundColor: MatchTheme.roundHeader.backgroundColor,
              fontColor: MatchTheme.roundHeader.fontColor,
              fontSize: isSmallScreen ? '0.8rem' : '1rem',
              padding: isSmallScreen ? '8px 4px' : '12px 8px',
            },
            connectorColor: MatchTheme.connectorColor,
            connectorColorHighlight: MatchTheme.connectorColorHighlight,
          },
        }}
        svgWrapper={({ children }) => (
          <Box
            sx={{
              overflowX: 'auto',
              width: '100%',
              py: 2,
              '&::-webkit-scrollbar': {
                height: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.grey[500],
                borderRadius: '4px',
              },
              display: { sm: 'flex' },
              justifyContent: { sm: 'center' },
            }}
          >
            {children}
          </Box>
        )}
      />
    </Paper>
  </>
) : (
  <LoadingCard
    CircularSize={'2%'}
    message="Maybe no matches are scheduled for this tournament or the number of teams is invalid."
  />
      )}
    </>
  );
};

export default React.memo(MatchBracket);