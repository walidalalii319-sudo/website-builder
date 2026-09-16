import React, { useState, useEffect, useMemo } from 'react';
import './Analytics.css';

// --- Mock Data Generators ---
const generateTimeSeries = (points, min, max) => 
  Array.from({ length: points }, (_, i) => ({
    time: `${i}:00`,
    value: Math.floor(Math.random() * (max - min + 1)) + min
  }));

const mockSources = [
  { name: 'Organic Search', value: 45, color: '#4F46E5' },
  { name: 'Direct', value: 25, color: '#10B981' },
  { name: 'Social Media', value: 15, color: '#F59E0B' },
  { name: 'Referral', value: 10, color: '#EF4444' },
  { name: 'Email', value: 5, color: '#8B5CF6' },
];

const mockGeo = [
  { country: 'United States', visitors: 1240, bounce: '42%' },
  { country: 'United Kingdom', visitors: 850, bounce: '38%' },
  { country: 'Germany', visitors: 620, bounce: '45%' },
  { country: 'India', visitors: 510, bounce: '52%' },
  { country: 'Canada', visitors: 340, bounce: '35%' },
];

const mockFunnels = [
  { stage: 'Page View', users: 10000, conversion: 100 },
  { stage: 'Product View', users: 4500, conversion: 45 },
  { stage: 'Add to Cart', users: 1200, conversion: 12 },
  { stage: 'Checkout', users: 800, conversion: 8 },
  { stage: 'Purchase', users: 350, conversion: 3.5 },
];

const mockErrors = [
  { id: 1, type: 'TypeError', message: "Cannot read property 'map' of undefined", url: '/products', count: 24, lastSeen: '2m ago' },
  { id: 2, type: 'NetworkError', message: "Failed to fetch API endpoint /api/cart", url: '/checkout', count: 12, lastSeen: '15m ago' },
  { id: 3, type: 'ReferenceError', message: "variable 'config' is not defined", url: '/dashboard', count: 5, lastSeen: '1h ago' },
];

const mockExperiments = [
  { id: 1, name: 'Hero Button Color', status: 'Active', variants: [{ name: 'Original (Blue)', conversions: 120 }, { name: 'Variant A (Red)', conversions: 145 }] },
  { id: 2, name: 'Pricing Table Layout', status: 'Paused', variants: [{ name: 'Original (Grid)', conversions: 80 }, { name: 'Variant A (List)', conversions: 75 }] },
];

// --- Sub-Components ---

const StatCard = ({ title, value, change, trend }) => (
  <div className="analytics-stat-card">
    <h3>{title}</h3>
    <div className="stat-value">{value}</div>
    <div className={`stat-change ${trend}`}>
      {trend === 'up' ? '↑' : '↓'} {change}
    </div>
  </div>
);

const SimpleBarChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="simple-bar-chart">
      {data.map((item, idx) => (
        <div key={idx} className="bar-container">
          <div 
            className="bar" 
            style={{ height: `${(item.value / max) * 100}%`, backgroundColor: item.color || '#4F46E5' }}
          />
          <div className="bar-label">{item.name || item.time}</div>
        </div>
      ))}
    </div>
  );
};

const FunnelChart = ({ data }) => {
  const maxUsers = data[0].users;
  return (
    <div className="funnel-chart">
      {data.map((step, idx) => (
        <div key={idx} className="funnel-step">
          <div className="funnel-info">
            <span className="stage-name">{step.stage}</span>
            <span className="stage-users">{step.users.toLocaleString()} users</span>
          </div>
          <div className="funnel-bar-bg">
            <div 
              className="funnel-bar-fill" 
              style={{ width: `${step.conversion}%` }}
            />
          </div>
          <div className="funnel-percent">{step.conversion}%</div>
        </div>
      ))}
    </div>
  );
};

const PerformanceMetrics = () => {
  const metrics = [
    { name: 'LCP (Largest Contentful Paint)', value: '1.8s', status: 'good', threshold: '2.5s' },
    { name: 'FID (First Input Delay)', value: '45ms', status: 'good', threshold: '100ms' },
    { name: 'CLS (Cumulative Layout Shift)', value: '0.08', status: 'needs-improvement', threshold: '0.1' },
    { name: 'TTFB (Time to First Byte)', value: '320ms', status: 'good', threshold: '600ms' },
  ];

  return (
    <div className="performance-grid">
      {metrics.map((m, idx) => (
        <div key={idx} className={`perf-card status-${m.status}`}>
          <div className="perf-header">
            <span className="perf-name">{m.name}</span>
            <span className={`perf-badge ${m.status}`}>{m.status.replace('-', ' ').toUpperCase()}</span>
          </div>
          <div className="perf-value">{m.value}</div>
          <div className="perf-threshold">Target: &lt; {m.threshold}</div>
        </div>
      ))}
    </div>
  );
};

