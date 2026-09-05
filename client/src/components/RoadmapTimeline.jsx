import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Clock, 
  BookOpen, 
  Code2, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Award 
} from 'lucide-react';
import { roadmapAPI } from '../services/api';

const RoadmapTimeline = ({ initialRoadmap }) => {
  const [roadmap, setRoadmap] = useState(initialRoadmap);
  const [expandedPhases, setExpandedPhases] = useState({ 0: true, 1: true, 2: true });
  const [updating, setUpdating] = useState(false);

  if (!roadmap || !roadmap.phases || roadmap.phases.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400">
        No learning roadmap generated yet. Complete an analysis to generate your plan.
      </div>
    );
  }

  const togglePhase = (phaseIndex) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phaseIndex]: !prev[phaseIndex]
    }));
  };

  const handleToggleMilestone = async (phaseIndex, milestoneIndex) => {
    if (updating || !roadmap._id) return;
    setUpdating(true);

    try {
      const res = await roadmapAPI.toggleMilestone(roadmap._id, phaseIndex, milestoneIndex);
      if (res.data.success) {
        setRoadmap(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to update milestone remotely, updating locally:', err.message);
      // Fallback local update
      const updatedPhases = [...roadmap.phases];
      const milestone = updatedPhases[phaseIndex].milestones[milestoneIndex];
      milestone.completed = !milestone.completed;

      let total = 0;
      let done = 0;
      updatedPhases.forEach(p => p.milestones.forEach(m => {
        total++;
        if (m.completed) done++;
      }));

      setRoadmap({
        ...roadmap,
        phases: updatedPhases,
        overallProgressPercentage: total > 0 ? Math.round((done / total) * 100) : 0
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Roadmap Header Summary & Overall Progress Bar */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-sky-900/20 to-slate-900/60 border border-indigo-500/20 dark:border-indigo-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                Personalized Career Roadmap: {roadmap.targetRole}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
              Estimated Completion: {roadmap.totalDurationWeeks || 8} Weeks • Interactive milestone tracking
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-400">Total Completion</span>
              <p className="text-xl font-black text-indigo-600 dark:text-sky-400">
                {roadmap.overallProgressPercentage || 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-4">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${roadmap.overallProgressPercentage || 0}%` }}
          />
        </div>
      </div>

      {/* Phases Stack */}
      <div className="space-y-4">
        {roadmap.phases.map((phase, pIdx) => {
          const isExpanded = expandedPhases[pIdx] !== false;
          const completedCount = phase.milestones.filter(m => m.completed).length;
          const phaseProgress = phase.milestones.length > 0
            ? Math.round((completedCount / phase.milestones.length) * 100)
            : 0;

          return (
            <div
              key={pIdx}
              className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition-all"
            >
              {/* Phase Header */}
              <div
                onClick={() => togglePhase(pIdx)}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-sky-400 flex items-center justify-center font-bold text-xs border border-indigo-200 dark:border-indigo-800">
                    P{phase.phaseNumber}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">
                      {phase.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {phase.durationWeeks || 2} Weeks
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <div className="flex flex-wrap gap-1">
                        {phase.focusSkills?.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
                    {completedCount} / {phase.milestones.length} Done
                  </span>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </div>

              {/* Milestones Accordion Body */}
              {isExpanded && (
                <div className="border-t border-slate-100 dark:border-slate-800/80 p-4 sm:p-5 space-y-4 bg-slate-50/50 dark:bg-slate-900/40">
                  {phase.milestones.map((milestone, mIdx) => (
                    <div
                      key={mIdx}
                      className={`p-4 rounded-xl border transition-all ${
                        milestone.completed
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-750'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start space-x-3">
                          <button
                            onClick={() => handleToggleMilestone(pIdx, mIdx)}
                            className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110"
                            title={milestone.completed ? 'Mark incomplete' : 'Mark complete'}
                          >
                            {milestone.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-400 hover:text-indigo-500" />
                            )}
                          </button>
                          <div>
                            <h5 className={`text-sm font-semibold ${
                              milestone.completed
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : 'text-slate-800 dark:text-slate-100'
                            }`}>
                              {milestone.title}
                            </h5>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {milestone.description}
                            </p>
                          </div>
                        </div>

                        {milestone.estimatedHours && (
                          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/60 px-2 py-1 rounded-md flex-shrink-0">
                            <Clock className="w-3 h-3" />
                            <span>{milestone.estimatedHours}h</span>
                          </div>
                        )}
                      </div>

                      {/* Project Idea / Deliverable card */}
                      {milestone.projectIdea && (
                        <div className="mt-3 p-3 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-2.5">
                          <Code2 className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                          <div className="text-xs">
                            <span className="font-bold text-indigo-900 dark:text-indigo-300">
                              Mini-Project: {milestone.projectIdea.title}
                            </span>
                            <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                              {milestone.projectIdea.description}
                            </p>
                            {milestone.projectIdea.deliverable && (
                              <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                Deliverable: {milestone.projectIdea.deliverable}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Recommended Resources */}
                      {milestone.resources && milestone.resources.length > 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> Resources:
                          </span>
                          {milestone.resources.map((res, rIdx) => (
                            <a
                              key={rIdx}
                              href={res.url || '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 hover:underline bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-900/60"
                            >
                              <span>{res.title}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapTimeline;
