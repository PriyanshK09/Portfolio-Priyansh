//
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import Skills from '../components/Skills';
import Education from '../components/Education';
import { projects, experiences, certificates, skills } from '../data';

const Home = () => {
  return (
    <main>
      <Hero />
      <Skills skills={skills as any} />
      <Projects projects={projects} />
      <Experience experiences={experiences} certificates={certificates} />
      <Education />
      <Contact />
    </main>
  );
};

export default Home;