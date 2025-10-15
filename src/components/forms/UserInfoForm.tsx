import React, { useState } from 'react';
import { UserInfo } from '../../types';
import { Save, X, Plus } from 'lucide-react';

interface UserInfoFormProps {
  userInfo: UserInfo;
  onSave: (data: UserInfo) => Promise<boolean> | boolean;
  onCancel: () => void;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ userInfo, onSave, onCancel }) => {
  const [formData, setFormData] = useState<UserInfo>({
    ...userInfo,
    // Make a deep copy of nested objects
    name: { ...userInfo.name },
    socialLinks: { ...userInfo.socialLinks },
    skills: {
      languages: [...userInfo.skills.languages],
      frameworks: [...userInfo.skills.frameworks],
      tools: [...userInfo.skills.tools],
      other: [...userInfo.skills.other]
    },
    typewriterStrings: [...userInfo.typewriterStrings]
  });
  
  const [typewriterInput, setTypewriterInput] = useState('');
  const [skillInputs, setSkillInputs] = useState({
    languages: '',
    frameworks: '',
    tools: '',
    other: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    nestedField?: string
  ) => {
    const { name, value } = e.target;
    
    if (nestedField) {
      if (nestedField === 'name') {
        setFormData({
          ...formData,
          name: {
            ...formData.name,
            [name]: value
          }
        });
      } else if (nestedField === 'socialLinks') {
        setFormData({
          ...formData,
          socialLinks: {
            ...formData.socialLinks,
            [name]: value
          }
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const addTypewriterString = () => {
    if (typewriterInput.trim() && !formData.typewriterStrings.includes(typewriterInput.trim())) {
      setFormData({
        ...formData,
        typewriterStrings: [...formData.typewriterStrings, typewriterInput.trim()]
      });
      setTypewriterInput('');
    }
  };

  const removeTypewriterString = (str: string) => {
    setFormData({
      ...formData,
      typewriterStrings: formData.typewriterStrings.filter(s => s !== str)
    });
  };

  const addSkill = (category: 'languages' | 'frameworks' | 'tools' | 'other') => {
    const value = skillInputs[category].trim();
    if (value && !formData.skills[category].includes(value)) {
      setFormData({
        ...formData,
        skills: {
          ...formData.skills,
          [category]: [...formData.skills[category], value]
        }
      });
      setSkillInputs({
        ...skillInputs,
        [category]: ''
      });
    }
  };

  const removeSkill = (category: 'languages' | 'frameworks' | 'tools' | 'other', skill: string) => {
    setFormData({
      ...formData,
      skills: {
        ...formData.skills,
        [category]: formData.skills[category].filter(s => s !== skill)
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    if (!formData.name.first) newErrors['name.first'] = 'First name is required';
    if (!formData.name.last) newErrors['name.last'] = 'Last name is required';
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.about) newErrors.about = 'About text is required';
    if (!formData.socialLinks.github) newErrors['socialLinks.github'] = 'GitHub link is required';
    if (!formData.socialLinks.linkedin) newErrors['socialLinks.linkedin'] = 'LinkedIn link is required';
    if (!formData.socialLinks.email) newErrors['socialLinks.email'] = 'Email is required';
    
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="space-y-6">
        {/* Personal Info Section */}
        <div>
          <h3 className="font-medium text-lg border-b border-[var(--border-color)] pb-2 mb-4">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">First Name</label>
              <input
                type="text"
                name="first"
                value={formData.name.first}
                onChange={(e) => handleChange(e, 'name')}
                className={`form-input ${errors['name.first'] ? 'border-red-500' : ''}`}
                placeholder="e.g., John"
              />
              {errors['name.first'] && <p className="text-red-500 text-sm mt-1">{errors['name.first']}</p>}
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Last Name</label>
              <input
                type="text"
                name="last"
                value={formData.name.last}
                onChange={(e) => handleChange(e, 'name')}
                className={`form-input ${errors['name.last'] ? 'border-red-500' : ''}`}
                placeholder="e.g., Doe"
              />
              {errors['name.last'] && <p className="text-red-500 text-sm mt-1">{errors['name.last']}</p>}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Professional Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`form-input ${errors.title ? 'border-red-500' : ''}`}
              placeholder="e.g., Full Stack Developer"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">About</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              className={`form-input ${errors.about ? 'border-red-500' : ''}`}
              placeholder="Tell people about yourself..."
              rows={4}
            />
            {errors.about && <p className="text-red-500 text-sm mt-1">{errors.about}</p>}
          </div>
        </div>
        
        {/* Social Links Section */}
        <div>
          <h3 className="font-medium text-lg border-b border-[var(--border-color)] pb-2 mb-4">Social Links</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">GitHub</label>
              <input
                type="url"
                name="github"
                value={formData.socialLinks.github}
                onChange={(e) => handleChange(e, 'socialLinks')}
                className={`form-input ${errors['socialLinks.github'] ? 'border-red-500' : ''}`}
                placeholder="e.g., https://github.com/username"
              />
              {errors['socialLinks.github'] && <p className="text-red-500 text-sm mt-1">{errors['socialLinks.github']}</p>}
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">LinkedIn</label>
              <input
                type="url"
                name="linkedin"
                value={formData.socialLinks.linkedin}
                onChange={(e) => handleChange(e, 'socialLinks')}
                className={`form-input ${errors['socialLinks.linkedin'] ? 'border-red-500' : ''}`}
                placeholder="e.g., https://linkedin.com/in/username"
              />
              {errors['socialLinks.linkedin'] && <p className="text-red-500 text-sm mt-1">{errors['socialLinks.linkedin']}</p>}
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.socialLinks.email}
                onChange={(e) => handleChange(e, 'socialLinks')}
                className={`form-input ${errors['socialLinks.email'] ? 'border-red-500' : ''}`}
                placeholder="e.g., you@example.com"
              />
              {errors['socialLinks.email'] && <p className="text-red-500 text-sm mt-1">{errors['socialLinks.email']}</p>}
            </div>
          </div>
        </div>
        
        {/* Typewriter Strings Section */}
        <div>
          <h3 className="font-medium text-lg border-b border-[var(--border-color)] pb-2 mb-4">Typewriter Strings</h3>
          
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Add New String</label>
            <div className="flex">
              <input
                type="text"
                value={typewriterInput}
                onChange={(e) => setTypewriterInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTypewriterString())}
                className="form-input flex-1 rounded-r-none"
                placeholder="e.g., Full Stack Developer"
              />
              <button
                type="button"
                onClick={addTypewriterString}
                className="px-4 bg-primary text-dark-bg hover:bg-primary/90 transition-colors rounded-r-lg"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            {formData.typewriterStrings.map((str, index) => (
              <div key={index} className="flex items-center justify-between bg-[var(--card-bg)] px-4 py-2 rounded-lg">
                <span className="pr-4">{str}</span>
                <button
                  type="button"
                  onClick={() => removeTypewriterString(str)}
                  className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            
            {formData.typewriterStrings.length === 0 && (
              <p className="text-gray-500 text-sm italic">No typewriter strings added</p>
            )}
          </div>
        </div>
        
        {/* Skills Section */}
        <div>
          <h3 className="font-medium text-lg border-b border-[var(--border-color)] pb-2 mb-4">Skills</h3>
          
          <div className="space-y-6">
            {(['languages', 'frameworks', 'tools', 'other'] as const).map((category) => (
              <div key={category}>
                <h4 className="text-[var(--primary)] capitalize mb-3">{category}</h4>
                
                <div className="flex mb-3">
                  <input
                    type="text"
                    value={skillInputs[category]}
                    onChange={(e) => setSkillInputs({ ...skillInputs, [category]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(category))}
                    className="form-input flex-1 rounded-r-none"
                    placeholder={`e.g., ${category === 'languages' ? 'JavaScript' : category === 'frameworks' ? 'React' : category === 'tools' ? 'Git' : 'UI/UX'}`}
                  />
                  <button
                    type="button"
                    onClick={() => addSkill(category)}
                    className="px-4 bg-primary text-dark-bg hover:bg-primary/90 transition-colors rounded-r-lg"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.skills[category].map((skill, i) => (
                    <div key={i} className="bg-[var(--card-bg)] px-3 py-1 rounded-full flex items-center gap-2 border border-[var(--border-color)]">
                      <span className="text-sm">{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(category, skill)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  
                  {formData.skills[category].length === 0 && (
                    <span className="text-gray-500 text-sm italic">No {category} added</span>
                  )}
                </div>
              </div>
            ))}
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
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default UserInfoForm;