import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area } from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  const value = payload[0]?.value;

  return (
    <div style={{ background: '#fff', border: '1px solid rgba(17,24,39,0.12)', borderRadius: 14, boxShadow: '0 12px 30px rgba(15,23,42,0.12)', padding: '10px 12px' }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Observation {label}</div>
      <div style={{ fontWeight: 900, color: 'var(--text-primary)' }}>{typeof value === 'number' ? value.toFixed(3) : value}</div>
    </div>
  );
}

export default function ModelChart({ data = [] }) {
  // If data is an array of numbers, convert to {value, index}
  const series = Array.isArray(data) ? data.map((v, i) => ({ value: v, name: i })) : data;

  if (!series || series.length === 0) return null;

  return (
    <div style={{ width: '100%', height: 180, minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
          <defs>
            <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(17,24,39,0.06)" />
          <XAxis
            dataKey="name"
            tick={{ fill: 'rgba(17,24,39,0.58)', fontSize: 12 }}
            tickFormatter={(value) => `#${value}`}
          />
          <YAxis tick={{ fill: 'rgba(17,24,39,0.58)', fontSize: 12 }} width={38} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="value" stroke="transparent" fill="url(#gradBlue)" />
          <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 2, stroke: '#fff', fill: '#2563eb' }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
