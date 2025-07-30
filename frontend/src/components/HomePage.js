import { Analytics, LocationOn, School, TrendingUp } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  fetchDistrictComparison,
  fetchOverviewStats,
  fetchTopSchools,
} from '../services/api';

const HomePage = () => {
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 500 }}>
          <Typography variant="h6" color="error" gutterBottom>
            Connection Error
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Please ensure the backend server is running at http://127.0.0.1:5000
          </Typography>
        </Paper>
      </Box>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        elevation={3}
        sx={{ p: 4, mb: 4, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}
      >
        <Typography variant='h3' gutterBottom>
          📊 Analiza osnovnih škola u Srbiji
        </Typography>
        <Typography variant='h6' sx={{ opacity: 0.9 }}>
          Kompletan pregled performansi osnovnih škola na teritoriji Republike Srbije
        </Typography>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <School color='primary' sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant='h4' color='primary'>
                {stats?.total_schools?.toLocaleString()}
              </Typography>
              <Typography color='textSecondary'>Ukupno škola</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <School color='secondary' sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant='h4' color='secondary'>
                {stats?.total_students?.toLocaleString()}
              </Typography>
              <Typography color='textSecondary'>Učenika 8. razreda</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp color='success' sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant='h4' color='success.main'>
                {stats?.avg_points}
              </Typography>
              <Typography color='textSecondary'>Prosečni poeni</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Analytics color='warning' sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant='h4' color='warning.main'>
                {stats?.median_points}
              </Typography>
              <Typography color='textSecondary'>Medijan poena</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Top Schools */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                🏆 Top 5 škola po poenima
              </Typography>
              {topSchools.map((school, index) => (
                <Box
                  key={school.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1,
                    borderBottom:
                      index < topSchools.length - 1 ? '1px solid #eee' : 'none',
                  }}
                >
                  <Box>
                    <Typography variant='subtitle2'>
                      {index + 1}. {school.name}
                    </Typography>
                    <Typography variant='caption' color='textSecondary'>
                      {school.municipality} • {school.students_count} učenika
                    </Typography>
                  </Box>
                  <Typography variant='h6' color='primary'>
                    {school.total_points}
                  </Typography>
                </Box>
              ))}
              <Button
                component={Link}
                to='/schools'
                variant='outlined'
                fullWidth
                sx={{ mt: 2 }}
              >
                Pogledaj sve škole
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* District Performance Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                📍 Top 10 okruga po performansama
              </Typography>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={districtData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis
                    dataKey='district'
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor='end'
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey='avg_points' fill='#1976d2' />
                </BarChart>
              </ResponsiveContainer>
              <Button
                component={Link}
                to='/districts'
                variant='outlined'
                fullWidth
                sx={{ mt: 2 }}
              >
                Detaljnu analizu okruga
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Button
            component={Link}
            to='/schools'
            variant='contained'
            fullWidth
            size='large'
            startIcon={<School />}
          >
            Pretraži škole
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
          >
            Analiza po okruzima
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
          >
            Download podataka
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
