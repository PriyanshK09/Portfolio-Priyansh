import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { GraduationCap, School, Calendar } from 'lucide-react';

interface EducationItem {
  institution: string;
  degree: string;
  duration: string;
}

interface EducationProps {
  college?: EducationItem;
  school?: EducationItem;
}

const Education: React.FC<EducationProps> = ({
  college = {
    institution: 'Lovely Professional University',
    degree: 'B.Tech — Computer Science and Engineering',
    duration: '2022 – 2026',
  },
  school = {
    institution: 'Central Academy (CBSE)',
    degree: 'Class X and XII',
    duration: '2019–20 (X), 2021–22 (XII)',
  }
}) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
  <section id="education" className="relative py-24 px-4">
      {/* top hairline */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(16,185,129,0.6),rgba(34,211,238,0.35),rgba(99,102,241,0.35),rgba(107,59,255,0.3))]" />
      {/* background layers */}
  <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl h-72 rounded-[50%] blur-3xl opacity-[0.18] bg-[radial-gradient(closest-side,rgba(16,185,129,0.6),transparent)] hidden md:block" />
  <div className="pointer-events-none absolute inset-0 opacity-[0.05] grid-pattern [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] hidden md:block" />
  <div className="pointer-events-none absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full border border-white/[0.06] hidden md:block" />
  <div className="pointer-events-none absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-[780px] h-[780px] rounded-full border border-white/[0.05] hidden md:block" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="mb-4 flex justify-center">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-[11px] tracking-wide uppercase text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
              Education
            </span>
          </div>
          <h2 className="section-title">Academic <span className="name-gradient">Journey</span></h2>
          <p className="section-subtitle">College and School</p>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="glass-card p-6 relative overflow-hidden group border-white/10 hover:border-[var(--primary)]/30 transition-colors"
            whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.35)' }}
            whileTap={{ y: -2, boxShadow: '0 10px 26px rgba(0,0,0,0.3)' }}
            transition={{
              opacity: { duration: 0.6 },
              y: { type: 'spring', stiffness: 320, damping: 24, mass: 0.6 },
              boxShadow: { duration: 0.25 }
            }}
          >
            {/* full-card stronger glow outline on hover */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent group-hover:border-[var(--primary)]/60 group-hover:shadow-[0_0_64px_rgba(16,185,129,0.35)] transition-[box-shadow,border-color]" />
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.16),transparent_60%)]" />
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-md bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                <GraduationCap className="text-[var(--primary)]" size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold">{college.institution}</h4>
                <p className="text-[var(--text-secondary)]">{college.degree}</p>
                <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[var(--text-secondary)]">
                  <Calendar size={12} />
                  {college.duration}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="glass-card p-6 relative overflow-hidden group border-white/10 hover:border-[var(--primary)]/30 transition-colors"
            whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.35)' }}
            whileTap={{ y: -2, boxShadow: '0 10px 26px rgba(0,0,0,0.3)' }}
            transition={{
              opacity: { duration: 0.6, delay: 0.1 },
              y: { type: 'spring', stiffness: 320, damping: 24, mass: 0.6, delay: 0.1 },
              boxShadow: { duration: 0.25 }
            }}
          >
            {/* full-card stronger glow outline on hover */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent group-hover:border-[var(--primary)]/60 group-hover:shadow-[0_0_64px_rgba(16,185,129,0.35)] transition-[box-shadow,border-color]" />
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.16),transparent_60%)]" />
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-md bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                <School className="text-[var(--primary)]" size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold">{school.institution}</h4>
                <p className="text-[var(--text-secondary)]">{school.degree}</p>
                <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[var(--text-secondary)]">
                  <Calendar size={12} />
                  {school.duration}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Education;
