import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { getDbStatus } from '../config/db.js';
import { mockStore } from '../config/inMemoryStore.js';

const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET || 'default_jwt_secret_dev_key_skill_analyzer_9921', {
    expiresIn: '30d',
  });
};

/**
 * Register new user
 * POST /api/auth/register
 */
export const registerUser = async (req, res) => {
  const { name, email, password, targetRole, experienceLevel } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
  }

  const dbStatus = getDbStatus();

  if (dbStatus.connected) {
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      targetRole: targetRole || 'Full Stack Developer',
      experienceLevel: experienceLevel || 'Mid Level',
    });

    return res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
      },
      token: generateToken(user._id, user.email),
    });
  } else {
    // In-memory fallback
    const userExists = mockStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      _id: `mem_user_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      targetRole: targetRole || 'Full Stack Developer',
      experienceLevel: experienceLevel || 'Mid Level',
      createdAt: new Date(),
    };
    mockStore.users.push(newUser);

    return res.status(201).json({
      success: true,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        targetRole: newUser.targetRole,
        experienceLevel: newUser.experienceLevel,
      },
      token: generateToken(newUser._id, newUser.email),
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  const dbStatus = getDbStatus();

  if (dbStatus.connected) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user && (await user.matchPassword(password))) {
      return res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          targetRole: user.targetRole,
          experienceLevel: user.experienceLevel,
        },
        token: generateToken(user._id, user.email),
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } else {
    // In-memory fallback
    const user = mockStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = user.password.startsWith('$2')
      ? await bcrypt.compare(password, user.password)
      : user.password === password;

    if (isMatch) {
      return res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          targetRole: user.targetRole,
          experienceLevel: user.experienceLevel,
        },
        token: generateToken(user._id, user.email),
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  }
};

/**
 * Create Guest / Demo session
 * POST /api/auth/guest
 */
export const createGuestSession = async (req, res) => {
  const guestId = `guest_${Math.random().toString(36).substring(2, 9)}`;
  const guestUser = {
    _id: guestId,
    name: 'Guest Candidate',
    email: `${guestId}@guest.analyzer`,
    targetRole: 'Full Stack Developer',
    experienceLevel: 'Entry Level',
    isGuest: true
  };

  return res.json({
    success: true,
    user: guestUser,
    token: generateToken(guestId, guestUser.email),
  });
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
};
