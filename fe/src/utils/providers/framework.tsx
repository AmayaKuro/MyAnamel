"use client";
import * as React from 'react';

import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme
} from '@mui/material/styles';

// import { AnimatePresence } from 'framer-motion';


export const Theme = ({ children }: {
  children?: React.ReactNode;
}) => {
  const theme = React.useMemo(() => extendTheme({
    colorSchemes: {
      dark: {
        palette: {
          primary: {
            main: '#f7f8f9',
          },
          secondary: {
            main: '#d0d0d5',
          },
          error: {
            main: '#f05858',
          },
          text: {
            primary: '#ffffff',
            secondary: `rgba(255, 255, 255, 0.7)`,
            disabled: `rgba(255, 255, 255, 0.5)`,
          },
          background: {
            default: '#040404',
            paper: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },
  }), []);

  // Can't delete not optional property
  delete (theme as any).colorSchemes.light;

  return <CssVarsProvider theme={theme} defaultMode='dark'>{children}</CssVarsProvider>;
};


// export const AnimateProvider = ({ children }: Props) => {
//   return <AnimatePresence mode="wait">{children}</AnimatePresence>;
// }
