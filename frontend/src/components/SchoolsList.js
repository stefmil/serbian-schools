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
import { fetchSchools, fetchDistricts } from '../services/api';

const SchoolsList = () => {
  const [schools, setSchools] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  
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
  }, [page, rowsPerPage, filters]);

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
    if (points >= 80) return 'success';
    if (points >= 60) return 'warning';
    return 'error';
  };

  if (error) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Schools List
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
        Schools List
      </Typography>
      
      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="School Name"
              value={filters.schoolName}
              onChange={(e) => handleFilterChange('schoolName', e.target.value)}
              placeholder="Search by school name"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>District</InputLabel>
              <Select
                value={filters.district}
                label="District"
                onChange={(e) => handleFilterChange('district', e.target.value)}
              >
                <MenuItem value="">All Districts</MenuItem>
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
              label="Municipality"
              value={filters.municipality}
              onChange={(e) => handleFilterChange('municipality', e.target.value)}
              placeholder="Enter municipality name"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Min Points"
              type="number"
              value={filters.minPoints}
              onChange={(e) => handleFilterChange('minPoints', e.target.value)}
              inputProps={{ min: 0, max: 100, step: 0.1 }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Max Points"
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
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Results */}
      <Paper>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">
            Schools ({totalCount.toLocaleString()} total)
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
                    <TableCell>School Name</TableCell>
                    <TableCell>District</TableCell>
                    <TableCell>Municipality</TableCell>
                    <TableCell align="right">Total Points</TableCell>
                    <TableCell align="right">Students</TableCell>
                    <TableCell align="right">Vukova Diplomas</TableCell>
                    <TableCell>Actions</TableCell>
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
                          color={getPerformanceColor(school.total_points)}
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
                          View Details
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
