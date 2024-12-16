import * as React from 'react';

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import VideoBackground from '../../components/videoBackground.jsx';
import Layout from '../Layout.jsx'
import {orange} from '../../components/shared-theme/themePrimitives.jsx';

export default function Privacy(props){
  return (
      <Layout>
        <VideoBackground myHeight={{ xs: '9.5rem', sm: '6.5rem' }}/>
          <Container
            sx={{
              position: 'relative',
              minHeight: '60vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: { xs: 'center', sm: 'left' },
              pt: { xs: 4, sm: 5 }, //padding top, xs para pantalla chicas
              // pb: { xs: '18%', sm: "4%" }, //padding bottom, sm para pantallas anchas
              zIndex: 1, // Asegura que el contenido esté encima del video
            }}
          >
            <Stack
              useFlexGap
              sx={{ alignItems: 'center', width: { xs: '80vw', sm: '82%' }, spacing: 1}}
              align='justify'
              color= 'text.primary'
              spacing={1.5}
            >
              <Typography variant="h1" gutterBottom align='center' sx={{color:orange[300], pb: { xs: 6, sm: 2 }}}>
                Privacy Policy
              </Typography>
              
              <Typography variant="body1" paragraph>
                Welcome to SportHub! Your privacy is important to us, and this Privacy Policy explains how we collect, use, and
                protect your personal information when you use our services. By accessing or using SportHub, you agree to the
                practices described in this policy.
              </Typography>

              {/* Section 1 */}
              <Typography variant="h6" gutterBottom>
                Information We Collect
              </Typography>
              <Typography variant="body2" paragraph>
                We collect the following types of information to provide and improve our services:
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Information You Provide:</strong> This includes account information (name, email, etc.), tournament
                data, and any communication details you provide.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Automatically Collected Information:</strong> Includes usage data, device information, and cookies.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Third-Party Information:</strong> Additional details we may receive from linked accounts or third-party
                integrations.
              </Typography>

              {/* Section 2 */}
              <Typography variant="h6" gutterBottom>
                How We Use Your Information
              </Typography>
              <Typography variant="body2" paragraph>
                We use your information to operate and improve the platform, manage user accounts, facilitate tournaments, analyze
                usage patterns, and more. We may also send service-related notifications and promotional materials.
              </Typography>

              {/* Section 3 */}
              <Typography variant="h6" gutterBottom>
                Sharing Your Information
              </Typography>
              <Typography variant="body2" paragraph>
                We do not sell your personal information. However, we may share it with service providers, other users (in
                tournament contexts), or when required by law.
              </Typography>

              {/* Additional Sections */}
              <Typography variant="h6" gutterBottom>
                Data Security
              </Typography>
              <Typography variant="body2" paragraph>
                We implement industry-standard measures to protect your data but cannot guarantee absolute security. Keep your
                credentials safe and notify us of suspicious activity.
              </Typography>

              <Typography variant="h6" gutterBottom>
                Your Rights
              </Typography>
              <Typography variant="body2" paragraph>
                You can access, update, or delete your account information. Opt-out options for promotional emails are also
                available. Contact us at [Insert Email] to exercise these rights.
              </Typography>

              <Typography variant="h6" gutterBottom>
                Changes to This Policy
              </Typography>
              <Typography variant="body2" paragraph>
                We may update this Privacy Policy. Continued use of the platform after updates constitutes your acceptance of
                the revised policy.
              </Typography>

              <Typography variant="h6" gutterBottom>
                Contact Us
              </Typography>
              <Typography variant="body2" paragraph>
                If you have any questions, contact us at [Insert Email or Contact Information].
              </Typography>

              </Stack>
        </Container>
      </Layout>
  );
}