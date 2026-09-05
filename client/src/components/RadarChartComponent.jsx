import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-xs">
        <p className="font-bold text-slate-800 dark:text-slate-100 mb-1">{payload[0]?.payload?.category}</p>
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          <span>Your Score: {payload[0]?.value}%</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Market Benchmark: {payload[1]?.value}%</span>
        </div>
      </div>
    );
  }
  return null;
};

const RadarChartComponent = ({ data = [] }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
        No competency radar data available
      </div>
    );
  }

  return (
    <div className="w-full h-72 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke={isDark ? '#334155' : '#e2e8f0'} />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10 }}
          />
          <Radar
            name="Your Skills"
            dataKey="candidateScore"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.4}
          />
          <Radar
            name="Market Standard"
            dataKey="benchmarkScore"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.2}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
            formatter={(value) => (
              <span className="text-slate-600 dark:text-slate-300 font-medium">{value}</span>
            )}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartComponent;
