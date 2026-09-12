import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { getDbStatus } from '../config/db.js';
import { mockStore } from '../config/inMemoryStore.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret_dev_key_skill_analyzer_9921');

      if (getDbStatus().connected) {
        if (mongoose.Types.ObjectId.isValid(decoded.id)) {
          req.user = await User.findById(decoded.id).select('-password');
        }
      } else {
        req.user = mockStore.users.find(u => u._id === decoded.id || u.email === decoded.email);
      }

      if (!req.user) {
        // Provide guest user fallback
        req.user = {
          _id: decoded.id || 'guest_id',
          name: 'Guest Candidate',
          email: decoded.email || 'guest@example.com',
          isGuest: true
        };
      }

      return next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

// Optional auth: allows guests to analyze without logging in
export const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret_dev_key_skill_analyzer_9921');
      
      if (getDbStatus().connected) {
        if (mongoose.Types.ObjectId.isValid(decoded.id)) {
          req.user = await User.findById(decoded.id).select('-password');
        }
      } else {
        req.user = mockStore.users.find(u => u._id === decoded.id || u.email === decoded.email);
      }

      if (!req.user && decoded.id) {
        req.user = {
          _id: decoded.id,
          name: 'Guest Candidate',
          email: decoded.email || 'guest@example.com',
          isGuest: true
        };
      }
    } catch (err) {
      // Ignore token failure for optional auth
    }
  }
  next();
};
