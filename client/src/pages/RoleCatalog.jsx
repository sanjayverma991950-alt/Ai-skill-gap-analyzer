import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { roleAPI } from '../services/api';
import { 
  BookOpen, 
  Search, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Layers,
  Sparkles,
  Filter
} from 'lucide-react';

const RoleCatalog = () => {
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await roleAPI.getRoles();
        setRoles(res.data.data);
      } catch (err) {
        console.error('Failed to load role catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const categories = ['All', ...new Set(roles.map(r => r.category))];

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.requiredSkills?.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || role.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Market Competency Catalog
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Industry Tech Role Standards
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Explore standard skill expectations, compensation bands, and competency benchmarks across major modern engineering disciplines.
          </p>
        </div>

        <Link
          to="/analyzer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          Test My Fit
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search roles or skills (e.g. React, Docker, Python)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-750'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Roles Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-slate-500">Loading benchmark standards...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map((role) => (
            <div
              key={role.slug}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Demand & Salary */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                    {role.marketDemand} Demand
                  </span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    {role.salaryRange?.min
                      ? `${(role.salaryRange.min / 1000).toFixed(0)}k - ${(role.salaryRange.max / 1000).toFixed(0)}k / yr`
                      : 'Competitive'}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                    {role.title}
                  </h3>
                  <span className="text-[11px] font-medium text-slate-400 block mb-2">
                    {role.category}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {role.description}
                  </p>
                </div>

                {/* Key Skills Checklist */}
                <div>
                  <h5 className="text-[11px] font-bold uppercase text-slate-400 mb-2">
                    Core Technical Requirements
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {role.requiredSkills?.slice(0, 7).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                          skill.importance === 'Critical'
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/80 font-semibold'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {skill.name}
                      </span>
                    ))}
                    {(role.requiredSkills?.length || 0) > 7 && (
                      <span className="text-[11px] text-slate-400 px-1 py-0.5">
                        +{role.requiredSkills.length - 7} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to={`/analyzer?role=${encodeURIComponent(role.title)}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-50 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-indigo-600 dark:text-sky-400 text-xs font-bold transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Test My Profile Against Role</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoleCatalog;
