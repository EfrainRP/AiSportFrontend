import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext'; // Acceder al usuario autenticado
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const ProfileEdit = () => {
    const { user } = useAuth(); // usuario autenticado
    const [successMessage, setSuccessMessage] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [profile, setProfile] = useState({
        name: '',
        fsurname: '',
        msurname: '',
        email: '',
        gender: '',
        birthdate: '',
        nickname: '',
        image: '',
        currentPassword: '', // Nueva propiedad para la contraseña actual
        newPassword: '',     // Nueva propiedad para la nueva contraseña
        confirmPassword: ''  // Nueva propiedad para la confirmación de la nueva contraseña
    });
    const [errors, setErrors] = useState({}); // Estado para los errores
    const [loading, setLoading] = useState(true); // Estado para manejar la carga de los datos
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchUser = async () => { // Petición SHOW Peril <-
            try {
                const response = await axios.get(`http://localhost:5000/sporthub/api/perfil/${user.userId}`);
                
                const userProfile = response.data;

                // Formatea la fecha de nacimiento a 'YYYY-MM-DD' si existe
                const formattedBirthdate = userProfile.birthdate ? userProfile.birthdate.slice(0, 10) : '';

                // Establece los los datos del perfil en el estado
                setProfile({
                    ...userProfile,
                    birthdate: formattedBirthdate // Usa la fecha formateada
                });
                setLoading(false); // Datos cargados
            } catch (err) {
                console.error('Error al cargar los datos de usuario:', err);
                setLoading(false); // En caso de que falle el servidor de back, regresa "loading" <-
            }
        };

        if (user && user.userId) {
            fetchUser(); // Llamada para obtener los detalles del usuario
        }
    }, [user.userId]); // Dependencias para volver a cargar si el userId cambia

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files && files[0]) {
            setProfile((prevState) => ({
                ...prevState,
                [name]: files[0] // Guarda el archivo en el estado
            }));
        } else {
            setProfile((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Validar que la nueva contraseña y la confirmación coincidan
        if (profile.newPassword !== profile.confirmPassword) {
            alert('La nueva contraseña y la confirmación no coinciden.');
            return;
        }
    
        // Crea un objeto FormData
        const formData = new FormData();
        formData.append('name', profile.name);
        formData.append('fsurname', profile.fsurname);
        formData.append('msurname', profile.msurname);
        formData.append('email', profile.email);
        formData.append('gender', profile.gender);
        formData.append('birthdate', profile.birthdate);
        formData.append('nickname', profile.nickname);
        if (profile.currentPassword) formData.append('currentPassword', profile.currentPassword);
        if (profile.newPassword) formData.append('newPassword', profile.newPassword);
        if (profile.confirmPassword) formData.append('confirmPassword', profile.confirmPassword);
        if (profile.image) formData.append('image', profile.image); // Adjunta el archivo de imagen
    
        // Enviar los datos al backend
        axios
            .put(`http://localhost:5000/sporthub/api/perfil/${user.userId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then((response) => {
                setSuccessMessage('¡Perfil actualizado con éxito!');
                // Redirige al perfil después de actualizar
                setTimeout(() => navigate(`/dashboard/perfil/${user.userName}`), 2000);
            })
            .catch((err) => {
                console.log("ERROR",err);
                if (err.response && err.response.data && err.response.data.field) {
                    const { field, message } = err.response.data;
                    setErrors({ [field]: message });
                    console.error("Error de campo:", field, message);
                } else {
                    setGeneralError('Error al actualizar el perfil.');
                }
            });
    };
    

    if (loading) {
        return <div>Loading...</div>; // Mostrar mensaje de carga
    }

    return (
        <div className="profile-edit">
            <h1>Edit Profile</h1>
            {successMessage && <p className="success">{successMessage}</p>}
            {generalError && <p className="error">{generalError}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                    />
                    {errors.name && <p className="error">{errors.name}</p>} {/* Mostrar error si existe */}
                </div>
                <div>
                    <label>First Surname</label>
                    <input
                        type="text"
                        name="fsurname"
                        value={profile.fsurname}
                        onChange={handleChange}
                    />
                    {errors.fsurname && <p className="error">{errors.fsurname}</p>} {/* Mostrar error si existe */}
                </div>
                <div>
                    <label>Second Surname</label>
                    <input
                        type="text"
                        name="msurname"
                        value={profile.msurname}
                        onChange={handleChange}
                    />
                    {errors.msurname && <p className="error">{errors.msurname}</p>} {/* Mostrar error si existe */}
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p className="error">{errors.email}</p>} {/* Mostrar error si existe */}
                </div>
                <div>
                    <label>Gender</label>
                    <input
                        type="text"
                        name="gender"
                        value={profile.gender}
                        onChange={handleChange}
                    />
                    {errors.gender && <p className="error">{errors.gender}</p>} {/* Mostrar error si existe */}
                </div>
                <div>
                    <label>Birthdate</label>
                    <input
                        type="date"
                        name="birthdate"
                        value={profile.birthdate}
                        onChange={handleChange}
                    />
                    {errors.birthdate && <p className="error">{errors.birthdate}</p>} {/* Mostrar error si existe */}
                </div>
                <div>
                    <label>Nickname</label>
                    <input
                        type="text"
                        name="nickname"
                        value={profile.nickname}
                        onChange={handleChange}
                    />
                    {errors.nickname && <p className="error">{errors.nickname}</p>} {/* Mostrar error si existe */}
                </div>
                <div>
                    <label>Profile Image</label>
                    <input
                        type="file"
                        name="image"
                        onChange={(e) => handleChange({ target: { name: 'image', value: e.target.files[0] } })}
                    />
                    {errors.image && <p className="error">{errors.image}</p>} {/* Mostrar error si existe */}
                </div>

                {/* Campos para cambiar la contraseña */}
                <div>
                    <label>Current Password</label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={profile.currentPassword}
                        onChange={handleChange}
                    />
                    {errors.currentPassword && <p className="error">{errors.currentPassword}</p>} {/* Mostrar error si existe */}
                </div>
                <div>
                    <label>New Password</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={profile.newPassword}
                        onChange={handleChange}
                    />
                    {errors.newPassword && <p className="error">{errors.newPassword}</p>} {/* Mostrar error si existe */}
                </div>
                <div>
                    <label>Confirm New Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={profile.confirmPassword}
                        onChange={handleChange}
                    />
                    {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>} {/* Mostrar error si existe */}
                </div>

                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default ProfileEdit;
