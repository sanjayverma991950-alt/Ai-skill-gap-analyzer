import React from 'react';
import { Compass, Heart, Github, Sparkles, Layers } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center space-x-2">
          <Compass className="w-5 h-5 text-indigo-600 dark:text-sky-400" />
          <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
            SkillBridge AI
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-500">
            • Career Intelligence & Skill Gap Diagnostics
          </span>
        </div>

        <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Powered by Gemini AI & MERN
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-sky-500" />
            React + Express + MongoDB
          </span>
        </div>

        <div className="text-xs text-slate-400">
          © {new Date().getFullYear()} SkillBridge AI. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
