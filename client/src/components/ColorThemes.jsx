// import * as React from 'react';
import { createTheme } from '@mui/material/styles';
import * as Colors from '@mui/material/colors';
// import Button from '@mui/material/Button';

const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: '#7e57c2',
    },
    secondary: {
      // This is green.A700 as hex.
      main: Colors.deepPurple[500],
    },
  },
  typography: {
    fontFamily: 'Secular One',
  },
});

export default theme;

// export default function ColorThemes() {
//   return (
//     theme
//   );
// }