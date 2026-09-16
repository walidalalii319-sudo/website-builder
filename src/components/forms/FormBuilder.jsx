import React, { useState } from 'react';
import formIntegrationService, { IntegrationManager, handleSubmitWithIntegrations } from './FormIntegrations';

/**
 * Form Builder Components
 * Complete form system with validation, conditional fields, and multiple field types
 */

/**
 * Form Field Types
 */
export const FieldTypes = {
  TEXT: 'text',
  EMAIL: 'email',
  PASSWORD: 'password',
  NUMBER: 'number',
  TEL: 'tel',
  URL: 'url',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  CHECKBOXES: 'checkboxes',
  FILE: 'file',
  DATE: 'date',
  TIME: 'time',
  DATETIME: 'datetime',
  RICHTEXT: 'richtext'
};

/**
 * Validation Rules
 */
export const validators = {
  required: (value) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return 'This field is required';
    }
    return null;
  },
  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },
  minLength: (min) => (value) => {
    if (!value) return null;
    if (value.length < min) {
      return `Minimum length is ${min} characters`;
    }
    return null;
  },
  maxLength: (max) => (value) => {
    if (!value) return null;
    if (value.length > max) {
      return `Maximum length is ${max} characters`;
    }
    return null;
  },
  pattern: (regex, message) => (value) => {
    if (!value) return null;
    if (!regex.test(value)) {
      return message || 'Invalid format';
    }
    return null;
  },
  number: (value) => {
    if (!value) return null;
    if (isNaN(parseFloat(value))) {
      return 'Please enter a valid number';
    }
    return null;
  },
  min: (min) => (value) => {
    if (!value) return null;
    if (parseFloat(value) < min) {
      return `Minimum value is ${min}`;
    }
    return null;
  },
  max: (max) => (value) => {
    if (!value) return null;
    if (parseFloat(value) > max) {
      return `Maximum value is ${max}`;
    }
    return null;
  },
  url: (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  }
};

/**
 * Individual Form Field Component
 */
