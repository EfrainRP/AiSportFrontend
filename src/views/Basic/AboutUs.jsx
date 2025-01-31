import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import LogoCollection from '../../components/Basic/LogoCollection.jsx';
import IconButton from '@mui/material/IconButton';

import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';

import VideoBackground from '../../components/videoBackground.jsx';
import LayoutBasic from '../LayoutBasic.jsx'
import {orange} from '../../components/shared-theme/themePrimitives.jsx';

export default function AboutUs(props){
  return (
      <LayoutBasic>
          <VideoBackground sx={{ xs: '10vh', sm: '31.5rem' }}/>
            <Container
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', sm: 'flex-start' },
                textAlign: { xs: 'center', sm: 'left' },
                pt: { xs: 4, sm: 6 }, //padding top, xs para pantalla chicas
                pb: { xs: 4, sm: 6 },
                mb: { xs: 4, sm: 4 }, //padding bottom, sm para pantallas anchas
              }}
              >
              <Stack
                spacing={2}
                useFlexGap
                sx={{ 
                  alignItems: 'center', 
                  width: { xs: '62vw', sm: '52%' }, 
                  zIndex: 1, // Asegura que el contenido esté encima del video
                }}
                align='justify'
                color= 'text.primary'
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
                  <EmailTwoToneIcon size='medium' color='warning'/> AiSport@gmail.com
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
        <LogoCollection myMb={{ xs: '1%', sm: '1%' }} myP={{ xs: '7%', sm: '2%' } }/>
      </LayoutBasic>
  );
}