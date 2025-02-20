import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  browser: String,
  os: String,
  device: String,
  ip: String,
  path: String
});

export const Visitor = mongoose.model('Visitor', visitorSchema);