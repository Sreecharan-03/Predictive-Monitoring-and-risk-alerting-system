import React, { useState } from 'react';
import axios from 'axios';
import PredictionCard from '../components/PredictionCard';
import { FaServer, FaSpinner, FaBolt } from 'react-icons/fa';
import './TaskPage.css';
import { apiUrl } from '../config/api';

const PROTOCOL_OPTIONS = ['icmp', 'tcp', 'udp'];
const SERVICE_OPTIONS = ['http', 'private', 'domain_u', 'smtp', 'ftp_data', 'eco_i', 'other'];
const FLAG_OPTIONS = ['SF', 'S0', 'REJ', 'RSTR', 'RSTO', 'other'];

const CATEGORY_FIELDS = [
  { name: 'protocol_type', label: 'Protocol Type', example: 'tcp / udp / icmp', options: PROTOCOL_OPTIONS },
  { name: 'service', label: 'Service Type', example: 'http / private / smtp', options: SERVICE_OPTIONS },
  { name: 'flag', label: 'Connection Flag', example: 'SF / S0 / REJ', options: FLAG_OPTIONS },
];

const NUMERIC_FIELDS = [
  { name: 'src_bytes', label: 'Incoming Traffic', example: '491', step: '1' },
  { name: 'dst_bytes', label: 'Outgoing Traffic', example: '0', step: '1' },
  { name: 'logged_in', label: 'Login Status', example: '0 or 1', min: 0, max: 1, step: 1 },
  { name: 'count', label: 'Number of Connections', example: '2', step: '1' },
  { name: 'srv_count', label: 'Service Request Count', example: '2', step: '1' },
  { name: 'serror_rate', label: 'Server Error Rate', example: '0.00', step: '0.01' },
  { name: 'rerror_rate', label: 'Connection Error Rate', example: '0.00', step: '0.01' },
];

const INITIAL_FORM = {
  protocol_type: 'tcp',
  service: 'http',
  flag: 'SF',
  src_bytes: '',
  dst_bytes: '',
  logged_in: 0,
  count: '',
  srv_count: '',
  serror_rate: '',
  rerror_rate: '',
};

function Task2() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = {
        protocol_type: formData.protocol_type,
        service: formData.service,
        flag: formData.flag,
        src_bytes: parseFloat(formData.src_bytes || 0),
        dst_bytes: parseFloat(formData.dst_bytes || 0),
        logged_in: parseInt(formData.logged_in || 0, 10),
        count: parseFloat(formData.count || 0),
        srv_count: parseFloat(formData.srv_count || 0),
        serror_rate: parseFloat(formData.serror_rate || 0),
        rerror_rate: parseFloat(formData.rerror_rate || 0),
      };

      const response = await axios.post(apiUrl('/api/predict/server-monitoring/predict'), data);
      setPrediction(response.data);
    } catch (err) {
      const detail = err?.response?.data?.detail || err?.response?.data || err?.message || 'Unknown error';
      setError('Error making prediction. ' + (typeof detail === 'string' ? detail : JSON.stringify(detail)));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-page fade-in">
      <div className="task-header">
        <div className="header-content">
          <h1><FaServer className="header-icon" /> System Performance Monitor</h1>
          <p>Predict server downtime using the 10 most important Task 2 columns from the dataset.</p>
        </div>
      </div>

      <div className="container">
        <div className="task-content">
          <div className="form-section">
            <h2>Enter System Parameters</h2>
            <form onSubmit={handleSubmit} className="prediction-form">
              {CATEGORY_FIELDS.map((field) => (
                <div className="form-group" key={field.name}>
                  <label htmlFor={field.name}>
                    <span>{field.label}</span>
                  </label>
                  <select id={field.name} name={field.name} value={formData[field.name]} onChange={handleChange}>
                    {field.options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}

              {NUMERIC_FIELDS.map((field) => (
                <div className="form-group" key={field.name}>
                  <label htmlFor={field.name}>
                    <span>{field.label}</span>
                  </label>
                  <input
                    type="number"
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    min={field.min}
                    max={field.max}
                    step={field.step || '1'}
                    placeholder={field.example}
                  />
                </div>
              ))}

              <button type="submit" className="form-submit" disabled={loading}>
                {loading ? (
                  <>
                    <FaSpinner className="spinner" />
                    Predicting...
                  </>
                ) : (
                  <>
                    <FaServer /> Predict Performance Risk
                  </>
                )}
              </button>
            </form>

            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="info-section">
            <h3>About This Model</h3>
            <p>The System Performance Monitor uses the trained Task 2 random forest model to classify normal vs anomaly based on the dataset columns from your notebook.</p>

            <h3 style={{ marginTop: '25px' }}>Model Inputs</h3>
            <ul className="features-list">
              <li><FaBolt /> 10 important columns are shown in the form</li>
              <li><FaBolt /> Categorical values are encoded to match training</li>
              <li><FaBolt /> Remaining model columns are filled with default values in the backend</li>
            </ul>

            {prediction && (
              <div className="prediction-result">
                <h3 style={{ marginTop: '25px' }}>Prediction Result</h3>
                <PredictionCard
                  prediction={{
                    value: prediction.prediction,
                    history: (prediction.history || null),
                    modelInfo: prediction.model_info || 'Uses the Task 2 random forest classifier trained on the dataset columns.'
                  }}
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
                  title="Performance Assessment"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Task2;
