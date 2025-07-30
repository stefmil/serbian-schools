import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import DistrictAnalysis from './components/DistrictAnalysis';
import HomePage from './components/HomePage';
import SchoolDetail from './components/SchoolDetail';
import SchoolsList from './components/SchoolsList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position='static' sx={{ mb: 4 }}>
          <Toolbar>
            <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
              📚 Analiza osnovnih škola u Srbiji
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth='lg'>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/schools' element={<SchoolsList />} />
            <Route path='/school/:id' element={<SchoolDetail />} />
            <Route path='/districts' element={<DistrictAnalysis />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
