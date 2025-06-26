import { createTheme } from '@mui/material/styles'

const primaryMain = '#2f749a'
const appBarBg = '#092e5d'

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primaryMain,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: appBarBg,
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '50px !important',
          height: '50px',
          '@media (min-width: 600px)': {
            minHeight: '50px !important',
          },
        },
      },
    },
  },
})

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: primaryMain,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: appBarBg,
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '50px !important',
          height: '50px',
          '@media (min-width: 600px)': {
            minHeight: '50px !important',
          },
        },
      },
    },
  },
}) 