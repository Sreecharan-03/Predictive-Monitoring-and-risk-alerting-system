import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';
import './PredictionCard.css';
import ModelViz from './ModelViz';
import ModelChart from './ModelChart';
import PredictionInsights from './PredictionInsights';
import modelInfoMap from '../config/modelInfo';


function PredictionCard({ prediction, predictionText, confidence, riskLevel, title }) {
  const getRiskColor = (risk) => {
    if (risk === 'High') return 'danger';
    if (risk === 'Medium') return 'warning';
    return 'success';
  };

  const getRiskIcon = (risk) => {
    if (risk === 'High') return <FaTimesCircle />;
    if (risk === 'Medium') return <FaExclamationCircle />;
    return <FaCheckCircle />;
  };

  const displayPrediction = (prediction && typeof prediction === 'object') ? (prediction.value ?? '') : prediction;

  return (
    <div className={`prediction-card ${getRiskColor(riskLevel)}`}>
      <div className="prediction-header">
        <div>
          <p className="prediction-eyebrow">Model output</p>
          <h3>{title}</h3>
        </div>
        <div className="risk-badge">
          {getRiskIcon(riskLevel)}
          <span>{riskLevel} Risk</span>
        </div>
      </div>

      <div className="prediction-content">
        <div className="prediction-item">
          <label>Prediction</label>
          <div className="prediction-value-row">
            <p className="prediction-value">{displayPrediction}</p>
          </div>
          {predictionText && <p className="prediction-text">{predictionText}</p>}
        </div>

        <div className="prediction-item">
          <label>Confidence</label>
          <div className="confidence-bar">
            <div
              className="confidence-fill"
              style={{ width: `${confidence * 100}%` }}
            ></div>
          </div>
          <p className="confidence-text">{(confidence * 100).toFixed(2)}%</p>
        </div>
      </div>

      <div className="prediction-summary">
        <div className="prediction-summary-panel">
          <div className="prediction-summary-heading">Model summary</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
            {prediction?.history ? (
              <ModelChart data={prediction.history} />
            ) : (
              <ModelViz series={prediction?.history} score={confidence} />
            )}
            </div>
            <div style={{ width: 240 }}>
              <div style={{ fontWeight: 900, marginBottom: 6, color: 'var(--text-primary)' }}>About this model</div>
              <div className="prediction-summary-copy">
                {prediction?.modelInfo || modelInfoMap[title] || `This model predicts ${title || 'the target'} using historical features and returns a confidence score.`}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PredictionInsights
        prediction={prediction}
        confidence={confidence}
        riskLevel={riskLevel}
        title={title}
      />
    </div>
  );
}

export default PredictionCard;
