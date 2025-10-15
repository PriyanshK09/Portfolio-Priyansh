import React, { useMemo } from "react";
import { motion, useInView, useScroll, useTransform, useSpring } from "framer-motion";
import { Code, Layers, Wrench, Lightbulb, Cloud, Code2, Database, GitBranch, Globe, Terminal, Cpu } from "lucide-react";
import { useRef } from "react";

interface SkillsProps {
  skills?: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    other: string[];
    cloud?: string[];
  };
}

// Normalize various input shapes into a clean, flat string array (defensive against API shape drift)
const normalizeStringArray = (
  value: any,
  fallback: string[] = []
): string[] => {
  try {
    const SEP = /[|,;\\/·•]+/; // common delimiters
    const out: string[] = [];

    const pushTokens = (s: any) => {
      if (s == null) return;
      let str =
        typeof s === "string"
          ? s
          : typeof s === "number"
          ? String(s)
          : s?.name ?? "";
      if (typeof str !== "string") return;
      str
        .split(SEP)
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((t) => out.push(t));
    };

    const walk = (v: any) => {
      if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === "object") Object.values(v).forEach(walk);
      else if (typeof v === "string" || typeof v === "number") pushTokens(v);
    };

    walk(value);
    const seen = new Set<string>();
    const deduped = out.filter((t) =>
      seen.has(t) ? false : (seen.add(t), true)
    );
    return deduped.length ? deduped : fallback;
  } catch {
    return fallback;
  }
};

