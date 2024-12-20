import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registra los elementos  de Chart.js para la Grafica <-
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EstadisticasEquipo = () => {
  const { equipoId } = useParams(); // Obtiene el ID del equipo desde la URL
  const { equipoName } = useParams(); // Obtiene el Name del equipo desde la URL
  const [estadisticas, setEstadisticas] = useState(null); // Estado para almacenar estadísticas
  const [loading, setLoading] = useState(true); // Estado para mostrar indicador de carga
  const [error, setError] = useState(null); // Estado para errores

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        // Llama al endpoint del controlador
        const response = await axios.get( // Estadisticas individuales y suma total del equipo <-
          `http://localhost:5000/sporthub/api/estadisticas/equipo/${equipoId}`
        );
        setEstadisticas(response.data.data); // Guarda las estadísticas en el estado
        setLoading(false); // Desactiva el indicador de carga
      } catch (err) {
        setError('Error al cargar las estadísticas del equipo.');
        setLoading(false);
      }
    };

    fetchEstadisticas();
  }, [equipoId]);

  if (loading) {
    return <div>Cargando estadísticas...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  //  Datos para el gráfico de líneas (PT por fecha)
  const fechas = estadisticas.estadisticas.map((registro) =>
    new Date(registro.created_at).toLocaleDateString()
  );
  const puntosTotales = estadisticas.estadisticas.map((registro) => registro.PT);

  const lineChartData = {
    labels: fechas,
    datasets: [
      {
        label: 'Puntos Totales (PT) por Fecha',
        data: puntosTotales,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  // Datos para el gráfico de barras (sumatorias totales)
  const barChartData = {
    labels: ['PT', 'CA', 'DC', 'CC'],
    datasets: [
      {
        label: 'Totales',
        data: [estadisticas.totales.PT, estadisticas.totales.CA, estadisticas.totales.DC, estadisticas.totales.CC],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Estadísticas Generales del Equipo <strong>{equipoName}</strong> en SportHub</h1>

      <h2>Puntos Totales por Fecha</h2>
      <Line data={lineChartData} options={{ responsive: true }} />

      <h2>Sumatorias Totales</h2>
      <Bar data={barChartData} options={{ responsive: true }} />

      {estadisticas.estadisticas.length > 0 ? (
        <table border="1" style={{ width: '50%', margin: '20px auto', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Puntos Totales (PT)</th>
              <th>Canastas Anotadas (CA)</th>
              <th>Defensas Completadas (DC)</th>
              <th>Campos Completados (CC)</th>
            </tr>
          </thead>
          <tbody>
            {estadisticas.estadisticas.map((registro, index) => (
              <tr key={index}>
                <td>{new Date(registro.created_at).toLocaleDateString()}</td>
                <td>{registro.PT}</td>
                <td>{registro.CA}</td>
                <td>{registro.DC}</td>
                <td>{registro.CC}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron estadísticas individuales para este equipo.</p>
      )}
    </div>
  );
};

export default EstadisticasEquipo;
