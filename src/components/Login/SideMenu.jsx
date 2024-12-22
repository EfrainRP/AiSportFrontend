import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Avatar from '@mui/material/Avatar';
import { SporthubIcon } from '../CustomIcons.jsx';

import ColorModeSelect from '../shared-theme/ColorModeSelect.jsx';

import HomeIcon from '@mui/icons-material/Home';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';

import SelectContent from './SelectContent';
import MenuContent from './MenuContent';
import CardAlert from './CardAlert';
import OptionsMenu from './OptionsMenu';

const drawerWidth = 215;

const dataSideMenu = [ //TO DO: checar las urls
  {name: 'Home', img: <HomeIcon/>, url: '/dashboard' },
  {name: 'Tournaments', img: <EmojiEventsIcon/>, url: '/torneos' },
  {name: 'Teams', img: <PeopleAltIcon/>, url: '#' },
  {name: 'Search', img: <SearchIcon/>, url: '#' },
  {name: 'Notifications', img: <ChatIcon/>, url: '#' }
];

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

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
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */
  return color;
}

function stringAvatar(name) { // Funcion segun el nombre del usuario para el color del avatar
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

export default function SideMenu(props) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const toggleDrawer = () => {
    setOpen(!open);
  };


  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
      <Drawer variant="permanent" open={open} sx={{display: 'block '}} {...props}>
        <DrawerHeader>
          <Box sx={open? { display: 'flex', flexGrow: 0.1, alignItems: 'center',} : { display:'none'}}>
            <SporthubIcon fontSize={{md:35,xs:40}}/>
            <Typography sx={{m:{md:1.5,xs:0.5}}} variant='h6'>SportHub</Typography>
          </Box>
          <IconButton onClick={toggleDrawer}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
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
          {dataSideMenu.map((data, index) => (
            <ListItem key={data.name} disablePadding 
              sx={{ display: 'block' }}
            >
              <ListItemButton
                title={data.name}
                alt={data.url}
                href={data.url}
                selected={selectedIndex === index}
                onClick={(event) => handleListItemClick(event, index)}
                sx={[{
                    minHeight: 80,
                    px: 2.5,
                  },
                  open? { justifyContent: 'initial',} : { justifyContent: 'center',},
                ]}>
                <ListItemIcon
                  sx={[{
                      minWidth: 0,
                      justifyContent: 'center',
                      ml: 1,
                    },
                  ]}>
                  {data.img}
                </ListItemIcon>
                <ListItemText
                  primary={data.name}
                  sx={[open? { opacity: 1,} : { opacity: 0,}, ]}
                />
              </ListItemButton>
              <Divider />
            </ListItem>
          ))}
          <ColorModeSelect 
            transform={{xs:'scale(0.75)', md:'scale(0.82)'}} 
            sx={[
              open? {mr:7} : {mr:18},
              {
              display:'flex',
              justifyContent: 'flex-end',
                mt:2.5,
              },
            ]}
            ml={9}
          />
          <ListItem key={'Profile'} disablePadding 
            sx={{ mt: 'auto', ml:-0.5}}
          >
            <ListItemButton
              title={'Profile'}
              alt='#' // TO DO: ingresar el name del usuario
              href='#' // TO DO: ingresar el name del usuario
              selected={selectedIndex === 5}
              onClick={(event) => handleListItemClick(event, 5)}
              sx={[{
                  minHeight: 70,
                },
                //open? { justifyContent: 'initial',} : { justifyContent: 'center',},
              ]}>
              <ListItemIcon
                sx={[{
                    minWidth: 0,
                  },
                ]}>
                <Avatar {...stringAvatar('Kent Dodds')} sx={{width: 40, height: 40, fontSize:18}}/>
              </ListItemIcon>
              <ListItemText
                primary={'Profile'}
                sx={[open? { opacity: 1,} : { opacity: 0,}, ]}
              />
            </ListItemButton>
            </ListItem>
        </List>
      </Drawer>
  );
}