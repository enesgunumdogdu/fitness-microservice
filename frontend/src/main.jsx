import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from 'react-oauth2-code-pkce'
import { authConfig } from './authConfig'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import './index.css'

import App from './App'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#667eea',
      light: '#8b9ef7',
      dark: '#4b5ed7',
    },
    secondary: {
      main: '#764ba2',
      light: '#9366c4',
      dark: '#5a3680',
    },
    background: {
      default: '#0a0a0a',
      paper: '#141414',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontFamily: '"Montserrat", sans-serif', fontWeight: 800 },
    h2: { fontFamily: '"Montserrat", sans-serif', fontWeight: 800 },
    h3: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Inter", sans-serif', fontWeight: 700 },
    h6: { fontFamily: '"Inter", sans-serif', fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '1rem',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
        },
      },
    },
  },
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <AuthProvider authConfig={authConfig}
                loadingComponent={<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontSize: '1.2rem'}}>Loading...</div>}>
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </AuthProvider>,
)