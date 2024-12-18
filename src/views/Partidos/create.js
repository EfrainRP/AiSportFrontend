import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePartido = () => {
  const { torneoName, torneoId } = useParams();
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
  const [errors, setErrors] = useState({}); // Estado para manejar errores específicos
  const [successMessage, setSuccessMessage] = useState('');
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    const fetchAllEquipos = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/sporthub/api/equipos/torneo/${torneoId}`);
        setAllEquipos(response.data);
      } catch (err) {
        console.error('Error al cargar los equipos:', err);
      }
    };
    fetchAllEquipos();
  }, [torneoId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: null })); // Limpiar el error del campo al cambiarlo
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrors({}); // Limpiar errores antes de enviar
      await axios.post(`http://localhost:5000/sporthub/api/partido/create/${torneoId}`, formData);
      setSuccessMessage('¡Partido creado con éxito!');
      setTimeout(() => navigate(`/torneo/${torneoName}/${torneoId}`), 2000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.field) {
        const { field, message } = err.response.data;
        setErrors({ [field]: message });
      } else {
        alert('Error al crear el partido');
        
      }
    }
  };

  return (
    <div>
      <h1>Crear Partido para el Torneo {torneoName}</h1>
        {/*Error cuando la cantidad de partidos de torneo posibles ya se han creado */}
      {errors.cantPartidos && <p className="error">{errors.cantPartidos}</p>} 
      {successMessage && <p className="success">{successMessage}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Equipo Local:</label>
          <select name="equipoLocalId" value={formData.equipoLocalId} onChange={handleInputChange}>
            <option value="">Seleccione un equipo</option>
            {allEquipos.map((equipo) => (
              <option key={equipo.id} value={equipo.id}>{equipo.name}</option>
            ))}
          </select>
          {errors.equipo && <p className="error">{errors.equipo}</p>}
        </div>
        <div>
          <label>Equipo Visitante:</label>
          <select name="equipoVisitanteId" value={formData.equipoVisitanteId} onChange={handleInputChange}>
            <option value="">Seleccione un equipo</option>
            {allEquipos.map((equipo) => (
              <option key={equipo.id} value={equipo.id}>{equipo.name}</option>
            ))}
          </select>
          {errors.equipo && <p className="error">{errors.equipo}</p>}
        </div>
        <div>
          <label>Hora del Partido:</label>
          <input type="time" name="horaPartido" value={formData.horaPartido} onChange={handleInputChange} />
          {errors.horaPartido && <p className="error">{errors.horaPartido}</p>}
        </div>
        <div>
          <label>Fecha del Partido:</label>
          <input type="date" name="fechaPartido" value={formData.fechaPartido} onChange={handleInputChange} />
          {errors.fechaPartido && <p className="error">{errors.fechaPartido}</p>}
        </div>
        <div>
          <label>Jornada:</label>
          <input type="date" name="jornada" value={formData.jornada} onChange={handleInputChange} />
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
        <button type="submit">Crear Partido</button>
      </form>
    </div>
  );
};

export default CreatePartido;
