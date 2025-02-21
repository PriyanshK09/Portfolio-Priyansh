import React, { useState, useEffect } from 'react';
import { Menu, X, FileText } from 'lucide-react';
import { Link } from 'react-scroll';
import ResumeModal from './ResumeModal';

const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 0L37.3205 10V30L20 40L2.67949 30V10L20 0Z" className="fill-gradient animate-pulse"/>
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
      PK
    </text>
  </svg>
);

const navItems = [
  { id: 'hero', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' }
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + 100; // Offset for better detection

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[var(--dark-bg)]/80 backdrop-blur-lg border-b border-[var(--border-color)]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo and Title */}
            <div className="flex-shrink-0">
              <Link
                to="hero"
                smooth={true}
                duration={500}
                className="flex items-center cursor-pointer group"
              >
                <img src="/assets/logo-D_pr2kY8.svg" alt="Logo" className="h-8 w-8" />
                <div className="ml-2">
                  <span className="text-lg font-bold">Priyansh's</span>
                  <span className="text-lg font-bold text-[var(--primary)]"> Portfolio</span>
                </div>
              </Link>
            </div>

            {/* Center: Navigation Links */}
            <div className="hidden md:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.id}
                    smooth={true}
                    duration={500}
                    offset={-80}
                    spy={true}
                    className={`px-4 py-2 text-sm font-medium relative group cursor-pointer transition-colors duration-300 
                      ${activeSection === item.id 
                        ? 'text-[var(--primary)]' 
                        : 'text-gray-300 hover:text-white'}`}
                  >
                    {item.label}
                    <span 
                      className={`absolute inset-x-0 bottom-0 h-0.5 bg-[var(--primary)] transform origin-left transition-transform duration-300
                        ${activeSection === item.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Resume Button */}
            <div className="hidden md:flex items-center flex-shrink-0">
              <button
                onClick={() => setIsResumeOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--primary)]/20 text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all duration-300"
              >
                <FileText size={16} />
                <span>Resume</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-[var(--border-color)]">
            <div className="px-4 py-2 space-y-1 bg-[var(--dark-bg)]/95 backdrop-blur-lg">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.id}
                  smooth={true}
                  duration={500}
                  offset={-70}
                  className={`block px-4 py-2 text-base font-medium rounded-lg transition-colors
                    ${activeSection === item.id
                      ? 'text-[var(--primary)] bg-[var(--primary)]/5'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsResumeOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 text-base font-medium text-[var(--primary)] hover:bg-[var(--primary)]/5 rounded-lg transition-colors w-full"
              >
                <FileText size={16} />
                <span>Resume</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Add Resume Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </>
  );
};

export default Navbar;