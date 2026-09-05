import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { roadmapAPI, analyzerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RoadmapTimeline from '../components/RoadmapTimeline';
import { Map, Sparkles, ArrowRight, BookOpen, Layers } from 'lucide-react';

const RoadmapView = () => {
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        if (user) {
          const res = await roadmapAPI.getUserRoadmaps();
          if (res.data.success && res.data.data.length > 0) {
            setRoadmaps(res.data.data);
            setSelectedRoadmap(res.data.data[0]);
          }
        }
      } catch (err) {
        console.warn('Could not fetch user roadmaps:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500">Loading career roadmaps...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-sky-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 mb-2">
            <Map className="w-3.5 h-3.5" />
            Skill Execution Tracker
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Personalized Career Learning Roadmaps
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Structured week-by-week curriculum tailored to close your specific technical skill deficits.
          </p>
        </div>

        <Link
          to="/analyzer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          Generate New Roadmap
        </Link>
      </div>

      {selectedRoadmap ? (
        <div className="space-y-6">
          {roadmaps.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <span className="text-xs text-slate-400 whitespace-nowrap">Your Roadmaps:</span>
              {roadmaps.map((rm) => (
                <button
                  key={rm._id}
                  onClick={() => setSelectedRoadmap(rm)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                    selectedRoadmap._id === rm._id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {rm.targetRole} ({rm.overallProgressPercentage || 0}%)
                </button>
              ))}
            </div>
          )}

          <RoadmapTimeline initialRoadmap={selectedRoadmap} />
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-sky-400 flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            No Active Roadmaps Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Run a diagnostic with our AI Skill Gap Analyzer to generate a customized week-by-week roadmap with curated tutorials, project ideas, and progress checklists.
          </p>
          <div className="pt-2">
            <Link
              to="/analyzer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs shadow-md"
            >
              <Sparkles className="w-4 h-4" /> Start Skill Analysis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapView;
