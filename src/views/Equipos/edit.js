import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../AuthContext'; // Importar el contexto de autenticación

const EditEquipo = () => {
  const navigate = useNavigate();
  const { equipoName } = useParams(); //Obtiene el Nombre del equipo por URL
  const { equipoId } = useParams();   //Obtiene el ID del equipo por URL
  const { user } = useAuth(); // Usuario autenticado
  const [equipo, setEquipo] = useState({
    name: '',
    user_id: user?.userId || '',
    miembros: [], // Inicializa miembros como un arreglo vacío
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Cargar el equipo actual cuando el componente se monta
  useEffect(() => {
    const fetchEquipo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/sporthub/api/equipo/${equipoName}/${equipoId}`);
        setEquipo({
          ...response.data,
          miembros: response.data.miembro_equipos || [], // Usar la relación 'miembro_equipos'
        });
      } catch (err) {
        setGeneralError('Error al cargar el equipo');
        console.error(err);
      }
    };

    fetchEquipo();
  }, [equipoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEquipo((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleMemberChange = (index, value) => {
    const newMiembros = [...equipo.miembros];
    newMiembros[index] = value;
    setEquipo((prev) => ({ ...prev, miembros: newMiembros }));
  };

  const handleAddMember = () => {
    setEquipo((prev) => ({ ...prev, miembros: [...prev.miembros, { user_miembro: '', id: Date.now() }] }));
  };

  const handleRemoveMember = (index) => {
    setEquipo((prev) => ({
      ...prev,
      miembros: prev.miembros.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError('');
    setSuccessMessage('');

    try {
      // Filtrar miembros vacíos antes de enviar el formulario
      const miembrosValidos = equipo.miembros.filter(member => member.user_miembro.trim() !== '');
      const equipoConMiembros = { ...equipo, miembros: miembrosValidos };
      console.log("equipoName",equipoName); // Verifica qué devuelve la API
      await axios.put(`http://localhost:5000/sporthub/api/equipo/${equipoId}`, equipoConMiembros);
      setSuccessMessage('Equipo actualizado con éxito!');
      setTimeout(() => navigate(`/equipo/${equipo.name}/${equipoId}`), 2000);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const { field, message } = err.response.data;
        if (field) {
          setFieldErrors((prev) => ({ ...prev, [field]: message }));
        } else {
          setGeneralError(message);
        }
      } else {
        setGeneralError('Error inesperado al actualizar el equipo.');
      }
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este equipo?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/sporthub/api/equipo/${equipoId}`);
        setSuccessMessage('¡Equipo eliminado con éxito!');
        setTimeout(() => navigate('/equipos'), 2000);
      } catch (err) {
        setGeneralError('Error al eliminar el equipo.');
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h1>Editar Equipo {equipoName}</h1>

      {generalError && <p className="error">{generalError}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre del equipo:</label>
          <input
            type="text"
            name="name"
            value={equipo.name}
            onChange={handleChange}
            required
          />
          {fieldErrors.name && <span className="error">{fieldErrors.name}</span>}
        </div>

        <div>
          <label>Miembros:</label>
          {equipo.miembros && equipo.miembros.map((member, index) => (
            <div key={index}>
              <input
                type="text"
                value={member.user_miembro || ''}
                onChange={(e) => handleMemberChange(index, { ...member, user_miembro: e.target.value })}
                required
              />
              <button type="button" onClick={() => handleRemoveMember(index)}>
                Eliminar 
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddMember}>
            Añadir miembro
          </button>
        </div>

        <button type="submit">Guardar Cambios</button>
      </form>

      <button onClick={handleDelete} className="delete-button">
        Eliminar Equipo
      </button>
    </div>
  );
};

export default EditEquipo;
