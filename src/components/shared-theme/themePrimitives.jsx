import { createTheme, alpha } from '@mui/material/styles';

const defaultTheme = createTheme();

const customShadows = [...defaultTheme.shadows];

export const colorPrimary = {
  50: 'hsl(210, 100%, 95%)',
  100: 'hsl(210, 100%, 92%)',
  200: 'hsl(210, 100%, 80%)',
  300: 'hsl(210, 100%, 65%)',
  400: 'hsl(210, 98%, 48%)',
  500: 'hsl(210, 98%, 42%)',
  600: 'hsl(210, 98%, 55%)',
  700: 'hsl(210, 100%, 35%)',
  800: 'hsl(210, 100%, 16%)',
  900: 'hsl(210, 100%, 21%)',
};

export const colorSecondary = {
  50: 'hsl(266, 100%, 95%)',
  100: 'hsl(266, 100%, 92%)',
  200: 'hsl(266, 100%, 80%)',
  300: 'hsl(266, 100%, 65%)',
  400: 'hsl(266, 98%, 48%)',
  500: 'hsl(266, 98.10%, 42.00%)',
  600: 'hsl(266, 83.30%, 62.40%)',
  700: 'hsl(266, 100%, 35%)',
  800: 'hsl(266, 100%, 16%)',
  900: 'hsl(266, 100%, 21%)',
};

export const teal = {
  50: 'hsl(172, 96%, 95%)',
  100: 'hsl(172, 96%, 90%)',
  200: 'hsl(172, 96%, 75%)',
  300: 'hsl(172, 96%, 60%)',
  400: 'hsl(172, 96%, 50%)', 
  500: 'hsl(172, 90%, 42%)',
  600: 'hsl(172, 80%, 34%)',
  700: 'hsl(172, 70%, 26%)',
  800: 'hsl(172, 70%, 18%)',
  900: 'hsl(172, 70%, 12%)',
};

export const brand = {
  50: 'hsl(210, 100%, 95%)',
  100: 'hsl(210, 100%, 92%)',
  200: 'hsl(210, 100%, 80%)',
  300: 'hsl(210, 100%, 65%)',
  400: 'hsl(210, 98%, 48%)',
  500: 'hsl(210, 98%, 42%)',
  600: 'hsl(210, 98%, 55%)',
  700: 'hsl(210, 100%, 35%)',
  800: 'hsl(210, 100%, 16%)',
  900: 'hsl(210, 100%, 21%)',
};

export const gray = {
  50: 'hsl(0, 0%, 97%)',
  100: 'hsl(0, 0%, 94%)',
  200: 'hsl(0, 0%, 88%)',
  300: 'hsl(0, 0%, 80%)',
  400: 'hsl(0, 0%, 65%)',
  500: 'hsl(0, 0%, 42%)',
  600: 'hsl(0, 0.00%, 34.90%)',
  700: 'hsl(0, 0.00%, 25.10%)',
  800: 'hsl(0, 0.00%, 5.90%)',
  900: 'hsl(0, 0.00%, 3.10%)',
};

export const green = {
  50: 'hsl(120, 80%, 98%)',
  100: 'hsl(120, 75%, 94%)',
  200: 'hsl(120, 75%, 87%)',
  300: 'hsl(120, 61%, 77%)',
  400: 'hsl(120, 44%, 53%)',
  500: 'hsl(120, 59%, 30%)',
  600: 'hsl(120, 70%, 25%)',
  700: 'hsl(120, 75%, 16%)',
  800: 'hsl(120, 84%, 10%)',
  900: 'hsl(120, 87%, 6%)',
};

export const orange = {
  50: 'hsl(24, 100%, 95%)',
  100: 'hsl(24, 100%, 90%)',
  200: 'hsl(24, 100%, 80%)',
  300: 'hsl(24, 100%, 65%)',
  400: 'hsl(24, 100%, 55%)',
  500: 'hsl(24, 100%, 50%)', // Aproximado base ff6900
  600: 'hsl(24, 100%, 45%)',
  700: 'hsl(24, 100%, 38%)',
  800: 'hsl(24, 100%, 28%)',
  900: 'hsl(24, 100%, 18%)',
};

export const gold = {
  50: 'hsl(45, 100%, 95%)',   
  100: 'hsl(45, 95%, 90%)',
  200: 'hsl(45, 90%, 80%)',
  300: 'hsl(45, 85%, 65%)',
  400: 'hsl(45, 85%, 55%)',  
  500: 'hsl(45, 80%, 50%)',   // Dorado medio clásico
  600: 'hsl(45, 75%, 45%)',
  700: 'hsl(45, 70%, 35%)',  
  800: 'hsl(45, 60%, 25%)',
  900: 'hsl(45, 50%, 15%)',   
};

