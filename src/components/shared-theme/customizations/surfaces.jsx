import { alpha } from '@mui/material/styles';
import { gray, brand } from '../themePrimitives';

/* eslint-disable import/prefer-default-export */
export const surfacesCustomizations = {
  MuiAccordion: {
    defaultProps: {
      elevation: 0,
      disableGutters: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        padding: 4,
        overflow: 'clip',
        backgroundColor: (theme.vars || theme).palette.background.default,
        border: '1px solid',
        borderColor: (theme.vars || theme).palette.divider,
        '&.Mui-disabled': {
          backgroundColor: (theme.vars || theme).palette.background.default,
          opacity: 0.7, // Hace que se vea más tenue
          pointerEvents: "none", // Evita interacción
        },
        ':before': {
          backgroundColor: 'transparent',
        },
        '&:not(:last-of-type)': {
          borderBottom: 'none',
        },
        '&:first-of-type': {
          borderTopLeftRadius: (theme.vars || theme).shape.borderRadius,
          borderTopRightRadius: (theme.vars || theme).shape.borderRadius,
        },
        '&:last-of-type': {
          borderBottomLeftRadius: (theme.vars || theme).shape.borderRadius,
          borderBottomRightRadius: (theme.vars || theme).shape.borderRadius,
        },
      }),
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: ({ theme }) => ({
        border: 'none',
        borderRadius: 8,
        '&:hover': { backgroundColor: gray[50] },
        '&:focus-visible': { backgroundColor: 'transparent' },
        ...theme.applyStyles('dark', {
          '&:hover': { backgroundColor: gray[800] },
        }),
      }),
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: { mb: 20, border: 'none' },
    },
  },
  MuiPaper: {
    defaultProps: {
      elevation: 0,
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => {
        return {
          padding: 16,
          gap: 16,
          transition: 'all 100ms ease',
          background: 'rgb(54, 54, 54)',
          borderRadius: (theme.vars || theme).shape.borderRadius,
          border: `1px solid ${(theme.vars || theme).palette.divider}`,
          boxShadow: 'none',
          color:gray[50],
          ...theme.applyStyles('dark', {
            backgroundColor: gray[800],
          }),
          "&:has(.MuiCardActionArea-root)": { // Estilos cuando el Card tiene un CardActionArea dentro (no funciona en FireFox)
            boxShadow: `0px 6px 15px ${alpha(gray[600],0.4)}`,
            "&:hover": {
              boxShadow: `10px 10px 10px ${alpha(gray[700],0.6)}`,
            },
            ...theme.applyStyles('dark', {
              boxShadow: `0px 6px 15px ${alpha(gray[800],0.3)}`,
              "&:hover": {
                boxShadow: `10px 10px 10px ${alpha(gray[800],0.5)}`,
              },
            }),
          },
          variants: [
            {
              props: {
                variant: 'outlined',
              },
              style: {
                border: `1px solid ${(theme.vars || theme).palette.divider}`,
                boxShadow: 'none',
                background: 'rgb(54, 54, 54)', //
                ...theme.applyStyles('dark', {
                  background: alpha(gray[900], 0.8),
                }),
              },
            },
          ],
        };
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: 0,
        '&:last-child': { paddingBottom: 0 },
      },
    },
  },
  MuiCardHeader: {
    styleOverrides: {
      root: {
        padding: 0,
      },
    },
  },
  MuiCardActions: {
    styleOverrides: {
      root:{
        padding: 0,
      },
    },
  },
  MuiCardActionArea: {
    styleOverrides: {
      root: ({ theme }) => {
        return {
          transition: "background-color 0.3s",
          "&:hover": {
            backgroundColor: alpha(gray[400],0.4),
            ...theme.applyStyles('dark', {
              backgroundColor: alpha(gray[700],0.2),
            }),
          },
        };
      },
    },
  },
};
