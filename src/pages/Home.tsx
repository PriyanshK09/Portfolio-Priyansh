import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import Skills from '../components/Skills';
import { PortfolioData } from '../types';

const apiUrl = import.meta.env.VITE_API_URL;

const Home = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/api/portfolio`);
        setPortfolioData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
        setError('Failed to load portfolio data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-t-2 border-b-2 border-[var(--primary)] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    // If there's an error, try to use static data from imports
    return (
      <main>
        <Hero />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
    );
  }

  return (
    <main>
      {portfolioData && (
        <>
          <Hero
            userInfo={portfolioData.userInfo}
          />
          <Skills 
            skills={portfolioData.userInfo.skills}
          />
          <Projects
            projects={portfolioData.projects}
          />
          <Experience
            experiences={portfolioData.experiences}
            certificates={portfolioData.certificates}
          />
          <Contact />
        </>
      )}
    </main>
  );
};

export default Home;