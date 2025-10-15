import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  userInfo: {
    name: {
      first: { type: String, required: true },
      last: { type: String, required: true }
    },
    title: { type: String, required: true },
    about: { type: String, required: true },
    socialLinks: {
      github: { type: String, required: true },
      linkedin: { type: String, required: true },
      email: { type: String, required: true }
    },
    skills: {
      languages: [String],
      frameworks: [String],
      tools: [String],
      other: [String]
    },
    typewriterStrings: [String]
  },
  projects: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: [String],
    githubUrl: { type: String, required: true },
    demoUrl: String,
    image: String
  }],
  experiences: [{
    company: { type: String, required: true },
    position: { type: String, required: true },
    duration: { type: String, required: true },
    description: [String],
    techStack: [String]
  }],
  certificates: [{
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    date: { type: String, required: true },
    url: { type: String, required: true }
  }]
}, { timestamps: true });

export const Portfolio = mongoose.model('Portfolio', portfolioSchema);