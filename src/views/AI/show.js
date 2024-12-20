import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AIShow = () => {
  const { equipoId } = useParams(); // ID del equipo desde la URL
  const { equipoName } = useParams(); // Name del equipo desde la URL
  const [estadisticaEquipo, setEstadisticaEquipo] = useState(null); // Resumen de estadísticas del equipo
  const [totales, setTotales] = useState({ PT: 0, CA: 0, DC: 0, CC: 0 }); // Totales de estadísticas
  const [promedios, setPromedios] = useState({ PT: 0, CA: 0, DC: 0, CC: 0 }); // Promedios de estadísticas
  const [CA, setCA] = useState(0); // Campo CA
  const [DC, setDC] = useState(0); // Campo DC
  const [CC, setCC] = useState(0); // Campo CC
  const [isTraining, setIsTraining] = useState(false); // Estado del entrenamiento
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState(null); // Código de error HTTP

  // Obtiene las estadísticas del equipo y calcula los promedios de las mismas
  useEffect(() => {
    const fetchEstadisticasEquipo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/sporthub/api/estadisticas/equipo/${equipoId}/${equipoName}`
        );
        const data = response.data.data;

        const { estadisticas, totales } = data;
        const cantidad = estadisticas.length;

        // Calcular promedios
        const promedios = {
          PT: totales.PT / cantidad,
          CA: totales.CA / cantidad,
          DC: totales.DC / cantidad,
          CC: totales.CC / cantidad,
        };

        setEstadisticaEquipo(estadisticas);
        setTotales(totales);
        setPromedios(promedios);
        setCA(promedios.CA); // Inicializar valores de entrenamiento
        setDC(promedios.DC);
        setCC(promedios.CC);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("Error al obtener las estadísticas del equipo.");
          setErrorCode(404);
        } else {
          setError("Ocurrió un error inesperado.");
        }
        console.error(err);
      }
    };

    fetchEstadisticasEquipo();
  }, [equipoId]);

  // Genera valores aleatorios (simulacion para conexion con el server) para el entrenamiento
  const startTraining = () => {
    setIsTraining(true);
    setCA(Math.floor(Math.random() * 100));
    setDC(Math.floor(Math.random() * 100));
    setCC(Math.floor(Math.random() * 100));
  };

  // Terminar el entrenamiento (conexion con el server) y actualizar las estadísticas
  const endTraining = async () => {
    try {
      const updatedData = { CA, DC, CC };
      await axios.put(
        `http://localhost:5000/sporthub/api/entrenamiento/AI/${equipoId}`,
        updatedData
      );
      setSuccessMessage(
        "Entrenamiento completado y estadísticas actualizadas correctamente."
      );
      setIsTraining(false);
    } catch (err) {
      setError("Error al actualizar las estadísticas.");
      console.error(err);
    }
  };

  // Mostrar mensaje de error específico para 404
  if (errorCode === 404) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h1>Error 404</h1>
          <p>No se encontraron estadísticas para el equipo {equipoName}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Entrenamiento Individual AI SportHub</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      {/* Resumen de Estadísticas del Equipo */}
      {estadisticaEquipo && (
        <div className="card mb-4 p-4 shadow-lg">
          <h5>Rendimiento del Equipo Actual</h5>
          <ul className="list-group">
            <li className="list-group-item">Total PT: {totales.PT}</li>
            <li className="list-group-item">Total CA: {totales.CA}</li>
            <li className="list-group-item">Total DC: {totales.DC}</li>
            <li className="list-group-item">Total CC: {totales.CC}</li>
            <li className="list-group-item">Promedio PT: {promedios.PT.toFixed(2)}</li>
            <li className="list-group-item">Promedio CA: {promedios.CA.toFixed(2)}</li>
            <li className="list-group-item">Promedio DC: {promedios.DC.toFixed(2)}</li>
            <li className="list-group-item">Promedio CC: {promedios.CC.toFixed(2)}</li>
          </ul>
        </div>
      )}

      {/* Entrenamiento Individual */}
      <div className="card p-4 shadow-lg" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div className="card-body">
          <h5 className="mb-4">Entrenamiento Individual</h5>
          <div className="form-group mb-3">
            <label>CA</label>
            <input type="number" className="form-control" value={CA} disabled />
          </div>
          <div className="form-group mb-3">
            <label>DC</label>
            <input type="number" className="form-control" value={DC} disabled />
          </div>
          <div className="form-group mb-4">
            <label>CC</label>
            <input type="number" className="form-control" value={CC} disabled />
          </div>

          <div className="text-center">
            {!isTraining ? (
              <button className="btn btn-primary btn-lg" onClick={startTraining}>
                Comenzar Entrenamiento
              </button>
            ) : (
              <button className="btn btn-success btn-lg" onClick={endTraining}>
                Terminar Entrenamiento
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIShow;
