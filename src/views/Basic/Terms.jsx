import * as React from 'react';

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

import VideoBackground from '../../components/videoBackground.jsx';
import LayoutBasic from '../LayoutBasic.jsx'
import {orange} from '../../components/shared-theme/themePrimitives.jsx';

export default function Terms(props){
  return (
      <LayoutBasic>
              <VideoBackground myHeight={{ xs: '19.8vh', sm: '108vh' }}/>
                <Container
                  sx={{
                    position: 'relative',
                    minHeight: '60vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: { xs: 'center', sm: 'flex-start' },
                    textAlign: { xs: 'center', sm: 'left' },
                    pt: { xs: 4, sm: 5 }, //padding top, xs para pantalla chicas
                    // pb: { xs: '18%', sm: "4%" }, //padding bottom, sm para pantallas anchas
                    zIndex: 1, // Asegura que el contenido esté encima del video
                  }}
                >
                  <Stack
                        useFlexGap
                        sx={{ alignItems: 'center', width: { xs: '80vw', sm: '52%' }, spacing: 1}}
                        align='justify'
                        color= 'text.primary'
                        spacing={1.5}
                      >
                        <Typography variant="h1" gutterBottom align='center' sx={{color:orange[300], pb: { xs: 6, sm: 2 }}}>
                          Terms of Service
                        </Typography>
                        
                        <Typography component="p" variant="subtitle2" gutterBottom>
                          Welcome to our Basketball Tournament Management Platform. By using our services, the following service terms. We recommend you read them carefully.
                        </Typography>

                        <Typography component="p" variant="subtitle2" gutterBottom>
                          When you register or use our platform, you confirm that you have read, understood and accepted terms of service. If you do not agree, you will not be able to use our services.
                        </Typography>

                        <Typography component="p" variant="subtitle2" gutterBottom>
                          Our platform allows an users Management Basketball Tournaments, including:
                        </Typography>
                        
                        <Typography component="li" variant="body3">Creation and administration of tournaments.</Typography>
                        <Typography component="li" variant="body3">Registered with teams and players.</Typography>
                        <Typography component="li" variant="body3">Parties programming.</Typography>
                        <Typography component="li" variant="body3">Result record and stays.</Typography>
                        <Typography component="li" variant="body3">Communication</Typography>

                        <Typography component="p" variant="subtitle2" gutterBottom>To use certain services, you must create an account by providing valid and updated information. You are responsible for maintaining the confidentiality of your password and all the activities carried out from your account. We reserve the right to suspend or eliminate accounts that breach these terms.
                        </Typography>

                        <Typography component="p" variant="subtitle2" gutterBottom>
                          The platform must be used only for purposes related to the organization and management of basketball tournaments.
                        </Typography>

                        <Typography component="p" variant="subtitle2" gutterBottom>
                          Users may upload information relating to tournaments, teams and matches. By doing so, you grant us a license to use such content for the purpose of operating the Platform.
                        </Typography>

                        <Typography component="p" variant="subtitle2" gutterBottom>
                          You are solely responsible for the content you share on the Platform and must ensure that it does not infringe the rights of any third party.
                        </Typography>

                        <Typography component="p" variant="subtitle2" gutterBottom>
                          The platform must be used only for purposes related to the organization and management of basketball tournaments.
                          It is strictly prohibited:
                        </Typography>

                          <Typography component="li" variant="body3">Posting offensive, discriminatory or illegal content.</Typography>

                          <Typography component="li" variant="body3">Using the platform for fraudulent activities.</Typography>

                          <Typography component="li" variant="body3">Accessing or manipulating internal systems without authorization.</Typography>
                          
                        <Typography variant="subtitle2">
                          If you have questions about these Terms, please contact us at <Typography component="span" sx={{ color: orange[500], fontWeight: 'bold' }}>sporthub@gmail.com</Typography> .
                        </Typography>

                        <Typography variant="subtitle2">Thank you for using our platform and enjoying basketball with us!
                        </Typography>

                        <Stack direction='row' >
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
                        </Stack>
                    </Stack>
              </Container>
      </LayoutBasic>
  );
}