import { useState, useEffect } from 'react';
import './FormIntegrations.css';

/**
 * Form Integrations Service
 * Handles connections to external services: Email, CRM, Analytics, Webhooks, etc.
 */
class FormIntegrationService {
  constructor() {
    this.integrations = this.loadIntegrations();
    this.webhookQueue = [];
    this.retryAttempts = 3;
    this.retryDelay = 1000;
  }

  loadIntegrations() {
    const stored = localStorage.getItem('formIntegrations');
    return stored ? JSON.parse(stored) : {
      slack: { enabled: false, webhookUrl: '' },
      discord: { enabled: false, webhookUrl: '' },
      zapier: { enabled: false, webhookUrl: '' },
      make: { enabled: false, webhookUrl: '' },
      googleSheets: { enabled: false, spreadsheetId: '', scriptId: '' },
      airtable: { enabled: false, baseId: '', apiKey: '', tableName: '' },
      hubspot: { enabled: false, portalId: '', formId: '' },
      mailchimp: { enabled: false, apiKey: '', audienceId: '' },
      sendgrid: { enabled: false, apiKey: '', fromEmail: '' },
      customWebhook: { enabled: false, url: '', headers: {} }
    };
  }

  saveIntegrations(integrations) {
    this.integrations = integrations;
    localStorage.setItem('formIntegrations', JSON.stringify(integrations));
  }

  async submitToIntegration(type, formData, formConfig) {
    const integration = this.integrations[type];
    if (!integration?.enabled) return { success: false, reason: 'disabled' };

    try {
      switch (type) {
        case 'slack':
          return await this.sendToSlack(integration, formData, formConfig);
        case 'discord':
          return await this.sendToDiscord(integration, formData, formConfig);
        case 'zapier':
        case 'make':
          return await this.sendToWebhook(integration.webhookUrl, formData, formConfig);
        case 'googleSheets':
          return await this.sendToGoogleSheets(integration, formData);
        case 'airtable':
          return await this.sendToAirtable(integration, formData);
        case 'hubspot':
          return await this.sendToHubspot(integration, formData);
        case 'mailchimp':
          return await this.sendToMailchimp(integration, formData);
        case 'sendgrid':
          return await this.sendToSendgrid(integration, formData, formConfig);
        case 'customWebhook':
          return await this.sendToCustomWebhook(integration, formData, formConfig);
        default:
          return { success: false, reason: 'unknown_integration' };
      }
    } catch (error) {
      console.error(`Integration ${type} failed:`, error);
      return { success: false, error: error.message };
    }
  }

