import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-scroll';
import { ArrowDown, Github, Linkedin, Mail, Download, Send, ArrowRight } from 'lucide-react';
import Typewriter from 'typewriter-effect';
import { useTranslation } from 'react-i18next';
import { socialLinks } from '../data';
import { UserInfo } from '../types';

interface HeroProps {
  userInfo?: UserInfo;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// Normalize various input shapes into a clean, flat string array
const normalizeStringArray = (value: any, fallback: string[]): string[] => {
  try {
    const SEP = /[|,;\\/·•]+/; // common delimiters
    const out: string[] = [];

    const pushTokens = (s: any) => {
      if (s == null) return;
      let str = typeof s === 'string' ? s : s?.name ?? (typeof s === 'number' ? String(s) : '');
      if (typeof str !== 'string') return;
      str
        .split(SEP)
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((t) => out.push(t));
    };

    const walk = (v: any) => {
      if (Array.isArray(v)) {
        v.forEach((item) => walk(item));
      } else if (v && typeof v === 'object') {
        const vals = Object.values(v as Record<string, any>);
        if (vals.length) vals.forEach((it) => walk(it));
        else pushTokens(v);
      } else if (typeof v === 'string') {
        pushTokens(v);
      } else if (typeof v === 'number') {
        pushTokens(String(v));
      }
    };

    walk(value);

    // de-duplicate while preserving order
    const seen = new Set<string>();
    const deduped = out.filter((t) => {
      if (seen.has(t)) return false;
      seen.add(t);
      return true;
    });

    return deduped.length ? deduped : fallback;
  } catch (_) {
    return fallback;
  }
};

const Hero: React.FC<HeroProps> = ({ userInfo }) => {
  // i18n hook reserved for future localized content (unused for now)
  useTranslation();

  const links = userInfo?.socialLinks || socialLinks;
  const typewriterStrings = normalizeStringArray(userInfo?.typewriterStrings, [
    'MERN Stack Developer',
    'Full‑Stack Engineer',
    'Open Source Contributor',
    'Problem Solver',
  ]);

  const nameFirst = userInfo?.name?.first || 'Priyansh';
  const nameLast = userInfo?.name?.last || 'Khare';

  // Display skills (explicit order as requested)
  const displaySkills = [
    'React',
    'TypeScript',
    'Node.js',
    'Express',
    'MongoDB',
    'JavaScript',
    'Tailwind',
    'C++',
  ];

  // Parallax motion values for background elements
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 25, mass: 0.3 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 25, mass: 0.3 });

  // Different depth factors
  const xSlow = useTransform(smoothX, (v) => v * 12);
  const ySlow = useTransform(smoothY, (v) => v * 12);
  const xMed = useTransform(smoothX, (v) => v * -20);
  const yMed = useTransform(smoothY, (v) => v * -20);
  const xFast = useTransform(smoothX, (v) => v * 35);
  const yFast = useTransform(smoothY, (v) => v * 35);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Normalize to [-1, 1] based on viewport center
    const iw = window.innerWidth || 1;
    const ih = window.innerHeight || 1;
    const dx = (e.clientX - iw / 2) / (iw / 2);
    const dy = (e.clientY - ih / 2) / (ih / 2);
    mouseX.set(dx);
    mouseY.set(dy);
  };

  // Enable parallax only on larger screens and when reduced motion is not preferred
  const [enableParallax, setEnableParallax] = React.useState(true);
  React.useEffect(() => {
    const mqWidth = window.matchMedia('(min-width: 768px)');
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnableParallax(mqWidth.matches && !mqMotion.matches);
    update();
    mqWidth.addEventListener?.('change', update);
    mqMotion.addEventListener?.('change', update);
    return () => {
      mqWidth.removeEventListener?.('change', update);
      mqMotion.removeEventListener?.('change', update);
    };
  }, []);

  // Static particle positions to avoid random reflows
  const particles: Array<{ top: string; left: string; size: number; opacity: number; delay: number; depth: 'slow' | 'med' | 'fast' }> = [
    { top: '18%', left: '12%', size: 3, opacity: 0.18, delay: 0.0, depth: 'slow' },
    { top: '26%', left: '78%', size: 2, opacity: 0.16, delay: 0.3, depth: 'med' },
    { top: '44%', left: '8%',  size: 2, opacity: 0.15, delay: 0.6, depth: 'fast' },
    { top: '58%', left: '22%', size: 3, opacity: 0.17, delay: 0.9, depth: 'slow' },
    { top: '35%', left: '64%', size: 2, opacity: 0.16, delay: 0.2, depth: 'med' },
    { top: '68%', left: '72%', size: 3, opacity: 0.18, delay: 0.4, depth: 'slow' },
    { top: '52%', left: '86%', size: 2, opacity: 0.15, delay: 0.8, depth: 'fast' },
    { top: '74%', left: '18%', size: 2, opacity: 0.16, delay: 0.5, depth: 'med' },
    { top: '14%', left: '50%', size: 3, opacity: 0.18, delay: 0.7, depth: 'slow' },
    { top: '40%', left: '92%', size: 2, opacity: 0.15, delay: 0.1, depth: 'fast' },
    { top: '62%', left: '6%',  size: 2, opacity: 0.16, delay: 0.35, depth: 'med' },
    { top: '82%', left: '48%', size: 3, opacity: 0.17, delay: 0.65, depth: 'slow' },
    // extras
    { top: '20%', left: '34%', size: 2, opacity: 0.16, delay: 0.15, depth: 'med' },
    { top: '30%', left: '12%', size: 2, opacity: 0.15, delay: 0.45, depth: 'fast' },
    { top: '46%', left: '58%', size: 3, opacity: 0.18, delay: 0.25, depth: 'slow' },
    { top: '54%', left: '32%', size: 2, opacity: 0.16, delay: 0.55, depth: 'med' },
    { top: '66%', left: '44%', size: 2, opacity: 0.16, delay: 0.75, depth: 'fast' },
    { top: '70%', left: '60%', size: 3, opacity: 0.18, delay: 0.35, depth: 'slow' },
    { top: '76%', left: '82%', size: 2, opacity: 0.15, delay: 0.65, depth: 'med' },
    { top: '22%', left: '90%', size: 2, opacity: 0.15, delay: 0.5, depth: 'fast' }
  ];

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center pt-20 md:pt-24 pb-8"
      onMouseMove={enableParallax ? handleMouseMove : undefined}
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Glow blobs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl"
          style={{
            x: enableParallax ? xSlow : 0,
            y: enableParallax ? ySlow : 0,
            background: 'radial-gradient(circle at 30% 30%, rgba(0,229,160,0.35), transparent 60%)'
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full blur-3xl"
          style={{
            x: enableParallax ? xMed : 0,
            y: enableParallax ? yMed : 0,
            background: 'radial-gradient(circle at 70% 70%, rgba(107,59,255,0.30), transparent 60%)'
          }}
        />
        {/* Extra subtle blob to fill whitespace */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.25 }}
          className="absolute top-1/3 right-1/4 h-56 w-56 rounded-full blur-2xl"
          style={{ x: enableParallax ? xFast : 0, y: enableParallax ? yFast : 0, background: 'radial-gradient(circle, rgba(34,211,238,0.25), transparent 60%)' }}
        />
        {/* Subtle grid */}
        <div className="absolute inset-0 grid-pattern opacity-[0.05]" />
        {/* Center spotlight behind heading */}
        <div
          className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px] w-[520px] h-[320px] md:w-[600px] md:h-[380px] xl:w-[820px] xl:h-[520px] 2xl:w-[1000px] 2xl:h-[600px]"
          style={{ background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.12), transparent 65%)' }}
        />
        {/* Decorative beams */}
        <motion.div
          className="absolute -top-40 -left-10 h-[60vh] w-[45vw] -rotate-12"
          style={{
            x: enableParallax ? xSlow : 0,
            y: enableParallax ? ySlow : 0,
            background: 'linear-gradient(90deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04), transparent)',
            filter: 'blur(36px)'
          }}
        />
        <motion.div
          className="absolute -bottom-48 -right-16 h-[55vh] w-[40vw] rotate-12"
          style={{
            x: enableParallax ? xMed : 0,
            y: enableParallax ? yMed : 0,
            background: 'linear-gradient(90deg, rgba(99,102,241,0.10), rgba(34,211,238,0.06), transparent)',
            filter: 'blur(36px)'
          }}
        />
        {/* Ring outlines */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5"
          style={{ width: 420, height: 420, x: enableParallax ? xSlow : 0, y: enableParallax ? ySlow : 0 }}
        />
        <motion.div
          className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]"
          style={{ width: 620, height: 620, x: enableParallax ? xMed : 0, y: enableParallax ? yMed : 0 }}
        />
        {/* Floating particles */}
        {particles.map((p, idx) => (
          <motion.span
            key={idx}
            className="absolute rounded-full"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              background: 'rgba(255,255,255,0.6)',
              opacity: p.opacity,
              boxShadow: '0 0 10px rgba(16,185,129,0.35), 0 0 2px rgba(255,255,255,0.3)'
            }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 6 + (idx % 5), repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
          />
        ))}
        {/* Bottom vignette fade */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 w-full">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col items-center text-center">
            {/* Top pill */}
            <motion.div variants={item} className="glass-card inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 border border-[var(--border-color)]/70">
              <span className="inline-block h-2 w-2 rounded-full bg-[var(--primary)] animate-pulse" />
              <span className="text-sm text-[var(--text-secondary)]">Building for the Web</span>
            </motion.div>

            {/* Heading */}
            <motion.h1 variants={item} className="section-title leading-tight">
              Hi, I’m <span className="name-gradient drop-shadow-[0_1px_10px_rgba(0,229,160,0.18)]">{nameFirst}</span> {nameLast}
            </motion.h1>

            {/* Typewriter subtitle */}
            <motion.div variants={item} className="text-[1.125rem] md:text-2xl text-[var(--text-secondary)] mt-1.5 mb-6 min-h-[32px] tracking-tight">
              <Typewriter options={{ strings: typewriterStrings, autoStart: true, loop: true, delay: 24, deleteSpeed: 18 }} />
            </motion.div>

            {/* Bio */}
            <motion.p variants={item} className="section-subtitle">
              {userInfo?.about || (
                <>I craft performant, accessible web apps with thoughtful UX and clean, maintainable code. I love solving real problems,
                collaborating with teams, and shipping polished products end‑to‑end.</>
              )}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-8">
              <Link to="projects" smooth duration={500} className="btn-primary cursor-pointer group">
                View Projects
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link to="contact" smooth duration={500} className="btn-outline cursor-pointer group">
                <Send className="h-4 w-4" />
                Contact Me
              </Link>
              <a href="/assets/resume.pdf" download className="btn-outline group">
                <Download className="h-4 w-4" />
                Download CV
              </a>
            </motion.div>

            {/* Socials */}
            <motion.div variants={item} className="flex items-center gap-3 md:gap-4 mb-10">
              {links.github && (
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="GitHub"
                  className="glass-card p-3 rounded-xl hover:border-[var(--primary)]/30 transition-all hover:-translate-y-0.5"
                >
                  <Github className="h-5 w-5 text-[var(--text-secondary)]" />
                </a>
              )}
              {links.linkedin && (
                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn"
                  className="glass-card p-3 rounded-xl hover:border-[var(--primary)]/30 transition-all hover:-translate-y-0.5"
                >
                  <Linkedin className="h-5 w-5 text-[var(--text-secondary)]" />
                </a>
              )}
              {links.email && (
                <a
                  href={`mailto:${links.email}`}
                  title="Email"
                  className="glass-card p-3 rounded-xl hover:border-[var(--primary)]/30 transition-all hover:-translate-y-0.5"
                >
                  <Mail className="h-5 w-5 text-[var(--text-secondary)]" />
                </a>
              )}
            </motion.div>

            {/* Skill tags */}
            <motion.div variants={item} className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 max-w-3xl">
              {displaySkills.map((s: string) => (
                <span key={s} className="skill-tag">{s}</span>
              ))}
            </motion.div>

            {/* Scroll indicator */}
            <motion.div variants={item} className="flex flex-col items-center mt-1 mb-1">
              <Link to="projects" smooth duration={500} className="cursor-pointer">
                <div className="p-2 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[var(--primary)]/40 transition-all">
                  <ArrowDown className="text-[var(--primary)] animate-bounce" size={28} />
                </div>
              </Link>
              <span className="text-sm text-[var(--text-secondary)] mt-2">Scroll to explore</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;