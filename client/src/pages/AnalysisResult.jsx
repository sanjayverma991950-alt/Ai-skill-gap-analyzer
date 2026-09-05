import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { analyzerAPI } from '../services/api';
import ScoreDial from '../components/ScoreDial';
import RadarChartComponent from '../components/RadarChartComponent';
import GapBreakdownChart from '../components/GapBreakdownChart';
import RoadmapTimeline from '../components/RoadmapTimeline';
import { 
  Sparkles, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  BookOpen, 
  Map, 
  Download, 
  Share2, 
  ArrowLeft, 
  ExternalLink,
  Code2,
  Printer
} from 'lucide-react';

const AnalysisResult = () => {
  const { id } = useParams();
  const location = useLocation();

  const [analysis, setAnalysis] = useState(location.state?.result?.analysis || null);
  const [roadmap, setRoadmap] = useState(location.state?.result?.roadmap || null);
  const [loading, setLoading] = useState(!analysis);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'roadmap' | 'recommendations'
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!analysis && id) {
      const fetchAnalysisData = async () => {
        try {
          const res = await analyzerAPI.getAnalysisById(id);
          if (res.data.success) {
            setAnalysis(res.data.data.analysis);
            setRoadmap(res.data.data.roadmap);
          }
        } catch (err) {
          console.error('Failed to load analysis:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchAnalysisData();
    }
  }, [id, analysis]);

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ analysis, roadmap }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `skillbridge-analysis-${analysis?.candidateName || 'report'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          Loading diagnostic report...
        </p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Analysis Report Not Found</h2>
        <p className="text-xs text-slate-500">The requested report ID may have expired or is not available.</p>
        <Link
          to="/analyzer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" /> Run New Analysis
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0">
      
      {/* Top Action Breadcrumb Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          to="/analyzer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-sky-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Analyzer
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
        </div>
      </div>

      {/* Hero Assessment Summary Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-sky-400 border border-indigo-200 dark:border-indigo-800">
                Target Role: {analysis.targetRole}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                {analysis.aiProviderUsed}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Skill Diagnostics for {analysis.candidateName}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {analysis.summary}
            </p>

            {/* High Level Key Strengths & Gaps Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Core Strengths
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {analysis.strengths?.slice(0, 3).join(', ') || 'Solid technical foundation'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
                <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> High-Impact Deficits
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {analysis.keyGaps?.slice(0, 3).join(', ') || 'System scalability & cloud architecture'}
                </p>
              </div>
            </div>
          </div>

          {/* Right side Score Dial */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
            <ScoreDial score={analysis.overallMatchScore} size={160} strokeWidth={14} />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 pt-4 print:hidden">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === 'overview'
                ? 'text-indigo-600 dark:text-sky-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Skill Matrix & Gap Analytics
            {activeTab === 'overview' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-sky-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`pb-3 text-sm font-bold transition-all relative flex items-center gap-1.5 ${
              activeTab === 'roadmap'
                ? 'text-indigo-600 dark:text-sky-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Map className="w-4 h-4" />
            Personalized Roadmap
            {activeTab === 'roadmap' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-sky-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('recommendations')}
            className={`pb-3 text-sm font-bold transition-all relative flex items-center gap-1.5 ${
              activeTab === 'recommendations'
                ? 'text-indigo-600 dark:text-sky-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            Recommendations ({analysis.recommendations?.length || 0})
            {activeTab === 'recommendations' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-sky-400" />
            )}
          </button>
        </div>
      </div>

      {/* Tab 1: Overview (Radar Chart + Detailed Gap List) */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Radar Chart Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Competency Radar vs. Benchmark
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Visual mapping of your proficiencies across core domain areas
                </p>
              </div>
            </div>
            <RadarChartComponent data={analysis.radarData} />
          </div>

          {/* Gap Breakdown List */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Skill Gaps & Proficiencies
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Individual skill deficits categorized by learning priority
                </p>
              </div>
            </div>
            <GapBreakdownChart skillGaps={analysis.skillGaps} />
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Roadmap Timeline */}
      {activeTab === 'roadmap' && (
        <RoadmapTimeline initialRoadmap={roadmap} />
      )}

      {/* Tab 3: Actionable Recommendations */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysis.recommendations?.map((rec, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-sky-400">
                      {rec.type || 'Course'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rec.priority === 'High'
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {rec.priority || 'Medium'} Priority
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {rec.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <a
                    href={rec.url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-sky-400 hover:underline"
                  >
                    <span>View Curated Guide</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default AnalysisResult;
