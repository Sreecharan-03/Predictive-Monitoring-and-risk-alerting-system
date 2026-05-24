import React, { useState } from 'react';
import axios from 'axios';
import PredictionCard from '../components/PredictionCard';
import { FaTruck, FaSpinner, FaBox, FaClock, FaDollarSign, FaIndustry } from 'react-icons/fa';
import './TaskPage.css';
import { apiUrl } from '../config/api';

function Task5() {
  const [formData, setFormData] = useState({
    stock_levels: '',
    lead_times: '',
    order_quantities: '',
    shipping_times: '',
    shipping_costs: '',
    production_volumes: '',
    manufacturing_lead_time: '',
    defect_rates: '',
    supplier_name: 'Supplier 1',
    transportation_mode: 'Road'
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
        stock_levels: parseFloat(formData.stock_levels),
        lead_times: parseFloat(formData.lead_times),
        order_quantities: parseFloat(formData.order_quantities),
        shipping_times: parseFloat(formData.shipping_times),
        shipping_costs: parseFloat(formData.shipping_costs),
        production_volumes: parseFloat(formData.production_volumes),
        manufacturing_lead_time: parseFloat(formData.manufacturing_lead_time),
        defect_rates: parseFloat(formData.defect_rates),
        supplier_name: formData.supplier_name,
        transportation_mode: formData.transportation_mode
      };
      
      const response = await axios.post(apiUrl('/api/predict/logistics-optimizer/predict'), data);
      setPrediction(response.data);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Error making prediction. Please check your inputs and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-page fade-in">
      <div className="task-header">
        <div className="header-content">
          <h1><FaTruck className="header-icon" /> Logistics Optimizer</h1>
          <p>Optimize supply chain and predict disruption risks</p>
        </div>
      </div>

      <div className="container">
        <div className="task-content">
          <div className="form-section">
            <h2>Enter Supply Chain Metrics</h2>
            <form onSubmit={handleSubmit} className="prediction-form">
              <div className="form-group">
                <label htmlFor="stock_levels">
                  <FaBox /> Stock Levels
                </label>
                <input
                  type="number"
                  id="stock_levels"
                  name="stock_levels"
                  value={formData.stock_levels}
                  onChange={handleChange}
                  placeholder="e.g., 1000"
                  step="1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lead_times">
                  <FaClock /> Lead Times (days)
                </label>
                <input
                  type="number"
                  id="lead_times"
                  name="lead_times"
                  value={formData.lead_times}
                  onChange={handleChange}
                  placeholder="e.g., 15"
                  step="0.1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="order_quantities">
                  <FaBox /> Order Quantities
                </label>
                <input
                  type="number"
                  id="order_quantities"
                  name="order_quantities"
                  value={formData.order_quantities}
                  onChange={handleChange}
                  placeholder="e.g., 500"
                  step="1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="shipping_times">
                  <FaTruck /> Shipping Times (days)
                </label>
                <input
                  type="number"
                  id="shipping_times"
                  name="shipping_times"
                  value={formData.shipping_times}
                  onChange={handleChange}
                  placeholder="e.g., 7"
                  step="0.1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="shipping_costs">
                  <FaDollarSign /> Shipping Costs
                </label>
                <input
                  type="number"
                  id="shipping_costs"
                  name="shipping_costs"
                  value={formData.shipping_costs}
                  onChange={handleChange}
                  placeholder="e.g., 500"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="production_volumes">
                  <FaIndustry /> Production Volumes
                </label>
                <input
                  type="number"
                  id="production_volumes"
                  name="production_volumes"
                  value={formData.production_volumes}
                  onChange={handleChange}
                  placeholder="e.g., 2000"
                  step="1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="manufacturing_lead_time">
                  <FaClock /> Manufacturing Lead Time (days)
                </label>
                <input
                  type="number"
                  id="manufacturing_lead_time"
                  name="manufacturing_lead_time"
                  value={formData.manufacturing_lead_time}
                  onChange={handleChange}
                  placeholder="e.g., 10"
                  step="0.1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="defect_rates">
                  <FaBox /> Defect Rates (%)
                </label>
                <input
                  type="number"
                  id="defect_rates"
                  name="defect_rates"
                  value={formData.defect_rates}
                  onChange={handleChange}
                  placeholder="e.g., 2.5"
                  step="0.1"
                  min="0"
                  max="100"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="supplier_name">Supplier</label>
                <select id="supplier_name" name="supplier_name" value={formData.supplier_name} onChange={handleChange}>
                  <option>Supplier 1</option>
                  <option>Supplier 2</option>
                  <option>Supplier 3</option>
                  <option>Supplier 4</option>
                  <option>Supplier 5</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="transportation_mode">Transportation Mode</label>
                <select id="transportation_mode" name="transportation_mode" value={formData.transportation_mode} onChange={handleChange}>
                  <option>Air</option>
                  <option>Rail</option>
                  <option>Road</option>
                  <option>Sea</option>
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
                    <FaTruck /> Predict Supply Chain Risk
                  </>
                )}
              </button>
            </form>

            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="info-section">
            <h3>About This Model</h3>
            <p>The Logistics Optimizer analyzes supply chain metrics to predict disruption risks and optimize inventory management.</p>
            
            <h3 style={{marginTop: '25px'}}>Supply Chain Metrics</h3>
            <ul className="features-list">
              <li><FaBox /> Inventory Levels</li>
              <li><FaClock /> Lead Times & Schedules</li>
              <li><FaTruck /> Shipping & Transport</li>
              <li><FaDollarSign /> Cost Analysis</li>
              <li><FaIndustry /> Production Capacity</li>
            </ul>

            {prediction && (
              <div className="prediction-result">
                <h3 style={{marginTop: '25px'}}>Supply Chain Assessment</h3>
                {
                  // Normalize backend response to props expected by PredictionCard
                }
                <PredictionCard
                  prediction={{ value: prediction.prediction, history: (prediction.history || null), modelInfo: prediction.model_info || 'Estimates disruption likelihood from inventory, lead times, and transport data.' }}
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
                  title="Disruption Risk Analysis"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Task5;
