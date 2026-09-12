import mongoose from 'mongoose';

const milestoneItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  estimatedHours: Number,
  resources: [{
    title: String,
    type: { type: String, default: 'Course' },
    url: String,
    isFree: { type: Boolean, default: true }
  }],
  projectIdea: {
    title: String,
    description: String,
    deliverable: String
  },
  completed: { type: Boolean, default: false },
  completedAt: Date
});

const roadmapPhaseSchema = new mongoose.Schema({
  phaseNumber: { type: Number, required: true },
  title: { type: String, required: true },
  durationWeeks: { type: Number, default: 2 },
  focusSkills: [String],
  milestones: [milestoneItemSchema]
});

const roadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  analysisId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Analysis',
    default: null
  },
  targetRole: { type: String, required: true },
  candidateName: { type: String, default: 'Candidate' },
  totalDurationWeeks: { type: Number, default: 8 },
  phases: [roadmapPhaseSchema],
  overallProgressPercentage: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const Roadmap = mongoose.model('Roadmap', roadmapSchema);
