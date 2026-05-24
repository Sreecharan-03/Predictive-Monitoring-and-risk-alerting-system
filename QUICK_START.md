# Quick Start Guide

## ⚡ Get Running in 5 Minutes

### Prerequisites Check
```bash
node --version  # Should be v16+
python --version  # Should be 3.8+
npm --version  # Should be 7+
```

### 1️⃣ Start Backend (Terminal 1)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start server
python run.py
```

**✅ Backend ready at**: `http://localhost:8000`  
**📚 API docs at**: `http://localhost:8000/docs`

### 2️⃣ Start Frontend (Terminal 2)

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start dev server
npm start
```

**✅ Frontend ready at**: `http://localhost:3000`

### 3️⃣ Test It Out

1. Open `http://localhost:3000` in your browser
2. Click on any Task (1-6)
3. Fill in the form fields
4. Click "Predict"
5. See the results! 🎉

---

## 📁 File Organization

```
Tekworks-Project-1/
├── frontend/           ← React app
├── backend/            ← FastAPI server
├── task-1 to task-6/   ← Original notebooks & data
├── README.md           ← Main documentation
├── SETUP_GUIDE.md      ← Detailed setup
├── DEPLOYMENT_GUIDE.md ← Production deployment
└── GITHUB_GUIDE.md     ← GitHub repository guide
```

---

## 🎯 6 Prediction Tasks

| Task | Purpose | Input Example |
|------|---------|---------------|
| **1** | Machine Failure | Temperature, Speed, Torque |
| **2** | Server Downtime | CPU, Memory, Disk Usage |
| **3** | Student Dropout | Age, Performance, Attendance |
| **4** | Hospital Readmission | Age, Health Metrics, BMI |
| **5** | Supply Chain Risk | Shipping, Stock, Lead Time |
| **6** | Quality Defects | Temperature, Humidity, Pressure |

---

## 🔧 Common Commands

### Frontend
```bash
npm start           # Run dev server
npm run build       # Build for production
npm install pkg     # Add package
npm run test        # Run tests
```

### Backend
```bash
python run.py       # Start server
pip install pkg     # Add package
pip freeze > requirements.txt  # Update dependencies
```

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| **Port 3000 in use** | `npm start -- --port 3001` |
| **Port 8000 in use** | `PORT=9000 python run.py` |
| **Module not found** | `npm install` or `pip install -r requirements.txt` |
| **API not connecting** | Check backend is running on port 8000 |
| **CORS errors** | Ensure backend has CORS enabled |

---

## 📝 Project Files You Need to Know

### Key Frontend Files
- `src/App.js` - Main app component with routing
- `src/pages/Task1-6.js` - Individual task pages
- `src/components/Navbar.js` - Navigation
- `src/styles/Global.css` - Theme colors

### Key Backend Files
- `app/routes/task1-6.py` - Prediction endpoints
- `app/schemas.py` - Request/response models
- `app/models.py` - ML model loading
- `main.py` - FastAPI app setup

---

## 🌐 API Endpoints

```
POST /api/predict/task1/predict  → Machine Failure
POST /api/predict/task2/predict  → Server Downtime
POST /api/predict/task3/predict  → Student Dropout
POST /api/predict/task4/predict  → Hospital Readmission
POST /api/predict/task5/predict  → Supply Chain
POST /api/predict/task6/predict  → Quality Defects
```

---

## 💡 Next Steps

### Development
- [ ] Explore the 6 task pages
- [ ] Test predictions with different inputs
- [ ] Check browser DevTools (F12)
- [ ] Review FastAPI Swagger UI

### Customization
- [ ] Change theme colors in `Global.css`
- [ ] Add your own ML models
- [ ] Customize form fields in task pages
- [ ] Add new tasks

### Deployment
- [ ] Follow `DEPLOYMENT_GUIDE.md`
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Deploy backend to Heroku/Railway
- [ ] Configure environment variables

---

## 📚 Documentation Map

| Document | Purpose |
|----------|---------|
| `README.md` | Complete project overview |
| `SETUP_GUIDE.md` | Detailed installation steps |
| `DEPLOYMENT_GUIDE.md` | Production deployment |
| `GITHUB_GUIDE.md` | GitHub repository setup |
| `QUICK_START.md` | This file - 5-minute setup |

---

## 🆘 Need Help?

### Check These First
1. Are both servers running? (Check terminals)
2. Are you using correct URLs? (localhost:3000 and :8000)
3. Is Python/Node installed? (Run `python --version`, `node --version`)
4. Check browser console for errors (F12)

### Common Errors
```
ModuleNotFoundError: pip install -r requirements.txt
Cannot find module: npm install
CORS error: Check backend is running
Connection refused: Check ports 3000 and 8000
```

### Debug Mode
```bash
# Backend with detailed logging
DEBUG=True python run.py

# Frontend with verbose output
npm start -- --verbose
```

---

## 🎨 Customization Examples

### Change Primary Color
Edit `frontend/src/styles/Global.css`:
```css
--accent: #06b6d4;  /* Change this to your color */
```

### Add New Form Field
In `frontend/src/pages/Task1.js`:
```javascript
const [formData, setFormData] = useState({
  // ... existing fields
  new_field: '',  // Add this
});
```

### Update API Endpoint
In any task file:
```javascript
const response = await axios.post(
  'http://your-api-url.com/api/predict/task1',
  formData
);
```

---

## 📊 Performance Tips

### Frontend
- Clear browser cache (Cmd+Shift+Del / Ctrl+Shift+Del)
- Check Network tab for slow requests
- Use Chrome DevTools Performance tab

### Backend
- Monitor CPU/Memory in terminal
- Check logs for errors
- Test with FastAPI Swagger UI

---

## ✅ Verification Checklist

- [ ] Backend server running (port 8000)
- [ ] Frontend app running (port 3000)
- [ ] Can access `http://localhost:3000`
- [ ] API docs available at `/docs`
- [ ] Can make a prediction
- [ ] Results display properly
- [ ] Responsive on mobile (F12 → Toggle device)
- [ ] No console errors (F12 → Console)

---

## 🚀 You're All Set!

**Start exploring**: Open `http://localhost:3000` and try making predictions!

For more details, see `README.md` or other documentation files.

---

**Happy Predicting!** 🎯

Last Updated: May 2024
