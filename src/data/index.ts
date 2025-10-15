import { Project, Experience, Certificate } from '../types';

export const projects: Project[] = [
  {
    id: 'codinganna',
    title: 'CodingAnna – EdTech Learning Platform',
    description: 'A modern EdTech platform delivering interactive coding lessons, assessments, and progress tracking. Built for performance and accessibility with a delightful, student‑first UX.',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'TailwindCSS', 'JWT Auth'],
    githubUrl: 'private',
    demoUrl: 'https://codinganna.com/',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80',
    privateRepo: true
  },
  {
    id: 'fintrack',
    title: 'FinTrack – Smart Finance Management App',
    description: 'A full-stack finance tracker helping users analyze spending patterns and achieve financial control.',
    techStack: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'OAuth', 'REST APIs'],
    githubUrl: 'https://github.com/PriyanshK09/FinTrack',
    demoUrl: 'https://fintrack-priyanshk09.vercel.app/',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80'
  },
  {
    id: 'medicare',
    title: 'Medicare – One Stop Wellness Portal',
    description: 'Healthcare accessibility platform providing users with essential medical resources and services.',
    techStack: ['MERN Stack', 'JWT Auth', 'RESTful API', 'Data Visualization'],
    githubUrl: 'https://github.com/PixelPiratess/SIH-PixelPirates-Medicare',
    demoUrl: 'https://medicare-pixelpirates.vercel.app/',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80'
  }
];

export const experiences: Experience[] = [
  {
    company: 'Tata Technologies (at Tata Motors Limited — On-site)',
    position: 'Full Stack Development Intern',
    duration: 'May 2025 - July 2025',
    description: [
      'Redesigned and developed the management portal, significantly improving usability and operational efficiency.',
      'Modernized UI/UX and optimized workflows for streamlined operations.',
      'Enhanced UI and backend logic, reducing page load times by 25%.',
      'Collaborated with cross-functional teams to deliver scalable  features.'
    ],
    techStack: ['Python', 'HTML', 'JavaScript', 'SQL', 'CSS']
  },
  {
    company: 'Cipher Schools',
    position: 'Summer Training - Full Stack Developer',
    duration: 'June 2024 - July 2024',
    description: [
      'Completed intensive Full Stack Development training program',
      'Built "Notes Me", a React-Based note taking web app',
      'Implemented frontend & backend integration',
      'Enhanced user efficiency by 30% with optimized UI/UX'
    ],
    techStack: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'JavaScript', 'RESTful APIs']
  }
];

export const certificates: Certificate[] = [
  {
    title: 'Social Networks',
    issuer: 'IIT Madras - NPTEL',
    date: 'October 2024',
    url: 'https://archive.nptel.ac.in/content/noc/NOC24/SEM2/Ecertificates/106/noc24-cs120/Course/NPTEL24CS120S95120096304214493.pdf'
  },
  {
    title: 'Data Visualization',
    issuer: 'Tata - Forage',
    date: 'July 2024',
    url: 'https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/Tata/MyXvBcppsW2FkNYCX_Tata Group_pyYmRWG68BNaGoJHf_1721934780763_completion_certificate.pdf'
  },
  {
    title: 'Introduction to Generative AI',
    issuer: 'Google Cloud - Coursera',
    date: 'January 2024',
    url: 'https://www.coursera.org/account/accomplishments/verify/WGGEXKVC2PJ8'
  }
];

export const skills = {
  languages: ['C', 'C++', 'JavaScript (ES6+)', 'Python', 'Java', 'SQL'],
  frameworks: ['React', 'Node.js', 'Express', 'HTML/CSS', 'Bootstrap'],
  tools: ['Git', 'GitHub', 'MongoDB', 'MySQL', 'Ubuntu', 'Figma'],
  other: ['Data Structures', 'Algorithms', 'RESTful APIs', 'Responsive Design']
};

export const socialLinks = {
  github: 'https://github.com/PriyanshK09',
  linkedin: 'https://linkedin.com/priyanshk09',
  email: 'mrpriyanshuniverse@gmail.com'
};