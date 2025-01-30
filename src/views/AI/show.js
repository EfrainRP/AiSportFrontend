import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../../AuthContext'; // Importa el contexto de autenticación

const AITraining = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const { equipoName, equipoId } = useParams();
  const [selectedTime, setSelectedTime] = useState("30");
  const { user, logout } = useAuth(); // Accede al usuario autenticado y al método logout
  const videoRef = useRef(null);
  const websocketRef = useRef(null);

  // Estados para controlar los modales
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [isManualClose, setIsManualClose] = useState(false); // Estado para controlar el cierre manual
  const [showInfoModal, setShowInfoModal] = useState(true); // Estado para controlar el modal informativo

  // Actualiza las estadisticas de entrenmiento para los equipos y el usuario <-
  const sendDataToServer = async (url, data, prediction) => {
    try {
      await axios.put(url, {
        datos: data,
        prediccion: prediction
      });
      console.log(`Datos enviados correctamente a ${url}`);
    } catch (error) {
      console.error(`Error al enviar datos a ${url}`, error);
    }
  };

  const startTraining = () => {
    setIsTraining(true);
    setIsManualClose(false); // Reiniciar el estado de cierre manual
    // Conexion con la direccion IP del host en el puerto abierto configurado desde el host "8765"
    websocketRef.current = new WebSocket("ws://192.168.100.170:8765");

    websocketRef.current.onopen = () => {
      setModalMessage("SportAI: Conexión de entrenamiento exitosa.");
      setShowModal(true);
      websocketRef.current.send(JSON.stringify({
        start: true,
        time: parseInt(selectedTime),
      }));
    };

    websocketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.prediction) {
        setPrediction(data.prediction);
      } else {
        setJsonData(data);
      }
      // Si se tiene una prediccion o el "entrenamiento" ha finalizado, se actualizan los datos en la BD
      if (data && data.prediction) {
        sendDataToServer(`http://localhost:5000/sporthub/api/entrenamiento/equipo/AI/${equipoId}`, data, data.prediction);
        sendDataToServer(`http://localhost:5000/sporthub/api/entrenamiento/user/AI/${user.userId}`, data, data.prediction);
      }
      // Muestra el frame de la IMG pasada en base64
      if (videoRef.current && data.image) {
        const img = new Image();
        img.src = `data:image/jpeg;base64,${data.image}`;
        img.onload = () => {
          const context = videoRef.current.getContext("2d");
          context.drawImage(img, 0, 0, videoRef.current.width, videoRef.current.height);
        };
      }
    };

    websocketRef.current.onerror = (error) => {
      setModalMessage(`SportAI: WebSocket error: ${error.message}`);
      setShowModal(true);
    };

    websocketRef.current.onclose = () => {
      if (isManualClose) {
        // Si el cierre fue manual, mostrar el mensaje de interrupción
        setModalMessage("El entrenamiento se ha interrumpido debido a un problema inesperado, la conexión ha sido finalizada.");
      } else if (prediction) {
        // Si el cierre fue automático y se tiene la predicción, mostrar el mensaje de éxito
        setModalMessage("SportAI: Conexión finalizada exitosamente.");
      } else {
        // Si el cierre fue automático pero no se tiene la predicción, mostrar un mensaje de error
        setModalMessage("El entrenamiento se ha interrumpido debido a un problema inesperado, la conexión ha sido finalizada.");
      }
      setShowModal(true);
    };
  };

  const stopTraining = () => {
    setIsTraining(false);
    setIsManualClose(true); // Indicar que el cierre fue manual
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify({ stop: true }));
      setTimeout(() => {
        websocketRef.current.close();
        setModalMessage("SportAI: Conexión finalizada exitosamente.");
        setShowModal(true);

        // Limpiar el canvas
        const context = videoRef.current.getContext("2d");
        context.clearRect(0, 0, videoRef.current.width, videoRef.current.height);
      }, 1000);
    } else {
      setModalMessage("La conexión con el servidor se encuentra finalizada.");
      setShowModal(true);
    }
  };

  // Función para determinar el estilo del modal según el rendimiento
  const getModalStyle = (performance) => {
    switch (performance?.toLowerCase()) {
      case "deficiente":
        return { backgroundColor: "#dc3545", color: "#fff" }; // Rojo
      case "mejorable":
        return { backgroundColor: "#ff8000", color: "#000" }; // Naranja
      case "bueno":
        return { backgroundColor: "#0d6efd", color: "#fff" }; // Azul
      case "muy bueno":
        return { backgroundColor: "#7be800", color: "#fff" }; // Verde claro
      case "excepcional":
        return { backgroundColor: "#198754", color: "#fff" }; // Verde fuerte
      default:
        return { backgroundColor: "#6c757d", color: "#fff" }; // Color por defecto
    }
  };

  // Efecto para abrir automáticamente el modal de predicción cuando prediction.performance deje de ser null
  useEffect(() => {
    if (prediction?.performance) {
      setShowPredictionModal(true); // Abre el modal cuando prediction.performance tenga un valor
      stopTraining(); // Cerrar la conexión automáticamente
    }
  }, [prediction]);

  // Efecto para mostrar el modal informativo al cargar la página
  useEffect(() => {
    setShowInfoModal(true);
  }, []);

  return (
    <div className="container-fluid vh-100 d-flex flex-column p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <h1 className="text-center mb-4 text-primary">Entrenamiento con IA - {equipoName}</h1>

      {/* Controles de entrenamiento */}
      <div className="d-flex justify-content-center align-items-center mb-4">
        <select
          className="form-select me-2"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          disabled={isTraining}
          style={{ width: "auto" }}
        >
          <option value="30">30 seg</option>
          <option value="60">1 min</option>
          <option value="120">2 min</option>
          <option value="180">3 min</option>
          <option value="240">4 min</option>
          <option value="300">5 min</option>
        </select>
        <button 
          className="btn btn-success me-2" 
          onClick={startTraining} 
          disabled={isTraining}
        >
          Comenzar Entrenamiento
        </button>
        <button 
          className="btn btn-danger" 
          onClick={stopTraining} 
          disabled={!isTraining}
        >
          Interrumpir Entrenamiento
        </button>
      </div>

      {/* Video y datos */}
      <div className="row flex-grow-1">
        {/* Canvas para el video */}
        <div className="col-md-8 d-flex justify-content-center align-items-center">
          <canvas 
            ref={videoRef} 
            width="840" 
            height="580" 
            className="border border-3 border-primary rounded shadow"
          ></canvas>
        </div>

        {/* Datos y predicción */}
        <div className="col-md-4">
          <div className="card h-100 shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title mb-0">Datos y Predicción</h3>
            </div>
            <div className="card-body overflow-auto">
              {/* Datos recibidos */}
              <div className="mb-4">
                <h4 className="text-secondary">Estadisticas actuales:</h4>
                {jsonData ? (
                  <ul className="list-group list-group-flush">  
                    <li className="list-group-item">Shots: <strong>{jsonData.shots < 0 ? 0 : jsonData.shots}</strong></li>
                    <li className="list-group-item">Intentos de tiro: <strong>{jsonData.attempted_shot < 0 ? 0 : jsonData.attempted_shot}</strong></li>
                    <li className="list-group-item">Tiempo transcurrido: <strong>{jsonData.time < 0 ? 0 : jsonData.time}s</strong></li>
                    <li className="list-group-item">Duración con balón sostenido: <strong>{jsonData.ball_held < 0 ? 0 : jsonData.ball_held}s</strong></li>
                    <li className="list-group-item">Dribbles: <strong>{jsonData.dribbles < 0 ? 0 : jsonData.dribbles}</strong></li>
                    <li className="list-group-item">Toques: <strong>{jsonData.touches < 0 ? 0 : jsonData.touches}</strong></li>
                    <li className="list-group-item">Pasos: <strong>{jsonData.steps < 0 ? 0 : jsonData.steps}</strong></li>
                    <li className="list-group-item">Dobles: <strong>{jsonData.double_dribbles < 0 ? 0 : jsonData.double_dribbles}</strong></li>
                    <li className="list-group-item">Travels: <strong>{jsonData.travels < 0 ? 0 : jsonData.travels}</strong></li>
                  </ul>
                ) : (
                  <p className="text-muted">Sin datos aún</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para mostrar mensajes */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Mensaje del sistema</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para mostrar la predicción al finalizar el entrenamiento */}
      <Modal show={showPredictionModal} onHide={() => setShowPredictionModal(false)} centered>
        <Modal.Header 
          closeButton 
          style={getModalStyle(prediction?.performance)} // Aplicar estilo dinámico
        >
          <Modal.Title>Predicción del entrenamiento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {prediction ? (
            <>
              <p><strong>Rendimiento:</strong> {prediction.performance}</p>
              {/* Mostrar la sugerencia solo si prediction.data[9] no es null o está definido */}
              {prediction.data[9] && (
                <p><strong>Sugerencia:</strong> {prediction.data[9]}</p>
              )}
            </>
          ) : (
            <p>No hay datos de predicción disponibles.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowPredictionModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal informativo al cargar la página */}
      <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>💡SportAI Recomendaciones</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p>Asegúrate de cumplir con los siguientes requerimientos antes de comenzar tu entrenamiento✅.</p>
        <p>El entrenamiento individual está enfocado a medir el <strong> rendimiento de un solo jugador </strong> por entrenamiento y no de un equipo de jugadores🏀.</p>
        <p>Recomendaciones de colocación de cámara para un análisis óptimo:</p>

        {/* Imágenes en blanco y negro */}
        <div className="d-flex justify-content-around align-items-center mb-3">
          <img
            src={`/sporthub/api/utils/uploads/tripie.jpg`}
            alt="Cámara en trípode tomando una foto"
            style={{ width: "250px", height: "auto", filter: "grayscale(100%)" }}
            className="img-fluid rounded"
          />
        </div>

        <ol>
          {/* Punto 1 */}
          <li>El jugador debe ocupar al menos un <strong>60% del cuadro</strong> o vista en cuerpo completo durante el entrenamiento.🤾‍♂️.</li>
          <div className="d-flex justify-content-center mb-3">
            <img
              src={`/sporthub/api/utils/uploads/60camara.png`}
              alt="60 de Camara"
              style={{ width: "650px", height: "auto", filter: "grayscale(100%)" }}
              className="img-fluid rounded"
            />
          </div>

          {/* Punto 2 */}
          <li>El área de juego debe estar lo más <strong>centrada</strong> y enfocada posible📷.</li>
          <div className="d-flex justify-content-center mb-3">
            <img
              src={`/sporthub/api/utils/uploads/centro_camara.jpg`}
              alt="Centro de Camara"
              style={{ width: "200px", height: "auto", filter: "grayscale(100%)" }}
              className="img-fluid rounded"
            />
          </div>

          {/* Punto 3 */}
          <li>Debe haber una distancia recomendable de <strong>2-5 metros</strong> desde la cámara al jugador y lugar de la canasta para un análisis más óptimo📐.</li>
          <div className="d-flex justify-content-center mb-3">
            <img
              src={`/sporthub/api/utils/uploads/distanciaCamara.png`}
              alt="Distancia de Camara"
              style={{ width: "500px", height: "auto", filter: "grayscale(100%)" }}
              className="img-fluid rounded"
            />
          </div>

          {/* Punto 4 */}
          <li>La altura de la cámara debe ser de entre <strong>1.50 cm a 2 m</strong> idealmente🎥.</li>
          <div className="d-flex justify-content-center mb-3">
            <img
              src={`/sporthub/api/utils/uploads/altura.jpg`}
              alt="Altura de Camara"
              style={{ width: "500px", height: "auto", filter: "grayscale(100%)" }}
              className="img-fluid rounded"
            />
          </div>

          {/* Punto 5 */}
          <li>El lugar debe contar con <strong>buena iluminación</strong>  de fondo para una detección óptima del jugador, pelota y cesta💡.</li>
          <div className="d-flex justify-content-center mb-3">
            <img
              src={`/sporthub/api/utils/uploads/iluminacion.jpg`}
              alt="Iluminacion en cancha"
              style={{ width: "300px", height: "auto", filter: "grayscale(100%)" }}
              className="img-fluid rounded"
            />
          </div>
          <li>Para una mayor cobertura de puntos ciegos, acomoda el enfoque de la cámara de manera <strong>lateral</strong>  a la cancha:</li>
          <div className="d-flex justify-content-center mb-3">
          ❌
            <img
              src={`/sporthub/api/utils/uploads/cancha_frontal.jpg`}
              alt="Cancha frontal" style={{ width: "200px", height: "auto", filter: "grayscale(100%)" }} className="img-fluid rounded"
            />
          ✅
            <img
              src={`/sporthub/api/utils/uploads/cancha_lateral.jpg`}
              alt="Cancha lateral" style={{ width: "230px", height: "auto", filter: "grayscale(100%)" }} className="img-fluid rounded"
            />
          </div>
        </ol>
        <p>¡Listo! Ahora puedes comenzar a poner a prueba tus habilidades en el deporte de baloncesto✅.</p>
        <p>-----------------------------------------------------------------------</p>
        <p><strong> ***SportAI Nota***</strong> </p>
        <p>Las estadísticas analizadas para el cálculo del rendimiento de un jugador son tomadas en base a 
              métricas usadas en la NBA (Asociación Nacional de Baloncesto) sin embargo, el <strong>tiempo </strong> 
              de entrenamiento puede influir considerablemente en los resultados, lo cual, <strong>no es considerado una métrica oficial</strong> en sí, 
              pero es usada debido a que el tiempo es un factor clave en el análisis de un entrenamiento individual medible.</p>
      </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowInfoModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AITraining;