# Serbian Schools Dashboard

A full-stack application for analyzing Serbian elementary school data, built with React frontend and Flask backend.

## Project Structure

```
schools_dashboard/
├── backend/          # Flask API server
│   ├── api.py       # Main Flask application
│   ├── requirements.txt
│   ├── serbian_schools.json  # School data
│   ├── venv/        # Python virtual environment
│   └── README.md
└── frontend/        # React application
    ├── src/         # React source code
    │   ├── components/
    │   │   ├── HomePage.js
    │   │   ├── DistrictAnalysis.js
    │   │   ├── SchoolsList.js
    │   │   └── SchoolDetail.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── public/      # Public static files
    │   ├── index.html
    │   ├── manifest.json
    │   ├── robots.txt
    │   └── favicon.ico
    ├── package.json
    └── node_modules/
```

## Prerequisites

- **Python 3.7+** (for backend)
- **Node.js 14+** (for frontend)
- **npm or yarn** (for frontend package management)

## Quick Start

**Important:** You need to run both backend and frontend servers simultaneously.

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python api.py
```

The backend will be available at `http://127.0.0.1:5000` (or `http://localhost:5000`)

### 2. Frontend Setup

**Open a new terminal window/tab** and run:

```bash
cd frontend

# Install dependencies
npm install

# If you see vulnerabilities, you can try to fix them
# Note: Some vulnerabilities are in build-time dependencies and less critical
npm audit fix

# Start the development server
npm start
```

The frontend will be available at `http://localhost:3000`

**Note about vulnerabilities:** If `npm install` shows security vulnerabilities, these are typically in build-time dependencies (like webpack-dev-server, postcss) rather than runtime dependencies. For a development environment, these are generally acceptable. For production deployment, consider using the built files (`npm run build`) which don't include these development dependencies.

### Troubleshooting

If you get a "Proxy error: Could not proxy request" error:

1. **Make sure the backend is running first** - Start the Flask server before the React development server
2. **Check the backend URL** - The backend should be accessible at `http://127.0.0.1:5000` or `http://localhost:5000`
3. **Wait a moment** - Sometimes there's a brief delay during backend startup
4. **Refresh the browser** - Try refreshing `http://localhost:3000` after both servers are running

## API Endpoints

- `GET /api/stats/overview` - Basic overview statistics
- `GET /api/districts` - All districts with their stats
- `GET /api/schools` - Schools with filtering and pagination
  - Query parameters: `school_name`, `district`, `municipality`, `min_points`, `max_points`, `limit`, `offset`
- `GET /api/schools/<id>` - Detailed info for specific school
- `GET /api/analysis/top-schools` - Top performing schools
- `GET /api/analysis/district-comparison` - District comparison data

## Features

- 📊 **School Analysis** - Comprehensive analysis of school performance
- 🏫 **District Comparison** - Compare performance across different districts
- 🔍 **School Search** - Search and filter schools by name, district, municipality, and performance criteria
- 📈 **Data Visualization** - Interactive charts and graphs
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Technology Stack

### Backend
- **Flask** - Python web framework
- **Pandas** - Data analysis and manipulation
- **Flask-CORS** - Cross-origin resource sharing

### Frontend
- **React** - JavaScript library for building user interfaces
- **Material-UI** - React UI framework
- **Recharts** - Charting library for React
- **React Router** - Routing for React applications
- **Axios** - HTTP client for API requests

## Development

### Backend Development

The virtual environment needs to be activated every time you work on the backend:

```bash
cd backend
source venv/bin/activate
```

To deactivate the virtual environment when done:

```bash
deactivate
```

### Frontend Development

For frontend development, the React development server provides hot reloading:

```bash
cd frontend
npm start
```

## Data Source

The application uses Serbian school data from `serbian_schools.json` located in the backend directory.

## Notes

- The frontend is configured to proxy API requests to `http://localhost:5000` (see `package.json`)
- Make sure both backend and frontend servers are running for full functionality
- The backend filters schools to only include those with 8th grade students

## Security Notes

If you encounter npm vulnerabilities during installation:

1. **Development Dependencies**: Most vulnerabilities in this project are in development/build-time dependencies (webpack-dev-server, postcss, svgo) which don't affect the runtime security of your application.

2. **For Development**: You can continue development safely. These tools are only used during the build process.

3. **For Production**: Use `npm run build` to create production-ready files that don't include development dependencies.

4. **To Force Fix**: If you want to attempt fixing all vulnerabilities (may cause breaking changes):
   ```bash
   npm audit fix --force
   ```
   Note: This may break some functionality and require additional fixes.
