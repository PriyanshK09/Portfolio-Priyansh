import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github, Lock } from 'lucide-react';
import { projects as staticProjects } from '../data';
import { Project } from '../types';

interface ProjectsProps {
  projects?: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ projects = staticProjects }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="projects" className="relative py-24 px-4">
      {/* top hairline */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(16,185,129,0.6),rgba(34,211,238,0.35),rgba(99,102,241,0.35),rgba(107,59,255,0.3))]" />
      {/* background glows + grid + rings */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl h-72 rounded-[50%] blur-3xl opacity-[0.18] bg-[radial-gradient(closest-side,rgba(16,185,129,0.6),transparent)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] grid-pattern [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full border border-white/[0.06]" />
      <div className="pointer-events-none absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-[780px] h-[780px] rounded-full border border-white/[0.05]" />
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="mb-4 flex justify-center">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-[11px] tracking-wide uppercase text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
              Portfolio
            </span>
          </div>
          <h2 className="section-title">Featured <span className="name-gradient">Projects</span></h2>
          <p className="section-subtitle">
            Showcasing my best work and technical expertise
          </p>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -6, scale: 1.005, boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}
              whileTap={{ scale: 0.997 }}
              className="glass-card overflow-hidden group flex flex-col h-full border-white/10 hover:border-[var(--primary)]/30 transition-colors relative will-change-transform md:hover:translate-y-[-6px]"
              role="article" aria-label={project.title}
            >
              {/* Tag ribbon on hover */}
              <div className="pointer-events-none absolute -right-10 top-4 rotate-45">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="inline-block bg-[var(--primary)]/15 border border-[var(--primary)]/35 text-[var(--primary)] text-[10px] font-semibold tracking-wider px-8 py-1 rounded">{index === 0 ? 'FEATURED' : 'PROJECT'}</span>
                </div>
              </div>
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image || 'https://via.placeholder.com/800x400?text=Project+Image'}
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-[1.06] transition-transform duration-700 ease-[cubic-bezier(.22,.99,.43,1)]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Project+Image';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark-bg)] via-transparent to-transparent" />
                {/* shine sweep */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-out bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.12),transparent)] hidden md:block" />

                {/* image overlay actions */}
                <div className="pointer-events-none absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {!(project as any).privateRepo ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/55 transition"
                      aria-label={`${project.title} code on GitHub`}
                    >
                      <Github size={16} />
                    </a>
                  ) : (
                    <span
                      className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/70"
                      title="Private repository (NDA)"
                      aria-label="Private repository (NDA)"
                    >
                      <Lock size={16} />
                    </span>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/55 transition"
                      aria-label={`${project.title} live demo`}
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="relative mb-2">
                  <h3 className="text-xl font-bold tracking-tight pr-6">{project.title}</h3>
                  {/* Featured spark/glow for first card */}
                  {index === 0 && (
                    <motion.span
                      className="absolute -right-0.5 top-1.5 h-2 w-2 rounded-full bg-[var(--primary)] shadow-[0_0_12px_rgba(16,185,129,0.9)]"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                      transition={{ repeat: Infinity, duration: 1.6 }}
                      aria-hidden
                    />
                  )}
                </div>
                <p className="text-[var(--text-secondary)] mb-4 leading-relaxed">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="skill-tag border-white/10 hover:border-[var(--primary)]/35 hover:text-[var(--text-primary)]/90">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-white/5 flex items-center gap-3">
                  {!(project as any).privateRepo ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline flex-1"
                    >
                      <Github size={18} />
                      <span>Code</span>
                    </a>
                  ) : (
                    <div
                      className="btn-outline flex-1 opacity-80 cursor-not-allowed select-none justify-center"
                      aria-disabled
                      title="Private repository (NDA)"
                    >
                      <Lock size={18} />
                      <span>Private</span>
                    </div>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex-1"
                    >
                      <ExternalLink size={18} />
                      <span>Visit</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;