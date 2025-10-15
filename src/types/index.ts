export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  demoUrl?: string;
  image?: string;
}

export interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string[];
  techStack: string[];
}

export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  url: string;
}

export interface VisitorData {
  timestamp: Date;
  localTime: string;
  browser: string;
  os: string;
  device: string;
  ip: string;
  path: string;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

// New types for portfolio editing
export interface UserInfo {
  name: {
    first: string;
    last: string;
  };
  title: string;
  about: string;
  socialLinks: {
    github: string;
    linkedin: string;
    email: string;
  };
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    other: string[];
  };
  typewriterStrings: string[];
}

export interface PortfolioData {
  userInfo: UserInfo;
  projects: Project[];
  experiences: Experience[];
  certificates: Certificate[];
}