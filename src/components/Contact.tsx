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
    <section id="contact" className="relative overflow-hidden py-24 px-4">
      {/* top hairline */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(16,185,129,0.6),rgba(34,211,238,0.35),rgba(99,102,241,0.35),rgba(107,59,255,0.3))]" />
      {/* background layers */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl h-72 rounded-[50%] blur-3xl opacity-[0.18] bg-[radial-gradient(closest-side,rgba(16,185,129,0.6),transparent)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] grid-pattern [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full border border-white/[0.06]" />
      <div className="pointer-events-none absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-[780px] h-[780px] rounded-full border border-white/[0.05]" />
      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="mb-4 flex justify-center">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-[11px] tracking-wide uppercase text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
              Contact
            </span>
          </div>
          <h2 className="section-title">Let’s <span className="name-gradient">Connect</span>!</h2>
          <p className="section-subtitle">
            Got a project in mind? Let’s discuss how we can bring your ideas to life.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="contact-card p-8 md:p-10 border-white/10"
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

      {/* Background Elements retained via section layers above */}
    </section>
  );
};

export default Contact;