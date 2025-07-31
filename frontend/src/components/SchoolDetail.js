import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  School,
  LocationOn,
  Email,
  Language,
  TrendingUp,
  Grade,
  EmojiEvents,
  People,
  ArrowBack
} from '@mui/icons-material';
import { fetchSchoolDetail } from '../services/unifiedApi';

const SchoolDetail = () => {
  const { id } = useParams();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSchoolDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchSchoolDetail(id);
        setSchool(response.data);
      } catch (error) {
        console.error('Error loading school detail:', error);
        if (error.response?.status === 404) {
          setError('School not found.');
        } else {
          setError('Failed to load school details. Please ensure the backend is running.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadSchoolDetail();
  }, [id]);

  const getPerformanceColor = (points) => {
    if (points >= 80) return 'success';
    if (points >= 60) return 'warning';
    return 'error';
  };

  const getPercentileDescription = (percentile) => {
    if (percentile >= 90) return 'Изузетне перформансе';
    if (percentile >= 75) return 'Изнад просека';
    if (percentile >= 50) return 'Просечне перформансе';
    if (percentile >= 25) return 'Испод просека';
    return 'Потребно побољшање';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Button
          component={Link}
          to="/schools"
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          Назад на школе
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!school) {
    return (
      <Box>
        <Button
          component={Link}
          to="/schools"
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          Назад на школе
        </Button>
        <Alert severity="info">Нема података о школи.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Navigation */}
      <Button
        component={Link}
        to="/schools"
        startIcon={<ArrowBack />}
        sx={{ mb: 3 }}
      >
        Назад на школе
      </Button>

      {/* School Header */}
      <Paper sx={{ p: 4, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              <School sx={{ mr: 2, verticalAlign: 'middle' }} />
              {school.name}
            </Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {school.municipality}, {school.district}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              ИД школе: {school.id}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} textAlign="center">
            <Chip
              label={`${school.total_points} поена`}
              color={getPerformanceColor(school.total_points)}
              sx={{ fontSize: '1.2rem', p: 2, mb: 1 }}
            />
            <Typography variant="body2" color="textSecondary">
              {school.percentile}th percentile
            </Typography>
            <Typography variant="caption" display="block">
              {getPercentileDescription(school.percentile)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Performance Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                Преглед перформанси
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Укупни поени
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {school.total_points}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Перцентилни ранг
                  </Typography>
                  <Typography variant="h5" color="secondary">
                    {school.percentile}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Просек тест поена
                  </Typography>
                  <Typography variant="h6">
                    {school.test_points_avg || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Вукова проценат
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {school.vukova_percentage}%
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Student Statistics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <People sx={{ mr: 1, verticalAlign: 'middle' }} />
                Статистике ученика
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Ученици 8. разреда
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {school.students_count}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Завршени ученици
                  </Typography>
                  <Typography variant="h5">
                    {school.finished_students}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Ученици са Вуковом дипломом
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h5" color="success.main">
                      {school.vukova_diploma}
                    </Typography>
                    <EmojiEvents color="warning" />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Grade Averages */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Grade sx={{ mr: 1, verticalAlign: 'middle' }} />
                Просеци оцена
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Просек 6. разреда"
                    secondary={school.grades.grade_6 || 'N/A'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Просек 7. разреда"
                    secondary={school.grades.grade_7 || 'N/A'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Просек 8. разреда"
                    secondary={school.grades.grade_8 || 'N/A'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Укупни просек оцена"
                    secondary={school.grades.total_avg || 'N/A'}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Контакт информације
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                {school.contact.address && (
                  <ListItem>
                    <ListItemIcon>
                      <LocationOn color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Адреса"
                      secondary={school.contact.address}
                    />
                  </ListItem>
                )}
                
                {school.contact.email && (
                  <ListItem>
                    <ListItemIcon>
                      <Email color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="И-мејл"
                      secondary={
                        <a href={`mailto:${school.contact.email}`}>
                          {school.contact.email}
                        </a>
                      }
                    />
                  </ListItem>
                )}
                
                {school.contact.website && (
                  <ListItem>
                    <ListItemIcon>
                      <Language color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Веб сајт"
                      secondary={
                        <a 
                          href={school.contact.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {school.contact.website}
                        </a>
                      }
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SchoolDetail;
