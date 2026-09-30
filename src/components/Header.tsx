import React from 'react';
import { 
  Sparkles, 
  FileSpreadsheet, 
  Layers, 
  FileText, 
  Zap, 
  CheckCircle2 
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'brief' | 'form' | 'sheets' | 'database';
  setActiveTab: (tab: 'brief' | 'form' | 'sheets' | 'database') => void;
  onOpenSampleProfiles: () => void;
  hasActiveBrief: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSampleProfiles,
  hasActiveBrief
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-sky-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Sparkles className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">LaniEdu</h1>
              <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                Strategy Agent v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400">Internal Educational Research & Strategy Engine</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 rounded-xl bg-slate-900/90 p-1 border border-slate-800">
          <button
            onClick={() => setActiveTab('brief')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'brief'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Client Strategy Brief
            {hasActiveBrief && (
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('form')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'form'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            New Intake Form
          </button>

          <button
            onClick={() => setActiveTab('sheets')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'sheets'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
            Google Forms / Sheets
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'database'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-sky-400" />
            Verified Universities
          </button>
        </nav>

        {/* Quick Action / Preset Loader */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSampleProfiles}
            className="flex items-center gap-2 rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            Load Sample Profile
          </button>
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" />
            Vercel Ready
          </div>
        </div>
      </div>
    </header>
  );
};
