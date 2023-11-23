import { createTheme } from "@mui/material"

const defaultTheme = createTheme({
    typography: {
      button: {
        textTransform: 'none'
      }
    },
    spacing: [0, 4, 8, 16, 32, 64],
    palette: {
      mode: 'dark',
    },
  })

export default defaultTheme