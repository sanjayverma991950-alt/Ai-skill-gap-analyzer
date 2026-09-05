import mongoose from 'mongoose';

const skillGapDetailSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  category: { type: String, default: 'General' },
  status: {
    type: String,
    enum: ['Strong Match', 'Needs Improvement', 'Missing Critical'],
    required: true
  },
  currentProficiency: { type: Number, min: 0, max: 100, default: 0 },
  requiredProficiency: { type: Number, min: 0, max: 100, default: 80 },
  gapScore: { type: Number, default: 0 },
  reason: String,
  learningPriority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  }
}, { _id: false });

const competencyRadarSchema = new mongoose.Schema({
  category: String,
  candidateScore: Number,
  benchmarkScore: Number,
  fullMark: { type: Number, default: 100 }
}, { _id: false });

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // Allow guest users
  },
  candidateName: {
    type: String,
    default: 'Anonymous Candidate'
  },
  targetRole: {
    type: String,
    required: true
  },
  jobDescriptionProvided: {
    type: Boolean,
    default: false
  },
  overallMatchScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  summary: {
    type: String,
    required: true
  },
  strengths: [String],
  keyGaps: [String],
  radarData: [competencyRadarSchema],
  skillGaps: [skillGapDetailSchema],
  extractedSkills: [String],
  recommendations: [{
    type: { type: String }, // 'Course', 'Project', 'Certification', 'Practice'
    title: String,
    description: String,
    priority: String,
    url: String
  }],
  aiProviderUsed: {
    type: String,
    default: 'heuristic'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Analysis = mongoose.model('Analysis', analysisSchema);
