# GitHub Repository Guide

## 📋 Repository Structure

This guide explains the GitHub repository structure and how to organize your project.

## 🗂️ Directory Organization

```
predictive-monitoring/
│
├── .github/
│   ├── workflows/
│   │   ├── deploy.yml
│   │   ├── test.yml
│   │   └── lint.yml
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       └── feature_request.md
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── schemas.py
│   │   ├── models.py
│   │   └── __init__.py
│   ├── main.py
│   ├── run.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── Dockerfile
│   └── .gitignore
│
├── docs/
│   ├── API.md
│   ├── CONTRIBUTING.md
│   └── ARCHITECTURE.md
│
├── task-1/
│   ├── ai4i_predictive_maintenance.csv
│   └── main.ipynb
├── task-2/
│   ├── ai4i2020.csv
│   └── main.ipynb
├── task-3/
│   ├── student_dropout_dataset_v3.csv
│   └── main.ipynb
├── task-4/
│   ├── stroke.csv
│   └── main.ipynb
├── task-5/
│   ├── supply_chain_data.csv
│   └── main.ipynb
├── task-6/
│   ├── manufacturing_defect_dataset.csv
│   └── main.ipynb
│
├── .gitignore
├── README.md
├── SETUP_GUIDE.md
├── DEPLOYMENT_GUIDE.md
├── docker-compose.yml
├── Dockerfile
└── LICENSE
```

## 📄 Essential Files

### Root Level Files

**`.gitignore`** - Files to exclude from Git
```
# Node
node_modules/
npm-debug.log
.npm

# Python
__pycache__/
*.py[cod]
*$py.class
venv/
env/
.env

# IDEs
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Build
build/
dist/
.next/
out/

# Logs
logs/
*.log
```

**`docker-compose.yml`** - Docker Compose configuration
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8000
    volumes:
      - ./frontend:/app
      - /app/node_modules

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - HOST=0.0.0.0
      - PORT=8000
      - RELOAD=True
    volumes:
      - ./backend:/app
```

**`LICENSE`** - Choose appropriate license (MIT, Apache 2.0, etc.)

### Frontend Files

**`frontend/.env.example`**
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_TIMEOUT=30000
REACT_APP_ENV=development
```

**`frontend/.gitignore`**
```
node_modules/
build/
.env
.env.local
.env.*.local
npm-debug.log*
```

### Backend Files

**`backend/.env.example`**
```env
HOST=0.0.0.0
PORT=8000
RELOAD=True
DEBUG=False
```

**`backend/.gitignore`**
```
venv/
__pycache__/
*.pyc
.env
.env.local
*.db
logs/
```

## 🔄 GitHub Workflows

### CI/CD Pipeline (`.github/workflows/deploy.yml`)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm install && npm run build

  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: |
          cd backend
          pip install -r requirements.txt
          pytest

  deploy:
    needs: [test-frontend, test-backend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Production
        run: |
          # Your deployment commands
          echo "Deploying to production..."
```

## 📝 Documentation Files

### `docs/API.md` - API Documentation
Document all endpoints, request/response formats, and examples

### `docs/CONTRIBUTING.md` - Contributing Guidelines
```markdown
# Contributing

## Prerequisites
- Node.js v16+
- Python 3.8+

## Setup
1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Submit a pull request

## Code Style
- Frontend: Use ESLint
- Backend: Use Black, Flake8
```

### `docs/ARCHITECTURE.md` - Architecture Overview
Document system design and component relationships

## 🏷️ Issues & Pull Requests

### Issue Templates

**Bug Report** (`.github/ISSUE_TEMPLATE/bug_report.md`)
```markdown
---
name: Bug report
about: Create a report to help us improve

---

## Description
<!-- Clear description of the bug -->

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
<!-- What should happen -->

## Actual Behavior
<!-- What actually happens -->

## Screenshots
<!-- If applicable -->

## Environment
- OS: 
- Browser: 
- Python Version: 
- Node Version: 
```

**Feature Request** (`.github/ISSUE_TEMPLATE/feature_request.md`)
```markdown
---
name: Feature request
about: Suggest an idea for this project

---

## Description
<!-- Clear description of the feature -->

## Motivation
<!-- Why is this feature needed -->

## Implementation Details
<!-- How should it be implemented -->

## Alternatives
<!-- Alternative approaches -->
```

## 🎯 Best Practices

### Commit Messages
```
# Good
git commit -m "feat: add machine failure prediction model"
git commit -m "fix: correct CORS configuration in backend"
git commit -m "docs: update API documentation"
git commit -m "style: format code with Black"
git commit -m "test: add unit tests for Task1"

# Bad
git commit -m "fixed stuff"
git commit -m "updates"
```

### Branch Naming
```
feature/new-task-endpoint
bugfix/cors-issue
docs/api-documentation
chore/update-dependencies
```

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing Done
Describe testing performed

## Checklist
- [ ] Code follows style guidelines
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No breaking changes
```

## 📊 Repository Settings

### Branch Protection Rules
1. Go to Settings → Branches
2. Add rule for `main` branch:
   - Require pull request reviews
   - Require status checks to pass
   - Require branches to be up to date

### Secrets & Variables
Add in Settings → Secrets and variables:
```
DEPLOY_KEY
API_TOKEN
DATABASE_URL
```

## 📈 Tracking Progress

### Milestones
Create milestones for major releases:
- v1.0 - MVP Release
- v1.1 - Performance Improvements
- v2.0 - Major Feature Release

### Project Board
Use GitHub Projects to track:
- Backlog
- In Progress
- Review
- Done

## 🔍 Code Quality

### GitHub Actions for Linting

**Frontend** (`.github/workflows/lint-frontend.yml`)
```yaml
name: Lint Frontend
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd frontend && npm install && npm run lint
```

**Backend** (`.github/workflows/lint-backend.yml`)
```yaml
name: Lint Backend
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
      - run: |
          cd backend
          pip install flake8 black
          black --check .
          flake8 .
```

## 🚀 Release Management

### Version Tagging
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### Create Release Notes
1. Go to Releases
2. Click "Create a new release"
3. Select tag
4. Write release notes
5. Mark as latest release

## 📞 Community

### README Badges
```markdown
![GitHub](https://img.shields.io/badge/github-repo-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/python-3.8+-blue)
![React](https://img.shields.io/badge/react-18.2+-blue)
![Status](https://img.shields.io/badge/status-active-success)
```

### Support Channels
- Issues: Bug reports and features
- Discussions: General questions
- Email: support@example.com

---

**Last Updated**: May 2024
