import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Asegúrate de importar tu archivo de estilos

const Register = () => {
    const [name, setName] = useState('');
    const [fsurname, setFsurname] = useState('');
    const [msurname, setMsurname] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('N/E');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        
        const newErrors = {};
        // Validación de los campos
        if (!name) newErrors.name = 'El nombre es obligatorio';
        if (!fsurname) newErrors.fsurname = 'El primer apellido es obligatorio';
        if (!msurname) newErrors.msurname = 'El segundo apellido es obligatorio';
        if (!nickname) newErrors.nickname = 'El apodo es obligatorio';
        if (!email) newErrors.email = 'El correo electrónico es obligatorio';
        if (!password) newErrors.password = 'La contraseña es obligatoria';
        if (!confirmPassword) newErrors.confirmPassword = 'La confirmación de contraseña es obligatoria';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden'; // Validación de coincidencia
        if (!birthdate) newErrors.birthdate = 'La fecha de nacimiento es obligatoria';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/sporthub/api/register', {
                name,
                fsurname,
                msurname,
                nickname,
                email,
                gender,
                password,
                birthdate,
            });
            
            if (response.status === 201) {
                // Manejo del éxito
                console.log('Registro exitoso:', response.data);
                setMessage('Registro exitoso. Puedes iniciar sesión ahora.');
            }
        } catch (error) {
            // Manejo del error
            if (error.response) {
                console.error('Error registrando:', error.response.data);
                const backendErrors = error.response.data.errors || {}; // Suponiendo que los errores vienen en este formato

                // Recorre los errores del backend y los asigna al objeto de errores
                for (const key in backendErrors) {
                    if (backendErrors.hasOwnProperty(key)) {
                        newErrors[key] = backendErrors[key];
                    }
                }

                setErrors(newErrors);
            } else {
                console.error('Error registrando:', error);
                setMessage('Error en el registro. Inténtalo de nuevo.');
            }
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h2 className="text-center mb-4">Registro</h2>
                {message && <div className="alert alert-info">{message}</div>}
                <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                    <div className="form-group">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    <div className="form-group">
                        <label>Primer Apellido:</label>
                        <input
                            type="text"
                            className={`form-control ${errors.fsurname ? 'is-invalid' : ''}`}
                            value={fsurname}
                            onChange={(e) => setFsurname(e.target.value)}
                            required
                        />
                        {errors.fsurname && <div className="invalid-feedback">{errors.fsurname}</div>}
                    </div>
                    <div className="form-group">
                        <label>Segundo Apellido:</label>
                        <input
                            type="text"
                            className={`form-control ${errors.msurname ? 'is-invalid' : ''}`}
                            value={msurname}
                            onChange={(e) => setMsurname(e.target.value)}
                            required
                        />
                        {errors.msurname && <div className="invalid-feedback">{errors.msurname}</div>}
                    </div>
                    <div className="form-group">
                        <label>Apodo:</label>
                        <input
                            type="text"
                            className={`form-control ${errors.nickname ? 'is-invalid' : ''}`}
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            required
                        />
                        {errors.nickname && <div className="invalid-feedback">{errors.nickname}</div>}
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    <div className="form-group">
                        <label>Género:</label>
                        <select
                            className="form-control"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="N/E">No Especificado</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                    <div className="form-group">
                        <label>Confirmar Contraseña:</label>
                        <input
                            type="password"
                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                    </div>
                    <div className="form-group">
                        <label>Fecha de Nacimiento:</label>
                        <input
                            type="date"
                            className={`form-control ${errors.birthdate ? 'is-invalid' : ''}`}
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
                            required
                        />
                        {errors.birthdate && <div className="invalid-feedback">{errors.birthdate}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary">Registrar</button>
                    <p>
                      ¿Ya tienes una cuenta? <Link to="/login">¡Inicia sesión!</Link>
                    </p>
                </form>
            </header>
        </div>
    );
};

export default Register;
