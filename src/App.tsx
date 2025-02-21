import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Create a PathTracker component
const PathTracker = () => {
  const [trackedSections, setTrackedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Skip tracking for admin pages
    if (window.location.pathname.includes('admin')) {
      return;
    }

    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('a[href]');
    
    const options = {
      threshold: 0.3,
      rootMargin: '-20% 0px -20% 0px'
    };

    const trackInteraction = async (type: 'view' | 'click', elementId: string) => {
      try {
        if (type === 'view' && trackedSections.has(elementId)) {
          return; // Skip if already tracked this section
        }

        await axios.post(`${import.meta.env.VITE_API_URL}/api/track`, {
          path: elementId,
          interactionType: type
        });

        if (type === 'view') {
          setTrackedSections(prev => new Set([...prev, elementId]));
        }
      } catch (error) {
        // Silently fail for tracking errors
      }
    };

    // Track section views
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          trackInteraction('view', entry.target.id);
        }
      });
    }, options);

    // Observe all sections
    sections.forEach(section => {
      observer.observe(section);
    });

    // Track link clicks
    const handleLinkClick = (e: MouseEvent) => {
      const link = e.currentTarget as HTMLAnchorElement;
      trackInteraction('click', `link_${link.href}`);
    };

    links.forEach(link => {
      link.addEventListener('click', handleLinkClick);
    });

    // Cleanup
    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
      links.forEach(link => {
        link.removeEventListener('click', handleLinkClick);
      });
    };
  }, [trackedSections]); // Add trackedSections as dependency

  return null;
};

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <div className="min-h-screen bg-[#0a0a0a] text-white">
          <PathTracker />
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </I18nextProvider>
  );
}

export default App;