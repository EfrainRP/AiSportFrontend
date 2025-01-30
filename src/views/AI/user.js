import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import { useAuth } from '../../AuthContext'; // Importa el contexto de autenticación
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registra los elementos de Chart.js para la gráfica
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EstadisticasAI = () => {
  const { user, logout } = useAuth(); // Accede al usuario autenticado y al método logout
  const [estadisticas, setEstadisticas] = useState(null); // Estado para almacenar estadísticas
  const [loading, setLoading] = useState(true); // Estado para mostrar indicador de carga
  const [error, setError] = useState(null); // Estado para errores

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        // Llama al endpoint del controlador para obtener las estadísticas del usuario
        const response = await axios.get(
          `http://localhost:5000/sporthub/api/estadisticas/AI/${user.userId}`
        );
        setEstadisticas(response.data.data); // Guarda las estadísticas en el estado
        setLoading(false); // Desactiva el indicador de carga
      } catch (err) {
        setError('Error al cargar las estadísticas del usuario.');
        setLoading(false);
      }
    };

    fetchEstadisticas();
  }, [user.userId]);

  if (loading) {
    return <div>Cargando estadísticas...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Datos para el gráfico de líneas (Tiempo de entrenamiento por fecha)
  const fechas = estadisticas.estadisticas.map((registro) =>
    new Date(registro.created_at).toLocaleDateString()
  );
  const tiempoEntrenamiento = estadisticas.estadisticas.map((registro) => registro.TM);

  const lineChartData = {
    labels: fechas,
    datasets: [
      {
        label: 'Tiempo de Entrenamiento (TM) por Fecha',
        data: tiempoEntrenamiento,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  // Datos para el gráfico de barras (sumatorias totales)
  const barChartData = {
    labels: ['SS', 'SA', 'BC', 'DR', 'TO', 'ST', 'DD', 'TR', 'TC'],
    datasets: [
      {
        label: 'Totales',
        data: [
          estadisticas.totales.SS,
          estadisticas.totales.SA,
          estadisticas.totales.BC,
          estadisticas.totales.DR,
          estadisticas.totales.TO,
          estadisticas.totales.ST,
          estadisticas.totales.DD,
          estadisticas.totales.TR,
          estadisticas.totales.PF,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)',
          'rgba(83, 102, 255, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Función para obtener el estilo según el rendimiento
  const getRendimientoStyle = (rendimiento) => {
    switch (rendimiento) {
      case "DEFICIENTE":
        return { backgroundColor: "#dc3545", color: "#fff" }; // Rojo
      case "MEJORABLE":
        return { backgroundColor: "#ff8000", color: "#000" }; // Naranja
      case "BUENO":
        return { backgroundColor: "#0d6efd", color: "#fff" }; // Azul
      case "MUY_BUENO":
        return { backgroundColor: "#198754", color: "#fff" }; // Verde fuerte
      case "EXCEPCIONAL":
        return { backgroundColor: "#ff006c", color: "#fff" }; // Rosa semi fuerte
      default:
        return { backgroundColor: "#6c757d", color: "#fff" }; // Color por defecto
    }
  };

  // Estilo para el rendimiento más frecuente
  const rendimientoStyle = getRendimientoStyle(estadisticas.rendimientoFrecuente);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Estadísticas de Entrenamiento con IA</h1>

      {/* Mostrar el rendimiento más frecuente */}
      <h2 style={rendimientoStyle}>
        Rendimiento más frecuente: {estadisticas.rendimientoFrecuente}
      </h2>

      <h2>Tiempo de Entrenamiento por Fecha</h2>
      <Line data={lineChartData} options={{ responsive: true }} />

      <h2>Estadísticas a lo largo de Entrenamientos</h2>
      <Bar data={barChartData} options={{ responsive: true }} />

      {estadisticas.estadisticas.length > 0 ? (
        <table border="1" style={{ width: '80%', margin: '20px auto', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Canastas Anotadas (SS)</th>
              <th>Intentos de Tiro (SA)</th>
              <th>Tiempo de Entrenamiento (TM)</th>
              <th>Control de Balón (BC)</th>
              <th>Dribbles (DR)</th>
              <th>Toques (TO)</th>
              <th>Pasos (ST)</th>
              <th>Dobles (DD)</th>
              <th>Travels (TR)</th>
              <th>Rendimiento (PF)</th>
            </tr>
          </thead>
          <tbody>
            {estadisticas.estadisticas.map((registro, index) => {
              const estiloRendimiento = getRendimientoStyle(registro.PF); // Obtener el estilo para cada rendimiento
              return (
                <tr key={index}>
                  <td>{new Date(registro.created_at).toLocaleDateString()}</td>
                  <td>{registro.SS}</td>
                  <td>{registro.SA}</td>
                  <td>{registro.TM}</td>
                  <td>{registro.BC}</td>
                  <td>{registro.DR}</td>
                  <td>{registro.TO}</td>
                  <td>{registro.ST}</td>
                  <td>{registro.DD}</td>
                  <td>{registro.TR}</td>
                  <td style={estiloRendimiento}>{registro.PF}</td> {/* Aplicar estilo aquí */}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron estadísticas de entrenamiento.</p>
      )}
    </div>
  );
};

export default EstadisticasAI;