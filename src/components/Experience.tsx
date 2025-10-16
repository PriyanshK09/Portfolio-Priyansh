import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Briefcase, Award, Calendar, Building2, ExternalLink, Star, Globe } from 'lucide-react';
import { experiences as staticExperiences, certificates as staticCertificates } from '../data';
import { Experience as ExperienceType, Certificate } from '../types';

interface ExperienceProps {
  experiences?: ExperienceType[];
  certificates?: Certificate[];
}

const Experience: React.FC<ExperienceProps> = ({
  experiences = staticExperiences,
  certificates = staticCertificates
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="experience" className="relative py-24 px-4">
      {/* top hairline */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(16,185,129,0.6),rgba(34,211,238,0.35),rgba(99,102,241,0.35),rgba(107,59,255,0.3))]" />
      {/* background glows + grid + rings */}
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
              Journey
            </span>
          </div>
          <h2 className="section-title">Professional <span className="name-gradient">Experience</span></h2>
          <p className="section-subtitle">Work experience and certifications</p>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Work Experience */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="mb-3 flex justify-start">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-[11px] tracking-wide uppercase text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
                Work Experience
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-6">Work Experience</h3>
            
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                className="glass-card p-6 relative overflow-hidden group border-white/10 hover:border-[var(--primary)]/30 transition-colors rounded-2xl will-change-transform"
                whileHover={{ y: -6, boxShadow: '0 22px 60px rgba(0,0,0,0.45), 0 0 40px rgba(16,185,129,0.25)' }}
                whileTap={{ y: -2, boxShadow: '0 14px 32px rgba(0,0,0,0.35), 0 0 22px rgba(16,185,129,0.18)' }}
                transition={{ type: 'spring', stiffness: 320, damping: 24, mass: 0.6 }}
              >
                {/* full-card subtle glow outline on hover */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent group-hover:border-[var(--primary)]/60 group-hover:shadow-[0_0_64px_rgba(16,185,129,0.35)] transition-[box-shadow,border-color]" />
                {/* inner radial glow */}
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.16),transparent_60%)]" />

                {/* Featured Internship ribbon for Tata */}
                {exp.company?.toLowerCase().includes('tata technologies') && (
                  <div className="absolute right-4 top-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[var(--primary)]/15 border border-[var(--primary)]/40 text-[var(--primary)] shadow-[0_0_18px_rgba(16,185,129,0.3)] backdrop-blur-sm">
                      <Star size={12} className="text-[var(--primary)]" />
                      Internship
                    </span>
                  </div>
                )}

                {/* timeline node */}
                <div className="absolute -left-3 top-6 w-6 h-6 rounded-full bg-[var(--primary)]/90 ring-2 ring-white/15 shadow-[0_0_14px_rgba(16,185,129,0.35)] flex items-center justify-center">
                  <Briefcase size={14} className="text-[var(--dark-bg)]" />
                </div>

                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[var(--text-secondary)]">
                    <Calendar size={12} />
                    {exp.duration}
                  </span>
                  <h4 className="text-xl font-bold tracking-tight">{exp.position}</h4>
                  <p className="text-[var(--text-secondary)] inline-flex items-center gap-1.5">
                    <Building2 size={14} className="text-white/50" /> {exp.company}
                  </p>
                  
                  <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
                    {exp.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2 pt-4">
                    {exp.techStack.map((tech) => (
                      <span key={tech} className="skill-tag hover:text-[var(--text-primary)]/90 border-white/10 hover:border-[var(--primary)]/35">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {experiences.length === 0 && (
              <div className="glass-card p-6 text-center">
                <p className="text-[var(--text-secondary)]">No experience data available</p>
              </div>
            )}
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="mb-3 flex justify-start">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-[11px] tracking-wide uppercase text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
                Certifications
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-6">Certifications</h3>
            
            {certificates.map((cert, index) => (
              <motion.a
                key={index}
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-6 relative overflow-hidden group block border-white/10 hover:border-[var(--primary)]/30 transition-colors rounded-2xl will-change-transform"
                whileHover={{ y: -6, boxShadow: '0 22px 60px rgba(0,0,0,0.45), 0 0 40px rgba(16,185,129,0.25)' }}
                whileTap={{ y: -2, boxShadow: '0 14px 32px rgba(0,0,0,0.35), 0 0 22px rgba(16,185,129,0.18)' }}
                transition={{ type: 'spring', stiffness: 320, damping: 24, mass: 0.6 }}
              >
                {/* full-card subtle glow outline on hover */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent group-hover:border-[var(--primary)]/60 group-hover:shadow-[0_0_64px_rgba(16,185,129,0.35)] transition-[box-shadow,border-color]" />
                {/* inner radial glow */}
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.16),transparent_60%)]" />
                {/* top-right link icon */}
                <div className="absolute right-4 top-4 opacity-60 group-hover:opacity-90 transition-opacity">
                  <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-white/5 border border-white/10">
                    <ExternalLink size={14} />
                  </span>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-md bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                    <Award className="text-[var(--primary)]" size={20} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold">{cert.title}</h4>
                    <p className="text-[var(--text-secondary)]">{cert.issuer}</p>
                    <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[var(--text-secondary)]">
                      <Calendar size={12} />
                      {cert.date}
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
            
            {certificates.length === 0 && (
              <div className="glass-card p-6 text-center">
                <p className="text-[var(--text-secondary)]">No certification data available</p>
              </div>
            )}

            {/* Agency / Freelance section */}
            <div className="mt-8">
              <div className="mb-3 flex justify-start">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-[11px] tracking-wide uppercase text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
                  Agency
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-6">Zeploy — Web Development</h3>

              <motion.a
                href="https://zeploy.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-6 relative overflow-hidden group block border-white/10 hover:border-[var(--primary)]/30 transition-colors rounded-2xl will-change-transform"
                whileHover={{ y: -6, boxShadow: '0 22px 60px rgba(0,0,0,0.45), 0 0 40px rgba(16,185,129,0.25)' }}
                whileTap={{ y: -2, boxShadow: '0 14px 32px rgba(0,0,0,0.35), 0 0 22px rgba(16,185,129,0.18)' }}
                transition={{ type: 'spring', stiffness: 320, damping: 24, mass: 0.6 }}
                aria-label="Visit zeploy.dev"
              >
                {/* full-card subtle glow outline on hover */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent group-hover:border-[var(--primary)]/60 group-hover:shadow-[0_0_64px_rgba(16,185,129,0.35)] transition-[box-shadow,border-color]" />
                {/* inner radial glow */}
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.16),transparent_60%)]" />
                {/* top-right link icon */}
                <div className="absolute right-4 top-4 opacity-60 group-hover:opacity-90 transition-opacity">
                  <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-white/5 border border-white/10">
                    <ExternalLink size={14} />
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-md bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                    <Globe className="text-[var(--primary)]" size={20} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold">Zeploy — Web Dev Agency</h4>
                    <p className="text-[var(--text-secondary)]">I founded Zeploy, building modern, fast websites and apps for clients as freelance gigs.</p>
                    <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[var(--text-secondary)]">
                      <ExternalLink size={12} />
                      zeploy.dev
                    </span>
                  </div>
                </div>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experience;