import React from 'react';
import Typography from '@mui/material/Typography';


import { useAuth } from '../../services/AuthContext'; // Importa el AuthContext
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

import SideMenu from '../../components/Login/SideMenu';
import LayoutLogin from '../LayoutLogin';

function Dashboard() {
  const { user, logout } = useAuth(); // Accede al usuario autenticado y al método logout
  const navigate = useNavigate(); // Hook para redireccionar

  const handleLogout = () => {
    logout(); // Llama a la función logout del contexto
    navigate('/signin'); // Redirecciona a la página de login
  };
  console.log(user);
    return (
      <LayoutLogin>
        <Typography sx={{ marginBottom: 2 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
          enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
          imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
          Convallis convallis tellus id interdum velit laoreet id donec ultrices.
          Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
          adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
          nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
          leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
          feugiat vivamus at augue. At augue eget arcu dictum varius duis at
          consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
          sapien faucibus et molestie ac.
        </Typography>
              <h4 className="text-center">Dashboard</h4>
            <div className="card-body text-center">
              <h1 className="text-center">¡Hola {user ? user.userName : 'invitado'}!</h1>
              <p>Bienvenido al panel de control.</p>
              <p>Aquí podrás gestionar tus preferencias y consultar tu información.</p>
            </div>
            <div className="card-footer text-center">
              <button className="btn btn-primary">Mis Preferencias</button>
              <button className="btn btn-secondary ms-2" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          
      </LayoutLogin>
  );
}

export default Dashboard;