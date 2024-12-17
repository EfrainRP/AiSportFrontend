import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditPartido = () => {
  const { torneoName, torneoId, partidoId } = useParams();
  const navigate = useNavigate();

  const [allEquipos, setAllEquipos] = useState([]);
  const [formData, setFormData] = useState({
    equipoLocalId: '',
    equipoVisitanteId: '',
    horaPartido: '',
    fechaPartido: '',
    jornada: '',
    resLocal: 0,
    resVisitante: 0,
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [generalError, setGeneralError] = useState('');

  // Cargar equipos disponibles
  useEffect(() => {
    const fetchAllEquipos = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/sporthub/api/equipos/torneo/${torneoId}`);
        setAllEquipos(response.data);
      } catch (err) {
        console.error('Error al cargar los equipos:', err);
      }
    };

    const fetchPartido = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/sporthub/api/partido/${torneoId}/${partidoId}`);
          const partido = response.data;
          console.log("PARTIDO",partido.equipoLocal_id);
      
          // Formatear hora
          const horaPartido = partido.horaPartido ? partido.horaPartido.slice(11, 16) : ''; // HH:mm
      
          // Validar y formatear fecha (formato YYYY-MM-DD)
          const fechaPartido = partido.fechaPartido ? partido.fechaPartido.slice(0, 10) : ''; // YYYY-MM-DD
      
          const jornada = partido.jornada ? partido.jornada.slice(0, 10) : ''; // YYYY-MM-DD
          // Toma los datos obtenidos y los reformatea para poderlos mostrar en la vista <-
          setFormData({
            equipoLocalId: partido.equipoLocal_id,
            equipoVisitanteId: partido.equipoVisitante_id,
            horaPartido, // Hora en formato HH:mm
            fechaPartido, // Fecha en formato YYYY-MM-DD
            jornada, // Jornada cargada
            resLocal: partido.resLocal || 0,
            resVisitante: partido.resVisitante || 0,
          });
         // console.log("Fecha y hora", jornada);
        } catch (err) {
          console.error('Error al cargar los datos del partido:', err);
        }
      };
      

    fetchAllEquipos();
    fetchPartido();
  }, [torneoId, partidoId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrors({});
      await axios.put(`http://localhost:5000/sporthub/api/partido/${torneoId}/${partidoId}`, formData);
      setSuccessMessage('¡Partido actualizado con éxito!');
      setTimeout(() => navigate(`/torneo/${torneoName}/${torneoId}`), 2000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.field) {
        const { field, message } = err.response.data;
        setErrors({ [field]: message });
      } else {
        setGeneralError('Error al actualizar el partido.');
      }
    }
  };

  return (
    <div>
      <h1>Editar Partido para el Torneo {torneoName}</h1>
      {generalError && <p className="error">{generalError}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Equipo Local:</label>
          <select name="equipoLocalId" value={formData.equipoLocalId} onChange={handleInputChange}>
            <option value="">Seleccione un equipo</option>
            {allEquipos.map((equipo) => (
              <option key={equipo.id} value={equipo.id}>
                {equipo.name}
              </option>
            ))}
          </select>
          {errors.equipoLocalId && <p className="error">{errors.equipoLocalId}</p>}
        </div>
        <div>
          <label>Equipo Visitante:</label>
          <select name="equipoVisitanteId" value={formData.equipoVisitanteId} onChange={handleInputChange}>
            <option value="">Seleccione un equipo</option>
            {allEquipos.map((equipo) => (
              <option key={equipo.id} value={equipo.id}>
                {equipo.name}
              </option>
            ))}
          </select>
          {errors.equipoVisitanteId && <p className="error">{errors.equipoVisitanteId}</p>}
        </div>
        <div>
          <label>Hora del Partido:</label>
          <input
            type="time"
            name="horaPartido"
            value={formData.horaPartido} // Valor cargado automáticamente
            onChange={handleInputChange}
          />
          {errors.horaPartido && <p className="error">{errors.horaPartido}</p>}
        </div>
        <div>
          <label>Fecha del Partido:</label>
          <input
            type="date"
            name="fechaPartido"
            value={formData.fechaPartido} // Valor cargado automáticamente
            onChange={handleInputChange}
          />
          {errors.fechaPartido && <p className="error">{errors.fechaPartido}</p>}
        </div>
        <div>
          <label>Jornada:</label>
          <input
            type="date"
            name="jornada"
            value={formData.jornada} // Valor cargado automáticamente
            onChange={handleInputChange}
          />
          {errors.jornada && <p className="error">{errors.jornada}</p>}
        </div>
        <div>
          <label>Resultado Local:</label>
          <input type="number" name="resLocal" value={formData.resLocal} min="0" onChange={handleInputChange} />
          {errors.resLocal && <p className="error">{errors.resLocal}</p>}
        </div>
        <div>
          <label>Resultado Visitante:</label>
          <input type="number" name="resVisitante" value={formData.resVisitante} min="0" onChange={handleInputChange} />
          {errors.resVisitante && <p className="error">{errors.resVisitante}</p>}
        </div>
        <button type="submit">Actualizar Partido</button>
      </form>
    </div>
  );
};

export default EditPartido;
