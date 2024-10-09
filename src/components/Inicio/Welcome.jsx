import React, { useEffect, useState } from 'react';


import video from '../../assets/media/welcome.webm'

function Welcome(){
  return (
  <section>
        <video loop muted autoPlay style={{height:'1000px', weight:'800px'}}>
          <source src={video} type='video/webm;'/>
            Your browser does not support the video tag.
        </video>
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
            <li><a href="#"><img src="https://i.ibb.co/x7P24fL/facebook.png"/></a></li>
            <li><a href="#"><img src="https://i.ibb.co/Wnxq2Nq/twitter.png"/></a></li>
            <li><a href="#"><img src="https://i.ibb.co/ySwtH4B/instagram.png"/></a></li>
          </ul>
        </footer>
    </section>
    );
}
export default Welcome;
