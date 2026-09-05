import { Roadmap } from '../models/Roadmap.js';
import { getDbStatus } from '../config/db.js';
import { mockStore } from '../config/inMemoryStore.js';

/**
 * Get roadmap by ID
 * GET /api/roadmaps/:id
 */
export const getRoadmapById = async (req, res) => {
  try {
    const { id } = req.params;
    const isConnected = getDbStatus().connected;

    let roadmap = null;
    if (isConnected) {
      roadmap = await Roadmap.findById(id);
    } else {
      roadmap = mockStore.roadmaps.find(r => String(r._id) === String(id));
    }

    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    return res.json({ success: true, data: roadmap });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get roadmaps for current user
 * GET /api/roadmaps/user/me
 */
export const getUserRoadmaps = async (req, res) => {
  try {
    const isConnected = getDbStatus().connected;
    const userId = req.user._id;

    if (isConnected) {
      const roadmaps = await Roadmap.find({ userId }).sort({ createdAt: -1 });
      return res.json({ success: true, count: roadmaps.length, data: roadmaps });
    } else {
      const roadmaps = mockStore.roadmaps.filter(r => String(r.userId) === String(userId));
      return res.json({ success: true, count: roadmaps.length, data: roadmaps });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Toggle a milestone's completed state
 * PATCH /api/roadmaps/:id/milestones/:phaseIndex/:milestoneIndex
 */
export const toggleMilestone = async (req, res) => {
  try {
    const { id, phaseIndex, milestoneIndex } = req.params;
    const pIdx = parseInt(phaseIndex, 10);
    const mIdx = parseInt(milestoneIndex, 10);
    const isConnected = getDbStatus().connected;

    let roadmap = null;

    if (isConnected) {
      roadmap = await Roadmap.findById(id);
      if (!roadmap) {
        return res.status(404).json({ success: false, message: 'Roadmap not found' });
      }

      if (!roadmap.phases[pIdx] || !roadmap.phases[pIdx].milestones[mIdx]) {
        return res.status(400).json({ success: false, message: 'Invalid phase or milestone index' });
      }

      const milestone = roadmap.phases[pIdx].milestones[mIdx];
      milestone.completed = !milestone.completed;
      milestone.completedAt = milestone.completed ? new Date() : null;

      // Recalculate overall progress
      let totalMilestones = 0;
      let completedMilestones = 0;
      roadmap.phases.forEach(phase => {
        phase.milestones.forEach(m => {
          totalMilestones++;
          if (m.completed) completedMilestones++;
        });
      });

      roadmap.overallProgressPercentage = totalMilestones > 0
        ? Math.round((completedMilestones / totalMilestones) * 100)
        : 0;

      await roadmap.save();
    } else {
      roadmap = mockStore.roadmaps.find(r => String(r._id) === String(id));
      if (!roadmap) {
        return res.status(404).json({ success: false, message: 'Roadmap not found' });
      }

      const milestone = roadmap.phases[pIdx]?.milestones[mIdx];
      if (!milestone) {
        return res.status(400).json({ success: false, message: 'Invalid milestone index' });
      }

      milestone.completed = !milestone.completed;
      milestone.completedAt = milestone.completed ? new Date() : null;

      let totalMilestones = 0;
      let completedMilestones = 0;
      roadmap.phases.forEach(phase => {
        phase.milestones.forEach(m => {
          totalMilestones++;
          if (m.completed) completedMilestones++;
        });
      });

      roadmap.overallProgressPercentage = totalMilestones > 0
        ? Math.round((completedMilestones / totalMilestones) * 100)
        : 0;
    }

    return res.json({
      success: true,
      message: 'Milestone updated successfully',
      data: roadmap
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
