import React from 'react';

const ScoreDial = ({ score = 0, size = 180, strokeWidth = 14 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 80) return { stroke: '#10b981', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', label: 'Strong Fit' };
    if (s >= 60) return { stroke: '#0ea5e9', text: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-500/10', label: 'Moderate Fit' };
    if (s >= 40) return { stroke: '#f59e0b', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10', label: 'Developing' };
    return { stroke: '#f43f5e', text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10', label: 'Significant Gap' };
  };

  const status = getColor(score);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={status.stroke}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Inner score label */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">
            {score}%
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Match Score
          </span>
        </div>
      </div>

      <div className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
        {status.label}
      </div>
    </div>
  );
};

export default ScoreDial;
