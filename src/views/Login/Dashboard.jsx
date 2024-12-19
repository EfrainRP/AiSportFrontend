// src/Dashboard.js
import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../../services/AuthContext'; // Importa el AuthContext
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import SideMenu from '../../components/Login/SideMenu';

function Dashboard() {
  const { user, logout } = useAuth(); // Accede al usuario autenticado y al método logout
  const navigate = useNavigate(); // Hook para redireccionar

  const handleLogout = () => {
    logout(); // Llama a la función logout del contexto
    navigate('/signin'); // Redirecciona a la página de login
  };
  console.log(user);
    return (
      <div className="container mt-5">
      <SideMenu/>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4 className="text-center">Dashboard</h4>
            </div>
            <div className="card-body text-center">
              <h1 className="text-center">¡Hola {user ? user.userName : 'invitado'}!</h1>
              <p>Bienvenido al panel de control.</p>
              <p>Aquí podrás gestionar tus preferencias y consultar tu información.</p>
            </div>
            <div className="card-footer text-center">
              <button className="btn btn-primary">Mis Preferencias</button>
              <button className="btn btn-secondary ms-2" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;