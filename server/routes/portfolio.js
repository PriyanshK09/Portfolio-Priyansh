import express from 'express';
import jwt from 'jsonwebtoken';
import { Portfolio } from '../models/Portfolio.js';
import { projects, experiences, certificates, skills, socialLinks } from '../data.js';

const router = express.Router();

// Auth middleware
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Token not provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

// Initialize portfolio data if it doesn't exist
const initializePortfolio = async () => {
  try {
    const portfolioExists = await Portfolio.findOne();
    if (!portfolioExists) {
      // Create default portfolio data using data from src/data
      const defaultPortfolio = {
        userInfo: {
          name: {
            first: 'Priyansh',
            last: 'Khare'
          },
          title: 'Full Stack Developer',
          about: 'Full Stack Developer specialized in MERN stack. Passionate about building beautiful and functional web applications.',
          socialLinks: socialLinks,
          skills: skills,
          typewriterStrings: [
            'Student',
            'Full Stack Developer',
            'Web Developer',
            'DSA Enthusiast',
            'Problem Solver'
          ]
        },
        projects: projects,
        experiences: experiences,
        certificates: certificates
      };
      
      await Portfolio.create(defaultPortfolio);
      console.log('Default portfolio data created');
    }
  } catch (error) {
    console.error('Error initializing portfolio data:', error);
  }
};

// Initialize on server start
initializePortfolio();

// Get all portfolio data
router.get('/', async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne();
    
    if (!portfolio) {
      // If no portfolio exists, create one with default data
      await initializePortfolio();
      portfolio = await Portfolio.findOne();
    }
    
    res.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio data' });
  }
});

// Update User Info
router.put('/user-info', authMiddleware, async (req, res) => {
  try {
    const userInfo = req.body;
    
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      await initializePortfolio();
      portfolio = await Portfolio.findOne();
    }
    
    portfolio.userInfo = userInfo;
    await portfolio.save();
    
    res.json(portfolio.userInfo);
  } catch (error) {
    console.error('Error updating user info:', error);
    res.status(500).json({ error: 'Failed to update user info' });
  }
});

// Project routes
router.post('/projects', authMiddleware, async (req, res) => {
  try {
    const project = req.body;
    
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      await initializePortfolio();
      portfolio = await Portfolio.findOne();
    }
    
    portfolio.projects.push(project);
    await portfolio.save();
    
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

router.put('/projects/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProject = req.body;
    
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    const projectIndex = portfolio.projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    portfolio.projects[projectIndex] = updatedProject;
    await portfolio.save();
    
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

router.delete('/projects/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    portfolio.projects = portfolio.projects.filter(p => p.id !== id);
    await portfolio.save();
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Experience routes
router.post('/experiences', authMiddleware, async (req, res) => {
  try {
    const experience = req.body;
    
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      await initializePortfolio();
      portfolio = await Portfolio.findOne();
    }
    
    portfolio.experiences.push(experience);
    await portfolio.save();
    
    res.status(201).json(experience);
  } catch (error) {
    console.error('Error creating experience:', error);
    res.status(500).json({ error: 'Failed to create experience' });
  }
});

router.put('/experiences/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedExperience = req.body;
    
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    const index = portfolio.experiences.findIndex(e => e._id.toString() === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    
    portfolio.experiences[index] = updatedExperience;
    await portfolio.save();
    
    res.json(updatedExperience);
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

router.delete('/experiences/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    portfolio.experiences = portfolio.experiences.filter(e => e._id.toString() !== id);
    await portfolio.save();
    
    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

// Certificate routes
router.post('/certificates', authMiddleware, async (req, res) => {
  try {
    const certificate = req.body;
    
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      await initializePortfolio();
      portfolio = await Portfolio.findOne();
    }
    
    portfolio.certificates.push(certificate);
    await portfolio.save();
    
    res.status(201).json(certificate);
  } catch (error) {
    console.error('Error creating certificate:', error);
    res.status(500).json({ error: 'Failed to create certificate' });
  }
});

router.put('/certificates/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCertificate = req.body;
    
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    const index = portfolio.certificates.findIndex(c => c._id.toString() === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    
    portfolio.certificates[index] = updatedCertificate;
    await portfolio.save();
    
    res.json(updatedCertificate);
  } catch (error) {
    console.error('Error updating certificate:', error);
    res.status(500).json({ error: 'Failed to update certificate' });
  }
});

router.delete('/certificates/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    portfolio.certificates = portfolio.certificates.filter(c => c._id.toString() !== id);
    await portfolio.save();
    
    res.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({ error: 'Failed to delete certificate' });
  }
});

export const portfolioRouter = router;