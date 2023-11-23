import { Routes, Route } from 'react-router-dom';
import Authentication from './pages/Authentication/Authentication';
import DashboardPage from './pages/Dashboard';
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
      </Routes>
    </ThemeProvider>
  );
}

export default App;
