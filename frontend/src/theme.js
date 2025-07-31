import { createTheme } from '@mui/material/styles';

// Modern color palette - vibrant but professional
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366F1', // Modern indigo
      light: '#818CF8',
      dark: '#4F46E5',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#EC4899', // Vibrant pink
      light: '#F472B6',
      dark: '#DB2777',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#10B981', // Emerald green
      light: '#34D399',
      dark: '#059669',
    },
    warning: {
      main: '#F59E0B', // Amber
      light: '#FBC02D',
      dark: '#D97706',
    },
    error: {
      main: '#EF4444', // Red
      light: '#F87171',
      dark: '#DC2626',
    },
    info: {
      main: '#06B6D4', // Cyan
      light: '#22D3EE',
      dark: '#0891B2',
    },
    background: {
      default: '#F8FAFC', // Light gray background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B', // Dark slate
      secondary: '#64748B', // Medium slate
    },
    divider: '#E2E8F0',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#1E293B',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#1E293B',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#1E293B',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
      color: '#1E293B',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      color: '#1E293B',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: 16,
          border: '1px solid #E2E8F0',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: 16,
          border: '1px solid #E2E8F0',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
          textTransform: 'none',
          padding: '10px 24px',
          transition: 'all 0.3s ease',
        },
        contained: {
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            boxShadow: '0 6px 20px 0 rgba(99, 102, 241, 0.4)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 500,
        },
        colorSuccess: {
          background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
          color: 'white',
        },
        colorWarning: {
          background: 'linear-gradient(135deg, #F59E0B 0%, #FBC02D 100%)',
          color: 'white',
        },
        colorError: {
          background: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
          color: 'white',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: '#1E293B',
          backgroundColor: 'transparent',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          height: 8,
        },
        bar: {
          borderRadius: 10,
          background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
        },
      },
    },
  },
});

// Chart colors for consistency
export const chartColors = {
  primary: ['#6366F1', '#8B5CF6', '#EC4899', '#F472B6'],
  success: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
  warning: ['#F59E0B', '#FBC02D', '#FCD34D', '#FDE68A'],
  gradient: [
    'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
    'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    'linear-gradient(135deg, #F59E0B 0%, #FBC02D 100%)',
    'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)',
    'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
  ],
  vibrant: ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#06B6D4', '#EF4444', '#8B5CF6', '#F472B6'],
};

export default theme;
