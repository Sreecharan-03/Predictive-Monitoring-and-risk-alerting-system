# Predictive Monitoring & Risk Alerting System

An end-to-end AI dashboard for risk prediction across six domains. Each task has its own trained pickle model, dataset, and prediction route, with a responsive React UI and a FastAPI backend.

## What this project includes

- Six independent prediction models
- A responsive React frontend with task-specific forms
- A FastAPI backend that serves all prediction endpoints
- Pickled models, scalers, and label encoders stored per task
- A cleaner Task 2 form based on the server downtime notebook
- Prediction cards with confidence, risk level, and model context

## Project Layout

```text
Tekworks-Project-1/
├── frontend/
├── backend/
├── task-1/
├── task-2/
├── task-3/
├── task-4/
├── task-5/
├── task-6/
└── README.md
```

## Model and Dataset Details

| Task | Domain | Dataset | Saved Model | Notes |
|---|---|---|---|---|
| Task 1 | Equipment failure | `task-1/ai4i_predictive_maintenance.csv` | `task-1/model.pkl` | Predicts machine failure from sensor readings |
| Task 2 | Server downtime | `task-2/Train_data.csv` | `task-2/model.pkl` | Uses `label_encoder.pkl` for categorical encoding |
| Task 3 | Student dropout | `task-3/student_dropout_dataset_v3.csv` | `task-3/model.pkl` | Notebook cleans missing values, outliers, and encodes categorical variables |
| Task 4 | Stroke / health risk | `task-4/stroke.csv` | `task-4/stroke_model.pkl` | Uses `task-4/scaler.pkl` for preprocessing |
| Task 5 | Supply chain disruption | `task-5/supply_chain_data.csv` | `task-5/model.pkl` | Supply chain risk prediction model |
| Task 6 | Manufacturing defects | `task-6/manufacturing_defect_dataset.csv` | `task-6/model.pkl` | Predicts defect risk in production data |

## Task 2 Model Information

The server downtime model was trained in `task-2/main.ipynb` using:

- `RandomForestClassifier`
- `LabelEncoder` for `protocol_type`, `service`, and `flag`
- The target column: `class`

### Notebook preprocessing notes

The notebook keeps these important columns:

- `protocol_type`
- `service`
- `flag`
- `src_bytes`
- `dst_bytes`
- `logged_in`
- `count`
- `srv_count`
- `serror_rate`
- `srv_serror_rate`
- `same_srv_rate`
- `diff_srv_rate`
- `dst_host_count`
- `dst_host_srv_count`
- `dst_host_same_srv_rate`
- `dst_host_diff_srv_rate`
- `dst_host_serror_rate`
- `dst_host_srv_serror_rate`
- `rerror_rate`
- `srv_rerror_rate`

The current frontend shows the 10 most important inputs, and the backend fills the remaining model columns with default values before prediction. Categorical values are encoded using the saved label encoder and the training category mappings.

### Task 2 visible frontend inputs

- Protocol Type
- Service Type
- Connection Flag
- Incoming Traffic
- Outgoing Traffic
- Login Status
- Number of Connections
- Service Request Count
- Server Error Rate
- Connection Error Rate

## How the backend works

The FastAPI backend loads each pickle model at startup and exposes prediction routes under `/api/predict/...`. The Task 2 route accepts the form values, encodes categorical fields, fills the remaining model features, and returns:

- prediction
- prediction text
- confidence
- risk level
- model info

## API Endpoints

### Health

```text
GET /health
```

### Prediction routes

```text
POST /api/predict/predictive-maintenance/predict
POST /api/predict/server-monitoring/predict
POST /api/predict/student-risk/predict
POST /api/predict/health-monitoring/predict
POST /api/predict/supply-chain/predict
POST /api/predict/quality-assurance/predict
```

### Status

```text
GET /api/status/models
```

## Running Locally

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
pip install -r requirements.txt
python run.py
```

The backend is configured to run on `http://localhost:8001` in this workspace.

## Example Task 2 Request

```json
{
  "protocol_type": "tcp",
  "service": "http",
  "flag": "SF",
  "src_bytes": 491,
  "dst_bytes": 0,
  "logged_in": 1,
  "count": 2,
  "srv_count": 2,
  "serror_rate": 0,
  "rerror_rate": 0
}
```

## Troubleshooting

- If prediction fails, confirm the backend is running on port 8001.
- If a model does not load, check the pickle file paths in `backend/app/config.py`.
- If Task 2 categorical values fail, confirm the values match the training notebook categories.
- If the frontend looks stale, rebuild it with `npm run build`.

## Tech Stack

- Frontend: React, React Router, Axios, React Icons
- Backend: FastAPI, Uvicorn, Pydantic
- ML: scikit-learn, pandas, numpy

## Documentation

- `DOCUMENTATION_INDEX.md` for a guided map of the docs
- `QUICK_START.md` for a short setup path
- `SETUP_GUIDE.md` for detailed configuration
- `DEPLOYMENT_GUIDE.md` for production setup

## License

Proprietary and confidential.

