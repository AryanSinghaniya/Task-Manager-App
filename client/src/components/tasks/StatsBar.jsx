import React, { useEffect, useState } from 'react';
import './stats.css';

const Ring = ({ value }) => {
  const size = 96;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const pct = Math.min(100, Math.max(0, value));
    const to = circumference - (pct / 100) * circumference;
    const id = setTimeout(() => setOffset(to), 50);
    return () => clearTimeout(id);
  }, [value, circumference]);

  const color = value > 70 ? 'var(--stat-success-color)' : value >= 40 ? 'var(--stat-warning-color)' : 'var(--danger)';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="var(--surface-2)" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 900ms ease, stroke 300ms ease' }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" style={{ fontWeight: 700, fontSize: 16, fill: 'var(--text)' }}>
        {value}%
      </text>
    </svg>
  );
};

const StatCard = ({ children }) => (
  <div className="stat-card-analytics">
    {children}
  </div>
);

const StatsBar = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="stats-grid">
        <div className="stat-skel" />
        <div className="stat-skel" />
        <div className="stat-skel" />
        <div className="stat-skel" />
      </div>
    );
  }

  return (
    <div className="stats-grid">
      <StatCard>
        <div className="stat-top">
          <div className="stat-icon">📋</div>
          <div>
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>
      </StatCard>

      <StatCard>
        <div className="stat-top">
          <div className="stat-icon" style={{ color: 'var(--stat-warning-color)' }}>⚡</div>
          <div>
            <div className="stat-number">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
      </StatCard>

      <StatCard>
        <div className="stat-top">
          <div className="stat-icon" style={{ color: 'var(--stat-success-color)' }}>✅</div>
          <div>
            <div className="stat-number">{stats.done}</div>
            <div className="stat-label">Completed</div>
            <div className="stat-sub">+{stats.completedThisWeek} this week</div>
          </div>
        </div>
      </StatCard>

      <StatCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Ring value={stats.completionRate} />
          <div>
            <div className="stat-label">Done Rate</div>
          </div>
        </div>
      </StatCard>
    </div>
  );
};

export default StatsBar;
