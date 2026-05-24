import React from 'react';
import './ModelViz.css';

// Simple SVG sparkline + mini bar visualization
function Sparkline({ data = [], width = 220, height = 48, stroke = '#2563eb' }) {
  if (!data || data.length === 0) {
    data = [0.2, 0.45, 0.35, 0.6, 0.5, 0.72];
  }
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  const lastValue = data[data.length - 1];

  return (
    <svg className="viz-spark" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" width="100%" height={height}>
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <circle cx={(data.length - 1) / (data.length - 1) * width} cy={height - ((lastValue - min) / range) * height} r="3.6" fill={stroke} />
    </svg>
  );
}

function MiniBar({ value = 0.6, color = '#06b6d4' }) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <div className="viz-mini-bar">
      <div className="viz-mini-bar-track">
        <div className="viz-mini-bar-fill" style={{ width: `${pct * 100}%`, background: `linear-gradient(90deg, ${color}, #14b8a6)` }} />
      </div>
      <div className="viz-mini-bar-label">{Math.round(pct * 100)}%</div>
    </div>
  );
}

export default function ModelViz({ series, score }) {
  return (
    <div className="model-viz">
      <div className="viz-left">
        <Sparkline data={series} />
      </div>
      <div className="viz-right">
        <MiniBar value={typeof score === 'number' ? score : 0.6} />
      </div>
    </div>
  );
}
