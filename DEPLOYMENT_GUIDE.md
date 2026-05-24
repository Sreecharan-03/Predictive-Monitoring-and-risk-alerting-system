# Deployment Guide

## 🌐 Production Deployment

### Frontend Deployment

#### Option 1: Vercel (Recommended)
1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Set root directory to `frontend`
   - Deploy

#### Option 2: Netlify
1. **Build the project**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `build` folder
   - Or connect GitHub for automatic deployments

#### Option 3: Docker
1. **Create Dockerfile** in `frontend/`
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   FROM nginx:alpine
   COPY --from=0 /app/build /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Build and run**
   ```bash
   docker build -t predictive-frontend .
   docker run -p 80:80 predictive-frontend
   ```

### Backend Deployment

#### Option 1: Heroku
1. **Create `Procfile`**
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

2. **Create `runtime.txt`**
   ```
   python-3.11.0
   ```

3. **Push to Heroku**
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

#### Option 2: AWS EC2
1. **Launch EC2 instance** (Ubuntu 22.04)

2. **Connect and setup**
   ```bash
   sudo apt update
   sudo apt install python3-pip python3-venv
   git clone your-repo
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Install Gunicorn**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:8000 main:app
   ```

#### Option 3: Railway
1. **Connect GitHub repository**
2. **Set environment variables**
3. **Deploy automatically**

#### Option 4: Docker (Recommended)
1. **Create `backend/Dockerfile`**
   ```dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   COPY . .
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

2. **Create `docker-compose.yml`**
   ```yaml
   version: '3.8'
   services:
     backend:
       build: ./backend
       ports:
         - "8000:8000"
       environment:
         - PORT=8000
       volumes:
         - ./backend:/app
   ```

3. **Run with Docker Compose**
   ```bash
   docker-compose up
   ```

## 🔐 Security Considerations

### Frontend
- Set API endpoint as environment variable
- Use HTTPS only
- Enable Content Security Policy (CSP)
- Sanitize user inputs

### Backend
- Set CORS to specific domains only
- Use environment variables for sensitive config
- Implement rate limiting
- Add input validation
- Use HTTPS/TLS
- Implement authentication if needed

### Environment Variables

**Frontend (.env)**
```
REACT_APP_API_URL=https://api.yourdomain.com
```

**Backend (.env)**
```
HOST=0.0.0.0
PORT=8000
RELOAD=False
DATABASE_URL=your_db_url
API_KEY=your_secret_key
```

## 📊 Monitoring & Logging

### Frontend
- Use error tracking (Sentry, Rollbar)
- Monitor performance (Google Analytics)
- Track user behavior

### Backend
- Enable logging in FastAPI
- Use APM tools (New Relic, DataDog)
- Monitor API response times
- Set up alerts

## 🔄 CI/CD Pipeline

### GitHub Actions Example
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Frontend
        run: |
          cd frontend
          npm install
          npm run build
          # Deploy to Vercel/Netlify
      
      - name: Deploy Backend
        run: |
          cd backend
          # Deploy to Heroku/Railway/AWS
```

## 🚀 Performance Optimization

### Frontend
```bash
# Build optimization
npm run build

# Serve with gzip
npm install -g serve
serve -s build

# Enable caching headers
# Set in web server config
```

### Backend
- Use async/await for I/O operations
- Implement caching
- Use connection pooling
- Optimize database queries
- Monitor memory usage

## 📈 Scaling Strategy

### Horizontal Scaling
- Deploy multiple backend instances
- Use load balancer (nginx, HAProxy)
- Implement session management
- Use CDN for frontend

### Vertical Scaling
- Increase server resources
- Optimize code
- Use caching strategies

## 🔧 Maintenance

### Regular Tasks
- Monitor logs and errors
- Update dependencies
- Backup data
- Test disaster recovery
- Review security
- Optimize performance

### Update Procedure
1. Test in staging environment
2. Create backup
3. Deploy gradually
4. Monitor for issues
5. Rollback if needed

## 📞 Support & Troubleshooting

### Common Issues

**API Connection Timeout**
- Check network connectivity
- Verify API is running
- Check firewall rules
- Increase timeout settings

**High Memory Usage**
- Profile the application
- Optimize queries
- Implement caching
- Use pagination

**Slow Response Time**
- Check database performance
- Optimize algorithms
- Use CDN
- Implement caching

## 📋 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database backup created
- [ ] API documentation updated
- [ ] SSL certificate installed
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Monitoring alerts set up
- [ ] Health check endpoint working
- [ ] API tests passing
- [ ] Load testing completed
- [ ] Security audit done
- [ ] Rollback procedure documented

---

**Last Updated**: May 2024
