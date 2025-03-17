import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import HeaderAppBar from '../components/Basic/HeaderAppBar.jsx';
import Footer from '../components/Basic/Footer.jsx';

import AppTheme from '../components/shared-theme/AppTheme.jsx';

export default function LayoutBasic(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
        <Box sx={(theme) => ({
            width: '100',
            minHeight: '89.5vh',
            backgroundRepeat: 'no-repeat',
            backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsla(0, 0.00%, 100.00%, 0.84), hsla(28, 65.40%, 79.60%, 0.91))',
            ...theme.applyStyles('dark', {
              backgroundImage:
              'radial-gradient(at 50% 50%, hsla(29, 97.00%, 26.50%, 0.75), hsla(27, 64.80%, 17.80%, 0.64))', 
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
