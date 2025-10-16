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
          whileHover={{ y: -6, boxShadow: '0 22px 60px rgba(0,0,0,0.45), 0 0 40px rgba(16,185,129,0.25)' }}
          whileTap={{ y: -2, boxShadow: '0 14px 32px rgba(0,0,0,0.35), 0 0 22px rgba(16,185,129,0.18)' }}
          className="contact-card relative overflow-hidden group p-8 md:p-10 border-white/10 hover:border-[var(--primary)]/30 transition-colors will-change-transform"
        >
          {/* full-card subtle glow outline on hover */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent group-hover:border-[var(--primary)]/60 group-hover:shadow-[0_0_64px_rgba(16,185,129,0.35)] transition-[box-shadow,border-color]" />
          {/* inner radial glow */}
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.16),transparent_60%)]" />
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-white/90 flex items-center gap-2">
                  <User size={16} className="text-[var(--primary)]" />
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:bg-white/[0.07] focus:border-[var(--primary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-200"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-white/90 flex items-center gap-2">
                  <Mail size={16} className="text-[var(--primary)]" />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:bg-white/[0.07] focus:border-[var(--primary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-200"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-semibold text-white/90 flex items-center gap-2">
                <MessageSquare size={16} className="text-[var(--primary)]" />
                Message
              </label>
              <textarea
                id="message"
                required
                rows={6}
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 resize-none focus:bg-white/[0.07] focus:border-[var(--primary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-200"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell me about your project..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              {status === 'error' && (
                <p className="text-sm text-red-400 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  Failed to send. Please try again.
                </p>
              )}
              {status === 'success' && (
                <p className="text-sm text-[var(--primary)] flex items-center gap-2">
                  <CheckCircle size={16} />
                  Message sent successfully!
                </p>
              )}
              <div className={status === 'idle' ? 'ml-auto' : ''}>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--primary)] text-[var(--dark-bg)] font-semibold rounded-xl hover:bg-[var(--primary)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Background Elements retained via section layers above */}
    </section>
  );
};

export default Contact;