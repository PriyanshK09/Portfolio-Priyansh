import UAParser from 'ua-parser-js';
import { Visitor } from '../models/Visitor.js';

export const visitorMiddleware = async (req, res, next) => {
  try {
    const parser = new UAParser(req.headers['user-agent']);
    const result = parser.getResult();

    const visitorData = {
      browser: `${result.browser.name} ${result.browser.version}`,
      os: `${result.os.name} ${result.os.version}`,
      device: result.device.type || 'desktop',
      ip: req.ip,
      path: req.path
    };

    await Visitor.create(visitorData);
    next();
  } catch (error) {
    console.error('Error tracking visitor:', error);
    next();
  }
};