// API service that works with both static data and backend server
import { staticAPI } from '../data/schoolsData';

// Configuration - set to true for static deployment (GitHub Pages)
const USE_STATIC_DATA = process.env.REACT_APP_USE_STATIC === 'true' || process.env.NODE_ENV === 'production';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

// Helper function to make API calls to backend
const apiCall = async (endpoint, params = {}) => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value);
    }
  });

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return { data: await response.json() };
};

// Unified API functions that work with both static and backend data
export const fetchOverviewStats = () => {
  if (USE_STATIC_DATA) {
    return staticAPI.fetchOverviewStats();
  }
  return apiCall('/api/stats/overview');
};

export const fetchDistricts = () => {
  if (USE_STATIC_DATA) {
    return staticAPI.fetchDistricts();
  }
  return apiCall('/api/districts');
};

export const fetchSchools = (params = {}) => {
  if (USE_STATIC_DATA) {
    return staticAPI.fetchSchools(params);
  }
  return apiCall('/api/schools', params);
};

export const fetchSchoolDetail = (id) => {
  if (USE_STATIC_DATA) {
    return staticAPI.fetchSchoolDetail(id);
  }
  return apiCall(`/api/schools/${id}`);
};

export const fetchTopSchools = (limit = 10) => {
  if (USE_STATIC_DATA) {
    return staticAPI.fetchTopSchools(limit);
  }
  return apiCall('/api/analysis/top-schools', { limit });
};

export const fetchDistrictComparison = () => {
  if (USE_STATIC_DATA) {
    return staticAPI.fetchDistrictComparison();
  }
  return apiCall('/api/analysis/district-comparison');
};
