import React, { useState } from 'react'; 
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';  
import { useAuth } from '../../AuthContext'; 

const CreateEquipo = () => {
  const navigate = useNavigate(); 
  const { user } = useAuth(); 

  // Inicializa el estado del equipo, con valores predeterminados para el nombre y miembros (dos miembros vacíos por defecto)
  const [equipo, setEquipo] = useState({
    name: '',  // Nombre del equipo (vacío inicialmente)
    user_id: user?.userId || '',  // ID del usuario autenticado
    miembros: ['', ''],  // Array con dos miembros vacíos por defecto
  });

  // Estado para manejar errores específicos de los campos y mensajes generales de error o éxito
  const [fieldErrors, setFieldErrors] = useState({});  // Errores específicos de los campos del formulario
  const [generalError, setGeneralError] = useState('');  // Mensaje de error general
  const [successMessage, setSuccessMessage] = useState('');  // Mensaje de éxito

  // Función que maneja los cambios en los campos del formulario (nombre del equipo)
  const handleChange = (e) => {
    const { name, value } = e.target;  
    setEquipo((prev) => ({ ...prev, [name]: value }));  // Actualiza el estado del equipo con el nuevo valor
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));  // Limpia errores en los campos
  };

  // Función que maneja los cambios en los miembros del equipo
  const handleMemberChange = (index, value) => {
    const newMiembros = [...equipo.miembros];  // Crea una copia del array de miembros
    newMiembros[index] = value;  // Actualiza el miembro en el índice especificado
    setEquipo((prev) => ({ ...prev, miembros: newMiembros }));  // Actualiza el estado de los miembros
  };

  // Función que maneja el envío del formulario para crear el equipo
  const handleSubmit = async (e) => {
    e.preventDefault();  // Previene la recarga por defecto del formulario

    // Resetea los errores previos y los mensajes
    setFieldErrors({});
    setGeneralError('');
    setSuccessMessage('');

    try {
      const miembrosValidos = equipo.miembros.filter(member => member.trim() !== ''); // Filtra los miembros para eliminar los que son vacíos <-
      const equipoConMiembros = { ...equipo, miembros: miembrosValidos };  // Crea un nuevo objeto equipo con los miembros válidos

      // Realiza la solicitud POST para crear el equipo (form)
      await axios.post('http://localhost:5000/sporthub/api/equipo/create', equipoConMiembros);

      // Si la creación funciona, redirige al usuario
      setSuccessMessage('Equipo creado con éxito!');
      setTimeout(() => navigate('/equipos'), 2000);  // Redirige a la página de equipos después de 2 segundos
    } catch (err) {
      // Errores en la respuesta de la API
      if (err.response && err.response.status === 400) {
        // Se obtienen los errores específicos del campo y se muestran
        const { field, message } = err.response.data;
        if (field) {
          setFieldErrors((prev) => ({ ...prev, [field]: message }));
        } else {
          setGeneralError(message);  
        }
      } else {
        // Error al no poder hacer la peticion o en error de backend (servidor)
        setGeneralError('Error inesperado al crear el equipo.');
      }
    }
  };

  return (
    <div>
      <h1>Crear Equipo</h1>

      {/* Muestra el mensaje de error general si existe */}
      {generalError && <p className="error">{generalError}</p>}
      {/* Muestra el mensaje de éxito si el equipo se crea */}
      {successMessage && <p className="success">{successMessage}</p>}

      {/* Formulario para crear equipo <-*/}
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
          {/* Itera en cada miembro y crea un campo de entrada para cada uno */}
          {equipo.miembros.map((member, index) => (
            <div key={index}>
              <input
                type="text"
                value={member}
                onChange={(e) => handleMemberChange(index, e.target.value)}  // Actualiza al miembro
                required  
              />
            </div>
          ))}
          <p>Nota: Podrás añadir más miembros adelante al consultar tu equipo.</p>
        </div>
        <button type="submit">Crear equipo</button>
      </form>
    </div>
  );
};

export default CreateEquipo;
