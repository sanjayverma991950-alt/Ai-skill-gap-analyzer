import mongoose from 'mongoose';

const skillRequirementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['Frontend', 'Backend', 'Database', 'DevOps & Cloud', 'Testing & Quality', 'Architecture & System Design', 'Soft Skills & Leadership', 'Data & AI', 'Security'],
    default: 'Backend'
  },
  importance: {
    type: String,
    enum: ['Critical', 'Important', 'Nice to have'],
    default: 'Important'
  },
  requiredScore: {
    type: Number,
    min: 1,
    max: 100,
    default: 80
  },
  description: String
}, { _id: false });

const roleBenchmarkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  salaryRange: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' }
  },
  marketDemand: {
    type: String,
    enum: ['Very High', 'High', 'Moderate', 'Growing'],
    default: 'High'
  },
  requiredSkills: [skillRequirementSchema],
  competencyCategories: [{
    name: String,
    benchmarkScore: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export const RoleBenchmark = mongoose.model('RoleBenchmark', roleBenchmarkSchema);
