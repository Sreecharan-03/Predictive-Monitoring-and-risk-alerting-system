# Setup & Configuration Guide

## 🛠️ Complete Setup Instructions

### System Requirements

- **Node.js**: v16.0.0 or higher
- **Python**: 3.8 or higher
- **npm**: 7.0.0 or higher
- **pip**: Latest version
- **RAM**: Minimum 4GB recommended
- **Disk Space**: 2GB free space

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/predictive-monitoring.git
cd Tekworks-Project-1
```

### Step 2: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
REACT_APP_API_URL=http://localhost:8000
EOF

# Start development server
npm start
```

**Frontend will be available at**: `http://localhost:3000`

### Step 3: Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
HOST=0.0.0.0
PORT=8000
RELOAD=True
EOF

# Run server
python run.py
```

**Backend API will be available at**: `http://localhost:8000`

## 📁 Configuration Files

### Frontend Configuration

#### `.env` (Environment Variables)
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_TIMEOUT=30000
```

#### `package.json` (Scripts)
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "develop": "PORT=3001 react-scripts start"
  }
}
```

### Backend Configuration

#### `.env` (Environment Variables)
```env
HOST=0.0.0.0
PORT=8000
RELOAD=True
DEBUG=False
CORS_ORIGINS=["http://localhost:3000"]
DATABASE_URL=sqlite:///./predictive.db
```

#### `requirements.txt` (Python Dependencies)
```
fastapi==0.104.1
uvicorn==0.24.0
python-multipart==0.0.6
pydantic==2.5.0
scikit-learn==1.3.2
pandas==2.1.1
numpy==1.26.2
python-dotenv==1.0.0
```

## 🔧 Advanced Configuration

### Modify API Endpoint

**In Frontend** (`src/components/*.js`):
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const response = await axios.post(`${API_URL}/api/predict/task1`, formData);
```

### Add Custom Models

1. **Place pickle file in**:
   ```
   backend/models/your_model.pkl
   ```

2. **Update `models.py`**:
   ```python
   model_paths = {
       'your_task': 'backend/models/your_model.pkl',
       # ... other models
   }
   ```

3. **Create new route** in `backend/app/routes/`:
   ```python
   from fastapi import APIRouter
   from app.schemas import YourRequest, YourResponse
   from app.models import model_manager

   router = APIRouter(prefix="/your_task", tags=["Your Task"])

   @router.post("/predict", response_model=YourResponse)
   async def predict_your_task(request: YourRequest):
       features = [request.param1, request.param2, ...]
       result = model_manager.predict('your_task', features)
       return YourResponse(...)
   ```

### Customize Theme Colors

**Edit** `frontend/src/styles/Global.css`:
```css
:root {
  --primary: #0f172a;
  --secondary: #1e293b;
  --accent: #06b6d4;
  --accent-dark: #0891b2;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --light: #f1f5f9;
  --dark: #0f172a;
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --border: #334155;
}
```

## 📝 File Structure Details

### Frontend Component Hierarchy

```
App
├── Navbar
├── main-content
│   ├── Home
│   │   ├── Hero Section
│   │   ├── Features Grid
│   │   └── Tasks Grid
│   ├── Task1-6 Pages
│   │   ├── Task Header
│   │   ├── Form Section
│   │   ├── Info Section
│   │   └── PredictionCard
│   └── Not Found (404)
└── Footer
```

### Backend Request Flow

```
Client Request
    ↓
FastAPI Router
    ↓
Pydantic Validation
    ↓
Route Handler
    ↓
Model Manager
    ↓
ML Model Prediction
    ↓
Response Schema
    ↓
JSON Response
```

## 🔐 Security Setup

### CORS Configuration

**Update `backend/main.py`**:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://yourdomain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### API Rate Limiting

Add to `requirements.txt`:
```
slowapi==0.1.8
```

Update `backend/main.py`:
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/api/predict/task1/predict")
@limiter.limit("10/minute")
async def predict_task1(request: Request, data: Task1Request):
    ...
```

## 📊 Database Setup (Optional)

### SQLite (Development)
```python
# backend/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./predictive.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
```

### PostgreSQL (Production)
```python
# backend/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://user:password@localhost/predictive"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
```

## 🧪 Testing

### Frontend Testing

```bash
cd frontend

# Run tests
npm test

# Create test file: src/__tests__/Home.test.js
# Add test suite using Jest and React Testing Library
```

### Backend Testing

Create `backend/test_main.py`:
```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_task1_prediction():
    response = client.post(
        "/api/predict/task1/predict",
        json={
            "air_temperature": 25,
            "process_temperature": 45,
            "rotational_speed": 1500,
            "torque": 40,
            "tool_wear": 100
        }
    )
    assert response.status_code == 200
    assert "failure_prediction" in response.json()
```

Run tests:
```bash
pytest backend/test_main.py
```

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-task

# Make changes
git add .
git commit -m "Add new predictive task"

# Push to GitHub
git push origin feature/new-task

# Create Pull Request on GitHub
# After review and merge:
git checkout main
git pull origin main
```

## 📚 Useful Commands

### Frontend
```bash
# Install new package
npm install package-name

# Update packages
npm update

# Clean node_modules
rm -rf node_modules
npm install

# Build for production
npm run build

# Run production build locally
npm install -g serve
serve -s build
```

### Backend
```bash
# Install new package
pip install package-name

# Add to requirements
pip freeze > requirements.txt

# Run with specific port
PORT=9000 python run.py

# Run with debugging
DEBUG=True python run.py
```

## 🐛 Debugging

### Frontend Debugging
1. Open Chrome DevTools (F12)
2. Go to Network tab to see API calls
3. Go to Console tab for errors
4. Use React DevTools extension

### Backend Debugging
1. Check terminal logs
2. Add print statements
3. Use `--reload` flag during development
4. Use FastAPI Swagger UI at `/docs`

## 📱 Mobile Development

Test on mobile:
```bash
# Get your computer IP
ipconfig getifaddr en0  # macOS
hostname -I            # Linux

# Run frontend with exposed IP
DANGEROUSLY_DISABLE_HOST_CHECK=true npm start

# Access from mobile: http://your-ip:3000
```

## ✅ Verification Checklist

- [ ] Frontend runs without errors
- [ ] Backend API is accessible
- [ ] API documentation loads at `/docs`
- [ ] Health check endpoint works
- [ ] Can make prediction requests
- [ ] Responses are formatted correctly
- [ ] CORS is working properly
- [ ] No console errors in browser
- [ ] Responsive design works on mobile
- [ ] All animations are smooth

---

**Last Updated**: May 2024
