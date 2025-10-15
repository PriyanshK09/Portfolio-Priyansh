import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Briefcase, Award } from 'lucide-react';
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
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl h-72 rounded-[50%] blur-3xl opacity-[0.18] bg-[radial-gradient(closest-side,rgba(16,185,129,0.6),transparent)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] grid-pattern [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full border border-white/[0.06]" />
      <div className="pointer-events-none absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-[780px] h-[780px] rounded-full border border-white/[0.05]" />
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
          <h2 className="section-title">Experience & <span className="name-gradient">Education</span></h2>
          <p className="section-subtitle">My professional journey</p>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Work Experience */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold mb-8">Work Experience</h3>
            
            {experiences.map((exp, index) => (
              <div key={index} className="glass-card p-6 relative border-white/10 hover:border-[var(--primary)]/30 transition-colors">
                <div className="absolute -left-3 top-6 w-6 h-6 bg-[var(--primary)] rounded-full flex items-center justify-center">
                  <Briefcase size={14} className="text-[var(--dark-bg)]" />
                </div>

                <div className="space-y-2">
                  <span className="text-sm text-[var(--text-secondary)]">{exp.duration}</span>
                  <h4 className="text-xl font-bold">{exp.position}</h4>
                  <p className="text-[var(--text-secondary)]">{exp.company}</p>
                  
                  <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
                    {exp.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2 pt-4">
                    {exp.techStack.map((tech) => (
                      <span key={tech} className="skill-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
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
            <h3 className="text-2xl font-bold mb-8">Certifications</h3>
            
            {certificates.map((cert, index) => (
              <a
                key={index}
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-6 block border-white/10 hover:border-[var(--primary)]/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <Award className="text-[var(--primary)]" size={24} />
                  <div className="space-y-1">
                    <h4 className="font-bold">{cert.title}</h4>
                    <p className="text-[var(--text-secondary)]">{cert.issuer}</p>
                    <span className="text-sm text-[var(--text-secondary)]">{cert.date}</span>
                  </div>
                </div>
              </a>
            ))}
            
            {certificates.length === 0 && (
              <div className="glass-card p-6 text-center">
                <p className="text-[var(--text-secondary)]">No certification data available</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experience;