const ErrorTable = ({ errors }) => (
  <div className="data-table-container">
    <table className="data-table">
      <thead>
        <tr>
          <th>Type</th>
          <th>Message</th>
          <th>URL</th>
          <th>Count</th>
          <th>Last Seen</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {errors.map(err => (
          <tr key={err.id}>
            <td><span className="badge error">{err.type}</span></td>
            <td className="truncate">{err.message}</td>
            <td>{err.url}</td>
            <td>{err.count}</td>
            <td>{err.lastSeen}</td>
            <td><button className="btn-sm">Debug</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ABTestManager = ({ experiments }) => (
  <div className="ab-tests-container">
    {experiments.map(exp => (
      <div key={exp.id} className="ab-test-card">
        <div className="ab-header">
          <h4>{exp.name}</h4>
          <span className={`status-badge ${exp.status.toLowerCase()}`}>{exp.status}</span>
        </div>
        <div className="ab-variants">
          {exp.variants.map((v, idx) => (
            <div key={idx} className="variant-row">
              <span>{v.name}</span>
              <div className="variant-stats">
                <span className="conversions">{v.conversions} conv.</span>
                <div className="mini-bar">
                  <div style={{ width: `${Math.min(100, v.conversions)}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="ab-actions">
          <button className="btn-sm">Edit</button>
          <button className="btn-sm secondary">Stop</button>
          <button className="btn-sm primary">Declare Winner</button>
        </div>
      </div>
    ))}
  </div>
);

const HeatmapSimulator = () => {
  // Simulates a heatmap overlay on a generic page structure
  return (
    <div className="heatmap-container">
      <div className="heatmap-overlay">
        <div className="mock-page">
          <div className="mock-hero" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(255,0,0,0.4), transparent 60%)' }}>
            <div className="mock-element hot" style={{ top: '30%', left: '45%' }}></div>
          </div>
          <div className="mock-grid">
            <div className="mock-card" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(255,0,0,0.3), transparent 50%)' }}></div>
            <div className="mock-card" style={{ background: 'radial-gradient(circle at 20% 80%, rgba(255,0,0,0.2), transparent 50%)' }}></div>
            <div className="mock-card"></div>
          </div>
          <div className="mock-footer" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,0,0,0.1), transparent 40%)' }}></div>
        </div>
      </div>
      <div className="heatmap-legend">
        <span>Low Interaction</span>
        <div className="gradient-bar"></div>
        <span>High Interaction</span>
      </div>
    </div>
  );
};

// --- Main Component ---

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');
  
  const trafficData = useMemo(() => generateTimeSeries(7, 200, 800), []);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'funnels', label: 'Funnels' },
    { id: 'performance', label: 'Performance' },
    { id: 'errors', label: 'Error Tracking' },
    { id: 'ab-testing', label: 'A/B Testing' },
    { id: 'heatmaps', label: 'Heatmaps' },
  ];

  return (
    <div className="analytics-module">
      <header className="analytics-header">
        <h2>Analytics & Monitoring</h2>
        <div className="controls">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="select-input">
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button className="btn-primary">Export Report</button>
        </div>
      </header>

      <nav className="analytics-tabs">
        {tabs.map(tab => (
          <button 
            key={tab.id} 
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="analytics-content">
        {activeTab === 'overview' && (
          <>
            <div className="stats-grid">
              <StatCard title="Total Visitors" value="24,592" change="12.5%" trend="up" />
              <StatCard title="Page Views" value="89,431" change="8.2%" trend="up" />
              <StatCard title="Bounce Rate" value="42.3%" change="2.1%" trend="down" />
              <StatCard title="Avg. Session" value="2m 14s" change="5.4%" trend="up" />
            </div>
            
            <div className="charts-row">
              <div className="chart-card large">
                <h3>Traffic Overview</h3>
                <SimpleBarChart data={trafficData} />
              </div>
              <div className="chart-card">
                <h3>Traffic Sources</h3>
                <SimpleBarChart data={mockSources} />
              </div>
            </div>

            <div className="geo-row">
              <h3>Top Locations</h3>
              <div className="data-table-container">
                <table className="data-table">
                  <thead><tr><th>Country</th><th>Visitors</th><th>Bounce Rate</th></tr></thead>
                  <tbody>
                    {mockGeo.map((g, i) => (
                      <tr key={i}><td>{g.country}</td><td>{g.visitors.toLocaleString()}</td><td>{g.bounce}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'funnels' && (
          <div className="funnel-view">
            <h3>Conversion Funnel: E-commerce Purchase</h3>
            <FunnelChart data={mockFunnels} />
            <div className="funnel-insights">
              <h4>Insights</h4>
              <p>⚠️ High drop-off detected between <strong>Add to Cart</strong> and <strong>Checkout</strong>. Consider simplifying the cart review step.</p>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="perf-view">
            <h3>Core Web Vitals</h3>
            <PerformanceMetrics />
            <div className="perf-history">
              <h3>Performance History</h3>
              <SimpleBarChart data={generateTimeSeries(14, 85, 100)} />
            </div>
          </div>
        )}

        {activeTab === 'errors' && (
          <div className="errors-view">
            <div className="error-summary">
              <StatCard title="Total Errors (24h)" value="41" change="5%" trend="down" />
              <StatCard title="Affected Users" value="18" change="2%" trend="down" />
            </div>
            <ErrorTable errors={mockErrors} />
          </div>
        )}

        {activeTab === 'ab-testing' && (
          <div className="ab-view">
            <div className="ab-header-actions">
              <h3>Active Experiments</h3>
              <button className="btn-primary">+ New Experiment</button>
            </div>
            <ABTestManager experiments={mockExperiments} />
          </div>
        )}

        {activeTab === 'heatmaps' && (
          <div className="heatmap-view">
            <h3>Click Heatmap: Homepage</h3>
            <HeatmapSimulator />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
