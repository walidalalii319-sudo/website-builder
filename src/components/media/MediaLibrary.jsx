import React, { useState, useCallback } from 'react';

/**
 * Media Library Service
 * Manages media assets (images, videos, documents)
 */
class MediaLibraryService {
  constructor() {
    this.storageKey = 'website-builder-media';
    this.media = this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.media));
    } catch (e) {
      console.error('Failed to save media library:', e);
    }
  }

  addMedia(file, metadata = {}) {
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = (e) => {
        const mediaItem = {
          id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: this.getMediaType(file.type),
          name: file.name,
          size: file.size,
          mimeType: file.type,
          url: e.target.result,
          thumbnail: null,
          createdAt: new Date().toISOString(),
          ...metadata
        };

        // Generate thumbnail for images
        if (mediaItem.type === 'image') {
          this.generateThumbnail(e.target.result).then(thumbnail => {
            mediaItem.thumbnail = thumbnail;
            this.media.push(mediaItem);
            this.saveToStorage();
            resolve(mediaItem);
          });
        } else {
          this.media.push(mediaItem);
          this.saveToStorage();
          resolve(mediaItem);
        }
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  getMediaType(mimeType) {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf')) return 'document';
    return 'other';
  }

  generateThumbnail(dataUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxSize = 200;
        
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = dataUrl;
    });
  }

  getMedia(id) {
    return this.media.find(item => item.id === id);
  }

  getAllMedia(filter = {}) {
    let result = [...this.media];
    
    if (filter.type) {
      result = result.filter(item => item.type === filter.type);
    }
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchLower)
      );
    }
    
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  deleteMedia(id) {
    this.media = this.media.filter(item => item.id !== id);
    this.saveToStorage();
  }

  updateMedia(id, updates) {
    const index = this.media.findIndex(item => item.id === id);
    if (index !== -1) {
      this.media[index] = { ...this.media[index], ...updates };
      this.saveToStorage();
      return this.media[index];
    }
    return null;
  }

  clearLibrary() {
    this.media = [];
    this.saveToStorage();
  }
}

export const mediaLibrary = new MediaLibraryService();

/**
 * MediaPicker Component
 * Allows users to select media from the library or upload new files
 */
export function MediaPicker({ onSelect, acceptedTypes = ['image/*'], multiple = false }) {
  const [media, setMedia] = useState(mediaLibrary.getAllMedia());
  const [showUploader, setShowUploader] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const mediaItem = await mediaLibrary.addMedia(file);
        uploaded.push(mediaItem);
      }
      setMedia(mediaLibrary.getAllMedia());
      
      if (onSelect) {
        onSelect(multiple ? uploaded : uploaded[0]);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      setShowUploader(false);
    }
  };

  const handleSelect = (item) => {
    if (onSelect) {
      onSelect(item);
    }
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this media?')) {
      mediaLibrary.deleteMedia(id);
      setMedia(mediaLibrary.getAllMedia());
    }
  };

  return (
    <div className="media-picker">
      <div className="media-picker-header">
        <h4>Media Library</h4>
        <button 
          className="btn-upload"
          onClick={() => setShowUploader(!showUploader)}
        >
          {showUploader ? 'Cancel' : '+ Upload'}
        </button>
      </div>

      {showUploader && (
        <div className="media-uploader">
          <input
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileUpload}
            multiple={multiple}
            disabled={uploading}
          />
          {uploading && <p>Uploading...</p>}
        </div>
      )}

      <div className="media-grid">
        {media.length === 0 ? (
          <p className="no-media">No media yet. Upload some files!</p>
        ) : (
          media.map((item) => (
            <div
              key={item.id}
              className={`media-item ${item.type}`}
              onClick={() => handleSelect(item)}
            >
              {item.type === 'image' && (
                <img src={item.thumbnail || item.url} alt={item.name} />
              )}
              {item.type === 'video' && (
                <div className="media-placeholder">🎥 {item.name}</div>
              )}
              {item.type === 'document' && (
                <div className="media-placeholder">📄 {item.name}</div>
              )}
              {item.type === 'other' && (
                <div className="media-placeholder">📁 {item.name}</div>
              )}
              <div className="media-info">
                <span className="media-name">{item.name}</span>
                <span className="media-size">{formatFileSize(item.size)}</span>
              </div>
              <button
                className="media-delete"
                onClick={(e) => handleDelete(item.id, e)}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/**
 * MediaGallery Component
 * Displays a gallery of images with lightbox support
 */
export function MediaGallery({ images, columns = 3, gap = '1rem' }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div 
        className="media-gallery"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: gap
        }}
      >
        {images.map((image, index) => (
          <div
            key={image.id || index}
            className="gallery-item"
            onClick={() => setSelectedImage(image.url)}
          >
            <img src={image.url} alt={image.alt || ''} loading="lazy" />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="" />
            <button className="lightbox-close" onClick={() => setSelectedImage(null)}>×</button>
          </div>
        </div>
      )}
    </>
  );
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
