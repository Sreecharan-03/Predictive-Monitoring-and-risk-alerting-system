import React, { useState } from 'react';
import axios from 'axios';
import PredictionCard from '../components/PredictionCard';
import { FaHeartbeat, FaSpinner, FaCalendarAlt, FaWeight, FaTint } from 'react-icons/fa';
import './TaskPage.css';
import { apiUrl } from '../config/api';

function Task4() {
  const [formData, setFormData] = useState({
    gender: 'Male',
    age: '',
    hypertension: '0',
    heart_disease: '0',
    ever_married: 'Yes',
    work_type: 'Private',
    residence_type: 'Urban',
    avg_glucose_level: '',
    bmi: '',
    smoking_status: 'never smoked'
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = {
        gender: formData.gender,
        age: parseFloat(formData.age),
        hypertension: parseFloat(formData.hypertension),
        heart_disease: parseFloat(formData.heart_disease),
        ever_married: formData.ever_married,
        work_type: formData.work_type,
        residence_type: formData.residence_type,
        avg_glucose_level: parseFloat(formData.avg_glucose_level),
        bmi: parseFloat(formData.bmi),
        smoking_status: formData.smoking_status
      };
      
      const response = await axios.post(apiUrl('/api/predict/health-tracker/predict'), data);
      setPrediction(response.data);
    } catch (err) {
      setError('Error making prediction. Please check your inputs and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-page fade-in">
      <div className="task-header">
        <div className="header-content">
          <h1><FaHeartbeat className="header-icon" /> Patient Health Tracker</h1>
          <p>Monitor patient health indicators and assess stroke risk</p>
        </div>
      </div>

      <div className="container">
        <div className="task-content">
          <div className="form-section">
            <h2>Enter Health Information</h2>
            <form onSubmit={handleSubmit} className="prediction-form">
              <div className="form-group">
                <label htmlFor="age">
                  <FaCalendarAlt /> Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g., 45"
                  step="1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="hypertension">
                  <FaTint /> Hypertension
                </label>
                <select
                  id="hypertension"
                  name="hypertension"
                  value={formData.hypertension}
                  onChange={handleChange}
                >
                  <option value="0">No Hypertension</option>
                  <option value="1">Has Hypertension</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="heart_disease">
                  <FaHeartbeat /> Heart Disease
                </label>
                <select
                  id="heart_disease"
                  name="heart_disease"
                  value={formData.heart_disease}
                  onChange={handleChange}
                >
                  <option value="0">No Heart Disease</option>
                  <option value="1">Has Heart Disease</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="ever_married">Ever Married</label>
                <select id="ever_married" name="ever_married" value={formData.ever_married} onChange={handleChange}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="work_type">Work Type</label>
                <select id="work_type" name="work_type" value={formData.work_type} onChange={handleChange}>
                  <option value="Private">Private</option>
                  <option value="Self-employed">Self-employed</option>
                  <option value="Govt_job">Govt_job</option>
                  <option value="children">Children</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="residence_type">Residence Type</label>
                <select id="residence_type" name="residence_type" value={formData.residence_type} onChange={handleChange}>
                  <option value="Urban">Urban</option>
                  <option value="Rural">Rural</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="avg_glucose_level">
                  <FaTint /> Average Glucose Level (mg/dL)
                </label>
                <input
                  type="number"
                  id="avg_glucose_level"
                  name="avg_glucose_level"
                  value={formData.avg_glucose_level}
                  onChange={handleChange}
                  placeholder="e.g., 120"
                  step="0.1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="bmi">
                  <FaWeight /> BMI
                </label>
                <input
                  type="number"
                  id="bmi"
                  name="bmi"
                  value={formData.bmi}
                  onChange={handleChange}
                  placeholder="e.g., 25"
                  step="0.1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="smoking_status">Smoking Status</label>
                <select id="smoking_status" name="smoking_status" value={formData.smoking_status} onChange={handleChange}>
                  <option value="never smoked">Never smoked</option>
                  <option value="formerly smoked">Formerly smoked</option>
                  <option value="smokes">Smokes</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>

              <button type="submit" className="form-submit" disabled={loading}>
                {loading ? (
                  <>
                    <FaSpinner className="spinner" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FaHeartbeat /> Assess Health Risk
                  </>
                )}
              </button>
            </form>

            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="info-section">
            <h3>About This Model</h3>
            <p>The Patient Health Tracker uses machine learning to analyze patient health metrics and predict potential stroke risk based on medical indicators.</p>
            
            <h3 style={{marginTop: '25px'}}>Health Metrics Analyzed</h3>
            <ul className="features-list">
              <li><FaCalendarAlt /> Age and Demographics</li>
              <li><FaTint /> Hypertension Status</li>
              <li><FaHeartbeat /> Heart Disease History</li>
              <li><FaTint /> Glucose Levels</li>
              <li><FaWeight /> BMI Classification</li>
            </ul>

            {prediction && (
              <div className="prediction-result">
                <h3 style={{marginTop: '25px'}}>Health Assessment</h3>
                <PredictionCard
                  prediction={{ value: prediction.prediction, history: (prediction.history || null), modelInfo: prediction.model_info || 'Analyzes patient health metrics to estimate stroke and readmission risk.' }}
                  predictionText={prediction.prediction_text}
                  confidence={(prediction.confidence || 0) / 100}
                  riskLevel={(() => {
                    const rl = prediction.risk_level || '';
                    if (typeof rl === 'string') {
                      const lower = rl.toLowerCase();
                      if (lower.includes('high')) return 'High';
                      if (lower.includes('medium')) return 'Medium';
                    }
                    return 'Low';
                  })()}
                  title="Stroke Risk Analysis"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Task4;
