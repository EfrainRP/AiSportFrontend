import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';


import AppTheme from '../components/shared-theme/AppTheme.jsx';
import SideMenu from '../components/Login/SideMenu.jsx';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export default function LayoutBasic(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
        <Box sx={(theme) => ({
            display: 'flex',
            width: '100%',
            minHeight: '100vh',
            backgroundRepeat: 'no-repeat',
            backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsla(29, 89.50%, 66.30%, 0.70), hsl(0, 0.00%, 80.40%))',
            ...theme.applyStyles('dark', {
              backgroundImage:
              'radial-gradient(at 50% 50%, hsla(29, 82.60%, 36.10%, 0.48), hsla(29, 52.60%, 22.40%, 0.38))', 
              }),
            zIndex: 1
          })}
        >
          <SideMenu />
          
          <Box component="main" sx={{ flexGrow: 1, p:3}}> 
            {props.children}{/*  Contenido principal */}
          </Box>
        </Box>
    </AppTheme>
  );
}
