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
import IconButton from '@mui/material/IconButton';

import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';

import AppTheme from '../../components/shared-theme/AppTheme.jsx';
import {orange} from '../../components/shared-theme/themePrimitives.jsx';
import video from '../../assets/media/welcome.webm'

export default function AboutUs(props){
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
                          About Us
                        </Typography>
                        
                        <Typography  component="p" variant="subtitle2" gutterBottom>
                          Our page offers an integral solution to manage tournaments, from the registration of equipment to the programming of matches and the visualization of real -time results.
                        </Typography>

                        <Typography  component="p" variant="subtitle2" gutterBottom>
                          With intuitive design and advanced tools, you can create and customize tournaments, record players, update statistics and keep all informed participants and fans.
                        </Typography>

                        <Typography  component="p" variant="subtitle2" gutterBottom>
                          You are already an event organizer, a team or a fan, here you will find everything you need to make each tournament a unique experience.
                        </Typography>

                        <Typography variant="subtitle1">
                          <EmailTwoToneIcon size='medium' color='warning'/> sporthub@gmail.com
                        </Typography>
                        <Typography variant="subtitle1">
                          <IconButton
                            color="inherit"
                            size="medium"
                            href="#"
                            aria-label="Facebook"
                            sx={{ alignSelf: 'center' }}
                          >
                            <FacebookIcon size='medium'/>
                          </IconButton>
                          <IconButton
                            color="inherit"
                            size="medium"
                            href="#"
                            aria-label="Facebook"
                            sx={{ alignSelf: 'center' }}
                          >
                            <InstagramIcon size='medium'/></IconButton>
                          <IconButton
                            color="inherit"
                            size="medium"
                            href="#"
                            aria-label="Facebook"
                            sx={{ alignSelf: 'center' }}
                          >
                          <TwitterIcon size='medium'/></IconButton>
                          <IconButton
                            color="inherit"
                            size="medium"
                            href="#"
                            aria-label="Facebook"
                            sx={{ alignSelf: 'center' }}
                          >
                          <LinkedInIcon size='medium'/></IconButton>
                        </Typography>
                        </Stack>
              </Container>
          </Box>
        <LogoCollection myMb={{ xs: '1%', sm: '1%' }} myP={{ xs: '7%', sm: '2%' } }/>
        <Footer />
      </Stack>
    </AppTheme>
  );
}