export function FormField({ 
  field, 
  value, 
  error, 
  onChange, 
  onBlur,
  theme = {} 
}) {
  const { type, label, placeholder, options, required, helpText, multiple } = field;

  const baseStyles = {
    width: '100%',
    padding: '0.75rem',
    border: `1px solid ${error ? '#ef4444' : theme.borderColor || '#d1d5db'}`,
    borderRadius: theme.radius || '0.375rem',
    fontSize: '1rem',
    backgroundColor: theme.background || '#fff',
    color: theme.text || '#1f2937',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  };

  const focusStyles = {
    borderColor: error ? '#ef4444' : theme.accent || '#3b82f6',
    boxShadow: `0 0 0 3px ${error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`
  };

  const handleChange = (e) => {
    let newValue;
    if (type === 'checkbox') {
      newValue = e.target.checked;
    } else if (type === 'checkboxes' || multiple) {
      newValue = Array.from(e.target.selectedOptions, option => option.value);
    } else if (type === 'file') {
      newValue = e.target.files;
    } else {
      newValue = e.target.value;
    }
    onChange(field.id, newValue);
  };

  const handleBlur = () => {
    if (onBlur) onBlur(field.id);
  };

  const renderInput = () => {
    switch (type) {
      case FieldTypes.TEXTAREA:
        return (
          <textarea
            id={field.id}
            name={field.id}
            value={value || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            rows={field.rows || 4}
            style={baseStyles}
            aria-invalid={!!error}
            aria-describedby={error ? `${field.id}-error` : undefined}
          />
        );

      case FieldTypes.SELECT:
        return (
          <select
            id={field.id}
            name={field.id}
            value={value || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            style={baseStyles}
            multiple={multiple}
            aria-invalid={!!error}
            aria-describedby={error ? `${field.id}-error` : undefined}
          >
            {!multiple && <option value="">Select an option</option>}
            {options?.map((opt, i) => (
              <option key={i} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case FieldTypes.RADIO:
        return (
          <div className="radio-group">
            {options?.map((opt, i) => (
              <label key={i} className="radio-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="radio"
                  name={field.id}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ accentColor: theme.accent || '#3b82f6' }}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case FieldTypes.CHECKBOXES:
        return (
          <div className="checkbox-group">
            {options?.map((opt, i) => (
              <label key={i} className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="checkbox"
                  name={`${field.id}[]`}
                  value={opt.value}
                  checked={(value || []).includes(opt.value)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ accentColor: theme.accent || '#3b82f6' }}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case FieldTypes.FILE:
        return (
          <input
            type="file"
            id={field.id}
            name={field.id}
            onChange={handleChange}
            onBlur={handleBlur}
            multiple={multiple}
            accept={field.accept}
            style={{ ...baseStyles, padding: '0.5rem' }}
            aria-invalid={!!error}
            aria-describedby={error ? `${field.id}-error` : undefined}
          />
        );

      default:
        return (
          <input
            type={type}
            id={field.id}
            name={field.id}
            value={type === 'checkbox' ? (value ? 'on' : '') : (value || '')}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            checked={type === 'checkbox' ? !!value : undefined}
            style={type === 'checkbox' ? { accentColor: theme.accent || '#3b82f6' } : baseStyles}
            aria-invalid={!!error}
            aria-describedby={error ? `${field.id}-error` : undefined}
          />
        );
    }
  };

  return (
    <div className="form-field" style={{ marginBottom: '1.25rem' }}>
      {label && (
        <label 
          htmlFor={type !== 'checkbox' && type !== 'checkboxes' && type !== 'radio' ? field.id : undefined}
          className="form-label"
          style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: '500',
            color: theme.text || '#1f2937'
          }}
        >
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>}
        </label>
      )}
      
      {renderInput()}
      
      {helpText && !error && (
        <small className="form-help" style={{ 
          display: 'block', 
          marginTop: '0.25rem', 
          color: theme.muted || '#6b7280',
          fontSize: '0.875rem'
        }}>
          {helpText}
        </small>
      )}
      
      {error && (
        <p id={`${field.id}-error`} className="form-error" style={{ 
          display: 'block', 
          marginTop: '0.25rem', 
          color: '#ef4444',
          fontSize: '0.875rem'
        }}>
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Complete Form Component
 */
export function FormBuilder({ 
  fields = [], 
  onSubmit, 
  submitLabel = 'Submit',
  showValidation = true,
  theme = {},
  conditionalLogic = {}
}) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Check conditional visibility
  const isFieldVisible = (field) => {
    if (!conditionalLogic[field.id]) return true;
    
    const condition = conditionalLogic[field.id];
    const dependentValue = values[condition.field];
    
    switch (condition.operator) {
      case 'equals':
        return dependentValue === condition.value;
      case 'not_equals':
        return dependentValue !== condition.value;
      case 'contains':
        return Array.isArray(dependentValue) && dependentValue.includes(condition.value);
      case 'greater_than':
        return parseFloat(dependentValue) > parseFloat(condition.value);
      case 'less_than':
        return parseFloat(dependentValue) < parseFloat(condition.value);
      default:
        return true;
    }
  };

  const validateField = (field, value) => {
    if (!field.validations) return null;
    
    for (const validation of field.validations) {
      const validatorFn = validators[validation.rule];
      if (!validatorFn) continue;
      
      const validatorWithParams = typeof validation.params !== 'undefined'
        ? validators[validation.rule](validation.params)
        : validatorFn;
      
      const error = validatorWithParams(value);
      if (error) return error;
    }
    
    return null;
  };

  const validateAll = () => {
    const newErrors = {};
    let hasErrors = false;
    
    fields.forEach(field => {
      if (!isFieldVisible(field)) return;
      
      const value = values[field.id];
      const error = validateField(field, value);
      
      if (error) {
        newErrors[field.id] = error;
        hasErrors = true;
      }
    });
    
    setErrors(newErrors);
    return !hasErrors;
  };

  const handleChange = (fieldId, value) => {
    setValues(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: null }));
    }
  };

  const handleBlur = (fieldId) => {
    setTouched(prev => ({ ...prev, [fieldId]: true }));
    
    const field = fields.find(f => f.id === fieldId);
    if (field && showValidation) {
      const error = validateField(field, values[fieldId]);
      setErrors(prev => ({ ...prev, [fieldId]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      document.getElementById(firstErrorField)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    setSubmitting(true);
    
    try {
      await onSubmit(values);
      // Reset form on success
      setValues({});
      setErrors({});
      setTouched({});
    } catch (error) {
      console.error('Form submission failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="form-builder">
      {fields.filter(isFieldVisible).map((field) => (
        <FormField
          key={field.id}
          field={field}
          value={values[field.id]}
          error={touched[field.id] ? errors[field.id] : null}
          onChange={handleChange}
          onBlur={handleBlur}
          theme={theme}
        />
      ))}
      
      <button
        type="submit"
        disabled={submitting}
        className="form-submit-btn"
        style={{
          width: '100%',
          padding: '0.875rem 1.5rem',
          backgroundColor: theme.accent || '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: theme.radius || '0.375rem',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: submitting ? 'not-allowed' : 'pointer',
          opacity: submitting ? 0.7 : 1,
          transition: 'background-color 0.2s'
        }}
      >
        {submitting ? 'Submitting...' : submitLabel}
      </button>
    </form>
  );
}

/**
 * Multi-step Form Component
 */
export function MultiStepForm({ steps, onSubmit, submitLabel = 'Submit', theme = {} }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState({});
  const [stepErrors, setStepErrors] = useState({});

  const currentFields = steps[currentStep]?.fields || [];
  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepSubmit = (stepValues) => {
    setValues(prev => ({ ...prev, ...stepValues }));
    
    if (currentStep < totalSteps - 1) {
      handleNext();
    } else {
      onSubmit({ ...values, ...stepValues });
    }
  };

  return (
    <div className="multi-step-form">
      {/* Progress Bar */}
      <div className="form-progress" style={{ marginBottom: '2rem' }}>
        <div 
          className="form-progress-bar"
          style={{
            height: '0.5rem',
            backgroundColor: theme.muted || '#e5e7eb',
            borderRadius: '9999px',
            overflow: 'hidden'
          }}
        >
          <div
            className="form-progress-fill"
            style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: theme.accent || '#3b82f6',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
        <div className="form-steps" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '0.5rem',
          fontSize: '0.875rem',
          color: theme.muted || '#6b7280'
        }}>
          {steps.map((step, index) => (
            <span 
              key={index}
              style={{ 
                color: index <= currentStep ? (theme.accent || '#3b82f6') : (theme.muted || '#6b7280'),
                fontWeight: index <= currentStep ? '600' : '400'
              }}
            >
              {step.title || `Step ${index + 1}`}
            </span>
          ))}
        </div>
      </div>

      {/* Current Step Form */}
      <FormBuilder
        fields={currentFields}
        onSubmit={handleStepSubmit}
        submitLabel={currentStep < totalSteps - 1 ? 'Next' : submitLabel}
        theme={theme}
      />

      {/* Navigation Buttons */}
      {currentStep > 0 && (
        <button
          type="button"
          onClick={handlePrev}
          className="form-prev-btn"
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: 'transparent',
            color: theme.text || '#1f2937',
            border: `1px solid ${theme.borderColor || '#d1d5db'}`,
            borderRadius: theme.radius || '0.375rem',
            cursor: 'pointer'
          }}
        >
          Previous
        </button>
      )}
    </div>
  );
}
