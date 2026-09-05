import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';

const SAMPLE_PERSONAS = [
  {
    name: 'Junior React Frontend Dev',
    target: 'Full Stack Developer',
    summary: `Alex Chen - Frontend Web Developer
Skills: React, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Redux Toolkit, Git, GitHub, REST APIs, responsive design, Figma.
Experience:
Frontend Developer at TechNova (1.5 years):
- Built reusable React components for customer-facing dashboard.
- Integrated RESTful endpoints for user authentication and product listings.
- Improved mobile responsiveness and page load times by 20%.
Seeking to transition into a Full Stack Developer role.`
  },
  {
    name: 'Python & SQL Data Enthusiast',
    target: 'Data Scientist',
    summary: `Jordan Taylor - Junior Data Analyst
Skills: Python, SQL, Pandas, NumPy, Matplotlib, Excel, PostgreSQL, basic Git.
Experience:
Data Analyst Intern at InsightCorp (1 year):
- Formulated SQL queries across multi-million row datasets for KPI tracking.
- Created monthly automated revenue reports and visualizations in Matplotlib.
- Built initial proof-of-concept linear regression models in Scikit-Learn.
Looking to advance into a Data Scientist position.`
  },
  {
    name: 'Backend Node/Express Dev',
    target: 'DevOps & Cloud Architect',
    summary: `Samir Patel - Backend Software Engineer
Skills: Node.js, Express.js, MongoDB, JavaScript, REST APIs, Postman, Jest, Linux basics, Git.
Experience:
Backend Engineer at CloudSphere (2 years):
- Engineered microservices and CRUD APIs serving 50k daily active users.
- Designed document schemas in MongoDB and implemented JWT authentication.
- Familiar with writing Dockerfiles for local microservice development.
Goal: Become a specialized DevOps and Cloud Infrastructure Architect.`
  }
];

const ResumeUploader = ({
  file,
  setFile,
  resumeText,
  setResumeText,
  onSelectPersona,
  inputMode,
  setInputMode
}) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectedFile = (selectedFile) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    if (
      validTypes.includes(selectedFile.type) ||
      selectedFile.name.endsWith('.pdf') ||
      selectedFile.name.endsWith('.docx') ||
      selectedFile.name.endsWith('.txt')
    ) {
      setFile(selectedFile);
    } else {
      alert('Please select a valid PDF, DOCX, or TXT file.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab switch: File Upload vs Direct Text */}
      <div className="flex items-center justify-between">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setInputMode('file')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              inputMode === 'file'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Upload Resume (PDF/DOCX)
          </button>
          <button
            type="button"
            onClick={() => setInputMode('text')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              inputMode === 'text'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Paste Text
          </button>
        </div>

        {/* 1-Click Demo Profiles dropdown / triggers */}
        <div className="flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs text-slate-500 font-medium">Quick Demo:</span>
          <div className="flex gap-1">
            {SAMPLE_PERSONAS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectPersona(p)}
                className="text-[11px] px-2 py-1 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 rounded-md border border-indigo-200/60 dark:border-indigo-800/60 font-medium transition-colors"
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {inputMode === 'file' ? (
        /* File Drag & Drop Zone */
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
              : file
              ? 'border-emerald-500/60 bg-emerald-50/30 dark:bg-emerald-950/10'
              : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white/50 dark:bg-slate-900/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleSelectedFile(e.target.files[0]);
              }
            }}
          />

          {file ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {file.name}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {(file.size / 1024).toFixed(1)} KB • Ready for scan
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="mt-3 text-xs text-rose-500 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Change file
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-sky-400 flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Drag and drop your resume file here
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Supports PDF, DOCX, or TXT up to 10MB
              </p>
              <span className="mt-4 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Browse Files
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Textarea input */
        <div>
          <textarea
            rows={7}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume content, experience list, LinkedIn summary, or tech skills here..."
            className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-400"
          />
          <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400">
            <span>Minimum 30 characters recommended for accurate diagnostics</span>
            <span>{resumeText.length} chars</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;
