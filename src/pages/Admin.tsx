import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Lock, MessageSquare, Users, MapPin, FileEdit, User, Briefcase, Award, PlusCircle, Trash2, Edit, Settings } from 'lucide-react';
import GeoLocationPopup from '../components/GeoLocationPopup';
import AdminModal from '../components/AdminModal';
import UserInfoForm from '../components/forms/UserInfoForm';
import ProjectForm from '../components/forms/ProjectForm';
import ExperienceForm from '../components/forms/ExperienceForm';
import CertificateForm from '../components/forms/CertificateForm';

// Import the types
import { PortfolioData, UserInfo, Project, Experience, Certificate } from '../types';

const apiUrl = import.meta.env.VITE_API_URL;

interface VisitorData {
  timestamp: string;
  localTime: string;
  browser: string;
  os: string;
  device: string;
  ip: string;
  path: string;
  section: string;
}

interface Message {
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

type ActiveTab = 'stats' | 'portfolio' | 'settings';
type PortfolioTab = 'info' | 'projects' | 'experiences' | 'certificates';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [visitors, setVisitors] = useState<VisitorData[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIp, setSelectedIp] = useState<string | null>(null);
  const [isGeoPopupOpen, setIsGeoPopupOpen] = useState(false);
  
  // New states for portfolio management
  const [activeTab, setActiveTab] = useState<ActiveTab>('stats');
  const [portfolioTab, setPortfolioTab] = useState<PortfolioTab>('info');
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [portfolioError, setPortfolioError] = useState('');
  
