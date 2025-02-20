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
  browser: string;
  os: string;
  device: string;
  ip: string;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}