const Skills: React.FC<SkillsProps> = ({ skills: skillsProp }) => {
  const ref = useRef(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  
  // Scroll-based parallax for subtle background beams
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const beamX = useSpring(useTransform(scrollYProgress, [0, 1], [-30, 30]), { stiffness: 80, damping: 20 });
  const beamY = useSpring(useTransform(scrollYProgress, [0, 1], [-40, 40]), { stiffness: 80, damping: 20 });
  const beam2X = useSpring(useTransform(scrollYProgress, [0, 1], [25, -25]), { stiffness: 80, damping: 22 });
  const beam2Y = useSpring(useTransform(scrollYProgress, [0, 1], [-15, 15]), { stiffness: 80, damping: 22 });

  // Fallback skills if API fails or is empty
  const fallbackSkills = {
    languages: ["HTML", "CSS", "JavaScript", "Python", "Java", "C++"],
    frameworks: [
      "React.js",
      "Node.js",
      "Express.js",
      "Django",
      "Bootstrap",
      "TailwindCSS",
    ],
    tools: ["Git", "GitHub", "VS Code", "Postman", "Figma", "Linux (Ubuntu)"],
    other: [
      "RESTful APIs",
      "Microservices",
      "CI/CD",
      "Agile",
      "JWT Authentication",
      "OAuth",
      "Performance Optimization",
      "UI/UX Design",
    ],
    cloud: [
      "Google Cloud Platform",
      "Render",
      "Netlify",
      "Vercel",
      "Custom VPS",
      "Docker",
    ],
  };

  // Defensive normalization to avoid runtime issues in production
  const skills = useMemo(
    () => ({
      languages: (() => {
        const required = ["HTML", "CSS"];
        const base = normalizeStringArray(
          skillsProp?.languages,
          fallbackSkills.languages
        );
        // Ensure HTML/CSS appear first and only once
        return Array.from(new Set([...required, ...base]));
      })(),
      frameworks: normalizeStringArray(
        skillsProp?.frameworks,
        fallbackSkills.frameworks
      ),
      tools: normalizeStringArray(skillsProp?.tools, fallbackSkills.tools),
      other: normalizeStringArray(skillsProp?.other, fallbackSkills.other),
      cloud: normalizeStringArray((skillsProp as any)?.cloud, fallbackSkills.cloud),
    }),
    [skillsProp]
  );

  // Motion variants for staged reveals
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const card = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const chip = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
  };

  const skillCategories = [
    {
      title: "Languages",
      items: skills.languages,
      icon: <Code className="text-[var(--primary)]" size={24} />,
    },
    {
      title: "Frameworks",
      items: skills.frameworks,
      icon: <Layers className="text-[var(--primary)]" size={24} />,
    },
    {
      title: "Tools",
      items: skills.tools,
      icon: <Wrench className="text-[var(--primary)]" size={24} />,
    },
    {
      title: "Cloud",
      items: (skills as any).cloud ?? [],
      icon: <Cloud className="text-[var(--primary)]" size={24} />,
    },
    {
      title: "Other",
      items: skills.other,
      icon: <Lightbulb className="text-[var(--primary)]" size={24} />,
    },
  ];

  return (
    <section ref={sectionRef} id="skills" className="relative py-24 px-6">
      {/* Subtle gradient hairline and background glows to match Hero */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(16,185,129,0.6),rgba(34,211,238,0.35),rgba(99,102,241,0.35),rgba(107,59,255,0.3))]" />
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl h-72 rounded-[50%] blur-3xl opacity-[0.18] bg-[radial-gradient(closest-side,rgba(16,185,129,0.6),transparent)]" />
      <div className="pointer-events-none absolute -bottom-10 right-1/3 w-80 h-80 rounded-full blur-3xl opacity-[0.12] bg-[radial-gradient(circle,rgba(99,102,241,0.65),transparent)]" />
      {/* New: faint grid and rings to avoid blank space and align with hero visuals */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] grid-pattern [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full border border-white/[0.06]" />
      <div className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[780px] h-[780px] rounded-full border border-white/[0.05]" />
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[85%] max-w-5xl h-48 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.12),transparent_60%)] blur-2xl opacity-90" />

      {/* Parallax shimmer beams (behind content) */}
      <motion.div aria-hidden className="pointer-events-none absolute left-[5%] right-[5%] top-24 h-36 rounded-full blur-3xl opacity-[0.15] mix-blend-screen" style={{ x: beamX, y: beamY, background: "linear-gradient(90deg, rgba(16,185,129,0.25), rgba(34,211,238,0.18), rgba(99,102,241,0.2))" }} />
      <motion.div aria-hidden className="pointer-events-none absolute left-[15%] right-[15%] bottom-20 h-28 rounded-full blur-3xl opacity-[0.12] mix-blend-screen" style={{ x: beam2X, y: beam2Y, background: "linear-gradient(90deg, rgba(107,59,255,0.2), rgba(16,185,129,0.22), rgba(99,102,241,0.18))" }} />

      {/* Floating themed icons to fill negative space */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
        {[
          { Icon: Code2, top: '18%', left: '8%', size: 18, opacity: 0.10, delay: 0 },
          { Icon: Database, top: '28%', left: '92%', size: 18, opacity: 0.10, delay: 0.2 },
          { Icon: GitBranch, top: '62%', left: '6%', size: 18, opacity: 0.10, delay: 0.4 },
          { Icon: Globe, top: '48%', left: '88%', size: 18, opacity: 0.10, delay: 0.3 },
          { Icon: Terminal, top: '72%', left: '18%', size: 18, opacity: 0.10, delay: 0.1 },
          { Icon: Cpu, top: '34%', left: '50%', size: 18, opacity: 0.10, delay: 0.25 },
          { Icon: Cloud, top: '76%', left: '82%', size: 18, opacity: 0.10, delay: 0.35 },
        ].map(({ Icon, top, left, size, opacity, delay }, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ top, left, opacity }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay }}
          >
            <Icon size={size} className="text-white/70" />
          </motion.div>
        ))}
      </div>

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.55 }}
          className="text-center mb-16"
        >
          <div className="mb-4 flex justify-center">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-[11px] tracking-wide uppercase text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
              Skills & Tools
            </span>
          </div>
          <h2 className="section-title">
            My <span className="name-gradient">Skills</span>
          </h2>
          <p className="section-subtitle">Technologies I work with</p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          role="list"
          className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-7 lg:gap-8"
        >
          {skillCategories.map((category) => (
            <motion.div
              key={category.title}
              variants={card}
              whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}
              className="glass-card p-6 relative overflow-hidden group border-white/10 hover:border-[var(--primary)]/30 transition-colors"
              role="listitem"
              aria-label={`${category.title} skills`}
            >
              {/* corner accent */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.15),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="absolute right-4 top-4 opacity-15 group-hover:opacity-30 transition-opacity">
                {category.icon}
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-md bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                  {React.cloneElement(category.icon, { size: 18 })}
                </div>
                <h3 className="text-lg font-bold tracking-tight">
                  {category.title}
                </h3>
              </div>

              <motion.div
                className="flex flex-wrap gap-2 relative z-10"
                variants={container}
              >
                {category.items.map((skill: string, i: number) => (
                  <motion.span
                    key={`${category.title}-${i}-${skill}`}
                    variants={chip}
                    whileHover={{ scale: 1.05 }}
                    className="skill-tag hover:text-[var(--text-primary)]/90 border-white/10 hover:border-[var(--primary)]/35"
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
