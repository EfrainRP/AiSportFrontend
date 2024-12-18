import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext'; // Acceder al usuario autenticado
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Usar useNavigate en lugar de useHistory

const ProfileEdit = () => {
    const { user } = useAuth(); // Obtenemos el usuario autenticado
    const [profile, setProfile] = useState({
        name: '',
        fsurname: '',
        msurname: '',
        email: '',
        gender: '',
        birthdate: '',
        nickname: '',
        image: ''
    }); // Estado para almacenar los datos del perfil

    const [loading, setLoading] = useState(true); // Estado para manejar la carga de los datos
    const navigate = useNavigate(); // Usar useNavigate en lugar de useHistory

    useEffect(() => {
        const fetchUser = async () => { // Petición SHOW Torneo
            try {
                const response = await axios.get(`http://localhost:5000/sporthub/api/perfil/${user.userId}`);
                setProfile(response.data); // Guardamos los datos del perfil en el estado
                setLoading(false); // Datos cargados
            } catch (err) {
                console.error('Error al cargar los datos de usuario:', err);
                setLoading(false); // Aun así dejamos de cargar
            }
        };

        if (user && user.userId) {
            fetchUser(); // Llamada para obtener los detalles del usuario
        }
    }, [user.userId, user.userName]); // Dependencias para volver a cargar si el userId o userName cambian

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Enviamos los datos actualizados al backend
        axios
            .put(`http://localhost:5000/sporthub/api/perfil/${user.userId}`, profile)
            .then((response) => {
                console.log('Profile updated:', response.data);
                // Redirigimos a la vista de perfil después de actualizar
                navigate(`/dashboard/perfil/${user.userName}/${user.userId}`); // Usar navigate en lugar de history.push
            })
            .catch((error) => {
                console.error('Error updating profile:', error);
            });
    };

    if (loading) {
        return <div>Loading...</div>; // Mostrar mensaje de carga
    }

    return (
        <div className="profile-edit">
            <h1>Edit Profile</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>First Surname</label>
                    <input
                        type="text"
                        name="fsurname"
                        value={profile.fsurname}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Second Surname</label>
                    <input
                        type="text"
                        name="msurname"
                        value={profile.msurname}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Gender</label>
                    <input
                        type="text"
                        name="gender"
                        value={profile.gender}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Birthdate</label>
                    <input
                        type="date"
                        name="birthdate"
                        value={profile.birthdate}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Nickname</label>
                    <input
                        type="text"
                        name="nickname"
                        value={profile.nickname}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Profile Image</label>
                    <input
                        type="file"
                        name="image"
                        onChange={(e) => handleChange({ target: { name: 'image', value: e.target.files[0].name } })}
                    />
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default ProfileEdit;
