import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';

import '../css/Sporthub.css';
import video from '../assets/media/welcome.webm'

function Welcome(){
  return (
    <section className="showcase">
      <Header/>

      {/* Video Background */}
      <video loop muted autoPlay>
        <source src={video} type='video/webm;'/>
          Your browser does not support the video tag.
      </video>

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
        <li><a href="https://x.com/"><img src="https://i.ibb.co/Wnxq2Nq/twitter.png" alt="X (Twitter)" /></a></li>
        <li><a href="https://www.instagram.com/"><img src="https://i.ibb.co/ySwtH4B/instagram.png" alt="Instagram" /></a></li>
      </ul>
    </section>
    );
}
export default Welcome;
