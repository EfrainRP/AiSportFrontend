import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar los componentes de Chart.js para Graficar importado mediante npm install bootstrap chart.js react-chartjs-2 <- 
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const EstadisticasTorneo = () => {
  const { torneoId, torneoName } = useParams(); // Obtiene el ID y el nombre del torneo desde la URL
  const [estadisticas, setEstadisticas] = useState([]); // Estado para almacenar las estadísticas de los equipos
  const [loading, setLoading] = useState(true); // Estado para el indicador de carga
  const [error, setError] = useState(null); // Estado para almacenar errores

  useEffect(() => {
    const fetchEstadisticas = async () => { // Estadisticas Torneo
      try {
        // Llama al endpoint para obtener las estadísticas del torneo
        const response = await axios.get(
          `http://localhost:5000/sporthub/api/estadisticas/torneo/${torneoId}`
        );
        setEstadisticas(response.data.data); // Almacena las estadísticas en el estado
        setLoading(false); // Desactiva el indicador de carga (si no fallo el servidor)
      } catch (err) {
        setError('Error al cargar las estadísticas del torneo.');
        setLoading(false);
      }
    };

    fetchEstadisticas();
  }, [torneoId]);

  // Datos para la gráfica <-
  const prepareGraphData = () => {
    const rondas = [];
    const labels = [];
    const datasets = [];

    // Agrupar estadísticas por rondas (pares de equipos)
    for (let i = 0; i < estadisticas.length; i += 2) {
      const partido = estadisticas.slice(i, i + 2);
      rondas.push(partido);
      if((Math.floor(i / 2) + 1) < 6){ // Muestra horizontalmente la cantidad de rondas máximas de un torneo (5) <-
        labels.push(`Ronda ${Math.floor(i / 2) + 1}`);
      }
      
    }

    // Crear datasets para cada equipo
    const equiposMap = new Map();
    rondas.forEach((partido, index) => { // Recorre para mostrar el nombre de los equipos de cada partido y su PT en la grafica <-
      partido.forEach((estadistica) => {
        if (!equiposMap.has(estadistica.equipos.name)) {
          equiposMap.set(estadistica.equipos.name, []);
        }
        equiposMap.get(estadistica.equipos.name).push(estadistica.PT);
      });
    });

    // Convierte los datos de equipos en datasets
    equiposMap.forEach((pts, name) => {
      datasets.push({ // Labels e información visual de la Grafica 
        label: name,
        data: pts,
        borderColor: getRandomColor(), // Color aleatorio para cada equipo
        backgroundColor: 'rgba(0,0,0,0)',
        fill: false,
        tension: 0.4,
      });
    });

    return {
      labels,
      datasets,
    };
  };

  // Función para generar colores aleatorios para las líneas
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  if (loading) {
    return <div className="text-center">Cargando estadísticas del torneo... Puede haber algún error de conexión en el servidor.</div>;
  }

  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }

  const graphData = prepareGraphData();

  return (
    <div className="container my-5">

      <div className="row my-4">
      <h1 className="text-center">Estadísticas Generales del Torneo {torneoName}</h1>
        <div className="col-12">
          {estadisticas.length > 0 ? (
            <>
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>PARTIDO</th>
                    <th>Nombre del Equipo</th>
                    <th>Puntos Totales (PT)</th>
                    <th>Fecha de Creación</th>
                    <th>Fecha de Última Actualización</th>
                  </tr>
                </thead>
                <tbody>
                  {estadisticas.map((estadistica, index) => {
                    const partidoNumero = Math.floor(index / 2) + 1; // Número del partido
                    const isFirstEquipo = index % 2 === 0;
                    return (
                      <tr key={estadistica.id}>
                        {isFirstEquipo && (
                          <td rowSpan="2">Partido {partidoNumero}</td>
                        )}
                        <td>{estadistica.equipos.name}</td>
                        <td>{estadistica.PT}</td>
                        <td>{new Date(estadistica.created_at).toLocaleDateString()}</td>
                        <td>{new Date(estadistica.updated_at).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <h3 className="text-center my-4">Gráfica de Puntos Totales</h3>
              <div
                className="chart-container mx-auto"
                style={{
                  width: '90vw', // 90% del ancho de la ventana
                  height: '80vh', // 80% del alto de la ventana
                  maxWidth: '1200px', // Límite máximo de ancho
                  maxHeight: '800px', // Límite máximo de alto
                }}
              >
                <Line
                  data={graphData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </>
          ) : (
            <p className="text-center">No se encontraron estadísticas para este torneo.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstadisticasTorneo;
