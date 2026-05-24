import React, { useState } from 'react';
import axios from 'axios';
import PredictionCard from '../components/PredictionCard';
import { FaBolt, FaSpinner, FaThermometerHalf, FaTachometerAlt, FaTools } from 'react-icons/fa';
import './TaskPage.css';
import { apiUrl } from '../config/api';

function Task1() {
  const [formData, setFormData] = useState({
    air_temperature: '',
    process_temperature: '',
    rotational_speed: '',
    torque: '',
    tool_wear: '',
    type: 'L',
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
      // Convert values to numbers and use backend field names
      const data = {
        air_temperature_k: parseFloat(formData.air_temperature),
        process_temperature_k: parseFloat(formData.process_temperature),
        rotational_speed_rpm: parseFloat(formData.rotational_speed),
        torque_nm: parseFloat(formData.torque),
        tool_wear: parseFloat(formData.tool_wear),
        type: formData.type,
      };

      const response = await axios.post(apiUrl('/api/predict/predictive-maintenance/predict'), data);
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
          <h1><FaBolt className="header-icon" /> Equipment Failure Predictor</h1>
          <p>Predict equipment failures before they happen using advanced machine learning</p>
        </div>
      </div>

      <div className="container">
        <div className="task-content">
          <div className="form-section">
            <h2>Enter Equipment Parameters</h2>
            <form onSubmit={handleSubmit} className="prediction-form">
              <div className="form-group">
                <label htmlFor="air_temperature">
                  <FaThermometerHalf /> Air Temperature (K)
                </label>
                <input
                  type="number"
                  id="air_temperature"
                  name="air_temperature"
                  value={formData.air_temperature}
                  onChange={handleChange}
                  placeholder="e.g., 298"
                  step="0.1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="process_temperature">
                  <FaThermometerHalf /> Process Temperature (K)
                </label>
                <input
                  type="number"
                  id="process_temperature"
                  name="process_temperature"
                  value={formData.process_temperature}
                  onChange={handleChange}
                  placeholder="e.g., 308"
                  step="0.1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="rotational_speed">
                  <FaTachometerAlt /> Rotational Speed (rpm)
                </label>
                <input
                  type="number"
                  id="rotational_speed"
                  name="rotational_speed"
                  value={formData.rotational_speed}
                  onChange={handleChange}
                  placeholder="e.g., 2500"
                  step="1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="torque">
                  <FaTools /> Torque (Nm)
                </label>
                <input
                  type="number"
                  id="torque"
                  name="torque"
                  value={formData.torque}
                  onChange={handleChange}
                  placeholder="e.g., 40"
                  step="0.1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="tool_wear">Tool Wear (min)</label>
                <input
                  type="number"
                  id="tool_wear"
                  name="tool_wear"
                  value={formData.tool_wear}
                  onChange={handleChange}
                  placeholder="e.g., 30"
                  step="0.1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">
                  <FaBolt /> Equipment Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="L">Low (L)</option>
                  <option value="M">Medium (M)</option>
                  <option value="H">High (H)</option>
                </select>
              </div>

              <button type="submit" className="form-submit" disabled={loading}>
                {loading ? (
                  <>
                    <FaSpinner className="spinner" />
                    Predicting...
                  </>
                ) : (
                  <>
                    <FaBolt /> Predict Failure Risk
                  </>
                )}
              </button>
            </form>

            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="info-section">
            <h3>About This Model</h3>
            <p>The Equipment Failure Predictor uses machine learning to analyze equipment parameters and predict potential failures before they occur.</p>
            
            <h3 style={{marginTop: '25px'}}>Key Features</h3>
            <ul className="features-list">
              <li><FaThermometerHalf /> Temperature Monitoring</li>
              <li><FaTachometerAlt /> Speed Analysis</li>
              <li><FaTools /> Torque Measurement</li>
              <li><FaBolt /> Risk Classification</li>
            </ul>

            {prediction && (
              <div className="prediction-result">
                <h3 style={{marginTop: '25px'}}>Prediction Result</h3>
                <PredictionCard
                  prediction={{ value: prediction.prediction, history: (prediction.history || null), modelInfo: prediction.model_info || 'Predicts equipment failure using sensor readings and historical patterns.' }}
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
                  title="Failure Risk Assessment"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Task1;
