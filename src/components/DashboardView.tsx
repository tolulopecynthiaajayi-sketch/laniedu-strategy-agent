import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { ClientStrategyBrief } from '../types';
import { Users, Search, Clock, BadgeCheck, FileText, ExternalLink } from 'lucide-react';
import { formatCurrency, formatEuroAndNaira } from '../utils/fx';

interface DashboardViewProps {
  onSelectBrief: (brief: ClientStrategyBrief) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectBrief }) => {
  const [briefs, setBriefs] = useState<ClientStrategyBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'briefs'),
      orderBy('generatedAt', 'desc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedBriefs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ClientStrategyBrief[];
      
      setBriefs(fetchedBriefs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching briefs: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredBriefs = briefs.filter(brief => 
    brief.intakeData.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brief.intakeData.targetProgramme.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border-indigo-500/20">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-400" />
            Client History Dashboard
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Persistent record of all dynamically generated AI strategy briefs.
          </p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search applicants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredBriefs.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-3">
          <FileText className="h-12 w-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-semibold text-slate-300">No strategy briefs found</h3>
          <p className="text-sm text-slate-500">
            Submit a form or generate a new brief and it will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBriefs.map((brief) => (
            <div key={brief.id} className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col h-full group">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-white text-lg truncate pr-2">{brief.intakeData.applicantName}</h3>
                <span className={\`text-xs font-bold px-2 py-1 rounded-md \${
                  brief.viability.viabilityScore >= 80 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  brief.viability.viabilityScore >= 50 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }\`}>
                  {brief.viability.viabilityScore}% Viable
                </span>
              </div>
              
              <div className="space-y-2 mb-4 flex-grow">
                <div className="text-xs text-slate-300 flex items-center gap-1.5">
                  <BadgeCheck className="h-3.5 w-3.5 text-indigo-400" />
                  <span className="truncate">{brief.intakeData.targetProgramme}</span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(brief.generatedAt).toLocaleDateString()} at {new Date(brief.generatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                
                <div className="mt-3 p-2 bg-slate-900/80 rounded-lg border border-slate-800/80">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Top Reach Match</div>
                  <div className="text-xs text-amber-300 font-medium truncate">
                    {brief.primaryReachSchools?.[0]?.schoolName || 'N/A'}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {brief.primaryReachSchools?.[0]?.country || ''} • {formatEuroAndNaira(brief.primaryReachSchools?.[0]?.tuitionEuroApprox || 0)}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => onSelectBrief(brief)}
                className="w-full mt-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-indigo-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors border border-slate-700 group-hover:border-indigo-500"
              >
                View Full Strategy
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
