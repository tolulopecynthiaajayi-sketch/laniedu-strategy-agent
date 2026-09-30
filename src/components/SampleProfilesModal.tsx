import React from 'react';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';
import type { ClientIntakeData } from '../types';
import { X, Sparkles, ArrowRight } from 'lucide-react';

interface SampleProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProfile: (data: ClientIntakeData) => void;
}

export const SampleProfilesModal: React.FC<SampleProfilesModalProps> = ({
  isOpen,
  onClose,
  onSelectProfile
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 space-y-5 border-indigo-500/30 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              Select LaniEdu Benchmark Test Profile
            </h3>
            <p className="text-xs text-slate-400">
              Click any profile to run the strategy engine and test core dealbreaker rules in real-time.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-800 p-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Profile List */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {SAMPLE_PROFILES.map((profile, i) => (
            <div
              key={i}
              onClick={() => {
                onSelectProfile(profile.data);
                onClose();
              }}
              className="glass-panel p-4 rounded-2xl border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all hover:translate-x-1 group flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {profile.label}
                </div>
                <p className="text-xs text-slate-400">{profile.description}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono pt-1">
                  <span>Applicant: {profile.data.applicantName}</span> • 
                  <span>Qual: {profile.data.highestQualification}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 shrink-0 self-center">
                Test Profile <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
