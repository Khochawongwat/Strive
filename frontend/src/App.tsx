import { Routes, Route, Navigate } from 'react-router-dom';
import Authentication from './pages/Authentication/Authentication';
import DashboardPage from './pages/Dashboard';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import defaultTheme from './theme';
import { getApp, initializeApp } from 'firebase/app';
import { firebaseConfig } from './configs/firebase.config';
import { initializeAuth } from 'firebase/auth';

initializeApp(firebaseConfig)
initializeAuth(getApp())

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/auth" element={<Authentication />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
