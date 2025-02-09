import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../../AuthContext';

const AITraining = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const { equipoName, equipoId } = useParams();
  const [selectedTime, setSelectedTime] = useState("30");
  const { user, logout } = useAuth();
  const videoRef = useRef(null); // Referencia para el elemento <video>
  const canvasRef = useRef(null); // Referencia para el elemento <canvas>
  const websocketRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [isManualClose, setIsManualClose] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(true);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraModalMessage, setCameraModalMessage] = useState("");

  // Devices
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(""); 

  useEffect(() => {
    // Obtener todas las cámaras disponibles
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
      const videoDevices = deviceInfos.filter(device => device.kind === "videoinput");
      setDevices(videoDevices);
    });
  }, []);

  const startCamera = (deviceId) => {
    // Detener la cámara actual si existe
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }

    const constraints = {
      video: { deviceId: { exact: deviceId } } // Selecciona la cámara específica
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream; // Asigna la cámara al video
        }
        setCameraModalMessage(`Cámara seleccionada: ${devices.find(d => d.deviceId === deviceId)?.label || "Desconocida"}`);
        setShowCameraModal(true);
      })
      .catch((error) => {
        setCameraModalMessage("No se pudo acceder a la cámara seleccionada.");
        setShowCameraModal(true);
        console.error("Error al acceder a la cámara:", error);
      });
  };

  const resetCameraSelection = () => {
    // Detener la cámara actual si existe
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    // Limpiar el video
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Reiniciar la selección de la cámara
    setSelectedDeviceId("");
  };

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

  const startTraining = async () => {
    if (!selectedDeviceId) {
      setModalMessage("Por favor, selecciona una cámara antes de comenzar el entrenamiento.");
      setShowModal(true);
      return;
    }

    setIsTraining(true);
    setIsManualClose(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: selectedDeviceId } } });
      mediaStreamRef.current = stream;
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      websocketRef.current = new WebSocket("ws://192.168.100.170:8765");

      websocketRef.current.onopen = () => {
        setModalMessage("SportAI: Conexión de entrenamiento exitosa.");
        setShowModal(true);
        websocketRef.current.send(JSON.stringify({
          start: true,
          time: parseInt(selectedTime),
        }));

        let lastSendTime = 0;
        const frameInterval = 1000 / 25;  // 25 FPS a 40 ms por frame

        const sendFrame = () => {
          if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
            return; // No envía si el WebSocket no está abierto
          }
          const now = performance.now();
          if (now - lastSendTime >= frameInterval) {  
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
              const canvas = document.createElement('canvas');
              canvas.width = 640;
              canvas.height = 480;
              const context = canvas.getContext('2d');
              context.drawImage(video, 0, 0, canvas.width, canvas.height);
              const imageData = canvas.toDataURL('image/jpeg', 0.8);
              
              if (imageData.length > 100) {
                websocketRef.current.send(imageData);
              }
            }
            lastSendTime = now;
          }
          requestAnimationFrame(sendFrame);
        };
          
        sendFrame();
      };

      websocketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.prediction) {
          setPrediction(data.prediction);
        } else {
          setJsonData(data);
        }

        if (data && data.prediction) {
          sendDataToServer(`http://localhost:5000/sporthub/api/entrenamiento/equipo/AI/${equipoId}`, data, data.prediction);
          sendDataToServer(`http://localhost:5000/sporthub/api/entrenamiento/user/AI/${user.userId}`, data, data.prediction);
        }

        if (canvasRef.current && data.image) {
          const img = new Image();
          img.src = `data:image/jpeg;base64,${data.image}`;
          img.onload = () => {
            const context = canvasRef.current.getContext("2d");
            context.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
          };
        }
      };

      websocketRef.current.onerror = (error) => {
        setModalMessage(`SportAI: WebSocket error: ${error.message}`);
        setShowModal(true);
      };

      websocketRef.current.onclose = () => {
        if (isManualClose) {
          setModalMessage("El entrenamiento se ha interrumpido debido a un problema inesperado, la conexión ha sido finalizada.");
        } else if (prediction) {
          setModalMessage("SportAI: Conexión finalizada exitosamente.");
        } else {
          setModalMessage("El entrenamiento se ha interrumpido debido a un problema inesperado, la conexión ha sido finalizada.");
        }
        setShowModal(true);

        // Reiniciar la selección de la cámara
        resetCameraSelection();
      };
    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
      setModalMessage("Error al acceder a la cámara. Asegúrate de permitir el acceso a la cámara.");
      setShowModal(true);
      setIsTraining(false);
    }
  };

  const stopTraining = () => {
    setIsTraining(false);
    setIsManualClose(true);
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify({ stop: true }));
      setTimeout(() => {
        websocketRef.current.close();
        setModalMessage("SportAI: Conexión finalizada exitosamente.");
        setShowModal(true);

        const context = canvasRef.current.getContext("2d");
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Reiniciar la selección de la cámara
        resetCameraSelection();
      }, 1000);
    } else {
      setModalMessage("La conexión con el servidor se encuentra finalizada.");
      setShowModal(true);

      // Reiniciar la selección de la cámara
      resetCameraSelection();
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const getModalStyle = (performance) => {
    switch (performance?.toLowerCase()) {
      case "deficiente":
        return { backgroundColor: "#dc3545", color: "#fff" };
      case "mejorable":
        return { backgroundColor: "#ff8000", color: "#000" };
      case "bueno":
        return { backgroundColor: "#0d6efd", color: "#fff" };
      case "muy bueno":
        return { backgroundColor: "#198754", color: "#fff" };
      case "excepcional":
        return { backgroundColor: "#ff006c", color: "#fff" };
      default:
        return { backgroundColor: "#6c757d", color: "#fff" };
    }
  };

  useEffect(() => {
    if (prediction?.performance) {
      setShowPredictionModal(true);
      stopTraining();
    }
  }, [prediction]);

  useEffect(() => {
    setShowInfoModal(true);
  }, []);

  return (
    <div className="container-fluid vh-100 d-flex flex-column p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <h1 className="text-center mb-4 text-primary">Entrenamiento con IA - {equipoName}</h1>

      <div className="d-flex justify-content-center align-items-center mb-4">
        {/* Selección de cámara */}
        <div className="d-flex flex-column align-items-center me-3">
          <label htmlFor="cameraSelect" className="form-label fw-bold text-primary mb-2">
            📷 Selecciona una Cámara:
          </label>
          <div className="input-group shadow-sm mb-3">
            <span className="input-group-text bg-primary text-white">
              <i className="bi bi-camera-video"></i>
            </span>
            <select 
              id="cameraSelect"
              className="form-select border-primary rounded-3"
              onChange={(e) => {
                const selectedId = e.target.value;
                setSelectedDeviceId(selectedId);
                startCamera(selectedId); // Cambiar a la nueva cámara seleccionada
              }} 
              value={selectedDeviceId}
              style={{ minWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              <option value="" disabled>Selecciona una cámara</option>
              {devices.map((device, index) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Cámara ${index + 1}`}
                </option>
              ))}
            </select>
          </div>
          {!isTraining && selectedDeviceId && (
            <video ref={videoRef} autoPlay playsInline className="border border-3 border-primary rounded shadow"></video>
          )}
        </div>

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
          disabled={isTraining || !selectedDeviceId}
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

      <div className="row flex-grow-1">
        <div className="col-md-8 d-flex justify-content-center align-items-center">
          <canvas 
            ref={canvasRef} 
            width="840" 
            height="580" 
            className="border border-3 border-primary rounded shadow"
          ></canvas>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title mb-0">Datos y Predicción</h3>
            </div>
            <div className="card-body overflow-auto">
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

      {/* Modales */}
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

      <Modal show={showPredictionModal} onHide={() => setShowPredictionModal(false)} centered>
        <Modal.Header 
          closeButton 
          style={getModalStyle(prediction?.performance)}
        >
          <Modal.Title>Predicción del entrenamiento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {prediction ? (
            <>
              <p><strong>Rendimiento:</strong> {prediction.performance}</p>
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

      <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>💡SportAI Recomendaciones</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Asegúrate de cumplir con los siguientes requerimientos antes de comenzar tu entrenamiento✅.</p>
          <p>El entrenamiento individual está enfocado a medir el <strong> rendimiento de un solo jugador </strong> por entrenamiento y no de un equipo de jugadores🏀.</p>
          <p>Recomendaciones de colocación de cámara para un análisis óptimo:</p>
          <div className="d-flex justify-content-around align-items-center mb-3">
            <img
              src={`/sporthub/api/utils/uploads/tripie.jpg`}
              alt="Cámara en trípode tomando una foto"
              style={{ width: "250px", height: "auto", filter: "grayscale(100%)" }}
              className="img-fluid rounded"
            />
          </div>
          <ol>
            <li>El jugador debe ocupar al menos un <strong>60% del cuadro</strong> o vista en cuerpo completo durante el entrenamiento.🤾‍♂️.</li>
            <div className="d-flex justify-content-center mb-3">
              <img
                src={`/sporthub/api/utils/uploads/60camara.png`}
                alt="60 de Camara"
                style={{ width: "650px", height: "auto", filter: "grayscale(100%)" }}
                className="img-fluid rounded"
              />
            </div>
            <li>El área de juego debe estar lo más <strong>centrada</strong> y enfocada posible📷.</li>
            <div className="d-flex justify-content-center mb-3">
              <img
                src={`/sporthub/api/utils/uploads/centro_camara.jpg`}
                alt="Centro de Camara"
                style={{ width: "200px", height: "auto", filter: "grayscale(100%)" }}
                className="img-fluid rounded"
              />
            </div>
            <li>Debe haber una distancia recomendable de <strong>2-5 metros</strong> desde la cámara al jugador y lugar de la canasta para un análisis más óptimo📐.</li>
            <div className="d-flex justify-content-center mb-3">
              <img
                src={`/sporthub/api/utils/uploads/distanciaCamara.png`}
                alt="Distancia de Camara"
                style={{ width: "500px", height: "auto", filter: "grayscale(100%)" }}
                className="img-fluid rounded"
              />
            </div>
            <li>La altura de la cámara debe ser de entre <strong>1.50 cm a 2 m</strong> idealmente🎥.</li>
            <div className="d-flex justify-content-center mb-3">
              <img
                src={`/sporthub/api/utils/uploads/altura.jpg`}
                alt="Altura de Camara"
                style={{ width: "500px", height: "auto", filter: "grayscale(100%)" }}
                className="img-fluid rounded"
              />
            </div>
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

      <Modal show={showCameraModal} onHide={() => setShowCameraModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Estado de la Cámara</Modal.Title>
        </Modal.Header>
        <Modal.Body>{cameraModalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowCameraModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AITraining;