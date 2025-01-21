import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import AppTheme from '../components/shared-theme/AppTheme.jsx';
import SideMenu from '../components/Login/SideMenu.jsx';
import Skeleton from '@mui/material/Skeleton';
import { useAuth } from '../services/AuthContext.jsx'; // Importa el AuthContext
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

import axiosInstance from "../services/axiosConfig.js";

export default function LayoutLogin(props) {
  const { user } = useAuth(); // Accede al usuario autenticado y al método logout
  const navigate = useNavigate(); // Hook para redireccionar  
  

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
        <Box sx={(theme) => ({
            display: 'flex',
            width: '100%',
            minHeight: '100vh',
            backgroundRepeat: 'no-repeat',
            backgroundImage:
            'radial-gradient(ellipse at 60% 40%, hsla(29, 95.30%, 57.80%, 0.73), hsla(29, 77.40%, 77.50%, 0.94))',
            ...theme.applyStyles('dark', {
              backgroundImage:
              'radial-gradient(at 50% 50%, hsla(29, 90.90%, 30.20%, 0.85), hsla(29, 41.70%, 18.80%, 0.84))', 
              }),
            zIndex: 1
          })}
        >
          <SideMenu/>
          
          <Box component="main" sx={{ flexGrow: 1, p:3, width:'80vw'}}> 
            {props.children}{/*  Contenido principal */}
          </Box>

        </Box>
    </AppTheme>
  );
}
