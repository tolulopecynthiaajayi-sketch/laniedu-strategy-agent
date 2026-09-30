import { useState } from 'react';
import type { ClientIntakeData, ClientStrategyBrief } from './types';
import { generateClientStrategyBrief } from './utils/rulesEngine';
import { SAMPLE_PROFILES } from './data/sampleProfiles';
import { Header } from './components/Header';
import { StrategyBriefView } from './components/StrategyBriefView';
import { IntakeForm } from './components/IntakeForm';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { VerifiedDatabaseView } from './components/VerifiedDatabaseView';
import { SampleProfilesModal } from './components/SampleProfilesModal';

export function App() {
  const [activeTab, setActiveTab] = useState<'brief' | 'form' | 'sheets' | 'database'>('brief');
  
  // Default to sample profile #2 (HND France exception) so advisors see a live brief immediately
  const initialBrief = generateClientStrategyBrief(SAMPLE_PROFILES[1].data);
  const [activeBrief, setActiveBrief] = useState<ClientStrategyBrief | null>(initialBrief);

  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

  const handleProcessIntake = (intakeData: ClientIntakeData) => {
    const brief = generateClientStrategyBrief(intakeData);
    setActiveBrief(brief);
    setActiveTab('brief');
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 font-sans flex flex-col justify-between">
      <div>
        {/* Navigation Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSampleProfiles={() => setIsSampleModalOpen(true)}
          hasActiveBrief={!!activeBrief}
        />

        {/* Main Content Body */}
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {activeTab === 'brief' && (
            activeBrief ? (
              <StrategyBriefView brief={activeBrief} />
            ) : (
              <div className="text-center py-12 space-y-4">
                <p className="text-sm text-slate-400">No active Strategy Brief loaded yet.</p>
                <button
                  onClick={() => setActiveTab('form')}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
                >
                  Create New Client Intake
                </button>
              </div>
            )
          )}

          {activeTab === 'form' && (
            <IntakeForm onSubmit={handleProcessIntake} />
          )}

          {activeTab === 'sheets' && (
            <GoogleSheetsModal onImportIntake={handleProcessIntake} />
          )}

          {activeTab === 'database' && (
            <VerifiedDatabaseView />
          )}
        </main>
      </div>

      {/* Footer Branding */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-400 no-print">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © 2026 <strong>LaniEdu Strategy Engine</strong> • Analytical & Research Division
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Live FX Benchmark: 1 EUR = ₦1,650 NGN</span>
            <span>•</span>
            <span>Vercel Deployable App</span>
          </div>
        </div>
      </footer>

      {/* Sample Profile Selector Modal */}
      <SampleProfilesModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onSelectProfile={handleProcessIntake}
      />
    </div>
  );
}

export default App;
