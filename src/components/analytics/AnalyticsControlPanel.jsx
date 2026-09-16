import React, { useState } from 'react';
import './Analytics.css';

/**
 * AnalyticsControlPanel - Inspector panel for controlling analytics elements
 * Provides full customization of charts, tables, KPIs, maps, funnels, and heatmaps
 */

const AnalyticsControlPanel = ({ element, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState('data');
  const [localConfig, setLocalConfig] = useState(element?.config || {});

  const tabs = [
    { id: 'data', label: '📊 Data', icon: 'database' },
    { id: 'design', label: '🎨 Design', icon: 'palette' },
    { id: 'interactivity', label: '⚡ Interactivity', icon: 'zap' },
    { id: 'advanced', label: '⚙️ Advanced', icon: 'settings' }
  ];

  const handleConfigChange = (key, value) => {
    const newConfig = { ...localConfig, [key]: value };
    setLocalConfig(newConfig);
    if (onUpdate) onUpdate(newConfig);
  };

  const handleDataChange = (field, value) => {
    const newData = { ...(localConfig.data || {}), [field]: value };
    handleConfigChange('data', newData);
  };

  if (!element) {
    return (
      <div className="analytics-control-panel">
        <div className="panel-empty">
          <p>Select an analytics element to edit its properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-control-panel">
      <div className="panel-header">
        <h3>Analytics Settings</h3>
        <button onClick={onClose} className="btn-close">×</button>
      </div>

      <div className="panel-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="panel-content">
        {activeTab === 'data' && (
          <DataTab 
            type={element.type} 
            config={localConfig} 
            onChange={handleConfigChange}
            onDataChange={handleDataChange}
          />
        )}
        {activeTab === 'design' && (
          <DesignTab 
            type={element.type}
            config={localConfig} 
            onChange={handleConfigChange}
          />
        )}
        {activeTab === 'interactivity' && (
          <InteractivityTab 
            config={localConfig} 
            onChange={handleConfigChange}
          />
        )}
        {activeTab === 'advanced' && (
          <AdvancedTab 
            config={localConfig} 
            onChange={handleConfigChange}
          />
        )}
      </div>
    </div>
  );
};

// --- Data Tab ---

const DataTab = ({ type, config, onChange, onDataChange }) => {
  const dataSources = [
    { value: 'mock', label: '🎭 Mock Data (Built-in)' },
    { value: 'json', label: '📄 JSON File/API' },
    { value: 'csv', label: '📊 CSV File' },
    { value: 'google-sheets', label: '📈 Google Sheets' },
    { value: 'api', label: '🔌 REST API' },
    { value: 'graphql', label: '⚡ GraphQL' }
  ];

  return (
    <div className="tab-content data-tab">
      <div className="control-group">
        <label className="control-label">Element Type</label>
        <select 
          value={type}
          onChange={(e) => onChange('type', e.target.value)}
          className="control-select"
        >
          <option value="chart">📊 Chart</option>
          <option value="table">📋 Table</option>
          <option value="kpi">📈 KPI Card</option>
          <option value="map">🗺️ Map</option>
          <option value="funnel">🔄 Funnel</option>
          <option value="heatmap">🔥 Heatmap</option>
        </select>
      </div>

      <div className="control-group">
        <label className="control-label">Data Source</label>
        <select 
          value={config.dataSource?.type || 'mock'}
          onChange={(e) => onChange('dataSource', { ...config.dataSource, type: e.target.value })}
          className="control-select"
        >
          {dataSources.map(source => (
            <option key={source.value} value={source.value}>{source.label}</option>
          ))}
        </select>
      </div>

      {config.dataSource?.type === 'json' && (
        <>
          <div className="control-group">
            <label className="control-label">JSON URL</label>
            <input
              type="url"
              placeholder="https://api.example.com/data.json"
              value={config.dataSource?.url || ''}
              onChange={(e) => onChange('dataSource', { ...config.dataSource, url: e.target.value })}
              className="control-input"
            />
          </div>
          <div className="control-group">
            <label className="control-label">Or Paste JSON</label>
            <textarea
              placeholder='{"labels": [...], "datasets": [...]}'
              value={config.dataSource?.rawJson || ''}
              onChange={(e) => onChange('dataSource', { ...config.dataSource, rawJson: e.target.value })}
              className="control-textarea code-editor"
              rows="6"
            />
          </div>
        </>
      )}

      {config.dataSource?.type === 'csv' && (
        <>
          <div className="control-group">
            <label className="control-label">CSV URL</label>
            <input
              type="url"
              placeholder="https://example.com/data.csv"
              value={config.dataSource?.url || ''}
              onChange={(e) => onChange('dataSource', { ...config.dataSource, url: e.target.value })}
              className="control-input"
            />
          </div>
          <div className="control-group">
            <label className="control-label">Or Paste CSV</label>
            <textarea
              placeholder="Column1,Column2,Column3&#10;Value1,Value2,Value3"
              value={config.dataSource?.rawCsv || ''}
              onChange={(e) => onChange('dataSource', { ...config.dataSource, rawCsv: e.target.value })}
              className="control-textarea code-editor"
              rows="6"
            />
          </div>
        </>
      )}

      {config.dataSource?.type === 'google-sheets' && (
        <div className="control-group">
          <label className="control-label">Google Sheets ID</label>
          <input
            type="text"
            placeholder="1BxiMvs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
            value={config.dataSource?.sheetId || ''}
            onChange={(e) => onChange('dataSource', { ...config.dataSource, sheetId: e.target.value })}
            className="control-input"
          />
          <p className="control-hint">
            Get the ID from your Google Sheets URL: docs.google.com/spreadsheets/d/<strong>[ID]</strong>/edit
          </p>
        </div>
      )}

      {config.dataSource?.type === 'api' && (
        <>
          <div className="control-group">
            <label className="control-label">API Endpoint</label>
            <input
              type="url"
              placeholder="https://api.example.com/v1/metrics"
              value={config.dataSource?.endpoint || ''}
              onChange={(e) => onChange('dataSource', { ...config.dataSource, endpoint: e.target.value })}
              className="control-input"
            />
          </div>
          <div className="control-group">
            <label className="control-label">Headers (JSON)</label>
            <textarea
              placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
              value={JSON.stringify(config.dataSource?.headers || {}, null, 2)}
              onChange={(e) => {
                try {
                  const headers = JSON.parse(e.target.value);
                  onChange('dataSource', { ...config.dataSource, headers });
                } catch (err) {
                  // Invalid JSON, ignore
                }
              }}
              className="control-textarea code-editor"
              rows="4"
            />
          </div>
        </>
      )}

      {config.dataSource?.type === 'graphql' && (
        <>
          <div className="control-group">
            <label className="control-label">GraphQL Endpoint</label>
            <input
              type="url"
              placeholder="https://api.example.com/graphql"
              value={config.dataSource?.endpoint || ''}
              onChange={(e) => onChange('dataSource', { ...config.dataSource, endpoint: e.target.value })}
              className="control-input"
            />
          </div>
          <div className="control-group">
            <label className="control-label">Query</label>
            <textarea
              placeholder="query { metrics { label value } }"
              value={config.dataSource?.query || ''}
              onChange={(e) => onChange('dataSource', { ...config.dataSource, query: e.target.value })}
              className="control-textarea code-editor"
              rows="6"
            />
          </div>
        </>
      )}

      {/* Direct Data Editing for Mock Data */}
      {(!config.dataSource || config.dataSource?.type === 'mock') && type === 'chart' && (
        <div className="control-group">
          <label className="control-label">Chart Data (JSON)</label>
          <textarea
            value={JSON.stringify(config.data || {}, null, 2)}
            onChange={(e) => {
              try {
                const data = JSON.parse(e.target.value);
                onDataChange('data', data);
              } catch (err) {
                // Invalid JSON, ignore
              }
            }}
            className="control-textarea code-editor"
            rows="10"
          />
        </div>
      )}

      <div className="control-group">
        <button className="btn-primary full-width" onClick={() => alert('Data refreshed!')}>
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
};

// --- Design Tab ---

const DesignTab = ({ type, config, onChange }) => {
  return (
    <div className="tab-content design-tab">
      {type === 'chart' && (
        <>
          <div className="control-group">
            <label className="control-label">Chart Type</label>
            <div className="button-group">
              {['bar', 'line', 'area', 'pie', 'doughnut', 'radar'].map(chartType => (
                <button
                  key={chartType}
                  className={`btn-option ${config.chartType === chartType ? 'active' : ''}`}
                  onClick={() => onChange('chartType', chartType)}
                >
                  {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label className="control-label">Height (px)</label>
            <input
              type="number"
              min="100"
              max="800"
              value={config.height || 300}
              onChange={(e) => onChange('height', parseInt(e.target.value))}
              className="control-input"
            />
          </div>

          <div className="control-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={config.showLegend !== false}
                onChange={(e) => onChange('showLegend', e.target.checked)}
              />
              Show Legend
            </label>
          </div>

          <div className="control-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={config.showTooltips !== false}
                onChange={(e) => onChange('showTooltips', e.target.checked)}
              />
              Show Tooltips
            </label>
          </div>

          <div className="control-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={config.animation !== false}
                onChange={(e) => onChange('animation', e.target.checked)}
              />
              Enable Animations
            </label>
          </div>

          <div className="control-group">
            <label className="control-label">Primary Color</label>
            <input
              type="color"
              value={config.primaryColor || '#4F46E5'}
              onChange={(e) => onChange('primaryColor', e.target.value)}
              className="control-color"
            />
          </div>
        </>
      )}

      {type === 'table' && (
        <>
          <div className="control-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={config.sortable !== false}
                onChange={(e) => onChange('sortable', e.target.checked)}
              />
              Sortable Columns
            </label>
          </div>

          <div className="control-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={config.filterable !== false}
                onChange={(e) => onChange('filterable', e.target.checked)}
              />
              Filterable Search
            </label>
          </div>

          <div className="control-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={config.paginated !== false}
                onChange={(e) => onChange('paginated', e.target.checked)}
              />
              Pagination
            </label>
          </div>

          {config.paginated !== false && (
            <div className="control-group">
              <label className="control-label">Items Per Page</label>
              <input
                type="number"
                min="5"
                max="100"
                value={config.itemsPerPage || 10}
                onChange={(e) => onChange('itemsPerPage', parseInt(e.target.value))}
                className="control-input"
              />
            </div>
          )}

          <div className="control-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={config.striped !== false}
                onChange={(e) => onChange('striped', e.target.checked)}
              />
              Striped Rows
            </label>
          </div>

          <div className="control-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={config.hoverable !== false}
                onChange={(e) => onChange('hoverable', e.target.checked)}
              />
              Hover Effect
            </label>
          </div>
        </>
      )}

      {type === 'kpi' && (
        <>
          <div className="control-group">
            <label className="control-label">Gradient Style</label>
            <select
              value={config.gradient || 'from-indigo-500 to-purple-600'}
              onChange={(e) => onChange('gradient', e.target.value)}
              className="control-select"
            >
              <option value="from-indigo-500 to-purple-600">Indigo → Purple</option>
              <option value="from-blue-500 to-cyan-500">Blue → Cyan</option>
              <option value="from-green-500 to-emerald-500">Green → Emerald</option>
              <option value="from-orange-500 to-red-500">Orange → Red</option>
              <option value="from-pink-500 to-rose-500">Pink → Rose</option>
            </select>
          </div>

          <div className="control-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={config.showIcon !== false}
                onChange={(e) => onChange('showIcon', e.target.checked)}
              />
              Show Icon
            </label>
          </div>
        </>
      )}

      {type === 'map' && (
        <>
          <div className="control-group">
            <label className="control-label">Map Type</label>
            <select
              value={config.mapType || 'world'}
              onChange={(e) => onChange('mapType', e.target.value)}
              className="control-select"
            >
              <option value="world">World Map</option>
              <option value="country">Country Map</option>
              <option value="region">Region Map</option>
            </select>
          </div>

          <div className="control-group">
            <label className="control-label">Visualization</label>
            <select
              value={config.visualization || 'choropleth'}
              onChange={(e) => onChange('visualization', e.target.value)}
              className="control-select"
            >
              <option value="choropleth">Choropleth (Color-coded)</option>
              <option value="marker">Markers</option>
              <option value="heatmap">Heatmap</option>
            </select>
          </div>
        </>
      )}

      {(type === 'funnel' || type === 'heatmap') && (
        <div className="control-group">
          <p className="control-hint">
            {type === 'funnel' 
              ? 'Funnel stages are auto-calculated from your data. Edit the data in the Data tab.'
              : 'Heatmap intensity is based on click interaction data.'}
          </p>
        </div>
      )}
    </div>
  );
};

// --- Interactivity Tab ---

const InteractivityTab = ({ config, onChange }) => {
  return (
    <div className="tab-content interactivity-tab">
      <div className="control-group">
        <label className="control-label">Click Action</label>
        <select
          value={config.clickAction || 'none'}
          onChange={(e) => onChange('clickAction', e.target.value)}
          className="control-select"
        >
          <option value="none">No Action</option>
          <option value="link">Open Link</option>
          <option value="modal">Open Modal</option>
          <option value="filter">Filter Other Charts</option>
          <option value="drilldown">Drill Down</option>
        </select>
      </div>

      {config.clickAction === 'link' && (
        <div className="control-group">
          <label className="control-label">URL</label>
          <input
            type="url"
            placeholder="https://example.com/details"
            value={config.clickUrl || ''}
            onChange={(e) => onChange('clickUrl', e.target.value)}
            className="control-input"
          />
          <div className="control-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={config.openInNewTab || false}
                onChange={(e) => onChange('openInNewTab', e.target.checked)}
              />
              Open in New Tab
            </label>
          </div>
        </div>
      )}

      {config.clickAction === 'modal' && (
        <div className="control-group">
          <label className="control-label">Modal ID</label>
          <input
            type="text"
            placeholder="modal-details"
            value={config.modalId || ''}
            onChange={(e) => onChange('modalId', e.target.value)}
            className="control-input"
          />
        </div>
      )}

      <div className="control-group">
        <label className="control-label">Tooltip Format</label>
        <select
          value={config.tooltipFormat || 'default'}
          onChange={(e) => onChange('tooltipFormat', e.target.value)}
          className="control-select"
        >
          <option value="default">Default</option>
          <option value="percentage">Percentage</option>
          <option value="currency">Currency ($)</option>
          <option value="custom">Custom Template</option>
        </select>
      </div>

      {config.tooltipFormat === 'custom' && (
        <div className="control-group">
          <label className="control-label">Tooltip Template</label>
          <textarea
            placeholder="{{label}}: {{value}} ({{percent}}%)"
            value={config.tooltipTemplate || ''}
            onChange={(e) => onChange('tooltipTemplate', e.target.value)}
            className="control-textarea"
            rows="3"
          />
          <p className="control-hint">
            Available variables: {'{{label}}'}, {'{{value}}'}, {'{{percent}}'}
          </p>
        </div>
      )}

      <div className="control-group">
        <label className="control-label">Refresh Interval</label>
        <select
          value={config.refreshInterval || 'manual'}
          onChange={(e) => onChange('refreshInterval', e.target.value)}
          className="control-select"
        >
          <option value="manual">Manual Only</option>
          <option value="30">Every 30 seconds</option>
          <option value="60">Every minute</option>
          <option value="300">Every 5 minutes</option>
          <option value="900">Every 15 minutes</option>
          <option value="3600">Every hour</option>
        </select>
      </div>

      <div className="control-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={config.enableZoom || false}
            onChange={(e) => onChange('enableZoom', e.target.checked)}
          />
          Enable Zoom/Pan (for maps & large charts)
        </label>
      </div>

      <div className="control-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={config.exportable !== false}
            onChange={(e) => onChange('exportable', e.target.checked)}
          />
          Show Export Button
        </label>
      </div>
    </div>
  );
};

// --- Advanced Tab ---

const AdvancedTab = ({ config, onChange }) => {
  return (
    <div className="tab-content advanced-tab">
      <div className="control-group">
        <label className="control-label">Custom CSS Class</label>
        <input
          type="text"
          placeholder="my-custom-chart"
          value={config.customClass || ''}
          onChange={(e) => onChange('customClass', e.target.value)}
          className="control-input"
        />
      </div>

      <div className="control-group">
        <label className="control-label">Custom JSON Config</label>
        <textarea
          placeholder='{"responsive": true, "maintainAspectRatio": false}'
          value={config.customConfig || ''}
          onChange={(e) => {
            try {
              const customConfig = JSON.parse(e.target.value);
              onChange('customConfig', customConfig);
            } catch (err) {
              // Invalid JSON, ignore
            }
          }}
          className="control-textarea code-editor"
          rows="6"
        />
        <p className="control-hint">
          Advanced configuration for Chart.js compatible options
        </p>
      </div>

      <div className="control-group">
        <label className="control-label">Custom JavaScript Hook</label>
        <textarea
          placeholder="// Transform data before rendering&#10;function transformData(data) {&#10;  return data.map(item => ({...item, value: item.value * 2}));&#10;}"
          value={config.customJS || ''}
          onChange={(e) => onChange('customJS', e.target.value)}
          className="control-textarea code-editor"
          rows="8"
        />
        <p className="control-hint">
          Write custom JS to transform data or add interactivity
        </p>
      </div>

      <div className="control-group">
        <label className="control-label">Data Transformation</label>
        <select
          value={config.transform || 'none'}
          onChange={(e) => onChange('transform', e.target.value)}
          className="control-select"
        >
          <option value="none">None</option>
          <option value="sort-asc">Sort Ascending</option>
          <option value="sort-desc">Sort Descending</option>
          <option value="normalize">Normalize (0-100)</option>
          <option value="percentage">Convert to Percentage</option>
          <option value="aggregate">Aggregate by Category</option>
        </select>
      </div>

      <div className="control-group">
        <button 
          className="btn-danger full-width"
          onClick={() => {
            if (confirm('Reset all settings to defaults?')) {
              onChange('reset', true);
            }
          }}
        >
          🗑️ Reset to Defaults
        </button>
      </div>

      <div className="control-group info-box">
        <h4>💡 Pro Tips</h4>
        <ul>
          <li>Use Custom JS to connect to any API</li>
          <li>Combine multiple charts for dashboards</li>
          <li>Set refresh intervals for real-time data</li>
          <li>Use click actions to create interactive reports</li>
        </ul>
      </div>
    </div>
  );
};

export default AnalyticsControlPanel;
