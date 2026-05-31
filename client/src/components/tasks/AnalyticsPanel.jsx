import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import './stats.css';

const AnalyticsPanel = ({ weeklyData, priorityData, loading }) => {
  const [open, setOpen] = useState(false);

  const hasWeeklyData = Array.isArray(weeklyData) && weeklyData.some((d) => (d.created || d.completed));
  const hasPriorityData = Array.isArray(priorityData) && priorityData.some((p) => p.value && p.value > 0);
  const hasData = hasWeeklyData || hasPriorityData;

  useEffect(() => {
    // auto-open analytics when data becomes available
    if (hasData) setOpen(true);
  }, [hasData]);

  useEffect(() => {
    console.debug('AnalyticsPanel weeklyData:', weeklyData);
    console.debug('AnalyticsPanel priorityData:', priorityData);
  }, [weeklyData, priorityData]);

  return (
    <div className="analytics-panel">
      <button className="analytics-toggle button button--ghost" onClick={() => setOpen((s) => !s)} disabled={loading}>
        📊 {open ? 'Hide Analytics ▲' : 'View Analytics ▼'}
      </button>

      <div className={`analytics-collapse ${open ? 'is-open' : ''}`} style={{ maxHeight: open ? 420 : 0 }}>
        <div className="analytics-grid">
          <div className="analytics-chart">
            <h4>Activity This Week</h4>
            {hasWeeklyData ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
                  <Legend />
                  <Bar dataKey="created" fill="#6366f1" name="Created" radius={[4,4,0,0]} />
                  <Bar dataKey="completed" fill="#22c55e" name="Completed" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="analytics-empty">No activity yet — create tasks to populate this chart.</div>
            )}
          </div>

          <div className="analytics-chart">
            <h4>By Priority</h4>
            {hasPriorityData ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={priorityData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {Array.isArray(priorityData) && priorityData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="analytics-empty">No priority data yet — set priorities on tasks to see distribution.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
