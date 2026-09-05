import { defaultRoles } from '../data/seedRoles.js';

// In-memory memory structures used when MongoDB is not connected
export const mockStore = {
  users: [
    {
      _id: 'guest_user_demo_id',
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'password123', // In real test, compare works
      targetRole: 'Full Stack Developer',
      experienceLevel: 'Mid Level',
      createdAt: new Date()
    }
  ],
  roles: [...defaultRoles],
  analyses: [],
  roadmaps: []
};
