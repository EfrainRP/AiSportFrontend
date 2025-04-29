import * as React from 'react';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'; // <<--- Importamos Box

import VideoBackground from '../../components/videoBackground.jsx';
import LogoCollection from '../../components/Basic/LogoCollection.jsx';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';
import LayoutBasic from '../LayoutBasic.jsx';

import { orange } from '../../components/shared-theme/themePrimitives.jsx';

const WelcomeTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 'bold',
  letterSpacing: '0.5px',
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.text.primary,
  }),
}));
const StyledH1 = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? orange[300] : orange[900],
}));

const BackgroundBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(0, 0, 0, 0.6)'  // Fondo oscuro semi-transparente
    : 'rgba(255, 255, 255, 0.7)', // Fondo blanco semi-transparente
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2, // Bordes más redondeados
  boxShadow: theme.shadows[5], // Sombra para que flote mejor
  backdropFilter: 'blur(4px)', // Efecto de desenfoque elegante
}));

export default function Welcome(props) {
  return (
    <LayoutBasic>
      <VideoBackground />
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'center', sm: 'flex-start' },
          textAlign: { xs: 'center', sm: 'left' },
          pt: { xs: 4, sm: 6 },
          pb: { xs: 4, sm: 6 },
          mb: { xs: 4, sm: 10 },
        }}
      >
        {/* <<< Agregamos aquí el fondo flotante >>> */}
        <BackgroundBox sx={{ width: { xs: '90%', sm: '52%' } }}>
          <Stack
            spacing={2}
            useFlexGap
            align="justify"
            color="text.secondary"
            sx={{
              alignItems: 'center',
              zIndex: 1,
            }}
          >
            <StyledH1
              variant="h1"
              gutterBottom
              align="center"
            >
              Basketball tournaments
            </StyledH1>


            <WelcomeTypography variant="subtitle1" gutterBottom>
              Welcome to our basketball tournament management platform, where you can organize, follow and enjoy the emotion of basketball at its maximum expression.
            </WelcomeTypography>

            <Typography variant="subtitle1">
              <WhatsAppIcon fontSize="medium" color="success" />{' '}
              <Link color="inherit" href="#">
                33-22-11-44-55
              </Link>
            </Typography>

            <Typography variant="subtitle1">
              <EmailTwoToneIcon fontSize="medium" color="warning" /> AiSport@gmail.com
            </Typography>

            <Button href="/signin" color="secondary" variant="contained" size="medium">
              Sign in
            </Button>
          </Stack>
        </BackgroundBox>
      </Container>
      <LogoCollection myMb={{ xs: '1%', sm: '1%' }} myP={{ xs: '7%', sm: '2%' }} />
    </LayoutBasic>
  );
}
