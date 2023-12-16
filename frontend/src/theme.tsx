import { createTheme } from '@mui/material';

export const defaultTheme = createTheme({
  typography: {
    button: {
      textTransform: 'none'
    },
  },
  spacing: [0, 4, 8, 16, 32, 64],
  palette: {
    mode: 'dark',
  },
})

export const priorityPalette = {
  0: "#8BC34A",
  1: "#CDDC39",
  2: "#FFEB3B",
  3: "#FF9800",
  4: "#F44336",
}

export const myPalette = {
  1000: "#2D2D2D",
  925: "#7A7A7A",
  975: "#939393",
  951: "#292929",
  952: "#404249",
  950: "#1E1E1E",
  900: "#23036A",
  800: "#30009C",
  700: "#3700B3",
  600: "#5600E8",
  500: "#6200EE",
  400: "#7F39FB",
  300: "#985EFF",
  200: "#BB86FC",
  100: "#DBB2FF",
  50: "#F2E7FE"
}