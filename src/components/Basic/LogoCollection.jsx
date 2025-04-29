import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/system';
import addidas_claro from '../../assets/img/companies/addidas_claro.png'
import addidas_oscuro from '../../assets/img/companies/addidas_oscuro.png'
import jordan_claro from '../../assets/img/companies/jordan_claro.png'
import jordan_oscuro from '../../assets/img/companies/jordan_oscuro.png'
import nike_claro from '../../assets/img/companies/nike_claro.png'
import nike_oscuro from '../../assets/img/companies/nike_oscuro.png'
import under_claro from '../../assets/img/companies/under_claro.png'
import under_oscuro from '../../assets/img/companies/under_oscuro.png'

const whiteLogos = [
  addidas_claro,
  jordan_claro,
  nike_claro,
  under_claro
];

const darkLogos = [
  addidas_oscuro,
  jordan_oscuro,
  nike_oscuro,
  under_oscuro
];

const logoStyle = {
  width: '100px',
  height: '80px',
  margin: '0 32px',
  opacity: 0.7,
};

export default function LogoCollection(prop) {//pt es padding top
  const theme = useTheme();
  const logos = theme.palette.mode === 'light' ? darkLogos : whiteLogos;

  return (
    <Box id="logoCollection" sx={{mb: prop.myMb, pt: prop.myP, pb: prop.myP}}>
      <Typography
        component="p"
        variant="subtitle2"
        align="center"
        sx={{ color: 'text.primary' }}
      >
        Companies that support you:
      </Typography>
      <Grid container sx={{ justifyContent: 'center', mt: 2, opacity: 0.8, gap: { xs: 2, sm: 8 }}}>
        {logos.map((logo, index) => (
          <Grid item key={index} sx={{}}>
            <img
              src={logo}
              alt={`Company example ${index + 1}`}
              style={logoStyle}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
