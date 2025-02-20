import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-scroll';
import { socialLinks } from '../data';

const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 0L37.3205 10V30L20 40L2.67949 30V10L20 0Z" className="fill-gradient animate-pulse"/>
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
      PK
    </text>
  </svg>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = ['home', 'about', 'projects', 'contact'];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[var(--dark-bg)]/80 backdrop-blur-lg border-b border-[var(--border-color)]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="hero"
            smooth={true}
            duration={500}
            className="flex items-center cursor-pointer"
          >
            <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
            <span className="ml-2 text-lg font-bold">Priyansh</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1">
            {navItems.map((item) => (
              <Link
                key={item}
                to={item}
                smooth={true}
                duration={500}
                className="px-6 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer capitalize"
                activeClass="text-white"
                spy={true}
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-dark-300">
            {navItems.map((item) => (
              <Link
                key={item}
                to={item}
                smooth={true}
                duration={500}
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white transition-colors cursor-pointer capitalize"
                activeClass="text-white"
                spy={true}
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;