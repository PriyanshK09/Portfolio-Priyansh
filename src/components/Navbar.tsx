import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-scroll';
import { Menu, X, FileText, Aperture } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ResumeModal from './ResumeModal';

const navItems = [
  { id: 'hero', label: 'Home' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' }
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const islandRef = useRef<HTMLDivElement | null>(null);

  // Active section spy (header-aware; selects last section above adjusted top)
  useEffect(() => {
    const computeHeaderOffset = () => (window.matchMedia('(max-width: 767px)').matches ? 88 : 100);

    const setActiveFromScroll = () => {
      const sections = Array.from(document.querySelectorAll('section[id]')) as HTMLElement[];
      if (sections.length === 0) return;
      const offset = computeHeaderOffset();
      const position = window.scrollY + offset + 1; // +1 to switch as soon as new section top crosses

      let current = sections[0].id;
      for (const el of sections) {
        if (position >= el.offsetTop) current = el.id;
        else break; // sections are in DOM order; stop once we pass current top
      }
      setActiveSection(current);
    };

    const onScroll = () => setActiveFromScroll();
    const onResize = () => setActiveFromScroll();

    // Initial and listeners
    setActiveFromScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Track popup/modal open state to adjust background strength
  useEffect(() => {
    const checkPopupState = () => setIsPopupOpen(document.body.classList.contains('popup-open'));
    checkPopupState();
    const observer = new MutationObserver(checkPopupState);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('focus', checkPopupState);
    return () => {
      observer.disconnect();
      window.removeEventListener('focus', checkPopupState);
    };
  }, []);

  // (Removed) measured dropdown; now using full-screen overlay for mobile

  // Body scroll lock and Escape-to-close for mobile menu
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  return (
    <>
      {/* Dynamic Island Navigation */}
      <nav className="fixed inset-x-0 top-0 z-[60] pointer-events-none">
        {/* Subtle gradient hairline at page top */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(16,185,129,0.6),rgba(34,211,238,0.35),rgba(99,102,241,0.35),rgba(107,59,255,0.3))]" />

        {/* Reserve vertical space to avoid layout shift */}
        <div className="h-16 md:h-20" />

        {/* Centered floating island */}
        <div className="absolute inset-x-0 top-2 md:top-3 flex justify-center">
          <motion.div
            ref={islandRef}
            className={`pointer-events-auto w-[92%] max-w-[960px] rounded-full border backdrop-blur-xl px-3.5 md:px-4 h-12 md:h-14 flex items-center justify-between shadow-[0_8px_40px_rgba(0,0,0,0.35)] ${
              isPopupOpen ? 'bg-black/65 border-white/12' : 'bg-[var(--dark-bg)]/60 border-white/10'
            }`}
            initial={false}
            animate={{
              boxShadow: isOpen
                ? '0 12px 42px rgba(0,0,0,0.45), 0 0 24px rgba(16,185,129,0.18)'
                : '0 8px 40px rgba(0,0,0,0.35)',
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            {/* Left: Logo */}
            <Link to="hero" smooth duration={500} className="relative flex items-center cursor-pointer select-none group/logo">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-white/10 to-white/[0.04] border border-white/12 shadow-[0_0_12px_rgba(16,185,129,0.12)] group-hover/logo:shadow-[0_0_18px_rgba(16,185,129,0.2)] transition-all">
                <Aperture className="h-5 w-5 text-white/85 group-hover/logo:text-[var(--primary)] transition-colors" />
              </span>
            </Link>

            {/* Center: Desktop links inside island */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.id}
                  smooth
                  duration={500}
                  offset={-100}
                  spy
                  className={`relative px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors ${
                    activeSection === item.id ? 'text-[var(--primary)]' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <span className="absolute left-3 right-3 -bottom-[4px] h-[2px] rounded bg-[var(--primary)]/80 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right: Resume button and mobile toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsResumeOpen(true)}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[var(--primary)]/30 text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all hover:shadow-[0_0_18px_rgba(16,185,129,0.25)] text-sm font-semibold"
              >
                <FileText size={16} />
                Resume
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsOpen((v) => !v)}
                className="md:hidden relative inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/12 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                id="mobile-menu-button"
              >
                <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.25 }}>
                  {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.div>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Mobile full-screen overlay menu */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="mobile-menu-overlay"
              className="md:hidden fixed inset-0 z-[70]"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-menu-button"
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              {/* Background */}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,11,0.98),rgba(10,10,11,0.92))] backdrop-blur-[10px]" />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col">
                {/* Top bar inside overlay */}
                <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/10">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-white/10 to-white/[0.04] border border-white/12">
                    <Aperture className="h-5 w-5 text-white/85" />
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/12 bg-white/5 hover:bg-white/10 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Nav items */}
                <div className="flex-1 overflow-y-auto px-3 py-3">
                  <div className="space-y-1">
                    {navItems.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                      >
                        <Link
                          to={item.id}
                          smooth
                          duration={500}
                          offset={-90}
                          spy
                          className={`block px-5 py-4 text-lg font-semibold rounded-2xl cursor-pointer transition-all duration-300 ${
                            activeSection === item.id
                              ? 'bg-gradient-to-r from-[var(--primary)]/15 to-[var(--primary)]/5 text-[var(--primary)] border border-[var(--primary)]/25 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                              : 'text-gray-300 hover:text-white hover:bg-white/[0.06] border border-transparent'
                          }`}
                          onClick={() => setIsOpen(false)}
                          role="menuitem"
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  {/* Resume CTA */}
                  <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2, delay: (navItems.length + 1) * 0.05 }}
                    onClick={() => {
                      setIsOpen(false);
                      setIsResumeOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-5 py-4 text-lg font-semibold bg-gradient-to-r from-[var(--primary)]/20 to-[var(--primary)]/10 text-[var(--primary)] hover:from-[var(--primary)]/30 hover:to-[var(--primary)]/15 rounded-2xl border border-[var(--primary)]/30 transition-all duration-300 shadow-[0_0_24px_rgba(16,185,129,0.12)] active:scale-95"
                  >
                    <FileText size={18} />
                    <span>Download Resume</span>
                  </motion.button>
                </div>

                {/* Bottom safe-area padding */}
                <div className="h-4" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </>
  );
};

export default Navbar;
