import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { analyzerAPI, roleAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ResumeUploader from '../components/ResumeUploader';
import { 
  Sparkles, 
  Target, 
  FileText, 
  Briefcase, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown
} from 'lucide-react';

const SCAN_STEPS = [
  'Extracting technical skill tokens & career history...',
  'Normalizing proficiencies across target competencies...',
  'Evaluating readiness against industry benchmarks...',
  'Synthesizing personalized learning milestones & project ideas...'
];

const Analyzer = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // Form State
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [inputMode, setInputMode] = useState('file');
  const [candidateName, setCandidateName] = useState(user?.name || '');
  const [targetRole, setTargetRole] = useState(searchParams.get('role') || 'Full Stack Developer');
  const [customJobDescription, setCustomJobDescription] = useState('');
  const [showCustomJD, setShowCustomJD] = useState(false);

  // Available roles for select dropdown
  const [roles, setRoles] = useState([]);
  
  // UI & Processing State
  const [loading, setLoading] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await roleAPI.getRoles();
        setRoles(res.data.data);
      } catch (err) {
        console.warn('Could not load roles for dropdown:', err.message);
      }
    };
    fetchRoles();
  }, []);

  const handleSelectPersona = (persona) => {
    setInputMode('text');
    setResumeText(persona.summary);
    setCandidateName(persona.name.split(' ')[0]);
    if (persona.target) {
      setTargetRole(persona.target);
    }
  };

  const handleRunAnalysis = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (inputMode === 'file' && !file) {
      setErrorMessage('Please upload a resume file (PDF, DOCX, TXT) or switch to text mode.');
      return;
    }

    if (inputMode === 'text' && (!resumeText || resumeText.trim().length < 25)) {
      setErrorMessage('Please enter at least 25 characters of resume or skills summary.');
      return;
    }

    setLoading(true);
    setCurrentStepIdx(0);

    // Cycle through visual step progress indicators
    const interval = setInterval(() => {
      setCurrentStepIdx(prev => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const formData = new FormData();
      if (inputMode === 'file' && file) {
        formData.append('resume', file);
      } else {
        formData.append('resumeText', resumeText);
      }

      formData.append('targetRole', targetRole);
      if (candidateName) formData.append('candidateName', candidateName);
      if (customJobDescription) formData.append('customJobDescription', customJobDescription);

      const response = await analyzerAPI.scanResume(formData);
      clearInterval(interval);

      if (response.data.success) {
        const analysisId = response.data.data.analysis._id;
        navigate(`/analysis/${analysisId}`, { state: { result: response.data.data } });
      } else {
        setErrorMessage(response.data.message || 'Analysis failed');
      }
    } catch (err) {
      clearInterval(interval);
      console.error('Analysis error:', err);
      setErrorMessage(
        err.response?.data?.message || err.message || 'Analysis could not be completed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Title Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-sky-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
          <Sparkles className="w-3.5 h-3.5" />
          AI Skill Gap Diagnostics
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Evaluate Your Skill Fit
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Provide your resume or current tech stack, choose a target job, and our AI will benchmark your capabilities against market requirements.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Analyzer Card */}
      <form
        onSubmit={handleRunAnalysis}
        className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6"
      >
        {/* Step 1: Profile Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            1. Your Resume or Current Profile
          </label>
          <ResumeUploader
            file={file}
            setFile={setFile}
            resumeText={resumeText}
            setResumeText={setResumeText}
            onSelectPersona={handleSelectPersona}
            inputMode={inputMode}
            setInputMode={setInputMode}
          />
        </div>

        {/* Step 2: Target Role & JD */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-500" />
            2. Choose Target Role Benchmark
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-1 block">
                Standard Industry Benchmark
              </span>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {roles.length > 0 ? (
                  roles.map((r) => (
                    <option key={r.slug} value={r.title}>
                      {r.title} ({r.marketDemand} Demand)
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="AI / Machine Learning Engineer">AI / Machine Learning Engineer</option>
                    <option value="DevOps & Cloud Architect">DevOps & Cloud Architect</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                    <option value="Frontend Specialist (React / Next.js)">Frontend Specialist</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-1 block">
                Candidate Name (Optional)
              </span>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="e.g. Alex Chen"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Optional Custom Job Description Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowCustomJD(!showCustomJD)}
              className="text-xs font-semibold text-indigo-600 dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>{showCustomJD ? '− Hide Custom Job Description' : '+ Add Specific Job Description (Optional)'}</span>
            </button>

            {showCustomJD && (
              <div className="mt-3">
                <textarea
                  rows={4}
                  value={customJobDescription}
                  onChange={(e) => setCustomJobDescription(e.target.value)}
                  placeholder="Paste a specific company's Job Description / Requirements here to tailor the analysis specifically to their vacancy..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit Action Button & Loading Screen */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          {loading ? (
            <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-indigo-600 dark:text-sky-400">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-sm font-bold">AI Skill Gap Engine Active...</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium animate-pulse">
                {SCAN_STEPS[currentStepIdx]}
              </p>
              <div className="w-full bg-indigo-200 dark:bg-indigo-900/50 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 dark:bg-sky-400 h-full transition-all duration-700 rounded-full"
                  style={{ width: `${((currentStepIdx + 1) / SCAN_STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-sky-600 to-indigo-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              Generate AI Skill Gap Analysis
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

    </div>
  );
};

export default Analyzer;