export const red = {
  50: 'hsl(0, 100%, 97%)',
  100: 'hsl(0, 92%, 90%)',
  200: 'hsl(0, 94%, 80%)',
  300: 'hsl(0, 90%, 65%)',
  400: 'hsl(0, 90%, 40%)',
  500: 'hsl(0, 90%, 30%)',
  600: 'hsl(0, 91%, 25%)',
  700: 'hsl(0, 94%, 18%)',
  800: 'hsl(0, 95%, 12%)',
  900: 'hsl(0, 93%, 6%)',
};

export const getDesignTokens = (mode) => {
  customShadows[1] =
    mode === 'dark'
      ? 'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px'
      : 'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px';

  return {
    palette: {
      mode,
      primary: {
        light: colorPrimary[200],
        main: colorPrimary[400],
        dark: colorPrimary[700],
        contrastText: colorPrimary[50],
        ...(mode === 'dark' && {
          contrastText: colorPrimary[50],
          light: colorPrimary[300],
          main: colorPrimary[400],
          dark: colorPrimary[700],
        }),
      },
      secondary: { // Agregando el color secundario
        light: colorSecondary[300],
        main: colorSecondary[500],  // Aquí defines el color principal secundario
        dark: colorSecondary[700],
        contrastText: colorSecondary[50],
      },
      info: {
        light: colorPrimary[100],
        main: colorPrimary[300],
        dark: colorPrimary[600],
        contrastText: gray[50],
        ...(mode === 'dark' && {
          contrastText: colorPrimary[300],
          light: colorPrimary[500],
          main: colorPrimary[700],
          dark: colorPrimary[900],
        }),
      },
      warning: {
        light: orange[300],
        main: orange[400],
        dark: orange[800],
        ...(mode === 'dark' && {
          light: orange[400],
          main: orange[500],
          dark: orange[700],
        }),
      },
      error: {
        light: red[300],
        main: red[400],
        dark: red[800],
        ...(mode === 'dark' && {
          light: red[400],
          main: red[500],
          dark: red[700],
        }),
      },
      success: {
        light: '#388e3c',
        main: green[400],
        dark: green[800],
        ...(mode === 'dark' && {
          light: green[400],
          main: green[500],
          dark: green[700],
        }),
      },
      grey: {
        ...gray,
      },
      divider: mode === 'dark' ? alpha(gray[700], 0.6) : alpha(gray[300], 0.4),
      background: {
        default: gray[100],
        paper: 'hsl(220, 35%, 97%)',
        ...(mode === 'dark' && { default: gray[900], paper: 'hsl(220, 30%, 7%)' }),
      },
      text: {
        primary: 'hsl(0, 0%, 100%)', //gray[800],
        secondary: gray[600],
        warning: orange[400],
        ...(mode === 'dark' && {
          primary: 'hsl(0, 0%, 100%)',
          secondary: gray[400],
        }),
      },
      action: {
        hover: alpha(gray[200], 0.2),
        selected: `${alpha(gray[200], 0.3)}`,
        ...(mode === 'dark' && {
          hover: alpha(gray[600], 0.2),
          selected: alpha(gray[600], 0.3),
        }),
      },
    },
    typography: {
      fontFamily: ['"Inter", "sans-serif"'].join(','),
      h1: {
        fontSize: defaultTheme.typography.pxToRem(48),
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: -0.5,
      },
      h2: {
        fontSize: defaultTheme.typography.pxToRem(36),
        fontWeight: 600,
        lineHeight: 1.2,
      },
      h3: {
        fontSize: defaultTheme.typography.pxToRem(30),
        lineHeight: 1.2,
      },
      h4: {
        fontSize: defaultTheme.typography.pxToRem(24),
        fontWeight: 600,
        lineHeight: 1.5,
      },
      h5: {
        fontSize: defaultTheme.typography.pxToRem(20),
        fontWeight: 600,
      },
      h6: {
        fontSize: defaultTheme.typography.pxToRem(18),
        fontWeight: 600,
      },
      subtitle1: {
        fontSize: defaultTheme.typography.pxToRem(18),
      },
      subtitle2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 500,
      },
      body1: {
        fontSize: defaultTheme.typography.pxToRem(14),
      },
      body2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 400,
      },
      caption: {
        fontSize: defaultTheme.typography.pxToRem(12),
        fontWeight: 400,
      },
    },
    shape: {
      borderRadius: 8,
    },
    shadows: customShadows,
  };
};

