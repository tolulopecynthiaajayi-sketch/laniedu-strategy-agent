import { useState, useEffect } from 'react';
import type { ClientIntakeData, ClientStrategyBrief } from './types';
import { generateClientStrategyBrief } from './utils/rulesEngine';
import { SAMPLE_PROFILES } from './data/sampleProfiles';
import { Header } from './components/Header';
import { StrategyBriefView } from './components/StrategyBriefView';
import { IntakeForm } from './components/IntakeForm';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { VerifiedDatabaseView } from './components/VerifiedDatabaseView';
import { SampleProfilesModal } from './components/SampleProfilesModal';
import { Sparkles, Bell } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'brief' | 'form' | 'sheets' | 'database'>('brief');
  
  // Default to sample profile #2 (HND France exception) so advisors see a live brief immediately
  const initialBrief = generateClientStrategyBrief(SAMPLE_PROFILES[1].data);
  const [activeBrief, setActiveBrief] = useState<ClientStrategyBrief | null>(initialBrief);

  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [newFormNotification, setNewFormNotification] = useState<any | null>(null);

  // Poll for live Google Form submissions from Vercel webhook
  useEffect(() => {
    const fetchLiveSubmissions = async () => {
      try {
        const res = await fetch('https://laniedu-strategy-agent.vercel.app/api/intake');
        if (res.ok) {
          const data = await res.json();
          if (data.recentSubmissions && data.recentSubmissions.length > 0) {
            const latest = data.recentSubmissions[0];
            if (!newFormNotification || newFormNotification.id !== latest.id) {
              setNewFormNotification(latest);
            }
          }
        }
      } catch (err) {
        // Silent catch for offline or dev mode
      }
    };

    fetchLiveSubmissions();
    const interval = setInterval(fetchLiveSubmissions, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleProcessIntake = async (intakeData: ClientIntakeData) => {
    setActiveTab('brief');
    // Show a loading state if possible by clearing active brief temporarily or letting the user know
    setNewFormNotification(null);
    try {
      const res = await fetch("https://laniedu-strategy-agent.vercel.app/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intakeData, prompt: "Generate the initial strategy brief dynamically based on this profile." })
      });
      const data = await res.json();
      if (data.success && data.brief) {
        setActiveBrief(data.brief);
      } else {
        alert("AI Error generating initial brief: " + data.error);
        // Fallback to static engine if AI fails
        setActiveBrief(generateClientStrategyBrief(intakeData));
      }
    } catch(err) {
      console.error(err);
      setActiveBrief(generateClientStrategyBrief(intakeData));
    }
  };

  const handleViewLiveSubmission = (sub: any) => {
    const intake: ClientIntakeData = {
      id: sub.id || `live-${Date.now()}`,
      applicantName: sub.applicantName || 'Live Google Form Applicant',
      phone: sub.phone || '',
      hasPersonalBudget: true,
      isFullyFundedScholarshipRequested: false,
      assistanceType: 'full_advisory',
      highestQualification: sub.qualification || 'bachelor_21',
      targetProgramme: sub.targetProgramme || 'Master Degree',
      degreeLevelSought: 'master',
      tuitionBudgetAmount: sub.tuitionBudgetAmount || 3500,
      tuitionBudgetCurrency: 'EUR',
      budgetTierLabel: sub.budgetTierLabel || 'Under €4,000 / ~₦6 Million per year',
      preferredDestinations: sub.preferredDestinations || ['France', 'China'],
      intakeTimeline: 'Spring 2027',
      visaRefusalHistory: sub.visaRefusalHistory || 'No, zero refusals',
      advisoryPackageSelected: sub.advisoryPackageSelected || 'Full Advisory',
      readinessTimeline: 'Immediate',
      scholarshipRetainerStatus: 'willing_100',
      wantsRelocationGuidebook: false,
      documents: {
        passport6Months: true,
        officialTranscripts: true,
        degreeCertificate: true,
        updatedCv: true,
        referenceLetters2: true,
        motivationLetterSop: true,
        englishProficiency: true,
        proofOfFunds: true
      },
      createdAt: sub.generatedAt || new Date().toISOString()
    };

    handleProcessIntake(intake);
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

        {/* Live Google Form Submission Alert Banner */}
        {newFormNotification && (
          <div className="bg-gradient-to-r from-emerald-600 via-indigo-600 to-purple-600 text-white px-4 py-2.5 shadow-xl border-b border-white/10 animate-in slide-in-from-top duration-300">
            <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Bell className="h-4 w-4 animate-bounce text-emerald-300" />
                <span>New Google Form Response Received!</span>
                <span className="hidden sm:inline bg-black/20 px-2 py-0.5 rounded text-[11px] font-mono">
                  {newFormNotification.applicantName} • {newFormNotification.budgetTierLabel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewLiveSubmission(newFormNotification)}
                  className="flex items-center gap-1 bg-white text-slate-950 font-bold px-3 py-1 rounded-lg text-xs hover:bg-slate-100 transition-all shadow-md"
                >
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                  Compile Brief Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Body */}
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {activeTab === 'brief' && (
            activeBrief ? (
              <StrategyBriefView brief={activeBrief} onUpdateBrief={setActiveBrief} />
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
            <span>Google Form Live Sync: Active</span>
            <span>•</span>
            <span>Live Webhook: https://laniedu-strategy-agent.vercel.app/api/intake</span>
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
