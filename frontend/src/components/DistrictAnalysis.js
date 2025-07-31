import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { fetchDistricts, fetchSchools } from '../services/api';

// Modern vibrant colors matching our theme
const COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#06B6D4', '#EF4444', '#8B5CF6', '#F472B6'];

const DistrictAnalysis = () => {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('avg_points');
  const [sortOrder, setSortOrder] = useState('desc');
  const [overviewStats, setOverviewStats] = useState(null);

  useEffect(() => {
    loadDistrictData();
  }, []);

  const loadDistrictData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [districtsResponse, schoolsResponse] = await Promise.all([
        fetchDistricts(),
        fetchSchools({ limit: 1000 }) // Get more schools for analysis
      ]);

      const districtsData = districtsResponse.data;
      const schoolsData = schoolsResponse.data.schools;

      // Calculate additional statistics
      const enhancedDistricts = districtsData.map(district => {
        const districtSchools = schoolsData.filter(school => school.district === district.name);
        const totalVukova = districtSchools.reduce((sum, school) => sum + school.vukova_diploma, 0);
        const totalFinished = districtSchools.reduce((sum, school) => sum + (school.students_count || 0), 0);
        
        return {
          ...district,
          vukova_percentage: totalFinished > 0 ? ((totalVukova / totalFinished) * 100).toFixed(1) : 0,
          schools_with_data: districtSchools.length,
          top_school: districtSchools.length > 0 ? districtSchools.reduce((max, school) => 
            school.total_points > max.total_points ? school : max
          ) : null
        };
      });

      setDistricts(enhancedDistricts);
      
      // Calculate overview statistics
      const totalSchools = schoolsData.length;
      const totalStudents = schoolsData.reduce((sum, school) => sum + school.students_count, 0);
      const totalVukova = schoolsData.reduce((sum, school) => sum + school.vukova_diploma, 0);
      const avgPoints = schoolsData.reduce((sum, school) => sum + school.total_points, 0) / totalSchools;

      setOverviewStats({
        totalDistricts: enhancedDistricts.length,
        totalSchools,
        totalStudents,
        totalVukova,
        avgPoints: avgPoints.toFixed(2),
        vukovaPercentage: ((totalVukova / totalStudents) * 100).toFixed(1)
      });

    } catch (error) {
      console.error('Error loading district data:', error);
      setError('Failed to load district analysis. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (property) => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  const getSortedDistricts = () => {
    return [...districts].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const getPerformanceColor = (points) => {
    if (points >= 80) return 'linear-gradient(135deg, #10B981 0%, #34D399 100%)';
    if (points >= 60) return 'linear-gradient(135deg, #F59E0B 0%, #FBC02D 100%)';
    return 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)';
  };

  const getChartData = () => {
    return districts
      .sort((a, b) => b.avg_points - a.avg_points)
      .slice(0, 10)
      .map(district => ({
        name: district.name.length > 15 ? district.name.substring(0, 15) + '...' : district.name,
        points: district.avg_points,
        schools: district.school_count,
        students: district.total_students
      }));
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
        <Typography variant="h4" component="h1" gutterBottom>
          Анализа округа
        </Typography>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Анализа округа
      </Typography>

      {/* Overview Statistics */}
      {overviewStats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', 
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60px',
                height: '60px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                transform: 'translate(20px, -20px)',
              },
            }}>
              <CardContent sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {overviewStats.totalDistricts}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Окрузи
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)', 
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60px',
                height: '60px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                transform: 'translate(20px, -20px)',
              },
            }}>
              <CardContent sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {overviewStats.totalSchools.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Школе
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)', 
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60px',
                height: '60px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                transform: 'translate(20px, -20px)',
              },
            }}>
              <CardContent sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {overviewStats.totalStudents.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Ученици
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #F59E0B 0%, #FBC02D 100%)', 
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60px',
                height: '60px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                transform: 'translate(20px, -20px)',
              },
            }}>
              <CardContent sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {overviewStats.avgPoints}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Просечни поени
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)', 
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60px',
                height: '60px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                transform: 'translate(20px, -20px)',
              },
            }}>
              <CardContent sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {overviewStats.totalVukova.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Вукове дипломе
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)', 
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60px',
                height: '60px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                transform: 'translate(20px, -20px)',
              },
            }}>
              <CardContent sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {overviewStats.vukovaPercentage}%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Вукова стопа
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Grid container spacing={3}>
        {/* Top Performing Districts Chart */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Топ 10 округа по просечним поенима
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                />
                <YAxis tick={{ fill: '#64748B' }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value, name) => [
                    name === 'points' ? `${value} поена` : value,
                    name === 'points' ? 'Просечни поени' : 
                    name === 'schools' ? 'Школе' : 'Ученици'
                  ]}
                />
                <Legend />
                <Bar 
                  dataKey="points" 
                  fill="url(#barGradient)" 
                  name="Просечни поени"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* District Distribution Pie Chart */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Расподела школа по окрузима
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={districts.slice(0, 8)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) => `${percent > 5 ? name.substring(0, 10) : ''}`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="school_count"
                >
                  {districts.slice(0, 8).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value) => [`${value} школа`, 'Школе']} 
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Detailed Districts Table */}
        <Grid item xs={12}>
          <Paper>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6">
                Поређење перформанси округа
              </Typography>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === 'name'}
                        direction={sortBy === 'name' ? sortOrder : 'asc'}
                        onClick={() => handleSort('name')}
                      >
                        Име округа
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={sortBy === 'avg_points'}
                        direction={sortBy === 'avg_points' ? sortOrder : 'asc'}
                        onClick={() => handleSort('avg_points')}
                      >
                        Просечни поени
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={sortBy === 'school_count'}
                        direction={sortBy === 'school_count' ? sortOrder : 'asc'}
                        onClick={() => handleSort('school_count')}
                      >
                        Школе
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={sortBy === 'total_students'}
                        direction={sortBy === 'total_students' ? sortOrder : 'asc'}
                        onClick={() => handleSort('total_students')}
                      >
                        Ученици
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={sortBy === 'vukova_percentage'}
                        direction={sortBy === 'vukova_percentage' ? sortOrder : 'asc'}
                        onClick={() => handleSort('vukova_percentage')}
                      >
                        Вукова стопа
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Топ школа</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getSortedDistricts().map((district, index) => (
                    <TableRow key={district.name} hover>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {district.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Ранг #{index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={district.avg_points.toFixed(1)}
                          sx={{
                            background: getPerformanceColor(district.avg_points),
                            color: 'white',
                            fontWeight: 600,
                          }}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {district.school_count}
                      </TableCell>
                      <TableCell align="right">
                        {district.total_students.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        <Typography 
                          variant="body2" 
                          color={parseFloat(district.vukova_percentage) > 15 ? 'success.main' : 'text.primary'}
                        >
                          {district.vukova_percentage}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {district.top_school ? (
                          <Box>
                            <Typography variant="body2" noWrap>
                              {district.top_school.name.length > 30 
                                ? district.top_school.name.substring(0, 30) + '...'
                                : district.top_school.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {district.top_school.total_points} поена
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="caption" color="textSecondary">
                            Нема података
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DistrictAnalysis;
