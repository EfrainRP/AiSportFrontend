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
            flexDirection: {md:'row', xs: 'column'},
            width: '100%',
            minHeight: '100vh',
            backgroundRepeat: 'no-repeat',
            ...theme.applyStyles('light', {
              backgroundImage:
              `linear-gradient(to bottom left, #e3f2fd, #90caf9, #42a5f5, #1e88e5)`,
            }),
            ...theme.applyStyles('dark', {
              backgroundImage: 'linear-gradient(to bottom left, #1a1c2e, #2e324f, #3a3f6b, #4b4f7e)',
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
