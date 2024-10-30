// src/Sporthub.js
import React from 'react';
import { Link } from 'react-router-dom';
import './css/Sporthub.css';

function Sporthub() {
  return (
    <section className="showcase">
      <header>
        <h2 className="logo">Sporthub</h2>
        <div className="container">
          <nav>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register">Registrarse</Link>
          </nav>
        </div>
      </header>

      {/* Video Background */}
      <video src="/video/sporthub.webm" muted loop autoPlay></video>
      <div className="overlay"></div>

      {/* Text Content */}
      <div className="text">
        <h2>TORNEOS</h2>
        <h3>DE BALONCESTO</h3>
        <p>
          SportHub es una plataforma web que permite la creación de torneos locales en donde los usuarios pueden 
          disfrutar de participar en eventos competitivos y así promover el deporte, la diversión y el entusiasmo.
        </p>
        <p>
          <i className="fab fa-whatsapp whatsapp-icon"></i> 
          Contacto: 33-22-11-44-55
        </p>
        <p>Correo de contacto: <i>sporthub@gmail.com</i></p>
        <p><strong>© Copyright todos los derechos reservados.</strong></p>

        {/* Button Link */}
        <Link to="/login" className="action-button">Iniciar sesión</Link>
      </div>

      {/* Social Media Icons */}
      <ul className="social">
        <li><a href="https://www.facebook.com/"><img src="https://i.ibb.co/x7P24fL/facebook.png" alt="Facebook" /></a></li>
        <li><a href="https://x.com/"><img src="https://i.ibb.co/Wnxq2Nq/twitter.png" alt="X Icon" /></a></li>
        <li><a href="https://www.instagram.com/"><img src="https://i.ibb.co/ySwtH4B/instagram.png" alt="Instagram" /></a></li>
      </ul>
    </section>
  );
}

export default Sporthub;
