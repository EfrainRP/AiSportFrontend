import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import HeaderAppBar from '../components/HeaderAppBar';
import Footer from '../components/Footer';

import AppTheme from '../components/shared-theme/AppTheme.jsx';
import zIndex from '@mui/material/styles/zIndex.js';

export default function Layout(props) {
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
          <HeaderAppBar />
          
          {props.children}{/*  Contenido principal */}

          <Footer myP={{ xs: '5%', sm: '2%' } }/>
        </Box>
    </AppTheme>
  );
}
