import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CircularProgress from '@mui/material/CircularProgress';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Skeleton, { skeletonClasses } from '@mui/material/Skeleton';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';

import Logout from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SmartToyTwoToneIcon from '@mui/icons-material/SmartToyTwoTone';
import ChatIcon from '@mui/icons-material/Chat';
import Settings from '@mui/icons-material/Settings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { AiSportIcon } from '../CustomIcons.jsx';
import { useAuth } from '../../services/AuthContext.jsx'; // Importa el AuthContext
import { useNavigate, useLocation } from 'react-router-dom'; // Importa useNavigate
import axiosInstance from '../../services/axiosConfig.js';
const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server

import ColorModeSelect from '../shared-theme/ColorModeSelect.jsx';
import { Paper } from '@mui/material';

const drawerWidth = 195;

const dataSideMenu = [ //TO DO: checar las urls
  {name: 'Home', img: <HomeIcon/>, url: '/dashboard' },
  {name: 'Tournaments', img: <EmojiEventsIcon/>, url: '/tournaments' },
  {name: 'Teams', img: <PeopleAltIcon/>, url: '/teams' },
  {name: 'IA', img: <SmartToyTwoToneIcon/>, url: '/dashboard/trainning/IA' },
  {name: 'Notifications', img: <ChatIcon/>, url: '/notifications' }
];

const openedMixin = (theme, anchor) => {
  const isVertical = anchor === 'top' || anchor === 'bottom';
  return {
    ...(isVertical
      ? {
          height: 200,
          width: '100%',
        }
      : {
          width: drawerWidth,
        }),
    transition: theme.transitions.create(isVertical ? 'height' : 'width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflow: 'hidden',
  };
};

const closedMixin = (theme, anchor) => {
  const isVertical = anchor === 'top' || anchor === 'bottom';
  return {
    ...(isVertical
      ? {
          height: 0,
          width: '100%',
        }
      : {
          width: `calc(${theme.spacing(7)} + 1px)`,
          [theme.breakpoints.up('sm')]: {
            width: `calc(${theme.spacing(8)} + 1px)`,
          },
        }),
    transition: theme.transitions.create(isVertical ? 'height' : 'width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflow: 'hidden',
  };
};

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const MyDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open, anchor }) => ({
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open
    ? {
        ...openedMixin(theme, anchor),
        '& .MuiDrawer-paper': openedMixin(theme, anchor),
      }
    : {
        ...closedMixin(theme, anchor),
        '& .MuiDrawer-paper': closedMixin(theme, anchor),
      }),
}));

