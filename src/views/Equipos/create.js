import React, { useState } from 'react'; 
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';  
import { useAuth } from '../../AuthContext'; 

const CreateEquipo = () => {
  const navigate = useNavigate(); 
  const { user } = useAuth(); 

  const [equipo, setEquipo] = useState({
    name: '',
    user_id: user?.userId || '',
    miembros: ['', ''],
    image: null,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleFileChange = (e) => {
    setEquipo((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();  

    setFieldErrors({});
    setGeneralError('');
    setSuccessMessage('');

    try {
      const miembrosValidos = equipo.miembros.filter(member => member.trim() !== '');
      const formData = new FormData();
      formData.append('name', equipo.name);
      formData.append('user_id', equipo.user_id);
      miembrosValidos.forEach((member, index) => formData.append(`miembros[${index}]`, member));
      if (equipo.image) {
        formData.append('image', equipo.image);
      }

      await axios.post('http://localhost:5000/sporthub/api/equipo/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccessMessage('Equipo creado con éxito!');
      setTimeout(() => navigate('/equipos'), 2000);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const { field, message } = err.response.data;
        if (field) {
          setFieldErrors((prev) => ({ ...prev, [field]: message }));
        } else {
          setGeneralError(message);  
        }
      } else {
        setGeneralError('Error inesperado al crear el equipo.');
      }
    }
  };

  return (
    <div>
      <h1>Crear Equipo</h1>
      {generalError && <p className="error">{generalError}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Nombre del equipo:</label>
          <input type="text" name="name" value={equipo.name} onChange={handleChange} required />
          {fieldErrors.name && <span className="error">{fieldErrors.name}</span>}
        </div>

        <div>
          <label>Miembros:</label>
          {equipo.miembros.map((member, index) => (
            <div key={index}>
              <input type="text" value={member} onChange={(e) => handleMemberChange(index, e.target.value)} required />
            </div>
          ))}
          <p>Nota: Podrás añadir más miembros adelante al consultar tu equipo.</p>
        </div>

        <div>
          <label>Subir imagen del equipo:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <button type="submit">Crear equipo</button>
      </form>
    </div>
  );
};

export default CreateEquipo;
