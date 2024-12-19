import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import SideMenu from '../components/Login/SideMenu.jsx';

import AppTheme from '../components/shared-theme/AppTheme.jsx';

export default function LayoutBasic(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
        <Box sx={(theme) => ({
            width: '100%',
            minHeight: '89.5vh',
            backgroundRepeat: 'no-repeat',
            backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
            ...theme.applyStyles('dark', {
              backgroundImage:
              'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))', 
              }),
            zIndex: 1
          })}
        >
          <SideMenu />
          
          {props.children}{/*  Contenido principal */}

        </Box>
    </AppTheme>
  );
}
