import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext'; // Acceder al usuario autenticado
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProfileShow = () => {
    const { user } = useAuth(); // Obtenemos el usuario autenticado
    const [profile, setProfile] = useState(null); // Estado para almacenar los datos del perfil

    useEffect(() => {
        const fetchUser = async () => { // Peticion SHOW Torneo <-
          try {
            const response = await axios.get(`http://localhost:5000/sporthub/api/perfil/${user.userId}`);
            setProfile(response.data); // Datos del user
          } catch (err) {
            console.error('Error al cargar los datos de usuario:', err);
          }
        };
        fetchUser(); // Llamada para obtener los detalles del user
      }, [user.userId, user.userName]);

    if (!profile) {
        return <div>Loading... </div>; // Mostrar un mensaje de carga mientras se obtienen los datos
    }

    return (
        <div className="profile">
            <h1>Profile</h1>
            <div>
                <img src={`http://localhost:5000/images/${profile.image}`} alt="User Profile" />
                <p>Name: {profile.name} {profile.fsurname} {profile.msurname}</p>
                <p>Email: {profile.email}</p>
                <p>Gender: {profile.gender}</p>
                <p>Birthdate: {new Date(profile.birthdate).toLocaleDateString()}</p>
                <p>Nickname: {profile.nickname || 'No nickname set'}</p>
                <p><Link to={`/dashboard/perfil/${user.userName}/edit`}>Editar Perfil</Link></p>

                {/* Mostrar equipos, notificaciones y torneos si existen */}
                <div>
                    <h3>Equipos:</h3>
                    <ul>
                        {profile.equipos?.map((equipo) => (
                            <li key={equipo.id}>{equipo.name}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3>Notificaciones:</h3>
                    <ul>
                        {profile.notifications_notifications_user_idTousers?.map((notification) => (
                            <li key={notification.id}>{notification.message}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3>Torneos:</h3>
                    <ul>
                        {profile.torneos?.map((torneo) => (
                            <li key={torneo.id}>{torneo.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProfileShow;
