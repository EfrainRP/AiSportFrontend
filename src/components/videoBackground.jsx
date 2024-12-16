import * as React from 'react';
import Box from '@mui/material/Box';
import welcomeVideo from '../assets/media/welcomeVideo.webm';
import welcomeImage from '../assets/img/welcomeImage.png';

export default function VideoBackground({ myHeight = { xs: '65vh', sm: '30.5rem' }, myWidth = '100%' }) {//pt es padding top
  return (
    <Box 
    component="video"
    src={welcomeVideo}
    autoPlay
    muted
    loop
    poster={welcomeImage}
    sx={{
      position: 'absolute', // Fija el video como fondo
      mt: 2,
      // top: { xs: 1, sm: '1px' },
      width: myWidth, // Ocupa todo el ancho de la ventana
      height: myHeight, // Ocupa toda la altura de la ventana 64.45vh
      objectFit: 'cover', // Ajusta el video para cubrir el área sin distorsión
      zIndex: 0, // Asegura que el contenido esté encima del video
      opacity: 0.76,
      filter: 'brightness(0.72)', // Reducir brillo
    }}/>
  );
}
