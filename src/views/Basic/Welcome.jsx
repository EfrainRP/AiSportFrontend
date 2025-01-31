import * as React from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import VideoBackground from '../../components/videoBackground.jsx';
import LogoCollection from '../../components/Basic/LogoCollection.jsx';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';
import LayoutBasic from '../LayoutBasic.jsx'

import {orange} from '../../components/shared-theme/themePrimitives.jsx';


export default function Welcome(props) {
  return (
      <LayoutBasic>
          <VideoBackground/>
            <Container
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', sm: 'flex-start' },
                textAlign: { xs: 'center', sm: 'left' },
                pt: { xs: 4, sm: 6 }, //padding top, xs para pantalla chicas
                pb: { xs: 4, sm: 6 },
                mb: { xs: 4, sm: 10 }, //padding bottom, sm para pantallas anchas
              }}
              >
              <Stack
                spacing={2}
                useFlexGap
                align='justify'
                color= 'text.primary'
                sx={{ 
                  alignItems: 'center', 
                  width: { xs: '62vw', sm: '52%' }, 
                  // minHeight: '60vh', // Garantiza que cubra toda la altura de la pantalla
                  zIndex: 1, // Asegura que el contenido esté encima del video
                }}
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
                  <EmailTwoToneIcon fontSize='medium' color='warning'/> aiSport@gmail.com
                </Typography>

                <Button href='/signin' color="secondary" variant="contained" size="medium">
                  Sign in
                </Button>
              </Stack>
          </Container>
        <LogoCollection myMb={{ xs: '1%', sm: '1%' }} myP={{ xs: '7%', sm: '2%' } }/>
      </LayoutBasic>
  );
}
