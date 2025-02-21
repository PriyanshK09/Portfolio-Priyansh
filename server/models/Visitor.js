import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  localTime: {
    type: String,
    required: true
  },
  browser: String,
  os: String,
  device: String,
  ip: String,
  section: String,
  path: String,
  interactionType: {
    type: String,
    enum: ['view', 'click'],
    default: 'view'
  }
});

export const Visitor = mongoose.model('Visitor', visitorSchema);