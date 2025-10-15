import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { contactRouter } from './routes/contact.js';
import { adminRouter } from './routes/admin.js';
import { portfolioRouter } from './routes/portfolio.js'; // Add this import
import { visitorMiddleware } from './middleware/visitor.js';
import { healthRouter } from './routes/health.js';

dotenv.config();

const app = express();

// Basic middleware
app.use(express.json());
app.use(helmet());

// Update CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://priyanshk.netlify.app'  // Your Netlify URL
    : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Custom IP detection middleware
app.use((req, res, next) => {
  req.realIp = req.ip || 
               req.connection.remoteAddress || 
               req.socket.remoteAddress || 
               req.connection.socket?.remoteAddress;
  next();
});

// Remove or comment out debug middleware
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.path}`);
//   next();
// });

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // Custom key generator using our detected IP
  keyGenerator: (req) => req.realIp,
  skip: (req) => req.path.startsWith('/api/admin') // Skip rate limiting for admin routes
});

// Apply rate limiter to non-admin routes
app.use('/api', (req, res, next) => {
  if (!req.path.startsWith('/admin')) {
    limiter(req, res, next);
  } else {
    next();
  }
});

// Track endpoint should be before general visitorMiddleware
app.post('/api/track', async (req, res) => {
  try {
    const { path } = req.body;
    req.trackedPath = path;
    await visitorMiddleware(req, res, () => {
      res.status(200).json({ message: 'ok' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to track' });
  }
});

// Track visitors
app.use(visitorMiddleware);

// Add this before your other routes
app.use('/health', healthRouter);

// Routes
app.use('/api/contact', contactRouter);
app.use('/api/admin', adminRouter);
app.use('/api/portfolio', portfolioRouter); // Add portfolio routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Add this after MongoDB connection
app.set('mongoose', mongoose);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});