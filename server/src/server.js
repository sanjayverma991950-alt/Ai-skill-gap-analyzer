import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { connectDB, getDbStatus } from './config/db.js';
import { seedDatabase } from './data/seedRoles.js';
import authRoutes from './routes/authRoutes.js';
import analyzerRoutes from './routes/analyzerRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend client
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://ai-skill-gap-analyzer-5-vt0u.onrender.com',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    // Allow known origins, any Render deployment domain (*.onrender.com), or localhost
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.onrender.com') ||
      origin.includes('localhost') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(null, true); // Dev-friendly permissive CORS
  },
  credentials: true
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve static client assets if built
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// Root Route for deployment health checks & SPA serving
app.get('/', (req, res) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(200).json({
    status: 'online',
    message: 'AI Skill Gap Analyzer Backend is Running 🚀',
    timestamp: new Date().toISOString(),
    health: '/api/health'
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  const db = getDbStatus();
  const hasValidGeminiKey = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' &&
    process.env.GEMINI_API_KEY.trim() !== ''
  );

  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    database: db.type,
    connected: db.connected,
    aiConfigured: hasValidGeminiKey
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/analyzer', analyzerRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/roadmaps', roadmapRoutes);

// SPA client-side routing fallback (e.g. /analyzer, /roles, /roadmap)
if (fs.existsSync(clientDistPath)) {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    const indexPath = path.join(clientDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    next();
  });
}

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

// Initialize server and database
const startServer = async () => {
  const isDbConnected = await connectDB();
  if (isDbConnected) {
    await seedDatabase();
  }

  const hasValidGeminiKey = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' &&
    process.env.GEMINI_API_KEY.trim() !== ''
  );

  app.listen(PORT, () => {
    console.log(`🚀 AI Skill Gap Analyzer Server running on http://localhost:${PORT}`);
    console.log(`📡 Storage Mode: ${getDbStatus().type}`);
    console.log(`🧠 AI Engine: ${hasValidGeminiKey ? 'Gemini Enabled' : 'Heuristic Mode (Add GEMINI_API_KEY to enable LLM)'}`);
  });
};

startServer();