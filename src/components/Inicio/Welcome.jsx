import React from 'react';
import ReactPlayer from "react-player/"

import video from '/video/welcome.webm'

function Welcome(){
  return (
    <section>
        <header>
            <nav>
              {/* <Link to="/"><h2 className="logo">Sporthub</h2></Link> */}
              {/* <Link to="sobre-nosotros">Iniciar sesion</Link>
              <Link to="/register">Registrarse</Link> */}
            </nav>
        </header>
        <ReactPlayer url={video} loop={true} autoPlay/>
        {/* <video autoplay loop muted>
          <source src={video} type="video/webm"/>
            Your browser does not support the video tag.
        </video> */}
        <div className="text">
          <h2>TORNEOS</h2>
          <h3>DE BALONCESTO</h3>
          <p>SportHub es una plataforma web que permite la creación de torneos locales en donde los usuarios pueden disfrutar de participar en eventos competitivos y así promover el deporte, la diversión y el entusiasmo.</p>
          <p>Contacto: 33-22-11-44-55</p>
          <p>Correo de contacto: <i>sporthub@gmail.com</i></p>
          <p>© Coopyright todos los derechos reservados.</p>
        </div>
        <footer>
          <ul className="social">
            {/* <li><a href="#"><img src="https://i.ibb.co/x7P24fL/facebook.png"/></a></li>
            <li><a href="#"><img src="https://i.ibb.co/Wnxq2Nq/twitter.png"/></a></li>
            <li><a href="#"><img src="https://i.ibb.co/ySwtH4B/instagram.png"/></a></li> */}
          </ul>
        </footer>
    </section>
    );
}
export default Welcome;
