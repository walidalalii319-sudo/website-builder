import React, { useState, useEffect } from 'react';

/**
 * CMS Service - Content Management System
 * Handles collections, custom fields, relationships, and dynamic content
 */
class CMSService {
  constructor() {
    this.storageKey = 'website-builder-cms';
    this.collections = this.loadFromStorage();
    this.webhooks = this.loadWebhooks();
    this.apiEndpoints = [];
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : this.getDefaultCollections();
    } catch {
      return this.getDefaultCollections();
    }
  }

  loadWebhooks() {
    try {
      const stored = localStorage.getItem('cms-webhooks');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveWebhooks() {
    localStorage.setItem('cms-webhooks', JSON.stringify(this.webhooks));
  }

  getDefaultCollections() {
    return {
      posts: {
        id: 'posts',
        name: 'Blog Posts',
        slug: 'posts',
        icon: '📝',
        fields: [
          { id: 'title', name: 'Title', type: 'text', required: true },
          { id: 'slug', name: 'Slug', type: 'slug', required: true },
          { id: 'excerpt', name: 'Excerpt', type: 'textarea' },
          { id: 'content', name: 'Content', type: 'richtext', required: true },
          { id: 'featuredImage', name: 'Featured Image', type: 'image' },
          { id: 'author', name: 'Author', type: 'reference', reference: 'authors' },
          { id: 'category', name: 'Category', type: 'select', options: ['Technology', 'Design', 'Business', 'Tutorial'] },
          { id: 'tags', name: 'Tags', type: 'multiselect' },
          { id: 'publishedAt', name: 'Published Date', type: 'datetime' },
          { id: 'status', name: 'Status', type: 'select', options: ['draft', 'published', 'scheduled'], default: 'draft' },
          { id: 'seoTitle', name: 'SEO Title', type: 'text' },
          { id: 'seoDescription', name: 'SEO Description', type: 'textarea' }
        ],
        records: []
      },
      authors: {
        id: 'authors',
        name: 'Authors',
        slug: 'authors',
        icon: '👤',
        fields: [
          { id: 'name', name: 'Name', type: 'text', required: true },
          { id: 'slug', name: 'Slug', type: 'slug', required: true },
          { id: 'bio', name: 'Bio', type: 'textarea' },
          { id: 'avatar', name: 'Avatar', type: 'image' },
          { id: 'email', name: 'Email', type: 'email' },
          { id: 'socialLinks', name: 'Social Links', type: 'json' }
        ],
        records: []
      },
      categories: {
        id: 'categories',
        name: 'Categories',
        slug: 'categories',
        icon: '📁',
        fields: [
          { id: 'name', name: 'Name', type: 'text', required: true },
          { id: 'slug', name: 'Slug', type: 'slug', required: true },
          { id: 'description', name: 'Description', type: 'textarea' },
          { id: 'parent', name: 'Parent Category', type: 'reference', reference: 'categories' }
        ],
        records: []
      },
      products: {
        id: 'products',
        name: 'Products',
        slug: 'products',
        icon: '🛍️',
        fields: [
          { id: 'name', name: 'Name', type: 'text', required: true },
          { id: 'slug', name: 'Slug', type: 'slug', required: true },
          { id: 'description', name: 'Description', type: 'richtext' },
          { id: 'price', name: 'Price', type: 'number', required: true },
          { id: 'compareAtPrice', name: 'Compare at Price', type: 'number' },
          { id: 'images', name: 'Images', type: 'gallery' },
          { id: 'inventory', name: 'Inventory', type: 'number' },
          { id: 'sku', name: 'SKU', type: 'text' },
          { id: 'category', name: 'Category', type: 'select' },
          { id: 'tags', name: 'Tags', type: 'multiselect' },
          { id: 'status', name: 'Status', type: 'select', options: ['active', 'draft', 'archived'], default: 'draft' }
        ],
        records: []
      }
    };
  }

  getCollections() {
    return Object.values(this.collections);
  }

  getCollection(collectionId) {
    return this.collections[collectionId];
  }

  createCollection(config) {
    const collection = {
      id: config.id || `collection-${Date.now()}`,
      name: config.name,
      slug: config.slug || config.id,
      icon: config.icon || '📄',
      fields: config.fields || [],
      records: []
    };

    this.collections[collection.id] = collection;
    this.saveToStorage();
    return collection;
  }

  updateCollection(collectionId, updates) {
    if (!this.collections[collectionId]) return null;
    
    this.collections[collectionId] = {
      ...this.collections[collectionId],
      ...updates
    };
    this.saveToStorage();
    return this.collections[collectionId];
  }

  deleteCollection(collectionId) {
    delete this.collections[collectionId];
    this.saveToStorage();
  }

  addField(collectionId, field) {
    const collection = this.collections[collectionId];
    if (!collection) return null;

    collection.fields.push({
      id: field.id || `field-${Date.now()}`,
      ...field
    });
    this.saveToStorage();
    return collection;
  }

  removeField(collectionId, fieldId) {
    const collection = this.collections[collectionId];
    if (!collection) return null;

    collection.fields = collection.fields.filter(f => f.id !== fieldId);
    this.saveToStorage();
    return collection;
  }

  // Record operations
  getRecords(collectionId, options = {}) {
    const collection = this.collections[collectionId];
    if (!collection) return [];

    let records = [...collection.records];

    // Filtering
    if (options.filter) {
      records = records.filter(record => {
        return Object.entries(options.filter).every(([key, value]) => {
          return record.data[key] === value;
        });
      });
    }

    // Searching
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      records = records.filter(record => {
        return Object.values(record.data).some(value => 
          String(value).toLowerCase().includes(searchLower)
        );
      });
    }

    // Sorting
    if (options.sortBy) {
      records.sort((a, b) => {
        const aVal = a.data[options.sortBy];
        const bVal = b.data[options.sortBy];
        
        if (options.sortOrder === 'desc') {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }

    // Pagination
    if (options.page && options.limit) {
      const start = (options.page - 1) * options.limit;
      records = records.slice(start, start + options.limit);
    }

    return records;
  }

  getRecord(collectionId, recordId) {
    const collection = this.collections[collectionId];
    if (!collection) return null;
    return collection.records.find(r => r.id === recordId);
  }

  getRecordBySlug(collectionId, slug) {
    const collection = this.collections[collectionId];
    if (!collection) return null;
    return collection.records.find(r => r.data.slug === slug);
  }

  createRecord(collectionId, data) {
    const collection = this.collections[collectionId];
    if (!collection) return null;

    const record = {
      id: `record-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      data: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data
      },
      revisions: []
    };

    collection.records.push(record);
    this.saveToStorage();
    return record;
  }

  updateRecord(collectionId, recordId, data) {
    const collection = this.collections[collectionId];
    if (!collection) return null;

    const record = collection.records.find(r => r.id === recordId);
    if (!record) return null;

    // Save revision
    record.revisions.push({
      timestamp: new Date().toISOString(),
      data: { ...record.data }
    });

    // Keep only last 10 revisions
    if (record.revisions.length > 10) {
      record.revisions = record.revisions.slice(-10);
    }

    record.data = {
      ...record.data,
      ...data,
      updatedAt: new Date().toISOString()
    };

    this.saveToStorage();
    return record;
  }

  deleteRecord(collectionId, recordId) {
    const collection = this.collections[collectionId];
    if (!collection) return false;

    const index = collection.records.findIndex(r => r.id === recordId);
    if (index === -1) return false;

    collection.records.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  duplicateRecord(collectionId, recordId) {
    const record = this.getRecord(collectionId, recordId);
    if (!record) return null;

    const newData = { ...record.data };
    delete newData.id;
    
    return this.createRecord(collectionId, newData);
  }

  // Bulk operations
  bulkDelete(collectionId, recordIds) {
    const collection = this.collections[collectionId];
    if (!collection) return 0;

    const beforeCount = collection.records.length;
    collection.records = collection.records.filter(r => !recordIds.includes(r.id));
    this.saveToStorage();

    return beforeCount - collection.records.length;
  }

  bulkUpdate(collectionId, recordIds, data) {
    const collection = this.collections[collectionId];
    if (!collection) return 0;

    let updatedCount = 0;
    collection.records.forEach(record => {
      if (recordIds.includes(record.id)) {
        record.data = {
          ...record.data,
          ...data,
          updatedAt: new Date().toISOString()
        };
        updatedCount++;
      }
    });

    this.saveToStorage();
    return updatedCount;
  }

  // Import/Export
  exportCollection(collectionId) {
    const collection = this.collections[collectionId];
    if (!collection) return null;

    return {
      collection: {
        id: collection.id,
        name: collection.name,
        slug: collection.slug,
        fields: collection.fields
      },
      records: collection.records,
      exportedAt: new Date().toISOString()
    };
  }

  importCollection(collectionId, jsonData) {
    try {
      const imported = JSON.parse(jsonData);
      
      if (!imported.collection || !imported.records) {
        throw new Error('Invalid import format');
      }

      const collection = this.collections[collectionId];
      if (!collection) {
        // Create new collection
        this.createCollection({
          id: imported.collection.id,
          name: imported.collection.name,
          slug: imported.collection.slug,
          fields: imported.collection.fields
        });
      }

      // Import records
      imported.records.forEach(record => {
        this.createRecord(collectionId, record.data);
      });

      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }
}

export const cms = new CMSService();

/**
 * CollectionManager Component
 * UI for managing CMS collections
 */
export function CollectionManager({ onSelectCollection, onCreateCollection }) {
  const [collections, setCollections] = useState(cms.getCollections());

  useEffect(() => {
    setCollections(cms.getCollections());
  }, []);

  const handleCreate = () => {
    const name = prompt('Enter collection name:');
    if (!name) return;

    const id = name.toLowerCase().replace(/\s+/g, '-');
    const collection = cms.createCollection({ id, name });
    setCollections(cms.getCollections());
    
    if (onCreateCollection) onCreateCollection(collection);
  };

  return (
    <div className="collection-manager">
      <div className="collection-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>Collections</h3>
        <button onClick={handleCreate} className="btn-create" style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>
          + New Collection
        </button>
      </div>

      <div className="collections-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {collections.map(collection => (
          <button
            key={collection.id}
            onClick={() => onSelectCollection?.(collection)}
            className="collection-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              background: '#fff',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>{collection.icon}</span>
            <div>
              <div style={{ fontWeight: '600' }}>{collection.name}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {collection.records.length} records
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * RecordEditor Component
 * UI for editing CMS records
 */
export function RecordEditor({ collectionId, recordId, onSave, onClose }) {
  const collection = cms.getCollection(collectionId);
  const [record, setRecord] = useState(recordId ? cms.getRecord(collectionId, recordId) : null);
  const [data, setData] = useState(record?.data || {});
  const [errors, setErrors] = useState({});

  if (!collection) {
    return <div>Collection not found</div>;
  }

  const validateField = (field, value) => {
    if (field.required && !value) {
      return `${field.name} is required`;
    }
    if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Invalid email address';
    }
    if (field.type === 'number' && value && isNaN(parseFloat(value))) {
      return 'Must be a number';
    }
    return null;
  };

  const handleChange = (fieldId, value) => {
    setData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: null }));
    }
  };

  const handleSave = () => {
    // Validate all fields
    const newErrors = {};
    collection.fields.forEach(field => {
      const error = validateField(field, data[field.id]);
      if (error) newErrors[field.id] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (recordId) {
      cms.updateRecord(collectionId, recordId, data);
    } else {
      cms.createRecord(collectionId, data);
    }

    if (onSave) onSave();
  };

  const renderField = (field) => {
    const value = data[field.id] || field.default || '';
    const error = errors[field.id];

    switch (field.type) {
      case 'textarea':
      case 'richtext':
        return (
          <textarea
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            rows={4}
            style={{ width: '100%', padding: '0.75rem', border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`, borderRadius: '0.375rem' }}
          />
        );
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            style={{ width: '100%', padding: '0.75rem', border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`, borderRadius: '0.375rem' }}
          >
            <option value="">Select...</option>
            {field.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            style={{ width: '100%', padding: '0.75rem', border: `1px solid ${error ? '#ef4444' : '#d1d5db'}', borderRadius: '0.375rem' }}
          />
        );
      case 'datetime':
        return (
          <input
            type="datetime-local"
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            style={{ width: '100%', padding: '0.75rem', border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`, borderRadius: '0.375rem' }}
          />
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            style={{ width: '100%', padding: '0.75rem', border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`, borderRadius: '0.375rem' }}
          />
        );
    }
  };

  return (
    <div className="record-editor" style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3>{recordId ? 'Edit Record' : 'New Record'}</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={onClose} style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', background: '#fff', cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary" style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>
            Save
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {collection.fields.map(field => (
          <div key={field.id}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              {field.name}
              {field.required && <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>}
            </label>
            {renderField(field)}
            {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{error}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * DynamicList Component
 * Renders a list of CMS records with filtering, sorting, and pagination
 */
export function DynamicList({ 
  collectionId, 
  filter, 
  sortBy, 
  sortOrder = 'asc',
  limit,
  page = 1,
  renderItem,
  emptyMessage = 'No items found'
}) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetched = cms.getRecords(collectionId, {
      filter,
      sortBy,
      sortOrder,
      limit,
      page
    });
    setRecords(fetched);
    setLoading(false);
  }, [collectionId, filter, sortBy, sortOrder, limit, page]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (records.length === 0) {
    return <div>{emptyMessage}</div>;
  }

  return (
    <div className="dynamic-list">
      {records.map(record => renderItem?.(record))}
    </div>
  );
}