function stringToColor(string) {
  let hash = 0;
  let i;
  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${(value + 128).toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */
  return color;
}

// function stringAvatar(name, sx) { // Funcion segun el nombre del usuario para el color del avatar
//   return {
//     sx: {
//       bgcolor: stringToColor(name),
//       ml:0.6,
//       ...sx,
//     },
//     children: `${name[0]}`,
//   };
// }

export default function SideMenu(props) {  
  const { user = { userId: 0, userName: 'UserUnknow' }, logout, loading, setLoading } = useAuth(); // Accede al usuario autenticado, de la funcion obtenemos su valor especifico, validado si esta vacio el valory Accede al usuario autenticado y al método logout
  const userName = user.userName;

  const navigate = useNavigate();
  const location = useLocation(); // Hook para obtener la ubicación actual

  const theme = useTheme();
  const [openList, setOpen] = React.useState(false); // Evento para abrir sideBar

  const [anchorEl, setAnchorEl] = React.useState(null); // Evento para el miniMenu del Perfil
  const openMenu = Boolean(anchorEl);
  
  const [countNotification, setCountNotificactions] = React.useState(0); // Estado para las notificaciones
  const [profile, setProfile] = React.useState(null);

  React.useEffect(() => {
    const fetchProfile = async () => {
      await axiosInstance.get(`perfil/${user.userId}`) //obtener datos de perfil
      .then((response) => {
          setProfile(response.data);
      })
      .catch((error) => {
          console.error("Error al obtener los datos del usuario:", error);
      });
    };

    const fetchData = async () => {
      // Obtener notificaciones
      await axiosInstance.get(`/notificaciones/${user.userId}`)
      .then((response) => {
        setCountNotificactions(response.data.length); // Establecer las notificaciones en el estado
        setTimeout(() => {
          setLoading(false); // Cambia el estado para simular que la carga ha terminado
        }, 1500); // Simula tiempo de carga
      })
      .catch ((error) => {
        // console.error('Error al obtener las notificaciones:', error);
        setLoading(false); // Cambiar el estado de carga incluso en caso de error
      });
    };

    if (user) {
      fetchData(); // Llamar a la función solo si el usuario está definido
      fetchProfile();
    }
  }, [user.userId, user.userName, countNotification]);
  
  const handleLogout = () => {
    logout(); // Llama a la función logout del contexto
    navigate('/signin'); // Redirecciona a la página de login
  };
  
  const toggleDrawer = () => {
    setOpen(!openList);
  };
  
  const handleListItemClick = (event, i) => {
    setIndex(i);
    theIndex.current = i;
    console.log(theIndex.current)

  };

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // console.log(`${URL_SERVER}/utils/uploads/logoPerfil.jpg`);

  return (
    <>
      <MyDrawer variant="permanent" open={openList} sx={{display: { xs: 'none', md: 'block' }}} {...props}>
        <DrawerHeader>
          <Box sx={openList? { display: 'flex', flexGrow: 0.1, alignItems: 'center',} : { display:'none'}}>
            <AiSportIcon fontSize={{md:30,xs:35}}/>
            <Typography sx={{m:{md:1,xs:0.7}}} variant='h6'>AiSport</Typography>
          </Box>
          
          <IconButton onClick={toggleDrawer}>
            {openList? <ChevronLeftIcon /> 
            : (loading? <CircularProgress size={20}/>
              : <MenuIcon />)
            }
          </IconButton>
        </DrawerHeader>
          
        <Divider />
        
        <List
          sx={{
            display: 'flex',
            flexDirection: 'column', // Colocar elementos en columna
            height: '100%', // Ocupar toda la altura del contenedor
          }}
        >
          {loading?
            dataSideMenu.map((data, index) => {
            return (
              <ListItem key={data.name} disablePadding 
              sx={{ display: 'block' }}
            >
              <ListItemButton>
                <ListItemIcon
                sx={{
                  // height:75, 
                  justifyContent:'center',
                  alignItems:'center',
                  ml: 1
                  }}>
                <CircularProgress size={20}/>
              </ListItemIcon>
            </ListItemButton>
            <Divider />
            </ListItem>
            );
            })
          :
          dataSideMenu.map((data, index) => {
            return (<ListItem key={data.name} disablePadding 
              sx={{ display: 'block'}}
            >
              <ListItemButton
                title={data.name}
                alt={data.url}
                href={data.url}
                selected={location.pathname === data.url}
                sx={[{
                    my:2,
                    // minHeight: "4rem",
                    px: 2.5,
                  },
                  openList? { justifyContent: 'initial',} : { justifyContent: 'center',},
                ]}>
                <ListItemIcon
                  sx={[{
                      minWidth: 0,
                      justifyContent: 'center',
                      ml: 1,
                    },
                  ]}>
                  {data.name == 'Notifications'? 
                    <Badge badgeContent={countNotification} color="primary" 
                    sx={{
                      "& .MuiBadge-badge": {
                          fontSize: "0.75rem", // Tamaño del texto
                          height: "18px", // Altura del badge
                          minWidth: "18px", // Ancho mínimo del badge
                          borderRadius: "17px", // Forma redonda
                          right:-4,
                          top: -3
                        },
                    }}>
                    {data.img}</Badge> 
                    : 
                    data.img
                  }
                </ListItemIcon>
                <ListItemText
                  primary={data.name}
                  sx={[openList? { opacity: 1,} : { opacity: 0,}, ]}
                />
              </ListItemButton>
              <Divider />
            </ListItem>
          );})}
          {loading? 
            <Box sx={{ display: 'flex', justifyContent:'center', mt: '50%'}}>
              <CircularProgress size={20}/>
            </Box>
          :
            <ColorModeSelect 
              transform={{xs:'scale(0.75)', md:'scale(0.82)'}} 
              sx={[
                openList? {mr:7} : {mr:18},
                {
                display:'flex',
                justifyContent: 'flex-end',
                  mt:2.5,
                },
              ]}
              ml={9}
            />
          }
          {!openList && 
          <ListItem key={'Logout'} disablePadding 
            sx={{ mt: 'auto', ml:-0.5, flexDirection: 'row',}}
          >
            <ListItemButton
              onClick={handleLogout}
              sx={{
                minHeight: 40,
              }}
            >
              <ListItemIcon>
                {loading?
                  <CircularProgress size={20} sx={{ml:1}}/>
                :
                  <Logout sx={{ml:1.5, fontSize: 100 }}/>
                }
              </ListItemIcon>
            </ListItemButton>
          </ListItem>}
          <ListItem key={'Profile'} disablePadding 
            sx={[{ml:-0.5, flexDirection: 'row'},openList? {mt: 'auto'}: {mt: 1,}]}
          >
            <ListItemButton
              title={'Profile'}
              selected={location.pathname === 'profile'}
              href={`/dashboard/profile/${user.userName}`}
              onClick={handleClickMenu}
              sx={[{
                  minHeight: 40,
                },
                //open? { justifyContent: 'initial',} : { justifyContent: 'center',},
              ]}>
              <ListItemIcon
                sx={[{
                    minWidth: 0,
                  },
                ]}>
                {loading?
                  <CircularProgress size={20} sx={{ml:1}}/>
                :
                // {...stringAvatar(userName, {width: 30, height: 30, fontSize:15,})}
                  <Avatar src={`${URL_SERVER}/utils/uploads/${(profile && profile.image !== 'logoPerfil.jpg') ? profile.image : 'logoPerfil.jpg'}`} crossOrigin="use-credentials"/>
                }
              </ListItemIcon>
              <ListItemText
                primary={userName}
                sx={[openList? { opacity: 1,} : { opacity: 0, }, ]}
              />
            </ListItemButton>
            {/* Es un miniMenu para agregar el boton de settings con el logout y el perfil
            <Menu 
              anchorEl={anchorEl}
              id="account-menu"
              open={openMenu}
              onClose={handleCloseMenu}
              onClick={handleCloseMenu}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    ml:0.5,
                    width: '10%',
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&::before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      bottom: 21,
                      left: -5,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: 'left', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleCloseMenu}>
                <Avatar /> My account
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleCloseMenu}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={handleCloseMenu}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu> */}
            
            {/* && !openMenu  agregarlo en la condicion siguiente al usar el miniMenu*/}
            {openList && (
              <IconButton onClick={handleLogout} title='Logout' aria-label='Logout'>
                <Logout />
              </IconButton>
            )}
          </ListItem>
        </List>
        
      </MyDrawer>
      
      <AppBar position="static" 
        sx={[
          (theme) => ({
            display: { md: 'none', xs:'flex'},
            backgroundColor: theme.palette.background.paper,
            ...theme.applyStyles('dark', {
              backgroundColor: (theme.vars || theme).palette.background.paper
            }),
            
          }),
        ]}
      >
        <Toolbar sx={{justifyContent: 'space-between'}}>
          {/* <Box sx={openList? { display: 'flex', flexGrow: 0.1, alignItems: 'center',} : { display:'none'}}>
            <AiSportIcon fontSize={{md:30,xs:35}}/>
            <Typography sx={{m:{md:1,xs:0.7}}} variant='h6'>AiSport</Typography>
          </Box> */}
          <IconButton onClick={toggleDrawer}>
            {loading? <CircularProgress size={20}/> : <MenuIcon />}
          </IconButton>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignContent: 'center', ml:2}}>
            <AiSportIcon fontSize={{md:30,xs:35}}/>
            <Typography sx={{mx: 1}} variant='h4'>AiSport</Typography>
          </Box>
          <ColorModeSelect 
            sx={{mt:1}}
          />
        </Toolbar>
      </AppBar>
      <Drawer
        anchor='top'
        open={openList}
        sx={{display: { md: 'none', xs:'flex'}, width: '100%'}}
        {...props}
        >
          <Container sx={{display: 'flex', flexDirection:'row', mt: 2, justifyContent: 'space-between'}}>
            <IconButton
              onClick={toggleDrawer}
              // edge="start"
              // sx={{ mr: 2 }}
            >
              {loading? <CircularProgress size={20}/> : <ExpandLessIcon />}
            </IconButton>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', ml:2}}>
              <AiSportIcon fontSize={{md:30,xs:30}}/>
              <Typography sx={{mx: 1, mt:0.5}} variant='h4'>AiSport</Typography>
            </Box>
            <ColorModeSelect 
              sx={{mt:1}}
            />
            </Container>
            <List
              sx={{
                display: 'flex',
                flexDirection: 'column', // Colocar elementos en columna
                height: '100%', // Ocupar toda la altura del contenedor
              }}
            >
              {loading?
                dataSideMenu.map((data, index) => {
                return (
                  <ListItem key={data.name} disablePadding 
                  sx={{ display: 'block' }}
                >
                  <ListItemButton>
                    <ListItemIcon
                    sx={{
                      // height:75, 
                      justifyContent:'center',
                      alignItems:'center',
                      ml: 1
                      }}>
                    <CircularProgress size={20}/>
                  </ListItemIcon>
                </ListItemButton>
                <Divider />
                </ListItem>
                );
                })
              :
              dataSideMenu.map((data, index) => {
                return (<ListItem key={data.name} disablePadding 
                  sx={{ display: 'block'}}
                >
                  <ListItemButton
                    title={data.name}
                    alt={data.url}
                    href={data.url}
                    selected={location.pathname === data.url}
                    sx={{
                      my:1,
                    }}>
                    <ListItemIcon
                      sx={[{
                          minWidth: 0,
                          justifyContent: 'center',
                          ml: 2,
                        },
                      ]}>
                      {data.name == 'Notifications'? 
                        <Badge badgeContent={countNotification} color="primary" 
                        sx={{
                          "& .MuiBadge-badge": {
                              fontSize: "0.6rem", // Tamaño del texto
                              height: "14px", // Altura del badge
                            },
                        }}>
                        {data.img}</Badge> 
                        : 
                        data.img
                      }
                    </ListItemIcon>
                    <ListItemText
                      primary={data.name}
                      sx={{ml:1}}
                    />
                  </ListItemButton>
                  <Divider />
                </ListItem>
              );})}
              
              {!openList && 
              <ListItem key={'Logout'} disablePadding 
                sx={{ mt: 'auto', ml:-0.5, flexDirection: 'row',}}
              >
                <ListItemButton
                  onClick={handleLogout}
                  sx={{
                    minHeight: 40,
                  }}
                >
                  <ListItemIcon>
                    {loading?
                      <CircularProgress size={20} sx={{ml:1}}/>
                    :
                      <Logout sx={{ml:1.5, fontSize: 100 }}/>
                    }
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>}
              <ListItem key={'Profile'} disablePadding 
                sx={[{ml:-0.5, flexDirection: 'row'},openList? {mt: 'auto'}: {mt: 1,}]}
              >
                <ListItemButton
                  title={'Profile'}
                  selected={location.pathname === 'profile'}
                  href={`/dashboard/profile/${user.userName}`}
                  onClick={handleClickMenu}
                  sx={[{
                      minHeight: 40,
                    },
                    //open? { justifyContent: 'initial',} : { justifyContent: 'center',},
                  ]}>
                  <ListItemIcon
                    sx={[{
                        minWidth: 0,
                      },
                    ]}>
                    {loading?
                      <CircularProgress size={20} sx={{ml:1}}/>
                    :
                    // {...stringAvatar(userName, {width: 30, height: 30, fontSize:15,})}
                      <Avatar src={`${URL_SERVER}/utils/uploads/${(profile && profile.image !== 'logoPerfil.jpg') ? profile.image : 'logoPerfil.jpg'}`} crossOrigin="use-credentials"/>
                    }
                  </ListItemIcon>
                  <ListItemText
                    primary={userName}
                    sx={[openList? { opacity: 1,} : { opacity: 0, }, ]}
                  />
                </ListItemButton>
                
                {/* && !openMenu  agregarlo en la condicion siguiente al usar el miniMenu*/}
                {openList && (
                  <IconButton onClick={handleLogout} title='Logout' aria-label='Logout'>
                    <Logout />
                  </IconButton>
                )}
              </ListItem>
            </List>
        </Drawer>
  
    </>
  );
}