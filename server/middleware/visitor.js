import UAParser from 'ua-parser-js';
import { Visitor } from '../models/Visitor.js';

export const visitorMiddleware = async (req, res, next) => {
  try {
    // Skip tracking for admin routes and API endpoints except track endpoint
    if (req.path.includes('admin') || (req.path.startsWith('/api/') && req.path !== '/api/track')) {
      return next();
    }

    const parser = new UAParser(req.headers['user-agent']);
    const result = parser.getResult();
    
    const ip = (
      req.headers['x-forwarded-for']?.split(',').shift() ||
      req.socket?.remoteAddress?.replace('::ffff:', '') ||
      req.ip?.replace('::ffff:', '') ||
      'unknown'
    ).trim();

    const timestamp = new Date();
    const localTime = timestamp.toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'medium'
    });

    const { path, interactionType = 'view' } = req.body;

    // Map sections to readable names
    const sectionMap = {
      'hero': 'Home',
      'projects': 'Projects',
      'experience': 'Experience',
      'contact': 'Contact'
    };

    let section = sectionMap[path] || path;
    
    // Handle link clicks with better formatting
    if (path?.startsWith('link_')) {
      const url = path.replace('link_', '');
      if (url.includes('Certificate')) {
        const certTitle = url.split('/').pop(); // Get the last part of the URL
        section = `Clicked: Certificate -> ${certTitle || 'Unknown'}`;
      } else if (url.includes('github')) {
        section = 'Clicked: GitHub Project';
      } else if (url.includes('demo') || url.includes('vercel')) {
        section = 'Clicked: Project Demo';
      } else {
        section = `Clicked: ${url}`;
      }
    }

    const visitorData = {
      timestamp,
      localTime,
      browser: `${result.browser.name || 'Unknown'} ${result.browser.version || ''}`.trim(),
      os: `${result.os.name || 'Unknown'} ${result.os.version || ''}`.trim(),
      device: result.device.type || 'desktop',
      ip,
      section,
      path,
      interactionType
    };

    await Visitor.create(visitorData);

    if (req.path === '/api/track') {
      res.status(200).json({ message: 'Interaction tracked successfully' });
    } else {
      next();
    }
  } catch (error) {
    console.error('Error tracking visitor:', error);
    if (req.path === '/api/track') {
      res.status(500).json({ error: 'Failed to track interaction' });
    } else {
      next();
    }
  }
};