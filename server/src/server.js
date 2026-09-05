import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDbStatus } from './config/db.js';
import { seedDatabase } from './data/seedRoles.js';
import authRoutes from './routes/authRoutes.js';
import analyzerRoutes from './routes/analyzerRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend client
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Dev-friendly permissive CORS
  },
  credentials: true
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  const db = getDbStatus();
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    database: db.type,
    connected: db.connected,
    aiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here')
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/analyzer', analyzerRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/roadmaps', roadmapRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

// Initialize server and database
const startServer = async () => {
  const isDbConnected = await connectDB();
  if (isDbConnected) {
    await seedDatabase();
  }

  app.listen(PORT, () => {
    console.log(`🚀 AI Skill Gap Analyzer Server running on http://localhost:${PORT}`);
    console.log(`📡 Storage Mode: ${getDbStatus().type}`);
    console.log(`🧠 AI Engine: ${process.env.GEMINI_API_KEY ? 'Gemini Enabled' : 'Heuristic Mode (Add GEMINI_API_KEY to enable LLM)'}`);
  });
};

startServer();
