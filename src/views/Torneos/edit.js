import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditTorneo = () => {
  const { torneoName } = useParams();
  const { torneoId } = useParams();
  const navigate = useNavigate();
  const [torneo, setTorneo] = useState({
    name: '',
    ubicacion: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    cantEquipo: 0,
  });
  const [fieldErrors, setFieldErrors] = useState({}); // Almacena errores específicos por campo desde el backend
  const [generalError, setGeneralError] = useState(''); // Almacena errores generales
  const [successMessage, setSuccessMessage] = useState(''); // Almacena el mensaje de éxito

  useEffect(() => {
    const fetchTorneo = async () => { 
      try {  // Metodo GET/SHOW <-
        const response = await axios.get(`http://localhost:5000/sporthub/api/torneo/${torneoName}/${torneoId}`);
        setTorneo(response.data);
      } catch (err) {
        setGeneralError('Error al cargar los datos del torneo.');
        console.error(err);
      }
    };

    fetchTorneo();
  }, [torneoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTorneo((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' })); // Limpia errores del campo modificado
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError('');
    setSuccessMessage(''); // Limpiar mensaje de éxito previo

    try { // Metodo PUT <-
      await axios.put(`http://localhost:5000/sporthub/api/torneo/${torneoId}`, torneo);
      setSuccessMessage('Torneo actualizado con éxito!'); // Establecer mensaje de éxito
      setTimeout(() => navigate(`/torneo/${torneo.name}/${torneoId}`), 2000); // Redirige al "show" después de 2 segundos
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const { field, message } = err.response.data;
        if (field) {
          setFieldErrors((prev) => ({ ...prev, [field]: message }));
        } else {
          setGeneralError(message);
        }
      } else {
        setGeneralError('Error inesperado al actualizar el torneo.');
      }
    }
  };

  const handleDelete = async () => { // Metodo DELETE <-
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este torneo?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/sporthub/api/torneo/${torneoId}`);
        setSuccessMessage('Torneo eliminado con éxito!');
        setTimeout(() => navigate('/torneos'), 2000); // Redirige a la lista de torneos después de 2 segundos
      } catch (err) {
        setGeneralError('Error al eliminar el torneo.');
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h1>Editar Torneo</h1>

      {generalError && <p className="error">{generalError}</p>}
      {successMessage && <p className="success">{successMessage}</p>} {/* Muestra el mensaje de éxito */}
      
      <form onSubmit={handleSubmit}>
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
            value={torneo.fechaInicio.split('T')[0]}
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
            value={torneo.fechaFin.split('T')[0]}
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
        <button type="submit">Guardar Cambios</button>
      </form>

      <button onClick={handleDelete} className="delete-button">Eliminar Torneo</button>
    </div>
  );
};

export default EditTorneo;
