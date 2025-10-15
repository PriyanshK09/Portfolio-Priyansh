import React, { useState } from 'react';
import { Certificate } from '../../types';
import { Save, X } from 'lucide-react';

interface CertificateFormProps {
  certificate: Certificate | null;
  onSave: (data: Certificate) => Promise<boolean> | boolean;
  onCancel: () => void;
}

const CertificateForm: React.FC<CertificateFormProps> = ({ certificate, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Certificate>(
    certificate || {
      title: '',
      issuer: '',
      date: '',
      url: ''
    }
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = 'Certificate title is required';
    if (!formData.issuer) newErrors.issuer = 'Issuer name is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.url) newErrors.url = 'Certificate URL is required';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Certificate Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`form-input ${errors.title ? 'border-red-500' : ''}`}
            placeholder="e.g., Introduction to Generative AI"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">Issuer</label>
          <input
            type="text"
            name="issuer"
            value={formData.issuer}
            onChange={handleChange}
            className={`form-input ${errors.issuer ? 'border-red-500' : ''}`}
            placeholder="e.g., Google Cloud - Coursera"
          />
          {errors.issuer && <p className="text-red-500 text-sm mt-1">{errors.issuer}</p>}
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">Date</label>
          <input
            type="text"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`form-input ${errors.date ? 'border-red-500' : ''}`}
            placeholder="e.g., January 2024"
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">Certificate URL</label>
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className={`form-input ${errors.url ? 'border-red-500' : ''}`}
            placeholder="e.g., https://www.coursera.org/verify/WGGEXKVC2PJ8"
          />
          {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-4 border-t border-[var(--border-color)]">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-white hover:bg-white/5 transition-colors flex items-center gap-2"
        >
          <X size={18} />
          <span>Cancel</span>
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-primary text-dark-bg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-t-2 border-b-2 border-dark-bg rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>Save Certificate</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CertificateForm;