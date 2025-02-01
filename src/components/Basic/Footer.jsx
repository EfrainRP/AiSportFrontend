import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Instagram from '@mui/icons-material/Instagram';
import WhatsApp from '@mui/icons-material/WhatsApp';
import TwitterIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
      {'Copyright © '}
      <Link color="text.secondary" href="/">
        AiSport
      </Link>
      &nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer(prop) {
  return (
    <Container
      component="footer"
      position="fixed"
      bottom="0"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 4, sm: 8 },
          pt: prop.myP,
          pb: prop.myP,
          textAlign: { sm: 'center', md: 'left' },
        }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pt: { xs: 4, sm: 8 },
          width: '100%',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%',
          justifyContent: 'space-between',
          gap: 6
        }}
        >
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              <strong>Information</strong>
            </Typography>
            <Link color="text.secondary" variant="body2" href="/signin">
              Sign In
            </Link>
            <Link color="text.secondary" variant="body2" href="/signup">
              Sign Up
            </Link>
            <Link color="text.secondary" variant="body2" href='/aboutus'>
              About us
            </Link>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              <strong>Legal</strong>
            </Typography>
            <Link color="text.secondary" variant="body2" href="/terms">
              Terms
            </Link>
            <Link color="text.secondary" variant="body2" href="/privacy">
              Privacy
            </Link>
          </Box>
          <div>
          <Link color="text.secondary" variant="body2" href="/privacy">
            Privacy Policy
          </Link>
          <Typography sx={{ display: 'inline', mx: 0.5, opacity: 0.5 }}>
            &nbsp;•&nbsp;
          </Typography>
          <Link color="text.secondary" variant="body2" href="/terms">
            Terms of Service
          </Link>
          <Copyright />
        </div>
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ justifyContent: 'center', color: 'text.secondary' }}
        >
          <IconButton
            color="inherit"
            size="medium"
            href="#"
            aria-label="WhatsApp"
            sx={{ alignSelf: 'center' }}
          >
            <WhatsApp/>
          </IconButton>
          <IconButton
            color="inherit"
            size="medium"
            href="#"
            aria-label="Facebook"
            sx={{ alignSelf: 'center' }}
          >
            <FacebookIcon />
          </IconButton>
          <IconButton
            color="inherit"
            size="medium"
            href="#"
            aria-label="X"
            sx={{ alignSelf: 'center' }}
          >
            <TwitterIcon />
          </IconButton>
          <IconButton
            color="inherit"
            size="medium"
            href="#"
            aria-label="Instagram"
            sx={{ alignSelf: 'center' }}
          >
            <Instagram/>
          </IconButton>
        </Stack>
        </Box>
      </Box>
    </Container>
  );
}
