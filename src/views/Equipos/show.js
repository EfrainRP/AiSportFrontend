import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const ShowEquipo = () => {
  const { equipoName } = useParams(); // Obtiene el equipoName desde la URL
  const { equipoId } = useParams(); // Obtiene el equipoId desde la URL
  const [equipo, setEquipo] = useState(null); // Estado para guardar los datos del equipo
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchEquipo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/sporthub/api/equipo/${equipoName}/${equipoId}`);
        console.log("Respuesta del backend:", response.data); // Verifica la respuesta en la consola
        setEquipo(response.data); // Guarda el equipo en el estado
      } catch (err) {
        setError('Error al cargar el equipo'); // En caso de error, muestra un mensaje
        console.error(err);
      }
    };

    fetchEquipo();
  }, [equipoId]); // Vuelve a ejecutar cuando el equipoId cambie

  if (error) {
    return <div>{error}</div>;
  }

  if (!equipo) {
    return <div>Cargando...</div>; // Muestra un mensaje mientras carga los datos
  }

  return (
    <div>
      <h1>Detalles del Equipo {equipoName}</h1>
      <div>
        <img 
          src={`http://localhost:5000/sporthub/api/utils/uploads/${equipo.image !== 'logoEquipo.jpg' ? equipo.image : 'logoEquipo.jpg'}`} 
          alt="Perfil" 
        />

        <p><strong>Creador:</strong> {equipo.users?.name || 'Desconocido'}</p>
        <h3>Miembros:</h3>
        {equipo?.miembro_equipos?.length > 0 ? (
          equipo.miembro_equipos.map((miembro) => (
            <div key={miembro.user_miembro}>
              <p>{miembro.user_miembro}</p>
            </div>
          ))
        ) : (
          <p>No hay miembros para mostrar</p>
        )}
        <Link to={`/equipo/${equipoName}/${equipo.id}/edit`}>Editar Equipo</Link>
      </div>
    </div>
  );
};

export default ShowEquipo;
