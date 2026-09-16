import React, { useState, useEffect, useCallback } from 'react';
import { cms } from './CMS.jsx';

/**
 * Rich Text Editor Component
 * Full-featured WYSIWYG editor for content creation
 */
export function RichTextEditor({ value, onChange, placeholder = 'Enter content...' }) {
  const [editorRef, setEditorRef] = useState(null);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (onChange && editorRef) {
      onChange(editorRef.innerHTML);
    }
  };

  const ToolbarButton = ({ command, icon, title }) => (
    <button
      type="button"
      onClick={() => execCommand(command)}
      title={title}
      className="rich-text-btn"
    >
      {icon}
    </button>
  );

  return (
    <div className="rich-text-editor">
      <div className="rich-text-toolbar">
        <div className="toolbar-group">
          <ToolbarButton command="bold" icon="🅱️" title="Bold" />
          <ToolbarButton command="italic" icon="ℐ" title="Italic" />
          <ToolbarButton command="underline" icon="U̲" title="Underline" />
          <ToolbarButton command="strikeThrough" icon="S̶" title="Strikethrough" />
        </div>
        <div className="toolbar-group">
          <ToolbarButton command="formatBlock" value="h2" icon="H2" title="Heading 2" />
          <ToolbarButton command="formatBlock" value="h3" icon="H3" title="Heading 3" />
          <ToolbarButton command="formatBlock" value="p" icon="¶" title="Paragraph" />
        </div>
        <div className="toolbar-group">
          <ToolbarButton command="insertUnorderedList" icon="•" title="Bullet List" />
          <ToolbarButton command="insertOrderedList" icon="1." title="Numbered List" />
        </div>
        <div className="toolbar-group">
          <ToolbarButton command="justifyLeft" icon="⬅" title="Align Left" />
          <ToolbarButton command="justifyCenter" icon="↔" title="Align Center" />
          <ToolbarButton command="justifyRight" icon="➡" title="Align Right" />
        </div>
        <div className="toolbar-group">
          <ToolbarButton command="createLink" icon="🔗" title="Insert Link" />
          <ToolbarButton command="removeFormat" icon="✕" title="Clear Formatting" />
        </div>
      </div>
      <div
        ref={(ref) => {
          setEditorRef(ref);
          if (ref && value && ref.innerHTML !== value) {
            ref.innerHTML = value;
          }
        }}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange?.(e.target.innerHTML)}
        className="rich-text-content"
        data-placeholder={placeholder}
      />
    </div>
  );
}

/**
 * Content Type Builder
 * Create and manage custom content types with custom fields
 */
