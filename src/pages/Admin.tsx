import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Lock, MessageSquare, Users } from 'lucide-react';

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

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [visitors, setVisitors] = useState<VisitorData[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      fetchData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchData = async (token: string) => {
    try {
      setLoading(true);
      setError(null);

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

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;
    
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${apiUrl}/api/admin/login`, { password });
      localStorage.setItem('adminToken', response.data.token);
      await fetchData(response.data.token);
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid password');
    } finally {
      setLoading(false);
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
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
            <button
              onClick={() => {
                localStorage.removeItem('adminToken');
                setIsAuthenticated(false);
              }}
              className="px-4 py-2 text-sm rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10"
            >
              Logout
            </button>
          </div>

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
                      <td className="py-4 pr-6 font-mono text-sm">{visitor.ip}</td>
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
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;