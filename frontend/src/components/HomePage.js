import { Analytics, LocationOn, School, TrendingUp, EmojiEvents, ArrowForward } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Grid, Paper, Typography, Container, Chip, Avatar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  fetchDistrictComparison,
  fetchOverviewStats,
  fetchTopSchools,
} from '../services/unifiedApi';

const HomePage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [topSchools, setTopSchools] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, topSchoolsRes, districtsRes] = await Promise.all([
          fetchOverviewStats(),
          fetchTopSchools(5),
          fetchDistrictComparison(),
        ]);

        setStats(statsRes.data);
        setTopSchools(topSchoolsRes.data);
        setDistrictData(districtsRes.data.slice(0, 10)); // Top 10 districts
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to connect to the backend. Make sure the Flask server is running on port 5000.');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography variant="h6">Учитавање...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 500 }}>
            <Typography variant="h6" color="error" gutterBottom>
              Грешка у вези
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {error}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Молимо проверите да ли је сервер покренут на http://127.0.0.1:5000
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  const statsCards = [
    {
      title: 'Укупно школа',
      value: stats?.total_schools?.toLocaleString() || '0',
      icon: <School sx={{ fontSize: 40 }} />,
      color: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    },
    {
      title: 'Ученика 8. разреда',
      value: stats?.total_students?.toLocaleString() || '0',
      icon: <School sx={{ fontSize: 40 }} />,
      color: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
    },
    {
      title: 'Просечни поени',
      value: stats?.avg_points || '0',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    },
    {
      title: 'Медијан поена',
      value: stats?.median_points || '0',
      icon: <Analytics sx={{ fontSize: 40 }} />,
      color: 'linear-gradient(135deg, #F59E0B 0%, #FBC02D 100%)',
    },
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: 6,
          px: 3,
          background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
          borderRadius: 4,
          mb: 4,
          border: '1px solid #E2E8F0',
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 800,
            mb: 2,
          }}
        >
          📊 Анализа основних школа у Србији
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: '800px', mx: 'auto', lineHeight: 1.6 }}
        >
          Комплетан преглед перформанси основних школа на територији Републике Србије
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/schools')}
            endIcon={<ArrowForward />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
            }}
          >
            Претражи школе
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/districts')}
            endIcon={<Analytics />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              borderColor: '#6366F1',
              color: '#6366F1',
              '&:hover': {
                borderColor: '#4F46E5',
                color: '#4F46E5',
                backgroundColor: 'rgba(99, 102, 241, 0.05)',
              },
            }}
          >
            Анализа окрuga
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                background: card.color,
                color: 'white',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100px',
                  height: '100px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  transform: 'translate(30px, -30px)',
                },
              }}
            >
              <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'inherit',
                      width: 60,
                      height: 60,
                      mr: 2,
                    }}
                  >
                    {card.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h3" component="div" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {card.value}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      {card.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Top Schools */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <EmojiEvents sx={{ color: '#F59E0B', mr: 2, fontSize: 30 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  🏆 Топ 5 школа по поенима
                </Typography>
              </Box>
              
              {topSchools.map((school, index) => (
                <Box
                  key={school.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    mb: 2,
                    borderRadius: 3,
                    background: index === 0 
                      ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' 
                      : 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                    border: '1px solid #E2E8F0',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                  onClick={() => navigate(`/school/${school.id}`)}
                >
                  <Chip
                    label={`#${index + 1}`}
                    sx={{
                      mr: 2,
                      fontWeight: 700,
                      background: index === 0 
                        ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                        : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                      color: 'white',
                      minWidth: 50,
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {school.name.length > 35 ? school.name.substring(0, 35) + '...' : school.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {school.municipality} • {school.students_count} ученика
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#6366F1' }}>
                    {school.total_points}
                  </Typography>
                </Box>
              ))}
              
              <Button
                component={Link}
                to='/schools'
                variant='outlined'
                fullWidth
                sx={{ mt: 2, borderRadius: 3 }}
              >
                Погледај све школе
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* District Performance Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LocationOn sx={{ color: '#EC4899', mr: 2, fontSize: 30 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  📍 Топ 10 округа по перформансама
                </Typography>
              </Box>
              
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={districtData}>
                  <CartesianGrid strokeDasharray='3 3' stroke="#E2E8F0" />
                  <XAxis
                    dataKey='district'
                    tick={{ fontSize: 10, fill: '#64748B' }}
                    angle={-45}
                    textAnchor='end'
                    height={80}
                  />
                  <YAxis tick={{ fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar 
                    dataKey='avg_points' 
                    fill="url(#colorGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
              
              <Button
                component={Link}
                to='/districts'
                variant='outlined'
                fullWidth
                sx={{ mt: 2, borderRadius: 3 }}
              >
                Детаљну анализу округа
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Button
            component={Link}
            to='/schools'
            variant='contained'
            fullWidth
            size='large'
            startIcon={<School />}
            sx={{ py: 2, borderRadius: 3 }}
          >
            Претражи школе
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            component={Link}
            to='/districts'
            variant='contained'
            fullWidth
            size='large'
            startIcon={<LocationOn />}
            sx={{ 
              py: 2, 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #DB2777 0%, #EC4899 100%)',
              },
            }}
          >
            Анализа по окрузима
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            variant='contained'
            fullWidth
            size='large'
            startIcon={<Analytics />}
            href='/api/analysis/district-comparison'
            target='_blank'
            sx={{ 
              py: 2, 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
              },
            }}
          >
            Download података
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