export const colorSchemes = {
  light: {
    palette: {
      primary: {
        light: brand[200],
        main: brand[300],
        dark: brand[800],
        contrastText: brand[50],
      },
      secondary: { // Agregando el color secundario
        light: colorSecondary[300],
        main: colorSecondary[200],  // Aquí defines el color principal secundario
        dark: colorSecondary[700],
        contrastText: colorSecondary[50],
      },
      info: {
        light: teal[400],
        main: teal[600],
        dark: teal[700],
        contrastText: gray[50],
      },
      warning: {
        light: orange[500],
        main: orange[600],
        dark: orange[700],
      },
      error: {
        light: red[300],
        main: red[400],
        dark: red[600],
      },
      success: {
        light: green[300],
        main: green[400],
        dark: green[600],
      },
      grey: {
        ...gray,
      },
      divider: brand[900],
      background: {
        default: 'hsl(210, 33%, 97%)',//rgba(171, 167, 165, 0.85)
        paper: 'hsla(0, 0.00%, 93.50%, 0.92)', //Edited 'hsla(0, 0.00%, 93.50%, 0.92)'
      },
      text: { //Edited form text
        primary: 'hsla(0, 0.00%, 0.00%, 0.97)',
        secondary: 'hsl(160, 96.10%, 10.30%)',
        warning: orange[400],
        data: gray[50],
      },
      action: {
        hover: 'hsl(160, 96.00%, 50.40%)',
        selected: 'hsl(125, 80.60%, 65.70%)',
      },
      baseShadow:
        'hsla(224, 15.50%, 13.90%, 0.07) 0px 4px 16px 0px, hsla(222, 12.80%, 15.30%, 0.07) 0px 8px 16px -5px',
    },
  },
  dark: {
    palette: {
      primary: {
        contrastText: brand[50],
        light: orange[200],
        main: orange[400],
        dark: orange[800],
      },
      secondary: {
        light: teal[600],
        main: teal[500],
        dark: teal[800],
        contrastText: orange[300],
      },
      info: {
        contrastText: colorPrimary[300],
        light: colorPrimary[500],
        main: colorPrimary[700],
        dark: colorPrimary[900],
      },
      warning: {
        light: gold[400],
        main: gold[500],
        dark: gold[700],
      },
      error: {
        light: red[400],
        main: red[500],
        dark: red[700],
      },
      success: {
        light: green[400],
        main: green[500],
        dark: green[700],
      },
      grey: {
        ...gray,
      },
      divider: brand[600], // Components Divider Color
      background: {
        default: 'hsl(227, 14.30%, 12.40%)', // SideMenu base Color
        paper: 'hsla(219, 73.90%, 4.50%, 0.90)', // Searsh Widget Color
      },
      text: { 
        primary: 'hsla(0, 0.00%, 100.00%, 0.97)', // // SideMenu options Text Titles, subtitles
        secondary: 'hsl(160, 96.00%, 50.40%)', // SideMenu Icons Color
      },
      action: {
        hover: 'hsl(219, 77%, 4.5%)', // Icons Hover Color
        selected:'hsl(172, 96.00%, 50.40%)', // SideMenu Opcion Selected Color
      },
      baseShadow:
        'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px',
    }, 
  },
};

export const typography = {
  fontFamily: ['"Inter", "sans-serif"'].join(','),
  h1: {
    fontSize: defaultTheme.typography.pxToRem(48),
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: defaultTheme.typography.pxToRem(36),
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h3: {
    fontSize: defaultTheme.typography.pxToRem(30),
    lineHeight: 1.2,
  },
  h4: {
    fontSize: defaultTheme.typography.pxToRem(24),
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h5: {
    fontSize: defaultTheme.typography.pxToRem(20),
    fontWeight: 600,
  },
  h6: {
    fontSize: defaultTheme.typography.pxToRem(18),
    fontWeight: 600,
  },
  subtitle1: {
    fontSize: defaultTheme.typography.pxToRem(18),
  },
  subtitle2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 500,
  },
  body1: {
    fontSize: defaultTheme.typography.pxToRem(14),
  },
  body2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 400,
  },
  caption: {
    fontSize: defaultTheme.typography.pxToRem(12),
    fontWeight: 400,
  },
};

export const shape = {
  borderRadius: 8,
};

const defaultShadows = [
  'none',
  'var(--template-palette-baseShadow)',
  ...defaultTheme.shadows.slice(2),
];

export const shadows = defaultShadows;
