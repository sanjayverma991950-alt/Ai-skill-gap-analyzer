import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyzerAPI, roleAPI } from '../services/api';
import { 
  Sparkles, 
  ArrowRight, 
  Target, 
  TrendingUp, 
  History, 
  Compass, 
  CheckCircle2, 
  BookOpen, 
  ChevronRight,
  Award
} from 'lucide-react';
import ScoreDial from '../components/ScoreDial';

const Dashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [rolesRes] = await Promise.all([
          roleAPI.getRoles()
        ]);
        setRoles(rolesRes.data.data.slice(0, 3));

        if (user) {
          try {
            const histRes = await analyzerAPI.getHistory();
            setHistory(histRes.data.data || []);
          } catch (e) {
            // User may be guest or no history yet
          }
        }
      } catch (err) {
        console.warn('Dashboard data fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const latestScan = history[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-indigo-500/20">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-sky-300 text-xs font-semibold border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            AI-Driven Career Readiness Engine
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Close the Gap Between Where You Are and Where You Want to Be.
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Upload your resume, compare your skill profile against real-world tech benchmarks, and receive an actionable step-by-step learning roadmap.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/analyzer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              Analyze My Skills Now
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/roles"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm border border-white/10 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              Browse Role Standards
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-sky-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-sky-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Target Role</p>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate max-w-[160px]">
              {latestScan?.targetRole || user?.targetRole || 'Full Stack Developer'}
            </h4>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Latest Match Score</p>
            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {latestScan ? `${latestScan.overallMatchScore}%` : 'Not Scanned'}
            </h4>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <History className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Assessments</p>
            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {history.length}
            </h4>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Readiness Level</p>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {latestScan?.overallMatchScore >= 75 ? 'Interview Ready' : latestScan ? 'In Training' : 'Pending Scan'}
            </h4>
          </div>
        </div>
      </div>

      {/* Main Grid: Latest Analysis Highlight & Benchmark Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Scan / Quick Diagnostic */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-500" />
              Latest Diagnostic
            </h2>
            {history.length > 0 && (
              <span className="text-xs text-slate-400">
                {new Date(latestScan.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {latestScan ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-sky-400">
                    Target Role: {latestScan.targetRole}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                    {latestScan.candidateName}'s Assessment
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-md line-clamp-3 leading-relaxed">
                    {latestScan.summary}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <ScoreDial score={latestScan.overallMatchScore} size={140} strokeWidth={12} />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Engine: {latestScan.aiProviderUsed}</span>
                </div>
                <Link
                  to={`/analysis/${latestScan._id}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-sky-400 hover:underline"
                >
                  View Full Report & Roadmap
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-sky-400">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                No Skill Assessments Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Scan your resume or sample profile now to get your benchmark radar chart and custom learning roadmap.
              </p>
              <Link
                to="/analyzer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                Start Free Diagnostic
              </Link>
            </div>
          )}

          {/* Quick How-It-Works Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xs mb-2">
                1
              </div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Upload Profile</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Upload resume or choose from instant demo personas.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs mb-2">
                2
              </div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">AI Diagnostic</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Pinpoint deficits across standard competencies.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs mb-2">
                3
              </div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Follow Roadmap</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Check off milestones, build portfolio projects.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Industry Standards Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              Role Standards
            </h3>
            <Link to="/roles" className="text-xs text-indigo-600 dark:text-sky-400 hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {roles.map((role) => (
              <div
                key={role.slug}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                    {role.marketDemand} Demand
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {role.salaryRange?.min ? (
                      `$${(role.salaryRange.min / 1000).toFixed(0)}k - $${(role.salaryRange.max / 1000).toFixed(0)}k`
                    ) : (
                      'Competitive'
                    )}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mt-2 group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
                  {role.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {role.description}
                </p>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {role.requiredSkills?.length || 8} Key Competencies
                  </span>
                  <Link
                    to={`/analyzer?role=${encodeURIComponent(role.title)}`}
                    className="text-xs font-semibold text-indigo-600 dark:text-sky-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    Test Fit
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
