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
    <section id="experience" className="py-20 relative px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Experience & Education</h2>
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
              <div key={index} className="glass-card p-6 relative">
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
                className="glass-card p-6 block hover:border-[var(--primary)] transition-colors"
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