export function ContentTypeBuilder({ onSelectType }) {
  const [collections, setCollections] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollection, setNewCollection] = useState({ name: '', slug: '', icon: '📄' });

  useEffect(() => {
    setCollections(cms.getCollections());
  }, []);

  const handleCreate = () => {
    if (!newCollection.name) return;
    
    const collection = cms.createCollection({
      id: newCollection.slug || newCollection.name.toLowerCase().replace(/\s+/g, '-'),
      name: newCollection.name,
      slug: newCollection.slug,
      icon: newCollection.icon,
      fields: [
        { id: 'title', name: 'Title', type: 'text', required: true },
        { id: 'slug', name: 'Slug', type: 'slug', required: true }
      ]
    });
    
    setCollections(cms.getCollections());
    setShowCreateModal(false);
    setNewCollection({ name: '', slug: '', icon: '📄' });
    onSelectType?.(collection);
  };

  const addField = (collectionId, field) => {
    cms.addField(collectionId, field);
    setCollections(cms.getCollections());
  };

  const removeField = (collectionId, fieldId) => {
    cms.removeField(collectionId, fieldId);
    setCollections(cms.getCollections());
  };

  return (
    <div className="content-type-builder">
      <div className="builder-header">
        <h3>Content Types</h3>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-create-type"
        >
          + New Content Type
        </button>
      </div>

      <div className="collections-grid">
        {collections.map(collection => (
          <div key={collection.id} className="collection-card">
            <div className="collection-icon">{collection.icon}</div>
            <h4>{collection.name}</h4>
            <p className="collection-slug">/{collection.slug}</p>
            <p className="collection-stats">
              {collection.fields.length} fields • {collection.records.length} records
            </p>
            <button 
              onClick={() => onSelectType?.(collection)}
              className="btn-manage"
            >
              Manage Content
            </button>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Content Type</h3>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={newCollection.name}
                onChange={(e) => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Products, Team Members, Events"
              />
            </div>
            <div className="form-group">
              <label>Slug</label>
              <input
                type="text"
                value={newCollection.slug}
                onChange={(e) => setNewCollection(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="e.g., products, team, events"
              />
            </div>
            <div className="form-group">
              <label>Icon</label>
              <select
                value={newCollection.icon}
                onChange={(e) => setNewCollection(prev => ({ ...prev, icon: e.target.value }))}
              >
                <option value="📄">📄 Document</option>
                <option value="🛍️">🛍️ Product</option>
                <option value="👤">👤 Person</option>
                <option value="📅">📅 Event</option>
                <option value="🎨">🎨 Portfolio</option>
                <option value="📰">📰 News</option>
                <option value="🏢">🏢 Company</option>
                <option value="📍">📍 Location</option>
              </select>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowCreateModal(false)} className="btn-cancel">Cancel</button>
              <button onClick={handleCreate} className="btn-primary">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Custom Field Manager
 * Add and configure custom fields for content types
 */
export function CustomFieldManager({ collection, onClose }) {
  const [fields, setFields] = useState(collection?.fields || []);
  const [showAddField, setShowAddField] = useState(false);
  const [newField, setNewField] = useState({
    name: '',
    type: 'text',
    required: false,
    options: []
  });

  const fieldTypes = [
    { value: 'text', label: 'Text', icon: 'T' },
    { value: 'textarea', label: 'Long Text', icon: '¶' },
    { value: 'richtext', label: 'Rich Text', icon: '📝' },
    { value: 'number', label: 'Number', icon: '#' },
    { value: 'email', label: 'Email', icon: '@' },
    { value: 'url', label: 'URL', icon: '🔗' },
    { value: 'image', label: 'Image', icon: '🖼️' },
    { value: 'gallery', label: 'Gallery', icon: '📸' },
    { value: 'select', label: 'Dropdown', icon: '▼' },
    { value: 'multiselect', label: 'Multi-select', icon: '☑️' },
    { value: 'checkbox', label: 'Checkbox', icon: '✓' },
    { value: 'datetime', label: 'Date/Time', icon: '📅' },
    { value: 'date', label: 'Date', icon: '📆' },
    { value: 'color', label: 'Color Picker', icon: '🎨' },
    { value: 'json', label: 'JSON', icon: '{}' },
    { value: 'reference', label: 'Reference', icon: '🔗' },
    { value: 'slug', label: 'Slug', icon: '🏷️' }
  ];

  const handleAddField = () => {
    if (!newField.name) return;

    const field = {
      id: `field-${Date.now()}`,
      name: newField.name,
      type: newField.type,
      required: newField.required,
      ...(newField.type === 'select' || newField.type === 'multiselect' ? { options: newField.options } : {})
    };

    cms.addField(collection.id, field);
    setFields([...fields, field]);
    setShowAddField(false);
    setNewField({ name: '', type: 'text', required: false, options: [] });
  };

  const handleRemoveField = (fieldId) => {
    cms.removeField(collection.id, fieldId);
    setFields(fields.filter(f => f.id !== fieldId));
  };

  return (
    <div className="custom-field-manager">
      <div className="manager-header">
        <h3>Manage Fields: {collection.name}</h3>
        <button onClick={onClose} className="btn-close">×</button>
      </div>

      <div className="fields-list">
        {fields.map((field, index) => (
          <div key={field.id} className="field-item">
            <div className="field-info">
              <span className="field-icon">{fieldTypes.find(t => t.value === field.type)?.icon}</span>
              <div>
                <strong>{field.name}</strong>
                <span className="field-type">{field.type}</span>
              </div>
              {field.required && <span className="field-required">*</span>}
            </div>
            <button 
              onClick={() => handleRemoveField(field.id)}
              className="btn-remove-field"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={() => setShowAddField(true)}
        className="btn-add-field"
      >
        + Add Custom Field
      </button>

      {showAddField && (
        <div className="add-field-form">
          <div className="form-group">
            <label>Field Name</label>
            <input
              type="text"
              value={newField.name}
              onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Price, Author, Description"
            />
          </div>
          <div className="form-group">
            <label>Field Type</label>
            <select
              value={newField.type}
              onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value }))}
            >
              {fieldTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          {(newField.type === 'select' || newField.type === 'multiselect') && (
            <div className="form-group">
              <label>Options (comma-separated)</label>
              <input
                type="text"
                value={newField.options.join(', ')}
                onChange={(e) => setNewField(prev => ({ ...prev, options: e.target.value.split(',').map(o => o.trim()) }))}
                placeholder="Option 1, Option 2, Option 3"
              />
            </div>
          )}
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={newField.required}
                onChange={(e) => setNewField(prev => ({ ...prev, required: e.target.checked }))}
              />
              Required field
            </label>
          </div>
          <div className="form-actions">
            <button onClick={() => setShowAddField(false)} className="btn-cancel">Cancel</button>
            <button onClick={handleAddField} className="btn-primary">Add Field</button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Content Relationships Manager
 * Define and manage relationships between content types
 */
export function ContentRelationships({ collections }) {
  const [relationships, setRelationships] = useState([]);

  const relationshipTypes = [
    { value: 'one-to-one', label: 'One to One' },
    { value: 'one-to-many', label: 'One to Many' },
    { value: 'many-to-many', label: 'Many to Many' }
  ];

  const addRelationship = (fromCollection, toCollection, type, fieldName) => {
    const relationship = {
      id: `rel-${Date.now()}`,
      from: fromCollection.id,
      to: toCollection.id,
      type,
      fieldName
    };
    
    // Add reference field to source collection
    cms.addField(fromCollection.id, {
      id: fieldName,
      name: fieldName,
      type: type === 'one-to-many' || type === 'many-to-many' ? 'multiselect' : 'reference',
      reference: toCollection.id
    });

    setRelationships([...relationships, relationship]);
  };

  return (
    <div className="content-relationships">
      <h3>Content Relationships</h3>
      <p className="help-text">Define how different content types relate to each other</p>
      
      <div className="relationships-list">
        {relationships.map(rel => (
          <div key={rel.id} className="relationship-item">
            <span>{collections.find(c => c.id === rel.from)?.name}</span>
            <span className="rel-type">{rel.type}</span>
            <span>{collections.find(c => c.id === rel.to)?.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Publishing Workflow Manager
 * Handle draft, review, publish, and scheduled publishing
 */
export function PublishingWorkflow({ record, onSave, onPublish }) {
  const [status, setStatus] = useState(record?.data?.status || 'draft');
  const [scheduledDate, setScheduledDate] = useState('');
  const [reviewer, setReviewer] = useState('');
  const [publishDate, setPublishDate] = useState(record?.data?.publishedAt || '');

  const statusOptions = [
    { value: 'draft', label: 'Draft', color: '#6b7280' },
    { value: 'review', label: 'In Review', color: '#f59e0b' },
    { value: 'scheduled', label: 'Scheduled', color: '#3b82f6' },
    { value: 'published', label: 'Published', color: '#10b981' },
    { value: 'archived', label: 'Archived', color: '#ef4444' }
  ];

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    if (onSave) {
      onSave({ status: newStatus, publishedAt: newStatus === 'published' ? new Date().toISOString() : publishDate });
    }
  };

  const handleSchedule = () => {
    if (!scheduledDate) return;
    setStatus('scheduled');
    onSave({ 
      status: 'scheduled', 
      scheduledPublishAt: scheduledDate,
      publishedAt: new Date(scheduledDate).toISOString()
    });
  };

  return (
    <div className="publishing-workflow">
      <h3>Publishing Status</h3>
      
      <div className="status-selector">
        {statusOptions.map(option => (
          <button
            key={option.value}
            onClick={() => handleStatusChange(option.value)}
            className={`status-btn ${status === option.value ? 'active' : ''}`}
            style={{ 
              borderColor: option.color,
              backgroundColor: status === option.value ? option.color : 'transparent',
              color: status === option.value ? '#fff' : option.color
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      {status === 'scheduled' && (
        <div className="schedule-section">
          <label>Scheduled Publish Date</label>
          <input
            type="datetime-local"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
          />
          <button onClick={handleSchedule} className="btn-schedule">
            Schedule Publishing
          </button>
        </div>
      )}

      {status === 'review' && (
        <div className="review-section">
          <label>Assign Reviewer</label>
          <input
            type="text"
            value={reviewer}
            onChange={(e) => setReviewer(e.target.value)}
            placeholder="Enter reviewer email"
          />
        </div>
      )}

      {publishDate && (
        <div className="publish-info">
          <p>Published on: {new Date(publishDate).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Content Revisions History
 * Track and restore previous versions of content
 */
export function ContentRevisions({ collectionId, recordId, onRestore }) {
  const [revisions, setRevisions] = useState([]);
  const [selectedRevision, setSelectedRevision] = useState(null);

  useEffect(() => {
    const record = cms.getRecord(collectionId, recordId);
    if (record && record.revisions) {
      setRevisions(record.revisions.reverse());
    }
  }, [collectionId, recordId]);

  const handleRestore = (revision) => {
    if (onRestore) {
      onRestore(revision.data);
    }
  };

  return (
    <div className="content-revisions">
      <h3>Revision History</h3>
      
      {revisions.length === 0 ? (
        <p className="no-revisions">No revisions yet</p>
      ) : (
        <div className="revisions-list">
          {revisions.map((revision, index) => (
            <div key={index} className="revision-item">
              <div className="revision-info">
                <span className="revision-date">
                  {new Date(revision.timestamp).toLocaleString()}
                </span>
                <span className="revision-changes">
                  {Object.keys(revision.data).length} fields
                </span>
              </div>
              <button 
                onClick={() => handleRestore(revision)}
                className="btn-restore"
              >
                Restore This Version
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Bulk Operations Manager
 * Handle bulk editing, importing, and exporting
 */
export function BulkOperations({ collectionId, selectedRecords, onBulkUpdate, onBulkDelete }) {
  const [showImport, setShowImport] = useState(false);
  const [bulkData, setBulkData] = useState({});
  const [importData, setImportData] = useState('');

  const handleBulkUpdate = () => {
    if (Object.keys(bulkData).length === 0) return;
    
    const recordIds = selectedRecords.map(r => r.id);
    const count = cms.bulkUpdate(collectionId, recordIds, bulkData);
    onBulkUpdate?.(count);
    setBulkData({});
  };

  const handleBulkDelete = () => {
    if (!confirm(`Delete ${selectedRecords.length} records?`)) return;
    
    const recordIds = selectedRecords.map(r => r.id);
    const count = cms.bulkDelete(collectionId, recordIds);
    onBulkDelete?.(count);
  };

  const handleExport = () => {
    const data = cms.exportCollection(collectionId);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${collectionId}-export.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    try {
      const success = cms.importCollection(collectionId, importData);
      if (success) {
        alert('Import successful!');
        setShowImport(false);
        setImportData('');
      } else {
        alert('Import failed. Please check the format.');
      }
    } catch (e) {
      alert('Invalid JSON format');
    }
  };

  return (
    <div className="bulk-operations">
      <div className="operations-bar">
        <span className="selected-count">{selectedRecords.length} selected</span>
        
        <div className="operations-buttons">
          <button 
            onClick={() => setShowImport(true)}
            className="btn-operation"
          >
            📥 Import
          </button>
          <button onClick={handleExport} className="btn-operation">
            📤 Export
          </button>
          {selectedRecords.length > 0 && (
            <>
              <button onClick={handleBulkUpdate} className="btn-operation btn-update">
                ✏️ Bulk Edit
              </button>
              <button onClick={handleBulkDelete} className="btn-operation btn-delete">
                🗑️ Delete
              </button>
            </>
          )}
        </div>
      </div>

      {showImport && (
        <div className="import-modal">
          <h4>Import Data</h4>
          <textarea
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            placeholder='Paste JSON data here...'
            rows={10}
          />
          <div className="modal-actions">
            <button onClick={() => setShowImport(false)} className="btn-cancel">Cancel</button>
            <button onClick={handleImport} className="btn-primary">Import</button>
          </div>
        </div>
      )}

      {Object.keys(bulkData).length > 0 && (
        <div className="bulk-edit-form">
          <h4>Bulk Update Fields</h4>
          {Object.entries(bulkData).map(([key, value]) => (
            <div key={key} className="form-group">
              <label>{key}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => setBulkData(prev => ({ ...prev, [key]: e.target.value }))}
              />
            </div>
          ))}
          <button onClick={handleBulkUpdate} className="btn-apply">Apply Changes</button>
        </div>
      )}
    </div>
  );
}

/**
 * Multi-language Content Manager
 * Handle translations and localization
 */
export function MultiLanguageContent({ record, supportedLanguages = ['en', 'es', 'fr', 'de', 'zh'] }) {
  const [currentLang, setCurrentLang] = useState('en');
  const [translations, setTranslations] = useState({
    en: record?.data || {},
    es: {},
    fr: {},
    de: {},
    zh: {}
  });

  const languageNames = {
    en: '🇺🇸 English',
    es: '🇪🇸 Español',
    fr: '🇫🇷 Français',
    de: '🇩🇪 Deutsch',
    zh: '🇨🇳 中文'
  };

  const updateTranslation = (lang, field, value) => {
    setTranslations(prev => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value }
    }));
  };

  const copyFromBase = (lang) => {
    setTranslations(prev => ({
      ...prev,
      [lang]: { ...prev.en }
    }));
  };

  return (
    <div className="multi-language-content">
      <div className="language-selector">
        <h3>Translations</h3>
        <div className="languages">
          {supportedLanguages.map(lang => (
            <button
              key={lang}
              onClick={() => setCurrentLang(lang)}
              className={`lang-btn ${currentLang === lang ? 'active' : ''}`}
            >
              {languageNames[lang]}
            </button>
          ))}
        </div>
      </div>

      {currentLang !== 'en' && (
        <button 
          onClick={() => copyFromBase(currentLang)}
          className="btn-copy-base"
        >
          📋 Copy from English
        </button>
      )}

      <div className="translation-fields">
        {Object.entries(translations[currentLang] || {}).map(([field, value]) => (
          <div key={field} className="translation-field">
            <label>{field} ({currentLang})</label>
            <input
              type="text"
              value={value}
              onChange={(e) => updateTranslation(currentLang, field, e.target.value)}
              placeholder={`Enter ${field} in ${languageNames[currentLang]}`}
            />
          </div>
        ))}
      </div>

      <div className="localization-status">
        <h4>Localization Status</h4>
        {supportedLanguages.map(lang => {
          const fieldCount = Object.keys(translations[lang] || {}).filter(k => translations[lang][k]).length;
          const totalFields = Object.keys(translations.en || {}).length;
          const percentage = totalFields > 0 ? Math.round((fieldCount / totalFields) * 100) : 0;
          
          return (
            <div key={lang} className="lang-progress">
              <span>{languageNames[lang]}</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span>{percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Dynamic Page Renderer
 * Renders pages based on CMS content and templates
 */
export function DynamicPageRenderer({ pageSlug, template }) {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch page data from CMS
    const fetchPage = async () => {
      try {
        // Look for page in posts collection (or any configured collection)
        const posts = cms.getRecords('posts', { filter: { slug: pageSlug, status: 'published' } });
        if (posts.length > 0) {
          setPageData(posts[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch page:', error);
        setLoading(false);
      }
    };

    fetchPage();
  }, [pageSlug]);

  if (loading) {
    return <div className="loading-page">Loading...</div>;
  }

  if (!pageData) {
    return <div className="page-not-found">Page not found</div>;
  }

  return (
    <div className="dynamic-page">
      {template === 'blog' && (
        <article className="blog-post">
          <header>
            <h1>{pageData.data.title}</h1>
            {pageData.data.featuredImage && (
              <img src={pageData.data.featuredImage} alt={pageData.data.title} />
            )}
            <div className="post-meta">
              <span>By {pageData.data.author}</span>
              <span>{new Date(pageData.data.publishedAt).toLocaleDateString()}</span>
              <span>Category: {pageData.data.category}</span>
            </div>
          </header>
          <div 
            className="post-content"
            dangerouslySetInnerHTML={{ __html: pageData.data.content }}
          />
          {pageData.data.tags && (
            <div className="post-tags">
              {pageData.data.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </article>
      )}

      {template === 'product' && (
        <div className="product-page">
          <h1>{pageData.data.name}</h1>
          <div className="product-price">${pageData.data.price}</div>
          <div 
            className="product-description"
            dangerouslySetInnerHTML={{ __html: pageData.data.description }}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Author Profile Component
 * Displays author information and their posts
 */
export function AuthorProfile({ authorSlug }) {
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const authors = cms.getRecords('authors', { filter: { slug: authorSlug } });
    if (authors.length > 0) {
      const authorData = authors[0];
      setAuthor(authorData);
      
      // Fetch author's posts
      const authorPosts = cms.getRecords('posts', { 
        filter: { author: authorData.data.name },
        sortBy: 'publishedAt',
        sortOrder: 'desc'
      });
      setPosts(authorPosts);
    }
  }, [authorSlug]);

  if (!author) return <div>Author not found</div>;

  return (
    <div className="author-profile">
      <div className="author-header">
        {author.data.avatar && (
          <img src={author.data.avatar} alt={author.data.name} className="author-avatar" />
        )}
        <div>
          <h1>{author.data.name}</h1>
          <p className="author-bio">{author.data.bio}</p>
          {author.data.socialLinks && (
            <div className="social-links">
              {Object.entries(author.data.socialLinks).map(([platform, url]) => (
                <a key={platform} href={url} target="_blank" rel="noopener noreferrer">
                  {platform}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="author-posts">
        <h2>Posts by {author.data.name}</h2>
        <div className="posts-grid">
          {posts.map(post => (
            <article key={post.id} className="post-card">
              {post.data.featuredImage && (
                <img src={post.data.featuredImage} alt={post.data.title} />
              )}
              <h3>{post.data.title}</h3>
              <p>{post.data.excerpt}</p>
              <time>{new Date(post.data.publishedAt).toLocaleDateString()}</time>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Category Archive Component
 * Displays posts filtered by category
 */
export function CategoryArchive({ categorySlug }) {
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const categories = cms.getRecords('categories', { filter: { slug: categorySlug } });
    if (categories.length > 0) {
      setCategory(categories[0]);
      
      const categoryPosts = cms.getRecords('posts', { 
        filter: { category: categories[0].data.name },
        sortBy: 'publishedAt',
        sortOrder: 'desc'
      });
      setPosts(categoryPosts);
    }
  }, [categorySlug]);

  if (!category) return <div>Category not found</div>;

  return (
    <div className="category-archive">
      <header>
        <h1>{category.data.name}</h1>
        {category.data.description && (
          <p className="category-description">{category.data.description}</p>
        )}
      </header>

      <div className="posts-list">
        {posts.length === 0 ? (
          <p>No posts in this category yet.</p>
        ) : (
          posts.map(post => (
            <article key={post.id} className="post-item">
              <h2>{post.data.title}</h2>
              <p>{post.data.excerpt}</p>
              <a href={`/posts/${post.data.slug}`}>Read more →</a>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

/**
 * Tag Cloud Component
 * Displays all tags with post counts
 */
export function TagCloud() {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const allPosts = cms.getRecords('posts', { filter: { status: 'published' } });
    const tagCounts = {};
    
    allPosts.forEach(post => {
      if (post.data.tags) {
        post.data.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    setTags(Object.entries(tagCounts).sort((a, b) => b[1] - a[1]));
  }, []);

  return (
    <div className="tag-cloud">
      <h3>Popular Tags</h3>
      <div className="tags">
        {tags.map(([tag, count]) => (
          <a 
            key={tag} 
            href={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`}
            className="tag-item"
            style={{ fontSize: `${Math.max(0.8, Math.min(2, count / 5 + 0.8))}rem` }}
          >
            {tag} ({count})
          </a>
        ))}
      </div>
    </div>
  );
}
