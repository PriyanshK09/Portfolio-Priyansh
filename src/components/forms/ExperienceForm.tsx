import React, { useState } from 'react';
import { Experience } from '../../types';
import { Save, X, Plus, Trash2 } from 'lucide-react';

interface ExperienceFormProps {
  experience: Experience | null;
  onSave: (data: Experience) => Promise<boolean> | boolean;
  onCancel: () => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ experience, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Experience>(
    experience || {
      company: '',
      position: '',
      duration: '',
      description: [],
      techStack: []
    }
  );
  const [loading, setLoading] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    if (!formData.company) newErrors.company = 'Company name is required';
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.duration) newErrors.duration = 'Duration is required';
    if (formData.description.length === 0) newErrors.description = 'At least one description point is required';
    
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const addDescription = () => {
    if (descriptionInput.trim() && !formData.description.includes(descriptionInput.trim())) {
      setFormData({
        ...formData,
        description: [...formData.description, descriptionInput.trim()]
      });
      setDescriptionInput('');
      // Clear description error if it exists
      if (errors.description) {
        setErrors({
          ...errors,
          description: ''
        });
      }
    }
  };

  const removeDescription = (desc: string) => {
    setFormData({
      ...formData,
      description: formData.description.filter(d => d !== desc)
    });
  };

  const addTech = () => {
    if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, techInput.trim()]
      });
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter(t => t !== tech)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={`form-input ${errors.company ? 'border-red-500' : ''}`}
            placeholder="e.g., Cipher Schools"
          />
          {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">Position</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className={`form-input ${errors.position ? 'border-red-500' : ''}`}
            placeholder="e.g., Full Stack Developer"
          />
          {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">Duration</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className={`form-input ${errors.duration ? 'border-red-500' : ''}`}
            placeholder="e.g., June 2024 - July 2024"
          />
          {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">Description Points</label>
          <div className="flex">
            <input
              type="text"
              value={descriptionInput}
              onChange={(e) => setDescriptionInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDescription())}
              className={`form-input flex-1 rounded-r-none ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Add a bullet point about your responsibilities or achievements"
            />
            <button
              type="button"
              onClick={addDescription}
              className="px-4 bg-primary text-dark-bg hover:bg-primary/90 transition-colors rounded-r-lg"
            >
              <Plus size={18} />
            </button>
          </div>
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          
          <ul className="space-y-2 mt-3">
            {formData.description.map((desc, index) => (
              <li key={index} className="flex items-center justify-between bg-[var(--card-bg)] px-4 py-2 rounded-lg">
                <span className="pr-4">{desc}</span>
                <button
                  type="button"
                  onClick={() => removeDescription(desc)}
                  className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
            {formData.description.length === 0 && (
              <li className="text-gray-500 text-sm italic">No description points added</li>
            )}
          </ul>
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">Technologies Used</label>
          <div className="flex">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
              className="form-input flex-1 rounded-r-none"
              placeholder="e.g., React.js"
            />
            <button
              type="button"
              onClick={addTech}
              className="px-4 bg-primary text-dark-bg hover:bg-primary/90 transition-colors rounded-r-lg"
            >
              <Plus size={18} />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.techStack.map((tech) => (
              <div key={tech} className="bg-[var(--card-bg)] px-3 py-1 rounded-full flex items-center gap-2 border border-[var(--border-color)]">
                <span className="text-sm">{tech}</span>
                <button
                  type="button"
                  onClick={() => removeTech(tech)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {formData.techStack.length === 0 && (
              <span className="text-gray-500 text-sm italic">No technologies added</span>
            )}
          </div>
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
              <span>Save Experience</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ExperienceForm;