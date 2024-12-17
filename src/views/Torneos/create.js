import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext'; //  AuthContext

const CreateTorneo = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Accede al usuario autenticado y al método logout
  const [torneo, setTorneo] = useState({
    name: '',
    ubicacion: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    cantEquipo: 0,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTorneo((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError('');
    setSuccessMessage('');

    try {
      // Incluye el userId en el objeto torneo antes de enviarlo
      const torneoData = { ...torneo, userId: user.userId };

      await axios.post('http://localhost:5000/sporthub/api/torneo/create', torneoData);
      setSuccessMessage('Torneo creado con éxito!');
      setTimeout(() => navigate('/torneos'), 2000);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const { field, message } = err.response.data;
        if (field) {
          setFieldErrors((prev) => ({ ...prev, [field]: message }));
        } else {
          setGeneralError(message);
        }
      } else {
        setGeneralError('Error inesperado al crear el torneo.');
      }
    }
  };

  return (
    <div>
      <h1>Crear Torneo</h1>

      {generalError && <p className="error">{generalError}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        {/* Los campos de formulario permanecen igual */}
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={torneo.name}
            onChange={handleChange}
            required
          />
          {fieldErrors.name && <span className="error">{fieldErrors.name}</span>}
        </div>
        <div>
          <label>Ubicación:</label>
          <input
            type="text"
            name="ubicacion"
            value={torneo.ubicacion}
            onChange={handleChange}
            required
          />
          {fieldErrors.ubicacion && <span className="error">{fieldErrors.ubicacion}</span>}
        </div>
        <div>
          <label>Descripción:</label>
          <textarea
            name="descripcion"
            value={torneo.descripcion}
            onChange={handleChange}
            required
          />
          {fieldErrors.descripcion && <span className="error">{fieldErrors.descripcion}</span>}
        </div>
        <div>
          <label>Fecha de Inicio:</label>
          <input
            type="date"
            name="fechaInicio"
            value={torneo.fechaInicio}
            onChange={handleChange}
            required
          />
          {fieldErrors.fechaInicio && <span className="error">{fieldErrors.fechaInicio}</span>}
        </div>
        <div>
          <label>Fecha de Fin:</label>
          <input
            type="date"
            name="fechaFin"
            value={torneo.fechaFin}
            onChange={handleChange}
            required
          />
          {fieldErrors.fechaFin && <span className="error">{fieldErrors.fechaFin}</span>}
        </div>
        <div>
          <label>Cantidad de Equipos:</label>
          <input
            type="number"
            name="cantEquipo"
            value={torneo.cantEquipo}
            onChange={handleChange}
            required
          />
          {fieldErrors.cantEquipo && <span className="error">{fieldErrors.cantEquipo}</span>}
        </div>
        <button type="submit">Crear Torneo</button>
      </form>
    </div>
  );
};

export default CreateTorneo;
