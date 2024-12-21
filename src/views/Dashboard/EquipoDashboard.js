import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const EquipoDashboard = () => {
  const { equipoName, equipoId } = useParams();
  const [equipo, setEquipo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEquipo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/sporthub/api/equipo/${equipoName}/${equipoId}`);
        setEquipo(response.data);
      } catch (err) {
        setError('Error al cargar el equipo');
        console.error(err);
      }
    };

    fetchEquipo();
  }, [equipoId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!equipo) {
    return <div>... Cargando ... Es posible que el equipo al que intentas acceder no exista.</div>;
  }

  return (
    <div>
      <h1>Detalles del Equipo</h1>
      <div>
        <h2>{equipoName}</h2>
        <img 
          src={`http://localhost:5000/sporthub/api/utils/uploads/${equipo.image !== 'logoEquipo.jpg' ? equipo.image : 'logoEquipo.jpg'}`} 
          alt="Perfil" 
        />
        <p><strong>Organizador del Equipo:</strong> {equipo.users?.name || 'Desconocido'}</p>
        <h3>Integrantes:</h3>
        {equipo?.miembro_equipos?.length > 0 ? (
          equipo.miembro_equipos.map((miembro) => (
            <div key={miembro.user_miembro}>
              <p>{miembro.user_miembro}</p>
            </div>
          ))
        ) : (
          <p>No hay integrantes aún unidos a este equipo.</p>
        )}
         <Link to={`/equipo/${equipo.name}/${equipoId}/estadisticas`}>Estadisticas</Link>
      </div>
    </div>
  );
};

export default EquipoDashboard;
