import React, { useState, useEffect, useRef } from 'react';
import './Analytics.css';

/**
 * AnalyticsElement - A fully customizable analytics component for the website builder
 * Supports: Charts, Tables, KPI Cards, Maps, Funnels, Heatmaps
 * Fully controllable via props and inspector panel
 */

const AnalyticsElement = ({ 
  elementId,
  type = 'chart', // chart, table, kpi, map, funnel, heatmap
  config = {},
  onDataChange,
  isPreview = false,
  selected = false,
  onSelect
}) => {
  const [data, setData] = useState(config.data || generateDefaultData(type));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

  // Generate default data based on type
  function generateDefaultData(chartType) {
    const generators = {
      chart: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Visitors',
          data: [65, 59, 80, 81, 56, 55],
          backgroundColor: 'rgba(79, 70, 229, 0.2)',
          borderColor: 'rgba(79, 70, 229, 1)',
          borderWidth: 2,
          fill: true
        }]
      },
      table: {
        columns: ['Page', 'Views', 'Bounce Rate', 'Avg. Time'],
        rows: [
          ['/home', '12,450', '42%', '2m 14s'],
          ['/products', '8,320', '38%', '3m 05s'],
          ['/about', '4,210', '55%', '1m 32s'],
          ['/contact', '2,890', '48%', '2m 45s']
        ]
      },
      kpi: {
        title: 'Total Visitors',
        value: '24,592',
        change: '+12.5%',
        trend: 'up',
        icon: '👥'
      },
      map: {
        type: 'world',
        visualization: 'choropleth',
        data: [
          { country: 'US', value: 1240, color: '#4F46E5' },
          { country: 'GB', value: 850, color: '#10B981' },
          { country: 'DE', value: 620, color: '#F59E0B' },
          { country: 'IN', value: 510, color: '#EF4444' },
          { country: 'CA', value: 340, color: '#8B5CF6' }
        ]
      },
      funnel: {
        stages: [
          { name: 'Page View', value: 10000, conversion: 100 },
          { name: 'Product View', value: 4500, conversion: 45 },
          { name: 'Add to Cart', value: 1200, conversion: 12 },
          { name: 'Checkout', value: 800, conversion: 8 },
          { name: 'Purchase', value: 350, conversion: 3.5 }
        ]
      },
      heatmap: {
        page: 'homepage',
        intensity: 'medium'
      }
    };
    return generators[chartType] || generators.chart;
  }

  // Fetch data from external source
  useEffect(() => {
    if (config.dataSource && config.dataSource.type !== 'mock') {
      fetchExternalData(config.dataSource);
    }
  }, [config.dataSource]);

  async function fetchExternalData(source) {
    setLoading(true);
    setError(null);
    
    try {
      let responseData;
      
      switch (source.type) {
        case 'json':
          if (source.url) {
            const res = await fetch(source.url);
            responseData = await res.json();
          } else if (source.rawJson) {
            responseData = JSON.parse(source.rawJson);
          }
          break;
          
        case 'csv':
          if (source.url) {
            const res = await fetch(source.url);
            const csvText = await res.text();
            responseData = parseCSV(csvText);
          } else if (source.rawCsv) {
            responseData = parseCSV(source.rawCsv);
          }
          break;
          
        case 'api':
          if (source.endpoint) {
            const res = await fetch(source.endpoint, {
              headers: source.headers || {}
            });
            responseData = await res.json();
          }
          break;
          
        case 'google-sheets':
          if (source.sheetId) {
            const sheetUrl = `https://docs.google.com/spreadsheets/d/${source.sheetId}/gviz/tq?tqx=out:json`;
            const res = await fetch(sheetUrl);
            const text = await res.text();
            const jsonText = text.substring(47).slice(0, -2);
            responseData = JSON.parse(jsonText).table;
          }
          break;
          
        default:
          responseData = generateDefaultData(type);
      }
      
      setData(responseData);
      if (onDataChange) onDataChange(responseData);
    } catch (err) {
      setError(`Failed to load data: ${err.message}`);
      setData(generateDefaultData(type));
    } finally {
      setLoading(false);
    }
  }

  function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(line => 
      line.split(',').map(cell => cell.trim())
    );
    return { columns: headers, rows };
  }

  // Render based on type
  function renderContent() {
    if (loading) {
      return (
        <div className="analytics-loading">
          <div className="spinner"></div>
          <span>Loading data...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="analytics-error">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={() => fetchExternalData(config.dataSource)} className="btn-retry">
            Retry
          </button>
        </div>
      );
    }

    switch (type) {
      case 'chart':
        return renderChart();
      case 'table':
        return renderTable();
      case 'kpi':
        return renderKPI();
      case 'map':
        return renderMap();
      case 'funnel':
        return renderFunnel();
      case 'heatmap':
        return renderHeatmap();
      default:
        return renderChart();
    }
  }

  function renderChart() {
    const { chartType = 'bar', showLegend = true, showTooltips = true, animation = true } = config;
    const { labels, datasets } = data;
    
    if (!datasets || datasets.length === 0) {
      return <div className="no-data">No chart data available</div>;
    }

    const maxValue = Math.max(...datasets.flatMap(d => d.data));
    const chartHeight = config.height || 300;

    return (
      <div className="chart-container" style={{ height: `${chartHeight}px` }}>
        <canvas ref={canvasRef} width="800" height={chartHeight}></canvas>
        
        {/* Simple SVG-based chart rendering */}
        <svg width="100%" height={chartHeight} className="chart-svg">
          {chartType === 'bar' && datasets.map((dataset, setIdx) => (
            <g key={setIdx}>
              {dataset.data.map((value, idx) => {
                const barWidth = (800 / labels.length) * 0.7;
                const barHeight = (value / maxValue) * (chartHeight - 40);
                const x = (800 / labels.length) * idx + (800 / labels.length - barWidth) / 2;
                const y = chartHeight - barHeight - 20;
                
                return (
                  <g key={idx}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      fill={dataset.backgroundColor || dataset.borderColor || '#4F46E5'}
                      rx="4"
                      className={`chart-bar ${animation ? 'animate-grow' : ''}`}
                      style={{ transformOrigin: 'bottom' }}
                    />
                    {showTooltips && (
                      <text
                        x={x + barWidth / 2}
                        y={y - 8}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#666"
                      >
                        {value}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          ))}
          
          {chartType === 'line' && datasets.map((dataset, setIdx) => {
            const points = dataset.data.map((value, idx) => {
              const x = (800 / (labels.length - 1)) * idx;
              const y = chartHeight - ((value / maxValue) * (chartHeight - 40)) - 20;
              return `${x},${y}`;
            }).join(' ');
            
            return (
              <g key={setIdx}>
                <polyline
                  points={points}
                  fill="none"
                  stroke={dataset.borderColor || '#4F46E5'}
                  strokeWidth={dataset.borderWidth || 2}
                  className={animation ? 'animate-draw' : ''}
                />
                {dataset.fill && (
                  <polygon
                    points={`0,${chartHeight-20} ${points} 800,${chartHeight-20}`}
                    fill={dataset.backgroundColor || 'rgba(79, 70, 229, 0.1)'}
                  />
                )}
              </g>
            );
          })}
          
          {chartType === 'pie' && renderPieChart(datasets[0], chartHeight)}
        </svg>
        
        {showLegend && (
          <div className="chart-legend">
            {datasets.map((dataset, idx) => (
              <div key={idx} className="legend-item">
                <span 
                  className="legend-color" 
                  style={{ backgroundColor: dataset.borderColor || dataset.backgroundColor }}
                ></span>
                <span className="legend-label">{dataset.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function renderPieChart(dataset, size) {
    const total = dataset.data.reduce((sum, val) => sum + val, 0);
    let cumulativeAngle = 0;
    const center = size / 2;
    const radius = (size - 60) / 2;

    return dataset.data.map((value, idx) => {
      const angle = (value / total) * 360;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + angle;
      cumulativeAngle = endAngle;

      const startX = center + radius * Math.cos((startAngle - 90) * Math.PI / 180);
      const startY = center + radius * Math.sin((startAngle - 90) * Math.PI / 180);
      const endX = center + radius * Math.cos((endAngle - 90) * Math.PI / 180);
      const endY = center + radius * Math.sin((endAngle - 90) * Math.PI / 180);

      const largeArcFlag = angle > 180 ? 1 : 0;
      const pathData = `M ${center} ${center} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;

      const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
      
      return (
        <path
          key={idx}
          d={pathData}
          fill={dataset.backgroundColor?.[idx] || colors[idx % colors.length]}
          stroke="#fff"
          strokeWidth="2"
        />
      );
    });
  }

  function renderTable() {
    const { columns, rows } = data;
    const { 
      sortable = true, 
      filterable = true, 
      paginated = true,
      itemsPerPage = 10,
      striped = true,
      hoverable = true
    } = config;

    const [sortCol, setSortCol] = useState(null);
    const [sortDir, setSortDir] = useState('asc');
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(0);

    let filteredRows = rows || [];
    
    if (filter && filterable) {
      filteredRows = filteredRows.filter(row =>
        row.some(cell => cell.toLowerCase().includes(filter.toLowerCase()))
      );
    }

    if (sortCol !== null && sortable) {
      filteredRows.sort((a, b) => {
        const aVal = a[sortCol];
        const bVal = b[sortCol];
        const numA = parseFloat(aVal.replace(/[^0-9.-]/g, ''));
        const numB = parseFloat(bVal.replace(/[^0-9.-]/g, ''));
        
        if (!isNaN(numA) && !isNaN(numB)) {
          return sortDir === 'asc' ? numA - numB : numB - numA;
        }
        return sortDir === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      });
    }

    const totalPages = paginated ? Math.ceil(filteredRows.length / itemsPerPage) : 1;
    const displayedRows = paginated 
      ? filteredRows.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
      : filteredRows;

    return (
      <div className="table-container">
        {filterable && (
          <input
            type="text"
            placeholder="Search table..."
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setCurrentPage(0); }}
            className="table-filter"
          />
        )}
        
        <table className={`data-table ${striped ? 'striped' : ''} ${hoverable ? 'hoverable' : ''}`}>
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th 
                  key={idx}
                  onClick={() => sortable && handleSort(idx)}
                  className={sortable ? 'sortable' : ''}
                >
                  {col}
                  {sortCol === idx && (
                    <span className="sort-indicator">{sortDir === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedRows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        {paginated && totalPages > 1 && (
          <div className="table-pagination">
            <button 
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="btn-page"
            >
              Previous
            </button>
            <span className="page-info">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="btn-page"
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  }

  function handleSort(colIdx) {
    if (sortCol === colIdx) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(colIdx);
      setSortDir('asc');
    }
  }

  function renderKPI() {
    const { title, value, change, trend, icon } = data;
    const { gradient = 'from-indigo-500 to-purple-600', showIcon = true } = config;

    return (
      <div className={`kpi-card gradient-${gradient}`}>
        {showIcon && icon && <div className="kpi-icon">{icon}</div>}
        <div className="kpi-content">
          <h3 className="kpi-title">{title}</h3>
          <div className="kpi-value">{value}</div>
          <div className={`kpi-change ${trend}`}>
            {trend === 'up' ? '↑' : '↓'} {change}
          </div>
        </div>
      </div>
    );
  }

  function renderMap() {
    const { type, visualization, data } = data;
    
    return (
      <div className="map-container">
        <div className="map-placeholder">
          <svg viewBox="0 0 800 400" className="world-map-svg">
            {/* Simplified world map outline */}
            <path
              d="M150,120 Q200,100 250,120 T350,140 T450,130 T550,150 T650,140 T750,160 L750,280 Q650,300 550,280 T450,290 T350,270 T250,280 T150,260 Z"
              fill="#e5e7eb"
              stroke="#9ca3af"
              strokeWidth="2"
            />
            {visualization === 'marker' && data.map((point, idx) => {
              const x = 150 + (idx * 120);
              const y = 200 + (Math.random() * 60 - 30);
              return (
                <g key={idx}>
                  <circle cx={x} cy={y} r="8" fill={point.color} className="map-marker" />
                  <text x={x} y={y - 12} textAnchor="middle" fontSize="10" fill="#333">
                    {point.country}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="map-legend">
          <span>Interactive Map Preview</span>
        </div>
      </div>
    );
  }

  function renderFunnel() {
    const { stages } = data;
    const maxUsers = stages[0]?.value || 1000;

    return (
      <div className="funnel-chart">
        {stages.map((stage, idx) => {
          const widthPercent = (stage.value / maxUsers) * 100;
          return (
            <div key={idx} className="funnel-step">
              <div className="funnel-label">
                <span className="stage-name">{stage.name}</span>
                <span className="stage-value">{stage.value.toLocaleString()}</span>
              </div>
              <div className="funnel-bar-bg">
                <div 
                  className="funnel-bar-fill"
                  style={{ 
                    width: `${widthPercent}%`,
                    backgroundColor: `hsl(${220 + idx * 20}, 70%, 60%)`
                  }}
                />
              </div>
              <div className="funnel-conversion">
                {stage.conversion}%
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function renderHeatmap() {
    return (
      <div className="heatmap-container">
        <div className="heatmap-overlay">
          <div className="mock-page-layout">
            <div className="mock-header" style={{ background: 'radial-gradient(circle at 70% 50%, rgba(239,68,68,0.4), transparent 60%)' }}></div>
            <div className="mock-hero" style={{ background: 'radial-gradient(circle at 50% 40%, rgba(79,70,229,0.5), transparent 50%)' }}>
              <div className="mock-cta" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(245,158,11,0.6), transparent 40%)' }}></div>
            </div>
            <div className="mock-grid">
              <div className="mock-item" style={{ background: 'radial-gradient(circle at 30% 60%, rgba(16,185,129,0.3), transparent 50%)' }}></div>
              <div className="mock-item"></div>
              <div className="mock-item" style={{ background: 'radial-gradient(circle at 80% 40%, rgba(139,92,246,0.3), transparent 50%)' }}></div>
            </div>
            <div className="mock-footer" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(239,68,68,0.2), transparent 40%)' }}></div>
          </div>
        </div>
        <div className="heatmap-legend">
          <span>Cold</span>
          <div className="heatmap-gradient"></div>
          <span>Hot</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`analytics-element ${selected ? 'selected' : ''} ${isPreview ? 'preview' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelect && !isPreview) onSelect(elementId);
      }}
      data-element-id={elementId}
      data-type="analytics"
    >
      <div className="analytics-element-header">
        <span className="element-type-badge">{type.toUpperCase()}</span>
        {!isPreview && selected && (
          <div className="element-actions">
            <button className="btn-edit" title="Edit in Inspector">⚙️</button>
          </div>
        )}
      </div>
      <div className="analytics-element-body">
        {renderContent()}
      </div>
    </div>
  );
};

export default AnalyticsElement;
