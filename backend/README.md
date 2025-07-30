# Backend Setup

## Prerequisites

Make sure you have Python 3.7+ installed.

## Setting up Virtual Environment

First, create and activate a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

## Installing Dependencies

To install all required Python libraries, run:

```bash
pip install -r requirements.txt
```

## Running the Application

```bash
python api.py
```

The backend will be available at `http://localhost:5000`

## Deactivating Virtual Environment

When you're done working, you can deactivate the virtual environment:

```bash
deactivate
```

## Required Libraries

- `flask` - web framework
- `flask-cors` - enables CORS for frontend communication  
- `pandas` - data processing and analysis

## Notes

Make sure you have Python 3.7+ installed and that the JSON file with school data (`serbian_schools.json`) exists in the backend directory.