  async sendToSlack(config, formData, formConfig) {
    const attachments = [{
      color: '#36a64f',
      title: `New Submission: ${formConfig.name || 'Form'}`,
      fields: Object.entries(formData).map(([key, value]) => ({
        title: key,
        value: String(value),
        short: true
      })),
      footer: formConfig.pageUrl || window.location.href,
      ts: Math.floor(Date.now() / 1000)
    }];

    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attachments })
    });

    return { success: response.ok, data: await response.json() };
  }

  async sendToDiscord(config, formData, formConfig) {
    const embed = {
      title: `New Submission: ${formConfig.name || 'Form'}`,
      color: 0x36a64f,
      fields: Object.entries(formData).map(([key, value]) => ({
        name: key,
        value: String(value).substring(0, 1024),
        inline: true
      })),
      footer: { text: formConfig.pageUrl || window.location.href },
      timestamp: new Date().toISOString()
    };

    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });

    return { success: response.ok, data: await response.json() };
  }

  async sendToWebhook(url, formData, formConfig) {
    const payload = {
      ...formData,
      _metadata: {
        formName: formConfig.name,
        pageUrl: formConfig.pageUrl || window.location.href,
        submittedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ip: '{{client_ip}}'
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return { success: response.ok, data: await response.json() };
  }

  async sendToGoogleSheets(config, formData) {
    const scriptUrl = `https://script.google.com/macros/s/${config.scriptId}/exec`;
    
    const response = await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        spreadsheetId: config.spreadsheetId,
        data: formData
      })
    });

    return { success: true, data: { message: 'Sent to Google Sheets' } };
  }

  async sendToAirtable(config, formData) {
    const url = `https://api.airtable.com/v0/${config.baseId}/${config.tableName}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields: formData })
    });

    return { success: response.ok, data: await response.json() };
  }

  async sendToHubspot(config, formData) {
    const url = `https://api.hsforms.com/submissions/v3/integration/submit/${config.portalId}/${config.formId}`;
    
    const context = {
      pageUri: window.location.href,
      pageName: document.title
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: Object.entries(formData).map(([name, value]) => ({ name, value })),
        context
      })
    });

    return { success: response.ok, data: await response.json() };
  }

  async sendToMailchimp(config, formData) {
    const proxyUrl = '/api/mailchimp/subscribe';
    
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: config.apiKey,
        audienceId: config.audienceId,
        email: formData.email || formData.EMAIL,
        firstName: formData.firstName || formData.FNAME,
        lastName: formData.lastName || formData.LNAME,
        mergeFields: formData
      })
    });

    return { success: response.ok, data: await response.json() };
  }

  async sendToSendgrid(config, formData, formConfig) {
    const proxyUrl = '/api/sendgrid/send';
    
    const emailContent = Object.entries(formData)
      .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
      .join('');

    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: config.apiKey,
        from: config.fromEmail,
        to: formConfig.notificationEmail || config.fromEmail,
        subject: `New Form Submission: ${formConfig.name}`,
        html: emailContent
      })
    });

    return { success: response.ok, data: await response.json() };
  }

  async sendToCustomWebhook(config, formData, formConfig) {
    const headers = {
      'Content-Type': 'application/json',
      ...config.headers
    };

    const payload = {
      event: 'form_submission',
      form: {
        id: formConfig.id,
        name: formConfig.name,
        pageUrl: formConfig.pageUrl || window.location.href
      },
      data: formData,
      timestamp: new Date().toISOString(),
      meta: {
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(config.url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          return { success: true, data: await response.json(), attempt };
        }
      } catch (error) {
        if (attempt === this.retryAttempts) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
      }
    }

    return { success: false, reason: 'max_retries_exceeded' };
  }

  queueWebhook(type, formData, formConfig) {
    this.webhookQueue.push({
      type,
      formData,
      formConfig,
      timestamp: Date.now(),
      attempts: 0
    });
    this.saveQueue();
  }

  async processQueue() {
    while (this.webhookQueue.length > 0) {
      const item = this.webhookQueue[0];
      const result = await this.submitToIntegration(item.type, item.formData, item.formConfig);
      
      if (result.success) {
        this.webhookQueue.shift();
      } else {
        item.attempts++;
        if (item.attempts >= this.retryAttempts) {
          this.webhookQueue.shift();
        }
      }
      this.saveQueue();
    }
  }

  saveQueue() {
    localStorage.setItem('webhookQueue', JSON.stringify(this.webhookQueue));
  }

  getIntegrationStatus() {
    return Object.entries(this.integrations).reduce((acc, [key, value]) => {
      acc[key] = { enabled: value.enabled, configured: this.isConfigured(key, value) };
      return acc;
    }, {});
  }

  isConfigured(type, config) {
    switch (type) {
      case 'slack':
      case 'discord':
      case 'zapier':
      case 'make':
        return !!config.webhookUrl;
      case 'googleSheets':
        return !!config.spreadsheetId && !!config.scriptId;
      case 'airtable':
        return !!config.baseId && !!config.apiKey && !!config.tableName;
      case 'hubspot':
        return !!config.portalId && !!config.formId;
      case 'mailchimp':
        return !!config.apiKey && !!config.audienceId;
      case 'sendgrid':
        return !!config.apiKey && !!config.fromEmail;
      case 'customWebhook':
        return !!config.url;
      default:
        return false;
    }
  }
}

const formIntegrationService = new FormIntegrationService();

