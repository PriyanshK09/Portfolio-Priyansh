import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Code, Layers, Wrench, Lightbulb } from 'lucide-react';
import { useRef } from 'react';

interface SkillsProps {
  skills?: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    other: string[];
  };
}

const Skills: React.FC<SkillsProps> = ({ 
  skills = {
    languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++'],
    frameworks: ['React', 'Node.js', 'Express', 'Next.js', 'TailwindCSS'],
    tools: ['Git', 'GitHub', 'VS Code', 'Docker', 'Figma'],
    other: ['RESTful APIs', 'GraphQL', 'CI/CD', 'Agile', 'Unit Testing']
  } 
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  
  const skillCategories = [
    { 
      title: 'Languages', 
      items: skills.languages, 
      icon: <Code className="text-[var(--primary)]" size={24} /> 
    },
    { 
      title: 'Frameworks', 
      items: skills.frameworks, 
      icon: <Layers className="text-[var(--primary)]" size={24} /> 
    },
    { 
      title: 'Tools', 
      items: skills.tools, 
      icon: <Wrench className="text-[var(--primary)]" size={24} /> 
    },
    { 
      title: 'Other', 
      items: skills.other, 
      icon: <Lightbulb className="text-[var(--primary)]" size={24} /> 
    },
  ];

  return (
    <section id="skills" className="py-20 px-6">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">My Skills</h2>
          <p className="section-subtitle">Technologies I work with</p>
        </motion.div>

        <div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 relative overflow-hidden group"
            >
              <div className="absolute right-4 top-4 opacity-20 group-hover:opacity-30 transition-opacity">
                {category.icon}
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-md bg-[var(--primary)]/10">
                  {React.cloneElement(category.icon, { size: 18 })}
                </div>
                <h3 className="text-xl font-bold">{category.title}</h3>
              </div>
              
              <div className="flex flex-wrap gap-2 relative z-10">
                {category.items.map((skill, i) => (
                  <motion.span 
                    key={i}
                    className="skill-tag"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: index * 0.1 + i * 0.05 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;