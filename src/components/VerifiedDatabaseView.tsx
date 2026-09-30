import React, { useState } from 'react';
import { VERIFIED_UNIVERSITIES_DB } from '../data/universities';
import { formatEuroAndNaira } from '../utils/fx';
import { Search, ExternalLink, Layers, CheckCircle2 } from 'lucide-react';

export const VerifiedDatabaseView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [frenchOnly, setFrenchOnly] = useState(false);

  const countries = ['All', ...Array.from(new Set(VERIFIED_UNIVERSITIES_DB.map(u => u.country)))];

  const filtered = VERIFIED_UNIVERSITIES_DB.filter(item => {
    const matchesSearch = 
      item.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.programmeCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.country.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCountry = selectedCountry === 'All' || item.country === selectedCountry;
    const matchesFrench = !frenchOnly || item.acceptsHndDirectMaster;

    return matchesSearch && matchesCountry && matchesFrench;
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-sky-400" />
            Verified Global Universities & Pathways Database
          </h2>
          <p className="text-xs text-slate-400">
            Official program URLs, published entry criteria, and live tuition benchmarks for LaniEdu Agent matching.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-mono text-indigo-300 border border-slate-800">
            {filtered.length} Verified Institutions
          </span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search school, country, or course..."
            className="w-full rounded-xl glass-input pl-9 pr-3 py-2 text-xs"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <select
            value={selectedCountry}
            onChange={e => setSelectedCountry(e.target.value)}
            className="rounded-xl glass-input px-3 py-2 text-xs bg-slate-900"
          >
            {countries.map(c => (
              <option key={c} value={c}>Country: {c}</option>
            ))}
          </select>

          <label className="flex items-center gap-2 cursor-pointer bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-200">
            <input
              type="checkbox"
              checked={frenchOnly}
              onChange={e => setFrenchOnly(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-slate-700 text-indigo-600"
            />
            <span>French HND Direct Master's Only</span>
          </label>
        </div>
      </div>

      {/* Grid of Universities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(uni => (
          <div key={uni.id} className="glass-panel p-4 rounded-2xl space-y-3 flex flex-col justify-between border-slate-800/80 hover:border-indigo-500/30 transition-all">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-slate-300 border border-slate-800">
                  {uni.country.toUpperCase()}
                </span>
                <a
                  href={uni.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:underline"
                >
                  Official Page <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <h3 className="text-sm font-bold text-white mt-2 leading-snug">{uni.schoolName}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{uni.programmeCategory}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Verified Tuition:</span>
                <span className="font-mono font-bold text-emerald-400">{uni.tuitionLocal}</span>
              </div>
              <div className="text-[10px] text-right font-mono text-slate-400">
                ({formatEuroAndNaira(uni.tuitionEur)})
              </div>

              <div className="rounded-xl bg-slate-900/90 p-2.5 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <strong className="text-slate-400 text-[10px] uppercase block">Published Requirement:</strong>
                <p>{uni.entryRequirementDegree}</p>
              </div>

              {uni.acceptsHndDirectMaster && (
                <div className="flex items-center gap-1 text-[10px] font-semibold text-purple-300 bg-purple-500/10 p-1.5 rounded-lg border border-purple-500/20">
                  <CheckCircle2 className="h-3 w-3 text-purple-400 shrink-0" />
                  Accepts HND directly for Master's entry
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
