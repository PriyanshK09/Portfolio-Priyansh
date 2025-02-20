import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Send, CheckCircle, Mail, User, MessageSquare } from 'lucide-react';
import axios from 'axios';

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="py-20 relative px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-[var(--primary)] mb-2 block">
            Contact
          </span>
            <h2 className="section-title">Let's Connect!</h2>
          <p className="section-subtitle">
            Got a project in mind? Let's discuss how we can bring your ideas to life.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="contact-card p-8 md:p-10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label htmlFor="name" className="text-sm font-medium mb-2 block text-[var(--text-secondary)]">
                  Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    required
                    className="form-input pl-10"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                  />
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                </div>
              </div>
              <div className="relative">
                <label htmlFor="email" className="text-sm font-medium mb-2 block text-[var(--text-secondary)]">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    required
                    className="form-input pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                </div>
              </div>
            </div>
            <div className="relative">
              <label htmlFor="message" className="text-sm font-medium mb-2 block text-[var(--text-secondary)]">
                Message
              </label>
              <div className="relative">
                <textarea
                  id="message"
                  required
                  rows={6}
                  className="form-input pl-10 resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your project..."
                />
                <MessageSquare size={18} className="absolute left-3 top-[1.7rem] text-[var(--text-secondary)]" />
              </div>
            </div>
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="contact-button"
              >
                {status === 'loading' ? (
                  <>
                    <div className="w-5 h-5 border-t-2 border-b-2 border-current rounded-full animate-spin" />
                    Sending...
                  </>
                ) : status === 'success' ? (
                  <>
                    <CheckCircle size={20} />
                    Message Sent!
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-50">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[var(--primary)] rounded-full filter blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-[var(--secondary)] rounded-full filter blur-[120px]" />
      </div>
    </section>
  );
};

export default Contact;