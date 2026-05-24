import React, { useState } from 'react';
import axios from 'axios';
import PredictionCard from '../components/PredictionCard';
import { FaIndustry, FaDollarSign, FaBoxes, FaClock, FaChartLine, FaSpinner } from 'react-icons/fa';
import './TaskPage.css';
import { apiUrl } from '../config/api';

function Task6() {
  const [formData, setFormData] = useState({
    production_volume: '',
    production_cost: '',
    supplier_quality: '',
    quality_score: '',
    maintenance_hours: '',
    downtime_percentage: '',
    worker_productivity: ''
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = {
        production_volume: parseFloat(formData.production_volume),
        production_cost: parseFloat(formData.production_cost),
        supplier_quality: parseFloat(formData.supplier_quality),
        quality_score: parseFloat(formData.quality_score),
        maintenance_hours: parseFloat(formData.maintenance_hours),
        downtime_percentage: parseFloat(formData.downtime_percentage),
        worker_productivity: parseFloat(formData.worker_productivity)
      };

      const response = await axios.post(apiUrl('/api/predict/quality-monitor/predict'), data);
      setPrediction(response.data);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Prediction failed. Check inputs and backend.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-page fade-in">
      <div className="task-header">
        <div className="header-content">
          <h1><FaIndustry className="header-icon" /> Quality Control</h1>
          <p>Predict manufacturing defects and quality issues</p>
        </div>
      </div>

      <div className="container">
        <div className="task-content">
          <div className="form-section">
            <h2>Enter Production Metrics</h2>
            <form onSubmit={handleSubmit} className="prediction-form">
              <div className="form-group">
                <label htmlFor="production_volume"><FaBoxes /> Production Volume</label>
                <input type="number" id="production_volume" name="production_volume" value={formData.production_volume} onChange={handleChange} placeholder="e.g., 10000" step="1" required />
              </div>

              <div className="form-group">
                <label htmlFor="production_cost"><FaDollarSign /> Production Cost</label>
                <input type="number" id="production_cost" name="production_cost" value={formData.production_cost} onChange={handleChange} placeholder="e.g., 50000" step="0.01" required />
              </div>

              <div className="form-group">
                <label htmlFor="supplier_quality"><FaChartLine /> Supplier Quality</label>
                <input type="number" id="supplier_quality" name="supplier_quality" value={formData.supplier_quality} onChange={handleChange} placeholder="e.g., 0.95" step="0.01" required />
              </div>

              <div className="form-group">
                <label htmlFor="quality_score">Quality Score</label>
                <input type="number" id="quality_score" name="quality_score" value={formData.quality_score} onChange={handleChange} placeholder="e.g., 87" step="0.1" required />
              </div>

              <div className="form-group">
                <label htmlFor="maintenance_hours"><FaClock /> Maintenance Hours</label>
                <input type="number" id="maintenance_hours" name="maintenance_hours" value={formData.maintenance_hours} onChange={handleChange} placeholder="e.g., 12" step="0.1" required />
              </div>

              <div className="form-group">
                <label htmlFor="downtime_percentage">Downtime Percentage</label>
                <input type="number" id="downtime_percentage" name="downtime_percentage" value={formData.downtime_percentage} onChange={handleChange} placeholder="e.g., 2.5" step="0.1" required />
              </div>

              <div className="form-group">
                <label htmlFor="worker_productivity">Worker Productivity</label>
                <input type="number" id="worker_productivity" name="worker_productivity" value={formData.worker_productivity} onChange={handleChange} placeholder="e.g., 75" step="0.1" required />
              </div>

              <button type="submit" className="form-submit" disabled={loading}>
                {loading ? <><FaSpinner className="spinner" /> Analyzing...</> : 'Predict Quality Risk'}
              </button>
            </form>

            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="info-section">
            <h3>Model Info</h3>
            <p>This model analyzes production metrics to identify likely quality issues and help prioritize inspections.</p>

            {prediction && (
              <div className="prediction-result">
                <h3>Prediction</h3>
                <PredictionCard
                    prediction={{ value: prediction.prediction, history: (prediction.history || null), modelInfo: prediction.model_info || 'Scores quality risk using production and supplier metrics.' }}
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
                  title="Quality Risk"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Task6;
