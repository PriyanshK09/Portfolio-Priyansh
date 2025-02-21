import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { ArrowDown } from 'lucide-react';
import Typewriter from 'typewriter-effect';
import { useTranslation } from 'react-i18next';
import { Github, Linkedin, Mouse } from 'lucide-react';
import { socialLinks } from '../data';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Hi, I'm <span className="text-primary">Priyansh</span> Khare
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 mb-8"
          >
            <Typewriter
              options={{
                strings: [
                  'Student',
                  'Full Stack Developer',
                  'Web Developer',
                  'DSA Enthusiast',
                  'Problem Solver'
                ],
                autoStart: true,
                loop: true,
              }}
            />
          </motion.div>

            <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-gray-400 max-w-2xl mb-12"
            >
            Specialized in MERN Stack development with a passion for creating.
            <br />
            I build exceptional and accessible digital experiences for the web.
            <br />
            My goal is to blend creativity 
            with technical expertise to build impactful digital experiences that make a difference.
            </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col items-center"
          >
            <Link
              to="projects"
              smooth={true}
              duration={500}
              className="cursor-pointer flex flex-col items-center"
            >
              <div className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors duration-300">
                <ArrowDown 
                  className="animate-bounce text-primary" 
                  size={32}
                />
              </div>
              <span className="text-sm text-gray-400 mt-2 mb-4">Scroll to explore</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;