  // Form modals state
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      fetchData(token);
      fetchPortfolioData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchData = async (token: string) => {
    try {
      setLoading(true);
      setError('');

      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000 // 5 second timeout
      };

      const [visitorsRes, messagesRes] = await Promise.all([
        axios.get(`${apiUrl}/api/admin/visitors`, config),
        axios.get(`${apiUrl}/api/admin/messages`, config)
      ]);

      if (visitorsRes.data) setVisitors(visitorsRes.data);
      if (messagesRes.data) setMessages(messagesRes.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem('adminToken');
      }
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPortfolioData = async (token: string) => {
    try {
      setPortfolioLoading(true);
      setPortfolioError('');

      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.get(`${apiUrl}/api/portfolio`, config);
      setPortfolioData(response.data);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      setPortfolioError('Failed to fetch portfolio data');
    } finally {
      setPortfolioLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;
    
    try {
      setLoading(true);
      setError('');
      const response = await axios.post(`${apiUrl}/api/admin/login`, { password });
      localStorage.setItem('adminToken', response.data.token);
      await fetchData(response.data.token);
      await fetchPortfolioData(response.data.token);
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid password');
    } finally {
      setLoading(false);
    }
  };

  const handleIpClick = (ip: string) => {
    setSelectedIp(ip);
    setIsGeoPopupOpen(true);
  };

  // Portfolio management handlers
  const getAuthConfig = () => {
    const token = localStorage.getItem('adminToken');
    return {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  const handleUserInfoSave = async (data: UserInfo) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/portfolio/user-info`, 
        data, 
        getAuthConfig()
      );
      
      setPortfolioData(prev => prev ? {
        ...prev,
        userInfo: response.data
      } : null);
      
      setIsUserInfoModalOpen(false);
      return true;
    } catch (error) {
      console.error('Error updating user info:', error);
      return false;
    }
  };

  const handleProjectSave = async (data: Project) => {
    try {
      let response;
      
      if (selectedProject) {
        // Update existing project
        response = await axios.put(
          `${apiUrl}/api/portfolio/projects/${data.id}`, 
          data, 
          getAuthConfig()
        );
        
        setPortfolioData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            projects: prev.projects.map(p => 
              p.id === data.id ? response.data : p
            )
          };
        });
      } else {
        // Create new project
        response = await axios.post(
          `${apiUrl}/api/portfolio/projects`, 
          data, 
          getAuthConfig()
        );
        
        setPortfolioData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            projects: [...prev.projects, response.data]
          };
        });
      }
      
      setIsProjectModalOpen(false);
      setSelectedProject(null);
      return true;
    } catch (error) {
      console.error('Error saving project:', error);
      return false;
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await axios.delete(
        `${apiUrl}/api/portfolio/projects/${id}`, 
        getAuthConfig()
      );
      
      setPortfolioData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          projects: prev.projects.filter(p => p.id !== id)
        };
      });
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleExperienceSave = async (data: Experience) => {
    try {
      let response;
      
      if (selectedExperience) {
        // Update existing experience
        const id = (selectedExperience as any)._id;
        response = await axios.put(
          `${apiUrl}/api/portfolio/experiences/${id}`, 
          data, 
          getAuthConfig()
        );
        
        setPortfolioData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            experiences: prev.experiences.map(e => 
              (e as any)._id === id ? response.data : e
            )
          };
        });
      } else {
        // Create new experience
        response = await axios.post(
          `${apiUrl}/api/portfolio/experiences`, 
          data, 
          getAuthConfig()
        );
        
        setPortfolioData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            experiences: [...prev.experiences, response.data]
          };
        });
      }
      
      setIsExperienceModalOpen(false);
      setSelectedExperience(null);
      return true;
    } catch (error) {
      console.error('Error saving experience:', error);
      return false;
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    
    try {
      await axios.delete(
        `${apiUrl}/api/portfolio/experiences/${id}`, 
        getAuthConfig()
      );
      
      setPortfolioData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          experiences: prev.experiences.filter(e => (e as any)._id !== id)
        };
      });
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };

  const handleCertificateSave = async (data: Certificate) => {
    try {
      let response;
      
      if (selectedCertificate) {
        // Update existing certificate
        const id = (selectedCertificate as any)._id;
        response = await axios.put(
          `${apiUrl}/api/portfolio/certificates/${id}`, 
          data, 
          getAuthConfig()
        );
        
        setPortfolioData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            certificates: prev.certificates.map(c => 
              (c as any)._id === id ? response.data : c
            )
          };
        });
      } else {
        // Create new certificate
        response = await axios.post(
          `${apiUrl}/api/portfolio/certificates`, 
          data, 
          getAuthConfig()
        );
        
        setPortfolioData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            certificates: [...prev.certificates, response.data]
          };
        });
      }
      
      setIsCertificateModalOpen(false);
      setSelectedCertificate(null);
      return true;
    } catch (error) {
      console.error('Error saving certificate:', error);
      return false;
    }
  };

  const handleDeleteCertificate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    
    try {
      await axios.delete(
        `${apiUrl}/api/portfolio/certificates/${id}`, 
        getAuthConfig()
      );
      
      setPortfolioData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          certificates: prev.certificates.filter(c => (c as any)._id !== id)
        };
      });
    } catch (error) {
      console.error('Error deleting certificate:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-8 w-full max-w-md"
        >
          <div className="flex items-center justify-center mb-8">
            <Lock size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-dark-300 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-500/20 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-lg bg-primary text-dark-300 font-semibold hover:bg-primary/90 transition-colors"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-[var(--dark-bg)]">
      <div className="max-w-[90rem] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-[var(--primary)] mb-2 block">
                  Dashboard
                </span>
                <h1 className="text-3xl md:text-4xl font-bold">
                  Admin Panel
                </h1>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    localStorage.removeItem('adminToken');
                    setIsAuthenticated(false);
                  }}
                  className="px-4 py-2 text-sm rounded-lg border border-[var(--primary)]/20 text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-[var(--border-color)] mb-8">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('stats')}
                className={`pb-4 relative ${
                  activeTab === 'stats'
                    ? 'text-white font-medium'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Analytics
                {activeTab === 'stats' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`pb-4 relative ${
                  activeTab === 'portfolio'
                    ? 'text-white font-medium'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Portfolio Content
                {activeTab === 'portfolio' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`pb-4 relative ${
                  activeTab === 'settings'
                    ? 'text-white font-medium'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Settings
                {activeTab === 'settings' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]"></div>
                )}
              </button>
            </div>
          </div>

          {/* Content for Stats/Analytics Tab */}
          {activeTab === 'stats' && (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass rounded-xl p-6 flex items-center gap-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Visitors</p>
                    <p className="text-2xl font-bold">{visitors.length}</p>
                  </div>
                </div>
                <div className="glass rounded-xl p-6 flex items-center gap-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Messages</p>
                    <p className="text-2xl font-bold">{messages.length}</p>
                  </div>
                </div>
              </div>

              {/* Messages Table */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Recent Messages
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-left border-b border-white/10">
                        <th className="pb-4 pr-6 font-medium">Name</th>
                        <th className="pb-4 pr-6 font-medium">Email</th>
                        <th className="pb-4 pr-6 font-medium">Message</th>
                        <th className="pb-4 pr-6 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {messages.map((message, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-4 pr-6">{message.name}</td>
                          <td className="py-4 pr-6 text-primary">{message.email}</td>
                          <td className="py-4 pr-6">
                            <div className="max-w-md truncate">{message.message}</div>
                          </td>
                          <td className="py-4 pr-6 text-gray-400">
                            {new Date(message.timestamp).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                      {messages.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-gray-400">
                            No messages found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Visitors Table */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recent Visitors
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-left border-b border-white/10">
                        <th className="pb-4 pr-6 font-medium">Time</th>
                        <th className="pb-4 pr-6 font-medium">Section</th>
                        <th className="pb-4 pr-6 font-medium">IP Address</th>
                        <th className="pb-4 pr-6 font-medium">Device Info</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitors.map((visitor, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-4 pr-6 whitespace-nowrap text-gray-400">
                            {visitor.localTime}
                          </td>
                          <td className="py-4 pr-6">
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                              {visitor.section}
                            </span>
                          </td>
                          <td className="py-4 pr-6 font-mono text-sm">
                            <button
                              onClick={() => handleIpClick(visitor.ip)}
                              className="flex items-center gap-2 hover:text-[var(--primary)] transition-colors group"
                            >
                              {visitor.ip}
                              <MapPin size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          </td>
                          <td className="py-4 pr-6">
                            <div className="text-sm">
                              <span className="text-gray-400">{visitor.browser}</span>
                              <span className="mx-2">·</span>
                              <span className="text-gray-400">{visitor.os}</span>
                              <span className="mx-2">·</span>
                              <span className="text-primary">{visitor.device}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {visitors.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-gray-400">
                            No visitors found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Content for Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <>
              {/* Portfolio Sub-Navigation */}
              <div className="glass rounded-xl overflow-hidden">
                <div className="flex border-b border-[var(--border-color)]">
                  <button
                    onClick={() => setPortfolioTab('info')}
                    className={`px-6 py-4 flex items-center gap-2 ${
                      portfolioTab === 'info'
                        ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <User size={18} />
                    <span>User Info</span>
                  </button>
                  <button
                    onClick={() => setPortfolioTab('projects')}
                    className={`px-6 py-4 flex items-center gap-2 ${
                      portfolioTab === 'projects'
                        ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <FileEdit size={18} />
                    <span>Projects</span>
                  </button>
                  <button
                    onClick={() => setPortfolioTab('experiences')}
                    className={`px-6 py-4 flex items-center gap-2 ${
                      portfolioTab === 'experiences'
                        ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <Briefcase size={18} />
                    <span>Experience</span>
                  </button>
                  <button
                    onClick={() => setPortfolioTab('certificates')}
                    className={`px-6 py-4 flex items-center gap-2 ${
                      portfolioTab === 'certificates'
                        ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <Award size={18} />
                    <span>Certificates</span>
                  </button>
                </div>

                {/* Portfolio Content Area */}
                <div className="p-6">
                  {portfolioLoading ? (
                    <div className="py-10 flex justify-center">
                      <div className="w-6 h-6 border-t-2 border-b-2 border-[var(--primary)] rounded-full animate-spin"></div>
                    </div>
                  ) : portfolioError ? (
                    <div className="py-10 text-center">
                      <p className="text-red-400">{portfolioError}</p>
                      <button
                        onClick={() => fetchPortfolioData(localStorage.getItem('adminToken') || '')}
                        className="mt-4 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : !portfolioData ? (
                    <div className="py-10 text-center">
                      <p className="text-gray-400">No portfolio data available</p>
                    </div>
                  ) : (
                    <>
                      {/* User Info Tab */}
                      {portfolioTab === 'info' && (
                        <div>
                          <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Personal Information</h2>
                            <button
                              onClick={() => setIsUserInfoModalOpen(true)}
                              className="px-4 py-2 bg-[var(--primary)] text-[var(--dark-bg)] rounded-lg flex items-center gap-2 hover:bg-[var(--primary)]/90 transition-colors"
                            >
                              <Edit size={16} />
                              <span>Edit Info</span>
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="glass-card p-6 space-y-4">
                              <h3 className="font-medium text-lg">Basic Details</h3>
                              <div>
                                <p className="text-sm text-gray-400">Name</p>
                                <p className="font-medium text-lg">{portfolioData.userInfo.name.first} {portfolioData.userInfo.name.last}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">Title</p>
                                <p>{portfolioData.userInfo.title}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">About</p>
                                <p className="whitespace-pre-wrap">{portfolioData.userInfo.about}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-6">
                              <div className="glass-card p-6">
                                <h3 className="font-medium text-lg mb-4">Social Links</h3>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-400">GitHub:</span>
                                    <a 
                                      href={portfolioData.userInfo.socialLinks.github} 
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[var(--primary)] hover:underline truncate max-w-xs"
                                    >
                                      {portfolioData.userInfo.socialLinks.github}
                                    </a>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-400">LinkedIn:</span>
                                    <a 
                                      href={portfolioData.userInfo.socialLinks.linkedin} 
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[var(--primary)] hover:underline truncate max-w-xs"
                                    >
                                      {portfolioData.userInfo.socialLinks.linkedin}
                                    </a>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Email:</span>
                                    <a 
                                      href={`mailto:${portfolioData.userInfo.socialLinks.email}`} 
                                      className="text-[var(--primary)] hover:underline truncate max-w-xs"
                                    >
                                      {portfolioData.userInfo.socialLinks.email}
                                    </a>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="glass-card p-6">
                                <h3 className="font-medium text-lg mb-4">Typewriter Strings</h3>
                                <ul className="space-y-2">
                                  {portfolioData.userInfo.typewriterStrings.map((text, i) => (
                                    <li key={i} className="bg-white/5 px-3 py-2 rounded-lg">{text}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-8">
                            <h3 className="font-medium text-lg mb-4">Skills</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                              <div className="glass-card p-4">
                                <h4 className="font-medium text-[var(--primary)] mb-2">Languages</h4>
                                <div className="flex flex-wrap gap-2">
                                  {portfolioData.userInfo.skills.languages.map((skill, i) => (
                                    <span key={i} className="skill-tag">{skill}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="glass-card p-4">
                                <h4 className="font-medium text-[var(--primary)] mb-2">Frameworks</h4>
                                <div className="flex flex-wrap gap-2">
                                  {portfolioData.userInfo.skills.frameworks.map((skill, i) => (
                                    <span key={i} className="skill-tag">{skill}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="glass-card p-4">
                                <h4 className="font-medium text-[var(--primary)] mb-2">Tools</h4>
                                <div className="flex flex-wrap gap-2">
                                  {portfolioData.userInfo.skills.tools.map((skill, i) => (
                                    <span key={i} className="skill-tag">{skill}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="glass-card p-4">
                                <h4 className="font-medium text-[var(--primary)] mb-2">Other</h4>
                                <div className="flex flex-wrap gap-2">
                                  {portfolioData.userInfo.skills.other.map((skill, i) => (
                                    <span key={i} className="skill-tag">{skill}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Projects Tab */}
                      {portfolioTab === 'projects' && (
                        <div>
                          <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Projects</h2>
                            <button
                              onClick={() => {
                                setSelectedProject(null);
                                setIsProjectModalOpen(true);
                              }}
                              className="px-4 py-2 bg-[var(--primary)] text-[var(--dark-bg)] rounded-lg flex items-center gap-2 hover:bg-[var(--primary)]/90 transition-colors"
                            >
                              <PlusCircle size={18} />
                              <span>Add Project</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {portfolioData.projects.map((project) => (
                              <div key={project.id} className="glass-card overflow-hidden flex flex-col">
                                {project.image && (
                                  <div className="h-40 overflow-hidden">
                                    <img 
                                      src={project.image} 
                                      alt={project.title}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                                      }}
                                    />
                                  </div>
                                )}
                                
                                <div className="p-5 flex-grow flex flex-col">
                                  <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                                  <p className="text-gray-400 mb-4 flex-grow">{project.description}</p>
                                  
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {project.techStack.map((tech, i) => (
                                      <span key={i} className="skill-tag">{tech}</span>
                                    ))}
                                  </div>
                                  
                                  <div className="flex justify-end gap-2 mt-auto">
                                    <button 
                                      onClick={() => handleDeleteProject(project.id)}
                                      className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                                      title="Delete project"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setSelectedProject(project);
                                        setIsProjectModalOpen(true);
                                      }}
                                      className="p-2 rounded-lg hover:bg-[var(--primary)]/20 text-[var(--primary)] transition-colors"
                                      title="Edit project"
                                    >
                                      <Edit size={18} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            {portfolioData.projects.length === 0 && (
                              <div className="col-span-full py-10 text-center">
                                <p className="text-gray-400 mb-4">No projects added yet</p>
                                <button
                                  onClick={() => {
                                    setSelectedProject(null);
                                    setIsProjectModalOpen(true);
                                  }}
                                  className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 mx-auto"
                                >
                                  <PlusCircle size={18} />
                                  <span>Add Your First Project</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Experiences Tab */}
                      {portfolioTab === 'experiences' && (
                        <div>
                          <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Professional Experience</h2>
                            <button
                              onClick={() => {
                                setSelectedExperience(null);
                                setIsExperienceModalOpen(true);
                              }}
                              className="px-4 py-2 bg-[var(--primary)] text-[var(--dark-bg)] rounded-lg flex items-center gap-2 hover:bg-[var(--primary)]/90 transition-colors"
                            >
                              <PlusCircle size={18} />
                              <span>Add Experience</span>
                            </button>
                          </div>

                          <div className="space-y-6">
                            {portfolioData.experiences.map((exp, index) => (
                              <div key={index} className="glass-card p-6">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="text-sm text-gray-400">{exp.duration}</span>
                                    <h3 className="text-xl font-bold">{exp.position}</h3>
                                    <p className="text-[var(--primary)]">{exp.company}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => handleDeleteExperience((exp as any)._id)}
                                      className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                                      title="Delete experience"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setSelectedExperience(exp);
                                        setIsExperienceModalOpen(true);
                                      }}
                                      className="p-2 rounded-lg hover:bg-[var(--primary)]/20 text-[var(--primary)] transition-colors"
                                      title="Edit experience"
                                    >
                                      <Edit size={18} />
                                    </button>
                                  </div>
                                </div>
                                
                                <ul className="list-disc list-inside space-y-2 text-gray-400 mt-4 mb-6">
                                  {exp.description.map((desc, i) => (
                                    <li key={i}>{desc}</li>
                                  ))}
                                </ul>

                                <div className="flex flex-wrap gap-2">
                                  {exp.techStack.map((tech, i) => (
                                    <span key={i} className="skill-tag">{tech}</span>
                                  ))}
                                </div>
                              </div>
                            ))}
                            
                            {portfolioData.experiences.length === 0 && (
                              <div className="py-10 text-center">
                                <p className="text-gray-400 mb-4">No professional experience added yet</p>
                                <button
                                  onClick={() => {
                                    setSelectedExperience(null);
                                    setIsExperienceModalOpen(true);
                                  }}
                                  className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 mx-auto"
                                >
                                  <PlusCircle size={18} />
                                  <span>Add Your First Experience</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Certificates Tab */}
                      {portfolioTab === 'certificates' && (
                        <div>
                          <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Certificates & Awards</h2>
                            <button
                              onClick={() => {
                                setSelectedCertificate(null);
                                setIsCertificateModalOpen(true);
                              }}
                              className="px-4 py-2 bg-[var(--primary)] text-[var(--dark-bg)] rounded-lg flex items-center gap-2 hover:bg-[var(--primary)]/90 transition-colors"
                            >
                              <PlusCircle size={18} />
                              <span>Add Certificate</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {portfolioData.certificates.map((cert, index) => (
                              <div key={index} className="glass-card p-5">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-start gap-3">
                                    <Award className="text-[var(--primary)] mt-1" size={20} />
                                    <div>
                                      <h3 className="font-bold">{cert.title}</h3>
                                      <p className="text-gray-400">{cert.issuer}</p>
                                      <p className="text-sm text-gray-400 mt-1">{cert.date}</p>
                                    </div>
                                  </div>
                                  <div className="flex gap-1">
                                    <button 
                                      onClick={() => handleDeleteCertificate((cert as any)._id)}
                                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                                      title="Delete certificate"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setSelectedCertificate(cert);
                                        setIsCertificateModalOpen(true);
                                      }}
                                      className="p-1.5 rounded-lg hover:bg-[var(--primary)]/20 text-[var(--primary)] transition-colors"
                                      title="Edit certificate"
                                    >
                                      <Edit size={16} />
                                    </button>
                                  </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
                                  <a 
                                    href={cert.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-[var(--primary)] hover:underline block truncate"
                                  >
                                    View Certificate
                                  </a>
                                </div>
                              </div>
                            ))}
                            
                            {portfolioData.certificates.length === 0 && (
                              <div className="col-span-full py-10 text-center">
                                <p className="text-gray-400 mb-4">No certificates added yet</p>
                                <button
                                  onClick={() => {
                                    setSelectedCertificate(null);
                                    setIsCertificateModalOpen(true);
                                  }}
                                  className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 mx-auto"
                                >
                                  <PlusCircle size={18} />
                                  <span>Add Your First Certificate</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Content for Settings Tab */}
          {activeTab === 'settings' && (
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings
              </h2>
              
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <h3 className="text-lg font-medium mb-4">Admin Password</h3>
                  <p className="text-gray-400 mb-4">
                    To change your admin password, please edit the corresponding environment
                    variable and regenerate the hash using the provided script.
                  </p>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <code className="text-sm text-gray-300 font-mono">
                      node server/generateHash.js
                    </code>
                  </div>
                  <p className="text-sm text-gray-400 mt-4">
                    Then update the ADMIN_PASSWORD_HASH value in your .env file.
                  </p>
                </div>
                
                <div className="glass-card p-6">
                  <h3 className="text-lg font-medium mb-4">Backup & Restore</h3>
                  <p className="text-gray-400 mb-4">
                    Use MongoDB's native backup tools to create backups of your portfolio data.
                  </p>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <code className="text-sm text-gray-300 font-mono">
                      mongodump --uri="your_mongodb_uri" --out=./backup
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Add GeoLocation Popup */}
          <GeoLocationPopup
            ip={selectedIp || ''}
            isOpen={isGeoPopupOpen}
            onClose={() => setIsGeoPopupOpen(false)}
          />

          {/* Form Modals */}
          <AdminModal
            isOpen={isUserInfoModalOpen}
            onClose={() => setIsUserInfoModalOpen(false)}
            title="Edit Personal Information"
          >
            {portfolioData && (
              <UserInfoForm
                userInfo={portfolioData.userInfo}
                onSave={handleUserInfoSave}
                onCancel={() => setIsUserInfoModalOpen(false)}
              />
            )}
          </AdminModal>

          <AdminModal
            isOpen={isProjectModalOpen}
            onClose={() => {
              setIsProjectModalOpen(false);
              setSelectedProject(null);
            }}
            title={selectedProject ? "Edit Project" : "Add New Project"}
          >
            <ProjectForm
              project={selectedProject}
              onSave={handleProjectSave}
              onCancel={() => {
                setIsProjectModalOpen(false);
                setSelectedProject(null);
              }}
            />
          </AdminModal>

          <AdminModal
            isOpen={isExperienceModalOpen}
            onClose={() => {
              setIsExperienceModalOpen(false);
              setSelectedExperience(null);
            }}
            title={selectedExperience ? "Edit Experience" : "Add New Experience"}
          >
            <ExperienceForm
              experience={selectedExperience}
              onSave={handleExperienceSave}
              onCancel={() => {
                setIsExperienceModalOpen(false);
                setSelectedExperience(null);
              }}
            />
          </AdminModal>

          <AdminModal
            isOpen={isCertificateModalOpen}
            onClose={() => {
              setIsCertificateModalOpen(false);
              setSelectedCertificate(null);
            }}
            title={selectedCertificate ? "Edit Certificate" : "Add New Certificate"}
          >
            <CertificateForm
              certificate={selectedCertificate}
              onSave={handleCertificateSave}
              onCancel={() => {
                setIsCertificateModalOpen(false);
                setSelectedCertificate(null);
              }}
            />
          </AdminModal>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;