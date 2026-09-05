# 🚀 AI Skill Gap Analyzer & Career Roadmap Generator

An intelligent full-stack **MERN** application (MongoDB, Express, React, Node.js) that diagnoses technical skill gaps between a candidate's current capabilities and target job benchmarks. It generates visual competency radar charts, calculates match readiness scores, categorizes high-impact deficits, and produces personalized multi-phase learning roadmaps with curated resources and project suggestions.

---

## 🌟 Key Features

- **Multi-Modal Profile Ingestion**:
  - Drag-and-drop resume upload (`PDF`, `DOCX`, or `TXT`) powered by server-side parsing (`pdf-parse` & `mammoth`).
  - Raw text & LinkedIn profile summary paste mode.
  - **1-Click Demo Personas** (e.g. *Junior Frontend Developer*, *Python Data Analyst*, *Backend Node Developer*) for instant testing.

- **Dual-Engine AI Intelligence**:
  - **Google Gemini LLM Integration**: Generates deep contextual evaluations, tailored recommendations, and industry-grade roadmaps.
  - **Offline Heuristic NLP Engine**: Comprehensive fallback engine that performs fuzzy alias matching, competency weighted scoring, and milestone curriculum synthesis without requiring an internet connection or paid API keys.

- **Visual Competency Analytics**:
  - **Interactive Radar Chart**: Compare candidate skills against target market standards across domains (*Frontend*, *Backend*, *Database*, *Cloud & DevOps*, *Architecture*, *Testing*).
  - **Readiness Score Dial**: Animated circular match meter with calibrated fit indicators (*Strong Fit*, *Moderate Fit*, *Developing*, *Significant Gap*).
  - **Categorized Deficit Matrix**: Direct filtering into *Matched Skills*, *Growth Opportunities*, and *Missing Critical Skills*.

- **Personalized Career Roadmap Tracker**:
  - Multi-phase curriculum (Foundation, Production Engineering, System Architecture & Interview Prep).
  - Interactive checkboxes with remote persistence and overall progress tracking.
  - Curated free & official documentation links.
  - Real-world mini-project suggestions with concrete deliverables for portfolios.

- **Industry Role Standards Catalog**:
  - Pre-seeded benchmarks for *Full Stack Developer*, *AI / ML Engineer*, *DevOps & Cloud Architect*, *Data Scientist*, *Cybersecurity Analyst*, and *Frontend Specialist*.
  - Explore salary compensation bands, required technologies, and market demand ratings.
  - One-click testing against any role in the catalog.

- **Zero-Friction Authentication**:
  - JWT Authentication with bcrypt password hashing.
  - **1-Click Guest / Demo Session Mode** to explore all features instantly without registering.

---

## 🏗️ Architecture

```
Ai skill gap analyzer/
├── server/
│   ├── src/
│   │   ├── config/             # MongoDB connection & In-Memory fallback store
│   │   ├── controllers/        # Auth, Analyzer, Roles, and Roadmap controllers
│   │   ├── data/               # Seed data for industry benchmark roles
│   │   ├── middleware/         # JWT auth, Multer file upload, Error handling
│   │   ├── models/             # Mongoose schemas (User, Analysis, RoleBenchmark, Roadmap)
│   │   ├── routes/             # Express API route endpoints
│   │   ├── services/           # Gemini AI, Heuristic NLP engine, Resume parser
│   │   └── server.js           # Express application entrypoint
│   ├── package.json
│   └── .env.example
├── client/
│   ├── src/
│   │   ├── components/         # RadarChart, ScoreDial, ResumeUploader, RoadmapTimeline, Navbar, Footer
│   │   ├── context/            # AuthContext & ThemeContext (Light/Dark mode)
│   │   ├── pages/              # Dashboard, Analyzer, AnalysisResult, RoleCatalog, RoadmapView, Login, Register
│   │   ├── services/           # Axios API client
│   │   ├── App.jsx             # React Router setup
│   │   ├── main.jsx
│   │   └── index.css           # Tailwind base styles
│   ├── package.json
│   ├── vite.config.js          # Vite config with /api proxy to port 5000
│   └── tailwind.config.js
├── package.json                # Root monorepo script coordinator
└── README.md
```

---

## ⚡ Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher installed)
- [MongoDB](https://www.mongodb.com/) (Optional — an automatic in-memory mock store activates seamlessly if MongoDB is not running locally!)
- [Google Gemini API Key](https://aistudio.google.com/) (Optional — a built-in heuristic NLP engine activates automatically if no key is provided!)

---

### Step 1: Install Dependencies

From the project root:
```bash
npm run install:all
```
*(Or install in each directory individually: `npm install`, `cd server && npm install`, `cd client && npm install`)*

---

### Step 2: Configure Environment Variables

1. Open `server/.env` (a ready-to-run template is pre-created):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai_skill_gap_analyzer
JWT_SECRET=default_jwt_secret_dev_key_skill_analyzer_9921
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```
*(Note: If you do not have a `GEMINI_API_KEY`, leave it blank or as-is; the application will automatically run using its built-in heuristic rule-engine!)*

---

### Step 3: Run the Full Application

From the project root, launch both the backend and frontend simultaneously with a single command:
```bash
npm run dev
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:5000](http://localhost:5000)
- **API Health Endpoint**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧪 Testing User Flows

1. **Instant Demo Persona Test**:
   - Navigate to [http://localhost:5173/analyzer](http://localhost:5173/analyzer).
   - In the **Quick Demo** section at top-right of the resume uploader, click **Junior** (Alex Chen).
   - Notice the resume preview and target role (*Full Stack Developer*) auto-populate.
   - Click **Generate AI Skill Gap Analysis**.
   - Review your **Match Score Dial**, **Competency Radar Chart**, **High-Impact Deficits** (e.g. Docker, CI/CD, SQL), and **Personalized Roadmap**.

2. **Upload Your Own Resume**:
   - Drag and drop your own `.pdf`, `.docx`, or `.txt` resume into the drop zone.
   - Select your desired target role (e.g., *DevOps & Cloud Architect*, *Data Scientist*, or *Full Stack Developer*).
   - Optionally paste a specific job description from a company you're interviewing with.
   - Run the diagnostic.

3. **Interactive Career Roadmap**:
   - Check off milestones as you complete learning objectives.
   - Watch the **Total Completion %** update dynamically in real time.
   - Explore curated learning guides and project starter ideas for each milestone.

4. **Role Standards Explorer**:
   - Visit `/roles` to browse current compensation benchmarks and core technical competencies.

---

## 📡 REST API Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service status, database type, and AI engine flag |
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | User login and JWT issue |
| `POST` | `/api/auth/guest` | Instant 1-click guest session |
| `GET` | `/api/auth/me` | Fetch authenticated profile |
| `POST` | `/api/analyzer/scan` | Analyze resume (multipart file or text) |
| `GET` | `/api/analyzer/history` | Get user assessment history |
| `GET` | `/api/analyzer/:id` | Fetch specific analysis report |
| `GET` | `/api/roles` | List all industry role benchmarks |
| `GET` | `/api/roles/:slug` | Get specific role benchmark details |
| `GET` | `/api/roadmaps/:id` | Get roadmap details |
| `GET` | `/api/roadmaps/user/me` | List roadmaps for logged-in user |
| `PATCH` | `/api/roadmaps/:id/milestones/:phaseIndex/:milestoneIndex` | Toggle milestone completion status |

---

## 🛡️ License

MIT License. Designed and engineered for modern developers and tech career growth.
