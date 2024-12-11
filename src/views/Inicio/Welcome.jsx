import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import HeaderAppBar from '../../components/HeaderAppBar';
import LogoCollection from '../../components/LogoCollection';
import Footer from '../../components/Footer';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';

import AppTheme from '../../components/shared-theme/AppTheme.jsx';
import {orange} from '../../components/shared-theme/themePrimitives.jsx';
import video from '../../assets/media/welcome.webm'

export default function Welcome(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Stack 
        spacing={5}
        useFlexGap
        sx={(theme) => ({
        width: '100%',
        minHeight: '89.5vh',
        backgroundRepeat: 'no-repeat',
        backgroundImage:
        'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        ...theme.applyStyles('dark', {
          backgroundImage:
          'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        })
      })}>
          <HeaderAppBar />
          <Box
            sx={{
              position: 'relative', // Posiciona el contenido sobre el video
              minHeight: '60vh', // Garantiza que cubra toda la altura de la pantalla
              // top: '1%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              // marginTop: { xs:"1%", sm: "1%" }, //padding bottom, sm para pantallas anchas
              // marginBottom: { xs:"10%", sm: "1.5vw" }//1.5vw
            }}>
              <Box 
                component="video"
                src={video}
                autoPlay
                muted
                loop
                sx={{
                  position: 'absolute', // Fija el video como fondo
                  mt: 2,
                  // top: { xs: 1, sm: '1px' },
                  width: "100vw", // Ocupa todo el ancho de la ventana
                  height: { xs: "65vh", sm: "30.5rem"}, // Ocupa toda la altura de la ventana 64.45vh
                  objectFit: 'cover', // Ajusta el video para cubrir el área sin distorsión
                  zIndex: 0, // Asegura que el contenido esté encima del video
                  opacity: 0.96
              }}/>
                <Container
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: { xs: 'center', sm: 'flex-start' },
                    textAlign: { xs: 'center', sm: 'left' },
                    // pt: { xs: 4, sm: 5 }, //padding top, xs para pantalla chicas
                    // pb: { xs: '18%', sm: "4%" }, //padding bottom, sm para pantallas anchas
                    zIndex: 1, // Asegura que el contenido esté encima del video
                  }}
                >
                  <Stack
                    spacing={2}
                    useFlexGap
                    sx={{ alignItems: 'center', width: { xs: '62vw', sm: '52%' } }}
                    align='justify'
                    color= 'white'
                  >
                    <Typography variant="h1" gutterBottom align='center' sx={{color:orange[300]}}>
                      Basketball tournaments
                    </Typography>
                    
                    <Typography variant="subtitle1" gutterBottom>
                      Welcome to our basketball tournament management platform, where you can organize, follow and enjoy the emotion of basketball at its maximum expression.
                    </Typography>

                    <Typography variant="subtitle1">
                      <WhatsAppIcon fontSize='medium' color='success'/> <Link color="inherit" href="#">33-22-11-44-55</Link>
                    </Typography>

                    <Typography variant="subtitle1">
                      <EmailTwoToneIcon fontSize='medium' color='warning'/> sporthub@gmail.com
                    </Typography>

                    <Button href='/signin' color="secondary" variant="contained" size="medium">
                      Sign in
                    </Button>
                  </Stack>
              </Container>
          </Box>
        <LogoCollection myMb={{ xs: '1%', sm: '1%' }} myP={{ xs: '7%', sm: '2%' } }/>
        <Footer />
      </Stack>
    </AppTheme>
  );
}
