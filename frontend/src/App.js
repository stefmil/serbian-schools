import { AppBar, Container, Toolbar, Typography, Button, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { Route, BrowserRouter as Router, Routes, Link, useLocation } from 'react-router-dom';
import { School, Analytics, Home, Dashboard } from '@mui/icons-material';

import DistrictAnalysis from './components/DistrictAnalysis';
import HomePage from './components/HomePage';
import SchoolDetail from './components/SchoolDetail';
import SchoolsList from './components/SchoolsList';
import theme from './theme';

function NavigationBar() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Почетна', icon: <Home sx={{ mr: 1 }} /> },
    { path: '/schools', label: 'Школе', icon: <School sx={{ mr: 1 }} /> },
    { path: '/districts', label: 'Анализа по окрузима', icon: <Analytics sx={{ mr: 1 }} /> },
  ];

  return (
    <AppBar 
      position='static' 
      sx={{ 
        mb: 4,
        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Typography 
          variant='h6' 
          component='div' 
          sx={{ 
            flexGrow: 1,
            fontWeight: 700,
            fontSize: '1.4rem',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Dashboard sx={{ mr: 2, fontSize: '2rem' }} />
          📚 Анализа основних школа у Србији
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              color="inherit"
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1,
                fontWeight: 600,
                bgcolor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <NavigationBar />
        
        <Container 
          maxWidth='lg'
          sx={{
            minHeight: 'calc(100vh - 120px)',
            pb: 4,
          }}
        >
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
