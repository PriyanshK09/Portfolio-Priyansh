import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github } from 'lucide-react';
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
    <section id="projects" className="py-20 relative px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="section-title">Featured Projects</h2>
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
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="glass-card overflow-hidden group flex flex-col h-full"
            >
              <div className="relative h-48">
                <img
                  src={project.image || 'https://via.placeholder.com/800x400?text=Project+Image'}
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Project+Image';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark-bg)] via-transparent to-transparent" />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-[var(--text-secondary)] mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="skill-tag">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 mt-auto">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline flex-1"
                  >
                    <Github size={18} />
                    <span>Code</span>
                  </a>
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