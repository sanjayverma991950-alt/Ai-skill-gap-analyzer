import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Filter } from 'lucide-react';

const GapBreakdownChart = ({ skillGaps = [] }) => {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const strongMatches = skillGaps.filter(s => s.status === 'Strong Match');
  const needsImprovement = skillGaps.filter(s => s.status === 'Needs Improvement');
  const missingCritical = skillGaps.filter(s => s.status === 'Missing Critical');

  const filteredSkills = skillGaps.filter(s => {
    if (selectedFilter === 'Strong Match') return s.status === 'Strong Match';
    if (selectedFilter === 'Needs Improvement') return s.status === 'Needs Improvement';
    if (selectedFilter === 'Missing Critical') return s.status === 'Missing Critical';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Summary metric pill counters */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setSelectedFilter(selectedFilter === 'Strong Match' ? 'All' : 'Strong Match')}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedFilter === 'Strong Match'
              ? 'ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700'
              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Matched
            </span>
            <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{strongMatches.length}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Skills you meet</p>
        </button>

        <button
          onClick={() => setSelectedFilter(selectedFilter === 'Needs Improvement' ? 'All' : 'Needs Improvement')}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedFilter === 'Needs Improvement'
              ? 'ring-2 ring-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700'
              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Growth
            </span>
            <span className="text-lg font-bold text-amber-700 dark:text-amber-300">{needsImprovement.length}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Partial / Upgradable</p>
        </button>

        <button
          onClick={() => setSelectedFilter(selectedFilter === 'Missing Critical' ? 'All' : 'Missing Critical')}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedFilter === 'Missing Critical'
              ? 'ring-2 ring-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700'
              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> Deficits
            </span>
            <span className="text-lg font-bold text-rose-700 dark:text-rose-300">{missingCritical.length}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">High priority gaps</p>
        </button>
      </div>

      {/* List of skills with comparative bars */}
      <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
        {filteredSkills.map((item, idx) => {
          const isMatch = item.status === 'Strong Match';
          const isNeedsWork = item.status === 'Needs Improvement';
          const isMissing = item.status === 'Missing Critical';

          return (
            <div
              key={idx}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  {isMatch && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                  {isNeedsWork && <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                  {isMissing && <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />}
                  <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                    {item.skill}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {item.category}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {item.learningPriority === 'High' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                      High Priority
                    </span>
                  )}
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {item.currentProficiency}% / {item.requiredProficiency}%
                  </span>
                </div>
              </div>

              {/* Dual progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex relative">
                {/* Target benchmark indicator marker */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-400 dark:bg-slate-500 z-10"
                  style={{ left: `${item.requiredProficiency}%` }}
                  title={`Benchmark requirement: ${item.requiredProficiency}%`}
                />
                {/* Candidate fill */}
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isMatch
                      ? 'bg-emerald-500'
                      : isNeedsWork
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, item.currentProficiency)}%` }}
                />
              </div>

              {item.reason && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                  {item.reason}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GapBreakdownChart;
