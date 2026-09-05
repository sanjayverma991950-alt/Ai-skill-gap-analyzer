import { RoleBenchmark } from '../models/RoleBenchmark.js';
import { defaultRoles } from '../data/seedRoles.js';
import { getDbStatus } from '../config/db.js';
import { mockStore } from '../config/inMemoryStore.js';

/**
 * Get all role benchmarks
 * GET /api/roles
 */
export const getRoles = async (req, res) => {
  try {
    const isConnected = getDbStatus().connected;
    if (isConnected) {
      let roles = await RoleBenchmark.find().sort({ title: 1 });
      if (roles.length === 0) {
        // Automatically populate if empty
        await RoleBenchmark.insertMany(defaultRoles);
        roles = await RoleBenchmark.find().sort({ title: 1 });
      }
      return res.json({ success: true, count: roles.length, data: roles });
    } else {
      return res.json({ success: true, count: mockStore.roles.length, data: mockStore.roles });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get single role benchmark by slug
 * GET /api/roles/:slug
 */
export const getRoleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const isConnected = getDbStatus().connected;

    let role = null;
    if (isConnected) {
      role = await RoleBenchmark.findOne({ slug });
    } else {
      role = mockStore.roles.find(r => r.slug === slug);
    }

    if (!role) {
      return res.status(404).json({ success: false, message: 'Role benchmark not found' });
    }

    return res.json({ success: true, data: role });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
