import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Lock } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_URL;

interface VisitorData {
  timestamp: string;
  browser: string;
  os: string;
  device: string;
  ip: string;
  path: string;
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/admin/login`, { password });
      localStorage.setItem('adminToken', response.data.token);
      setIsAuthenticated(true);
      setError('');
    } catch (error) {
      setError('Invalid password');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      fetchData(token);
    }
  }, []);

  const fetchData = async (token: string) => {
    try {
      const [visitorsRes, messagesRes] = await Promise.all([
        axios.get(`${apiUrl}/api/admin/visitors`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${apiUrl}/api/admin/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setVisitors(visitorsRes.data);
      setMessages(messagesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsAuthenticated(false);
      localStorage.removeItem('adminToken');
    }
  };

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
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>

          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Recent Messages</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-white/10">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Email</th>
                    <th className="pb-2">Message</th>
                    <th className="pb-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message, index) => (
                    <tr key={index} className="border-b border-white/5">
                      <td className="py-3">{message.name}</td>
                      <td className="py-3">{message.email}</td>
                      <td className="py-3">{message.message}</td>
                      <td className="py-3">
                        {new Date(message.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Recent Visitors</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-white/10">
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Browser</th>
                    <th className="pb-2">OS</th>
                    <th className="pb-2">Device</th>
                    <th className="pb-2">Path</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((visitor, index) => (
                    <tr key={index} className="border-b border-white/5">
                      <td className="py-3">
                        {new Date(visitor.timestamp).toLocaleDateString()}
                      </td>
                      <td className="py-3">{visitor.browser}</td>
                      <td className="py-3">{visitor.os}</td>
                      <td className="py-3">{visitor.device}</td>
                      <td className="py-3">{visitor.path}</td>
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