import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const COLORS = ['#2563eb', '#ef4444', '#0f9d58'];

function InsightTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div style={{ background: '#fff', border: '1px solid rgba(17,24,39,0.12)', borderRadius: 14, boxShadow: '0 12px 30px rgba(15,23,42,0.12)', padding: '10px 12px' }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{payload[0].name}</div>
      <div style={{ fontWeight: 900, color: 'var(--text-primary)' }}>{payload[0].value.toFixed(1)}%</div>
    </div>
  );
}

function BarTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div style={{ background: '#fff', border: '1px solid rgba(17,24,39,0.12)', borderRadius: 14, boxShadow: '0 12px 30px rgba(15,23,42,0.12)', padding: '10px 12px' }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{payload[0].name}</div>
      <div style={{ fontWeight: 900, color: 'var(--text-primary)' }}>{payload[0].value.toFixed(1)}%</div>
    </div>
  );
}

function getRiskPressure(riskLevel) {
  if (riskLevel === 'High') return 82;
  if (riskLevel === 'Medium') return 56;
  return 24;
}

export default function PredictionInsights({ prediction, confidence, riskLevel, title }) {
  const confidencePercent = Math.max(0, Math.min(100, (confidence || 0) * 100));
  const uncertaintyPercent = Math.max(0, 100 - confidencePercent);
  const riskPressure = getRiskPressure(riskLevel);

  const donutData = [
    { name: 'Confidence', value: confidencePercent },
    { name: 'Uncertainty', value: uncertaintyPercent },
  ];

  const barData = [
    { name: 'Confidence', value: confidencePercent },
    { name: 'Risk pressure', value: riskPressure },
    { name: 'Uncertainty', value: uncertaintyPercent },
  ];

  const verdict = riskLevel === 'High' ? 'The model is signaling elevated risk.' : riskLevel === 'Medium' ? 'The model suggests a balanced watch zone.' : 'The model is currently leaning toward a safer outcome.';

  return (
    <div className="prediction-insights">
      <div className="prediction-insights-panel">
        <div className="prediction-summary-heading">Prediction breakdown</div>
        <div className="prediction-insights-copy prediction-insights-copy--stacked">
          <div className="prediction-insights-title">Why this matters</div>
          <p>{verdict}</p>
          <p>
            <strong>{title}</strong> is being evaluated using its own domain features, then translated into a risk level and confidence score that are easier to act on.
          </p>
          <div className="prediction-insight-chip-row">
            <span className="prediction-insight-chip">Risk: {riskLevel}</span>
            <span className="prediction-insight-chip">Confidence: {confidencePercent.toFixed(1)}%</span>
            <span className="prediction-insight-chip">Uncertainty: {uncertaintyPercent.toFixed(1)}%</span>
          </div>
        </div>

        <div className="prediction-insights-chart prediction-insights-chart--stacked" style={{ minWidth: 0 }}>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={68}
                outerRadius={94}
                paddingAngle={3}
                dataKey="value"
              >
                {donutData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip content={<InsightTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="prediction-insights-center-copy">
            <strong>{confidencePercent.toFixed(1)}%</strong>
            <span>confidence</span>
          </div>
        </div>
      </div>

      <div className="prediction-insights-panel">
        <div className="prediction-summary-heading">Model signal bars</div>
        <div style={{ width: '100%', height: 220, minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 8, right: 8, left: -6, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(17,24,39,0.06)" />
              <XAxis dataKey="name" tick={{ fill: 'rgba(17,24,39,0.58)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'rgba(17,24,39,0.58)', fontSize: 12 }} width={34} />
              <Tooltip content={<BarTooltip />} />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={index === 0 ? '#2563eb' : index === 1 ? '#ef4444' : '#0f9d58'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
