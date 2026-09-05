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

// Enable CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests without origin
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Temporarily allow all origins
    return callback(null, true);
  },
  credentials: true
}));

// Middleware
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));


// ========================================
// HOME ROUTE
// ========================================

app.get('/', (req, res) => {
  res.send('AI Skill Gap Analyzer Backend is Running 🚀');
});


// ========================================
// HEALTH CHECK ROUTE
// ========================================

app.get('/api/health', (req, res) => {
  const db = getDbStatus();

  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    database: db.type,
    connected: db.connected,
    aiConfigured: Boolean(
      process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'
    )
  });
});


// ========================================
// API ROUTES
// ========================================

app.use('/api/auth', authRoutes);
app.use('/api/analyzer', analyzerRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/roadmaps', roadmapRoutes);


// ========================================
// ERROR MIDDLEWARE
// ========================================

app.use(notFound);
app.use(errorHandler);


// ========================================
// START SERVER
// ========================================

const startServer = async () => {
  try {
    const isDbConnected = await connectDB();

    if (isDbConnected) {
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`🚀 AI Skill Gap Analyzer Server running on port ${PORT}`);
      console.log(`📡 Storage Mode: ${getDbStatus().type}`);
      console.log(
        `🧠 AI Engine: ${
          process.env.GEMINI_API_KEY
            ? 'Gemini Enabled'
            : 'Heuristic Mode (Add GEMINI_API_KEY to enable LLM)'
        }`
      );
    });

  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

startServer();