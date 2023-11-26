import { Routes, Route, Navigate } from 'react-router-dom';
import Authentication from './pages/Authentication/Authentication';
import DashboardPage from './pages/Dashboard/Dashboard';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import defaultTheme from './theme';

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