// Integration Manager Component
export function IntegrationManager({ onClose }) {
  const [integrations, setIntegrations] = useState(formIntegrationService.integrations);
  const [activeTab, setActiveTab] = useState('overview');
  const [testResult, setTestResult] = useState(null);

  const handleToggle = (type) => {
    const updated = {
      ...integrations,
      [type]: { ...integrations[type], enabled: !integrations[type].enabled }
    };
    setIntegrations(updated);
    formIntegrationService.saveIntegrations(updated);
  };

  const handleConfigChange = (type, field, value) => {
    const updated = {
      ...integrations,
      [type]: { ...integrations[type], [field]: value }
    };
    setIntegrations(updated);
    formIntegrationService.saveIntegrations(updated);
  };

  const handleTestConnection = async (type) => {
    setTestResult({ type, status: 'testing' });
    const result = await formIntegrationService.submitToIntegration(type, { test: true }, { name: 'Test Form' });
    setTestResult({ type, status: result.success ? 'success' : 'error', message: result.error });
    setTimeout(() => setTestResult(null), 3000);
  };

  const integrationTypes = [
    { key: 'slack', name: 'Slack', icon: '💬', description: 'Send submissions to Slack channel' },
    { key: 'discord', name: 'Discord', icon: '🎮', description: 'Send submissions to Discord channel' },
    { key: 'zapier', name: 'Zapier', icon: '⚡', description: 'Connect to 5000+ apps via Zapier' },
    { key: 'make', name: 'Make (Integromat)', icon: '🔗', description: 'Automate workflows with Make' },
    { key: 'googleSheets', name: 'Google Sheets', icon: '📊', description: 'Store submissions in Google Sheets' },
    { key: 'airtable', name: 'Airtable', icon: '🗃️', description: 'Store submissions in Airtable base' },
    { key: 'hubspot', name: 'HubSpot', icon: '🧡', description: 'Create contacts in HubSpot CRM' },
    { key: 'mailchimp', name: 'Mailchimp', icon: '🐵', description: 'Add submitters to Mailchimp audience' },
    { key: 'sendgrid', name: 'SendGrid', icon: '📧', description: 'Send email notifications via SendGrid' },
    { key: 'customWebhook', name: 'Custom Webhook', icon: '🔌', description: 'Send to any custom endpoint' }
  ];

  return (
    <div className="integration-manager">
      <div className="integration-header">
        <h2>🔌 Form Integrations</h2>
        <button onClick={onClose} className="close-btn">×</button>
      </div>

      <div className="integration-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''} 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'configure' ? 'active' : ''} 
          onClick={() => setActiveTab('configure')}
        >
          Configure
        </button>
        <button 
          className={activeTab === 'logs' ? 'active' : ''} 
          onClick={() => setActiveTab('logs')}
        >
          Activity Logs
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="integration-overview">
          <div className="status-summary">
            <div className="stat-card">
              <span className="stat-number">
                {Object.values(integrations).filter(i => i.enabled).length}
              </span>
              <span className="stat-label">Active Integrations</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {Object.values(integrations).filter((v, k) => formIntegrationService.isConfigured(k, v)).length}
              </span>
              <span className="stat-label">Configured</span>
            </div>
          </div>

          <div className="integration-grid">
            {integrationTypes.map(({ key, name, icon, description }) => {
              const config = integrations[key];
              const isConfigured = formIntegrationService.isConfigured(key, config);
              
              return (
                <div key={key} className={`integration-card ${config.enabled ? 'enabled' : ''}`}>
                  <div className="integration-icon">{icon}</div>
                  <h3>{name}</h3>
                  <p>{description}</p>
                  <div className="integration-status">
                    <span className={`status-badge ${config.enabled ? 'active' : 'inactive'}`}>
                      {config.enabled ? 'Active' : 'Inactive'}
                    </span>
                    {isConfigured && <span className="configured-badge">✓ Configured</span>}
                  </div>
                  <div className="integration-actions">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={config.enabled}
                        onChange={() => handleToggle(key)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    {isConfigured && (
                      <button 
                        className="test-btn"
                        onClick={() => handleTestConnection(key)}
                      >
                        Test
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'configure' && (
        <div className="integration-configure">
          {integrationTypes.map(({ key, name, icon }) => {
            const config = integrations[key];
            if (!config.enabled) return null;

            return (
              <div key={key} className="config-section">
                <h3>{icon} {name} Settings</h3>
                
                {key === 'slack' && (
                  <>
                    <div className="form-group">
                      <label>Slack Webhook URL</label>
                      <input
                        type="url"
                        value={config.webhookUrl || ''}
                        onChange={(e) => handleConfigChange(key, 'webhookUrl', e.target.value)}
                        placeholder="https://hooks.slack.com/services/..."
                      />
                      <small>Get this from your Slack app's Incoming Webhooks settings</small>
                    </div>
                  </>
                )}

                {key === 'discord' && (
                  <>
                    <div className="form-group">
                      <label>Discord Webhook URL</label>
                      <input
                        type="url"
                        value={config.webhookUrl || ''}
                        onChange={(e) => handleConfigChange(key, 'webhookUrl', e.target.value)}
                        placeholder="https://discord.com/api/webhooks/..."
                      />
                      <small>Get this from your Discord channel's Integration settings</small>
                    </div>
                  </>
                )}

                {key === 'zapier' && (
                  <>
                    <div className="form-group">
                      <label>Zapier Webhook URL</label>
                      <input
                        type="url"
                        value={config.webhookUrl || ''}
                        onChange={(e) => handleConfigChange(key, 'webhookUrl', e.target.value)}
                        placeholder="https://hooks.zapier.com/hooks/catch/..."
                      />
                      <small>Create a "Catch Hook" trigger in Zapier</small>
                    </div>
                  </>
                )}

                {key === 'make' && (
                  <>
                    <div className="form-group">
                      <label>Make Webhook URL</label>
                      <input
                        type="url"
                        value={config.webhookUrl || ''}
                        onChange={(e) => handleConfigChange(key, 'webhookUrl', e.target.value)}
                        placeholder="https://hook.make.com/..."
                      />
                      <small>Create a Webhook module in Make scenario</small>
                    </div>
                  </>
                )}

                {key === 'googleSheets' && (
                  <>
                    <div className="form-group">
                      <label>Google Spreadsheet ID</label>
                      <input
                        type="text"
                        value={config.spreadsheetId || ''}
                        onChange={(e) => handleConfigChange(key, 'spreadsheetId', e.target.value)}
                        placeholder="1BxiMvs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                      />
                      <small>Found in your Google Sheet URL</small>
                    </div>
                    <div className="form-group">
                      <label>Google Apps Script ID</label>
                      <input
                        type="text"
                        value={config.scriptId || ''}
                        onChange={(e) => handleConfigChange(key, 'scriptId', e.target.value)}
                        placeholder="AKfycbx..."
                      />
                      <small>Deploy a Google Apps Script as Web App</small>
                    </div>
                  </>
                )}

                {key === 'airtable' && (
                  <>
                    <div className="form-group">
                      <label>Airtable Base ID</label>
                      <input
                        type="text"
                        value={config.baseId || ''}
                        onChange={(e) => handleConfigChange(key, 'baseId', e.target.value)}
                        placeholder="appXXXXXXXXXXXXXX"
                      />
                    </div>
                    <div className="form-group">
                      <label>Table Name</label>
                      <input
                        type="text"
                        value={config.tableName || ''}
                        onChange={(e) => handleConfigChange(key, 'tableName', e.target.value)}
                        placeholder="Table 1"
                      />
                    </div>
                    <div className="form-group">
                      <label>API Key</label>
                      <input
                        type="password"
                        value={config.apiKey || ''}
                        onChange={(e) => handleConfigChange(key, 'apiKey', e.target.value)}
                        placeholder="patXXXXXXXXXXXXXX"
                      />
                      <small>Generate from Airtable account settings</small>
                    </div>
                  </>
                )}

                {key === 'hubspot' && (
                  <>
                    <div className="form-group">
                      <label>HubSpot Portal ID</label>
                      <input
                        type="text"
                        value={config.portalId || ''}
                        onChange={(e) => handleConfigChange(key, 'portalId', e.target.value)}
                        placeholder="12345678"
                      />
                    </div>
                    <div className="form-group">
                      <label>HubSpot Form ID</label>
                      <input
                        type="text"
                        value={config.formId || ''}
                        onChange={(e) => handleConfigChange(key, 'formId', e.target.value)}
                        placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                      />
                      <small>Create a form in HubSpot first</small>
                    </div>
                  </>
                )}

                {key === 'mailchimp' && (
                  <>
                    <div className="form-group">
                      <label>Mailchimp API Key</label>
                      <input
                        type="password"
                        value={config.apiKey || ''}
                        onChange={(e) => handleConfigChange(key, 'apiKey', e.target.value)}
                        placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us1"
                      />
                    </div>
                    <div className="form-group">
                      <label>Audience ID</label>
                      <input
                        type="text"
                        value={config.audienceId || ''}
                        onChange={(e) => handleConfigChange(key, 'audienceId', e.target.value)}
                        placeholder="xxxxxxxxxx"
                      />
                    </div>
                  </>
                )}

                {key === 'sendgrid' && (
                  <>
                    <div className="form-group">
                      <label>SendGrid API Key</label>
                      <input
                        type="password"
                        value={config.apiKey || ''}
                        onChange={(e) => handleConfigChange(key, 'apiKey', e.target.value)}
                        placeholder="SG.xxxxxxxxxxxxxxxxxxxx"
                      />
                    </div>
                    <div className="form-group">
                      <label>From Email</label>
                      <input
                        type="email"
                        value={config.fromEmail || ''}
                        onChange={(e) => handleConfigChange(key, 'fromEmail', e.target.value)}
                        placeholder="noreply@yourdomain.com"
                      />
                      <small>Must be verified in SendGrid</small>
                    </div>
                  </>
                )}

                {key === 'customWebhook' && (
                  <>
                    <div className="form-group">
                      <label>Webhook URL</label>
                      <input
                        type="url"
                        value={config.url || ''}
                        onChange={(e) => handleConfigChange(key, 'url', e.target.value)}
                        placeholder="https://your-api.com/webhook"
                      />
                    </div>
                    <div className="form-group">
                      <label>Custom Headers (JSON)</label>
                      <textarea
                        value={JSON.stringify(config.headers || {}, null, 2)}
                        onChange={(e) => {
                          try {
                            const headers = JSON.parse(e.target.value);
                            handleConfigChange(key, 'headers', headers);
                          } catch {}
                        }}
                        rows={4}
                        placeholder='{"Authorization": "Bearer token"}'
                      />
                    </div>
                  </>
                )}

                <div className="config-actions">
                  <button 
                    className="test-btn"
                    onClick={() => handleTestConnection(key)}
                  >
                    Test Connection
                  </button>
                  {testResult?.type === key && (
                    <span className={`test-result ${testResult.status}`}>
                      {testResult.status === 'testing' ? 'Testing...' : 
                       testResult.status === 'success' ? '✓ Connection successful!' : 
                       `✗ Failed: ${testResult.message}`}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="integration-logs">
          <h3>Recent Activity</h3>
          <p className="logs-info">Activity logs will appear here when forms are submitted.</p>
        </div>
      )}
    </div>
  );
}

// Enhanced Form Submit Handler
export const handleSubmitWithIntegrations = async (formData, formConfig, onSubmit) => {
  const results = {
    primary: null,
    integrations: []
  };

  if (onSubmit) {
    try {
      results.primary = await onSubmit(formData);
    } catch (error) {
      console.error('Primary submit failed:', error);
      results.primary = { success: false, error: error.message };
    }
  }

  const integrations = formIntegrationService.integrations;
  const integrationPromises = Object.entries(integrations)
    .filter(([_, config]) => config.enabled)
    .map(async ([type, config]) => {
      const result = await formIntegrationService.submitToIntegration(type, formData, formConfig);
      results.integrations.push({ type, ...result });
      return result;
    });

  await Promise.allSettled(integrationPromises);

  results.integrations
    .filter(r => !r.success)
    .forEach(r => {
      formIntegrationService.queueWebhook(r.type, formData, formConfig);
    });

  if (navigator.onLine) {
    formIntegrationService.processQueue();
  }

  return results;
};

export default formIntegrationService;
