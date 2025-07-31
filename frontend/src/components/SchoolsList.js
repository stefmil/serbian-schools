import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import { fetchSchools, fetchDistricts } from '../services/unifiedApi';

const SchoolsList = () => {
  const [schools, setSchools] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  
  // Sorting
  const [sortBy, setSortBy] = useState('total_points');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Filters
  const [filters, setFilters] = useState({
    schoolName: '',
    district: '',
    municipality: '',
    minPoints: '',
    maxPoints: ''
  });

  useEffect(() => {
    loadDistricts();
  }, []);

  useEffect(() => {
    const loadSchools = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = {
          limit: rowsPerPage,
          offset: page * rowsPerPage,
          sort_by: sortBy,
          sort_order: sortOrder,
          ...(filters.schoolName && { school_name: filters.schoolName }),
          ...(filters.district && { district: filters.district }),
          ...(filters.municipality && { municipality: filters.municipality }),
          ...(filters.minPoints && { min_points: parseFloat(filters.minPoints) }),
          ...(filters.maxPoints && { max_points: parseFloat(filters.maxPoints) })
        };

        const response = await fetchSchools(params);
        setSchools(response.data.schools);
        setTotalCount(response.data.total_count);
      } catch (error) {
        console.error('Error loading schools:', error);
        setError('Failed to load schools. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    loadSchools();
  }, [page, rowsPerPage, sortBy, sortOrder, filters]);

  const loadDistricts = async () => {
    try {
      const response = await fetchDistricts();
      setDistricts(response.data);
    } catch (error) {
      console.error('Error loading districts:', error);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setPage(0); // Reset to first page when filtering
  };

  const handleSort = (property) => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(property);
    setPage(0); // Reset to first page when sorting
  };

  const clearFilters = () => {
    setFilters({
      schoolName: '',
      district: '',
      municipality: '',
      minPoints: '',
      maxPoints: ''
    });
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getPerformanceColor = (points) => {
    if (points >= 80) return 'linear-gradient(135deg, #10B981 0%, #34D399 100%)';
    if (points >= 60) return 'linear-gradient(135deg, #F59E0B 0%, #FBC02D 100%)';
    return 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)';
  };

  if (error) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Листа школа
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
        Листа школа
      </Typography>
      
      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Филтери
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="                        School Name"
              value={filters.schoolName}
              onChange={(e) => handleFilterChange('schoolName', e.target.value)}
              placeholder="Претражи по имену школе"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Округ</InputLabel>
              <Select
                value={filters.district}
                label="Округ"
                onChange={(e) => handleFilterChange('district', e.target.value)}
              >
                <MenuItem value="">Сви окрузи</MenuItem>
                {districts.map((district) => (
                  <MenuItem key={district.name} value={district.name}>
                    {district.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Општина"
              value={filters.municipality}
              onChange={(e) => handleFilterChange('municipality', e.target.value)}
              placeholder="Унесите име општине"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Мин поени"
              type="number"
              value={filters.minPoints}
              onChange={(e) => handleFilterChange('minPoints', e.target.value)}
              inputProps={{ min: 0, max: 100, step: 0.1 }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Макс поени"
              type="number"
              value={filters.maxPoints}
              onChange={(e) => handleFilterChange('maxPoints', e.target.value)}
              inputProps={{ min: 0, max: 100, step: 0.1 }}
            />
          </Grid>
          
          <Grid item xs={12} md={1}>
            <Button
              fullWidth
              variant="outlined"
              onClick={clearFilters}
              disabled={!Object.values(filters).some(value => value !== '')}
            >
              Обриши
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Results */}
      <Paper>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">
            Школе ({totalCount.toLocaleString()} укупно)
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === 'school_name'}
                        direction={sortBy === 'school_name' ? sortOrder : 'asc'}
                        onClick={() => handleSort('school_name')}
                      >
                        Име школе
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === 'district_name'}
                        direction={sortBy === 'district_name' ? sortOrder : 'asc'}
                        onClick={() => handleSort('district_name')}
                      >
                        Округ
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === 'municipality_name'}
                        direction={sortBy === 'municipality_name' ? sortOrder : 'asc'}
                        onClick={() => handleSort('municipality_name')}
                      >
                        Општина
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={sortBy === 'total_points'}
                        direction={sortBy === 'total_points' ? sortOrder : 'asc'}
                        onClick={() => handleSort('total_points')}
                      >
                        Укупни поени
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={sortBy === 'students_count'}
                        direction={sortBy === 'students_count' ? sortOrder : 'asc'}
                        onClick={() => handleSort('students_count')}
                      >
                        Ученици
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={sortBy === 'vukova_diploma'}
                        direction={sortBy === 'vukova_diploma' ? sortOrder : 'asc'}
                        onClick={() => handleSort('vukova_diploma')}
                      >
                        Вукове дипломе
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Акције</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schools.map((school) => (
                    <TableRow key={school.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {school.name}
                        </Typography>
                        {school.address && (
                          <Typography variant="caption" color="textSecondary">
                            {school.address}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{school.district}</TableCell>
                      <TableCell>{school.municipality}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={school.total_points}
                          sx={{
                            background: getPerformanceColor(school.total_points),
                            color: 'white',
                            fontWeight: 600,
                          }}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">{school.students_count}</TableCell>
                      <TableCell align="right">{school.vukova_diploma}</TableCell>
                      <TableCell>
                        <Button
                          component={Link}
                          to={`/school/${school.id}`}
                          variant="outlined"
                          size="small"
                        >
                          Прегледај детаље
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[10, 25, 50, 100]}
            />
          </>
        )}
      </Paper>
    </Box>
  );
};

export default SchoolsList;
