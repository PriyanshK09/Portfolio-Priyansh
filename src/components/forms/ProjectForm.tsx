import React, { useState } from 'react';
import { Project } from '../../types';
import { Save, X, Plus, Trash2 } from 'lucide-react';

interface ProjectFormProps {
  project: Project | null;
  onSave: (data: Project) => Promise<boolean> | boolean;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Project>(
    project || {
      id: '',
      title: '',
      description: '',
      techStack: [],
      githubUrl: '',
      demoUrl: '',
      image: ''
    }
  );
  const [loading, setLoading] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    if (!formData.id) newErrors.id = 'ID is required';
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (formData.techStack.length === 0) newErrors.techStack = 'At least one technology is required';
    if (!formData.githubUrl) newErrors.githubUrl = 'GitHub URL is required';
    if (formData.image && !isValidUrl(formData.image)) newErrors.image = 'Please enter a valid image URL';
    
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

  const addTech = () => {
    if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, techInput.trim()]
      });
      setTechInput('');
      // Clear tech error if it exists
      if (errors.techStack) {
        setErrors({
          ...errors,
          techStack: ''
        });
      }
    }
  };

  const removeTech = (tech: string) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter(t => t !== tech)
    });
  };
  
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Project ID</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            className={`form-input ${errors.id ? 'border-red-500' : ''}`}
            placeholder="e.g., project-name"
            disabled={Boolean(project)} // Disable if editing existing project
          />
          {errors.id && <p className="text-red-500 text-sm mt-1">{errors.id}</p>}
          {!project && <p className="text-gray-500 text-xs mt-1">Must be unique, lowercase with no spaces</p>}
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`form-input ${errors.title ? 'border-red-500' : ''}`}
            placeholder="e.g., FinTrack – Smart Finance Management App"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`form-input ${errors.description ? 'border-red-500' : ''}`}
            placeholder="Describe your project"
            rows={3}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">Technologies</label>
          <div className="flex">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
              className={`form-input flex-1 rounded-r-none ${errors.techStack ? 'border-red-500' : ''}`}
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
          {errors.techStack && <p className="text-red-500 text-sm mt-1">{errors.techStack}</p>}
          
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
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">GitHub URL</label>
          <input
            type="url"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            className={`form-input ${errors.githubUrl ? 'border-red-500' : ''}`}
            placeholder="e.g., https://github.com/username/repo"
          />
          {errors.githubUrl && <p className="text-red-500 text-sm mt-1">{errors.githubUrl}</p>}
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">Demo URL (Optional)</label>
          <input
            type="url"
            name="demoUrl"
            value={formData.demoUrl || ''}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., https://demo-url.com"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">Image URL</label>
          <input
            type="url"
            name="image"
            value={formData.image || ''}
            onChange={handleChange}
            className={`form-input ${errors.image ? 'border-red-500' : ''}`}
            placeholder="e.g., https://images.unsplash.com/photo-123"
          />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          {formData.image && (
            <div className="mt-2">
              <img 
                src={formData.image} 
                alt="Preview" 
                className="h-32 w-full object-cover rounded-lg" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Invalid+Image+URL';
                }}
              />
            </div>
          )}
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
              <span>Save Project</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;