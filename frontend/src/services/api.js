import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Overview Statistics
export const fetchOverviewStats = () => api.get('/stats/overview');

// Districts
export const fetchDistricts = () => api.get('/districts');
export const fetchDistrictComparison = () => api.get('/analysis/district-comparison');

// Schools
export const fetchSchools = (params = {}) => api.get('/schools', { params });
export const fetchSchoolDetail = (schoolId) => api.get(`/schools/${schoolId}`);
export const fetchTopSchools = (limit = 10) =>
  api.get('/analysis/top-schools', { params: { limit } });

export default api;
