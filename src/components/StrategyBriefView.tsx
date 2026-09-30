import React, { useState } from 'react';
import type { ClientStrategyBrief, UniversityMatch } from '../types';
import { formatCurrency, formatEuroAndNaira } from '../utils/fx';
import { 
  Download, 
  Copy, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Building2, 
  FileCheck2, 
  UserCheck, 
  BadgeCheck, 
  Sparkles,
  MessageSquare,
  Package,
  Clock,
  Paperclip,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generatePdfDocument } from '../utils/exportPdf';

interface StrategyBriefViewProps {
  brief: ClientStrategyBrief;
  onUpdateBrief?: (newBrief: ClientStrategyBrief) => void;
}

export const StrategyBriefView: React.FC<StrategyBriefViewProps> = ({ brief, onUpdateBrief }) => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [cvData, setCvData] = useState<string | null>(null);
  const [cvMimeType, setCvMimeType] = useState<string | null>(null);
  const [cvFileName, setCvFileName] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }
    setCvFileName(file.name);
    setCvMimeType(file.type);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = (event.target?.result as string).split(',')[1];
      setCvData(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleClearCv = () => {
    setCvData(null);
    setCvMimeType(null);
    setCvFileName(null);
  };

  const handleAiRegenerate = async () => {
    if ((!aiPrompt.trim() && !cvData) || !onUpdateBrief) return;
    setIsGenerating(true);
    try {
      const res = await fetch("https://laniedu-strategy-agent.vercel.app/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          intakeData: brief.intakeData, 
          prompt: aiPrompt, 
          currentBrief: brief,
          cvData: cvData,
          cvMimeType: cvMimeType
        })
      });
      const data = await res.json();
      if (data.success && data.brief) {
        onUpdateBrief(data.brief);
        setAiPrompt("");
      } else {
        alert("AI Error: " + data.error);
      }
    } catch(err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const { intakeData, viability } = brief;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(brief.advisorClientScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleCopyMarkdown = () => {
    const mdText = buildMarkdownBrief(brief);
    navigator.clipboard.writeText(mdText);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2500);
  };

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    try {
      await generatePdfDocument('client-strategy-brief-container', `LaniEdu_Brief_${intakeData.applicantName.replace(/\s+/g, '_')}.pdf`);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      console.error('PDF Export Error:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Top Controls / Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 glass-panel p-4 rounded-2xl border border-indigo-500/20 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Client Strategy Brief</h2>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <BadgeCheck className="h-3.5 w-3.5" /> Live Verified
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Prepared for Lead Advisor Review • Applicant: <strong className="text-slate-200">{intakeData.applicantName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all border border-slate-700"
          >
            <Copy className="h-3.5 w-3.5 text-indigo-400" />
            {copiedMd ? 'Copied Markdown!' : 'Copy Brief (Markdown)'}
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            {isExportingPdf ? 'Generating PDF...' : 'Download PDF Brief'}
          </button>
        </div>
      </div>

      {/* Main Brief Printable Document Container */}
      <div id="client-strategy-brief-container" className="space-y-6 bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
        
        {/* Document Header Branding */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">LaniEdu Commercial Strategy Division</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">CLIENT STRATEGY BRIEF</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Ref: <span className="font-mono text-indigo-300">{brief.id}</span> • Date: {new Date(brief.generatedAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Viability Gauge */}
            <div className="text-right">
              <div className="text-xs text-slate-400 font-medium">Viability Rating</div>
              <div className="text-xl font-black text-emerald-400">{viability.viabilityScore}%</div>
            </div>
            <div className={`h-12 w-1.5 rounded-full ${
              viability.viabilityScore >= 80 ? 'bg-emerald-500' : viability.viabilityScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
            }`} />
          </div>
        </div>

        {/* Section 1: Applicant Overview */}
        <div className="glass-panel p-5 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-indigo-400 tracking-wider uppercase flex items-center gap-1.5">
            <UserCheck className="h-4 w-4 text-indigo-400" />
            1. Applicant Overview (Google Form "Path Selection")
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Applicant Name & Phone</div>
              <div className="text-sm font-bold text-white truncate">{intakeData.applicantName}</div>
              <div className="text-[10px] text-slate-400 font-mono">{intakeData.phone || 'No Phone'}</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Target Field & Level</div>
              <div className="text-sm font-bold text-indigo-300 truncate">{intakeData.targetProgramme}</div>
              <div className="text-[10px] text-slate-400">Level: {intakeData.degreeLevelSought?.toUpperCase()} • {intakeData.preferredDestinations.join(', ')}</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Highest Qualification</div>
              <div className="text-sm font-bold text-purple-300 truncate">
                {intakeData.highestQualification.replace('_', ' ').toUpperCase()}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Exp: {intakeData.workExperienceYears || 'N/A'}
              </div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Max Annual Tuition Budget</div>
              <div className="text-sm font-bold text-emerald-300 truncate">
                {intakeData.budgetTierLabel || formatCurrency(intakeData.tuitionBudgetAmount, intakeData.tuitionBudgetCurrency)}
              </div>
              <div className="text-[10px] text-slate-400">
                ~{formatEuroAndNaira(brief.primaryReachSchools[0]?.tuitionEuroApprox || 4000)}
              </div>
            </div>
          </div>

          {/* Package & Timeline Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-xs flex items-center gap-2">
              <Package className="h-4 w-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Package Selected:</span>
                <strong className="text-emerald-300 text-[11px]">{intakeData.advisoryPackageSelected || 'Full Advisory'}</strong>
              </div>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-xs flex items-center gap-2">
              <Clock className="h-4 w-4 text-sky-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Target Timeline:</span>
                <strong className="text-sky-300 text-[11px]">{intakeData.intakeTimeline || 'Spring 2027'}</strong>
              </div>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-xs flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-purple-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Visa Refusal History:</span>
                <strong className={intakeData.visaRefusalHistory !== 'No, zero refusals' ? 'text-rose-400' : 'text-slate-300'}>
                  {intakeData.visaRefusalHistory || 'Zero refusals'}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Viability Assessment & Reality Check */}
        <div className={`p-5 rounded-2xl border ${
          viability.classification === 'DIY / Guidebook Candidate'
            ? 'bg-rose-950/30 border-rose-500/40'
            : !viability.isBudgetViable
            ? 'bg-amber-950/30 border-amber-500/40'
            : 'bg-emerald-950/20 border-emerald-500/30'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold tracking-wider uppercase flex items-center gap-2 text-white">
              {viability.classification === 'DIY / Guidebook Candidate' ? (
                <ShieldAlert className="h-4 w-4 text-rose-400" />
              ) : !viability.isBudgetViable ? (
                <AlertTriangle className="h-4 w-4 text-amber-400" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              )}
              2. Viability Assessment & Reality Check
            </h3>
            <span className="rounded-full bg-slate-900 px-3 py-0.5 text-xs font-bold text-white border border-slate-700">
              Classification: {viability.classification}
            </span>
          </div>

          <p className="text-xs leading-relaxed text-slate-200 mt-2">
            {viability.summaryText}
          </p>

          {viability.budgetMismatchDetail && (
            <div className="mt-3 rounded-xl bg-amber-900/30 p-3 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Budget Stretch Requirement:</strong> {viability.budgetMismatchDetail}
              </div>
            </div>
          )}

          {viability.visaRiskNote && (
            <div className="mt-3 rounded-xl bg-purple-900/30 p-3 border border-purple-500/30 text-xs text-purple-200 flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong>Visa Refusal Audit Note:</strong> {viability.visaRiskNote}
              </div>
            </div>
          )}
        </div>

        {/* If DIY Candidate (Halted matching), show dealbreaker banner */}
        {viability.classification === 'DIY / Guidebook Candidate' ? (
          <div className="glass-panel p-6 rounded-2xl text-center space-y-3 border-rose-500/40">
            <ShieldAlert className="h-10 w-10 text-rose-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Strategic Matching Halted (Dealbreaker Rule #2)</h4>
            <p className="text-xs text-slate-300 max-w-xl mx-auto">
              Per LaniEdu Policy, fully-funded scholarship applications require a 100% upfront advisory retainer. Because the applicant selected Self-Application (DIY), strategic matching has been suspended. Recommend purchasing the ₦15,000 Relocation Guidebook.
            </p>
          </div>
        ) : (
          <>
            {/* Section 3: Primary Application Batch (6 Schools) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-indigo-400" />
                    3. Primary Application Batch (6 Verified Schools)
                  </h3>
                  <p className="text-xs text-slate-400">
                    2 Reach Schools • 3 Target Schools • 1 Safety School (Live verified tuition fees & published entry pathways)
                  </p>
                </div>
              </div>

              {/* 2 Reach Schools */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  2 Reach Schools (Ambitious Academically / Financially)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {brief.primaryReachSchools.map((school, i) => (
                    <SchoolCard key={school.id || i} school={school} badgeColor="amber" />
                  ))}
                </div>
              </div>

              {/* 3 Target Schools */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  3 Target Schools (Perfect Financial & Academic Alignment)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {brief.primaryTargetSchools.map((school, i) => (
                    <SchoolCard key={school.id || i} school={school} badgeColor="indigo" />
                  ))}
                </div>
              </div>

              {/* 1 Safety School */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  1 Safety School (Guaranteed Entry Option)
                </div>
                {brief.primarySafetySchool && (
                  <SchoolCard school={brief.primarySafetySchool} badgeColor="emerald" />
                )}
              </div>
            </div>

            {/* Section 4: Contingency Batch (3 Backup Schools) */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Building2 className="h-4 w-4 text-sky-400" />
                4. Contingency Batch (3 Backup Schools)
              </h3>
              <p className="text-xs text-slate-400">
                Highly likely backup institutions fitting budget if all primary applications fail.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {brief.contingencyBackupSchools.map((school, i) => (
                  <SchoolCard key={school.id || i} school={school} badgeColor="sky" />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Section 5: Document Gap Analysis List */}
        <div className="glass-panel p-5 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-indigo-400 tracking-wider uppercase flex items-center gap-1.5">
            <FileCheck2 className="h-4 w-4" />
            5. Document Gap Analysis List
          </h3>
          <p className="text-xs text-slate-400">
            Cross-referenced against LaniEdu Standard Checklist. Flagged items require immediate applicant action.
          </p>

          {brief.missingDocuments.length === 0 ? (
            <div className="rounded-xl bg-emerald-950/30 p-3 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <strong>Document Checklist 100% Complete!</strong> All mandatory documents are available in client file.
            </div>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {brief.missingDocuments.map((doc, idx) => (
                <li key={idx} className="flex items-center gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-rose-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Section 6: Lead Advisor Action Plan & Client Communication Script */}
        <div className="glass-panel p-5 rounded-2xl space-y-4 border border-purple-500/30">
          <h3 className="text-xs font-bold text-purple-300 tracking-wider uppercase flex items-center gap-1.5">
            <UserCheck className="h-4 w-4" />
            6. Lead Advisor Commercial Action Plan
          </h3>

          <div className="space-y-2">
            <div className="text-xs font-medium text-slate-300">Next Clarification Steps for Lead Advisor:</div>
            <ul className="space-y-1.5 text-xs text-slate-200">
              {brief.advisorActionPlan.map((action, i) => (
                <li key={i} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-[10px] font-bold text-indigo-300">
                    {i + 1}
                  </span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Script Box */}
          <div className="rounded-2xl bg-slate-900/90 p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
                Recommended Advisor Communication Script:
              </span>
              <button
                onClick={handleCopyScript}
                className="flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <Copy className="h-3 w-3" />
                {copiedScript ? 'Copied Script!' : 'Copy Script'}
              </button>
            </div>
            <p className="text-xs italic text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed font-sans">
              "{brief.advisorClientScript}"
            </p>
          </div>
        </div>

        {/* Section 7: AI Strategy Co-Pilot */}
        <div className="glass-panel p-5 rounded-2xl space-y-4 border border-emerald-500/30 no-print">
          <h3 className="text-xs font-bold text-emerald-300 tracking-wider uppercase flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            7. AI Strategy Co-Pilot
          </h3>
          <p className="text-xs text-slate-300">
            Tell the AI how to adjust this strategy (e.g., "Find more schools in Brazil", "Remove Malaysia", "Increase budget to €6000").
          </p>
          <div className="flex flex-col gap-3">
            {cvFileName && (
              <div className="flex items-center gap-2 bg-emerald-950/30 text-emerald-300 text-xs py-1.5 px-3 rounded-lg border border-emerald-500/30 w-max">
                <Paperclip className="h-3.5 w-3.5" />
                Attached: {cvFileName}
                <button onClick={handleClearCv} className="ml-2 text-emerald-500 hover:text-emerald-300">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input 
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="E.g. Focus exclusively on South America..."
                className="flex-1 rounded-xl glass-input p-3 text-xs font-mono"
              />
              
              <label className="cursor-pointer rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-2 border border-slate-700">
                <Paperclip className="h-4 w-4" />
                <span>Attach CV (PDF)</span>
                <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
              </label>

              <button 
                onClick={handleAiRegenerate}
                disabled={isGenerating || (!aiPrompt.trim() && !cvData)}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isGenerating ? 'Regenerating...' : 'Regenerate Strategy'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="border-t border-slate-900 pt-4 text-center text-[10px] text-slate-400">
          LaniEdu Educational Strategy Engine • Path Selection Form Integration • Confidential Commercial Document
        </div>
      </div>
    </div>
  );
};

interface SchoolCardProps {
  school: UniversityMatch;
  badgeColor: 'amber' | 'indigo' | 'emerald' | 'sky';
}

const SchoolCard: React.FC<SchoolCardProps> = ({ school, badgeColor }) => {
  const colorStyles = {
    amber: 'border-amber-500/30 bg-amber-950/10 text-amber-400',
    indigo: 'border-indigo-500/30 bg-indigo-950/10 text-indigo-400',
    emerald: 'border-emerald-500/30 bg-emerald-950/10 text-emerald-400',
    sky: 'border-sky-500/30 bg-sky-950/10 text-sky-400'
  };

  return (
    <div className={`rounded-2xl p-4 border glass-panel transition-all space-y-3 flex flex-col justify-between ${colorStyles[badgeColor]}`}>
      <div>
        <div className="flex items-start justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">
            {school.tier.toUpperCase()} • {school.country}
          </span>
          <a
            href={school.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-semibold text-indigo-300 hover:text-indigo-200 transition-colors bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20"
          >
            Official Site <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <h4 className="text-sm font-bold text-white mt-2 leading-tight">
          {school.schoolName}
        </h4>
        <p className="text-xs font-medium text-slate-300 mt-0.5">{school.programmeName}</p>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Verified Tuition:</span>
          <span className="font-bold text-emerald-400 font-mono">{school.tuitionLocal}</span>
        </div>
        <div className="text-[11px] text-slate-400 text-right font-mono">
          ({formatEuroAndNaira(school.tuitionEuroApprox)})
        </div>

        <div className="rounded-xl bg-slate-900/90 p-2.5 border border-slate-800/80 space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Published Entry Pathway:</div>
          <p className="text-[11px] text-slate-200 leading-snug">{school.entryRequirements}</p>
        </div>

        {school.justification && (
          <p className="text-[10px] italic text-slate-400 bg-slate-950/40 p-2 rounded-lg">
            Note: {school.justification}
          </p>
        )}
      </div>
    </div>
  );
};

function buildMarkdownBrief(brief: ClientStrategyBrief): string {
  const { intakeData, viability } = brief;
  return `# Client Strategy Brief: ${intakeData.applicantName}
**Generated on:** ${new Date(brief.generatedAt).toLocaleDateString()}
**Reference:** ${brief.id}

## Applicant Overview
* **Name:** ${intakeData.applicantName}
* **WhatsApp Phone:** ${intakeData.phone || 'N/A'}
* **Target Programme:** ${intakeData.targetProgramme} (${intakeData.degreeLevelSought?.toUpperCase()})
* **Highest Qualification:** ${intakeData.highestQualification}
* **Max Tuition Budget:** ${intakeData.budgetTierLabel || formatCurrency(intakeData.tuitionBudgetAmount, intakeData.tuitionBudgetCurrency)} (~${formatEuroAndNaira(brief.primaryReachSchools[0]?.tuitionEuroApprox || 4000)})
* **Advisory Package Selected:** ${intakeData.advisoryPackageSelected || 'Full Advisory'}
* **Visa Refusal History:** ${intakeData.visaRefusalHistory || 'None'}

## Viability Assessment
* **Classification:** ${viability.classification}
* **Viability Score:** ${viability.viabilityScore}%
* **Reality Check:** ${viability.summaryText}
${viability.budgetMismatchDetail ? `* **Budget Mismatch Note:** ${viability.budgetMismatchDetail}` : ''}
${viability.visaRiskNote ? `* **Visa Risk Note:** ${viability.visaRiskNote}` : ''}

## Primary Application Batch (6 Schools)
### 2 Reach Schools
${brief.primaryReachSchools.map(s => `* **${s.schoolName} (${s.country})**
  * Programme: ${s.programmeName}
  * Official URL: ${s.officialUrl}
  * Verified Tuition: ${s.tuitionLocal} (~${formatEuroAndNaira(s.tuitionEuroApprox)})
  * Entry Pathway: ${s.entryRequirements}
  * Reach Reason: ${s.justification}`).join('\n')}

### 3 Target Schools
${brief.primaryTargetSchools.map(s => `* **${s.schoolName} (${s.country})**
  * Programme: ${s.programmeName}
  * Official URL: ${s.officialUrl}
  * Verified Tuition: ${s.tuitionLocal} (~${formatEuroAndNaira(s.tuitionEuroApprox)})
  * Entry Pathway: ${s.entryRequirements}`).join('\n')}

### 1 Safety School
* **${brief.primarySafetySchool?.schoolName} (${brief.primarySafetySchool?.country})**
  * Official URL: ${brief.primarySafetySchool?.officialUrl}
  * Verified Tuition: ${brief.primarySafetySchool?.tuitionLocal} (~${formatEuroAndNaira(brief.primarySafetySchool?.tuitionEuroApprox)})
  * Entry Pathway: ${brief.primarySafetySchool?.entryRequirements}

## Contingency Batch (3 Backup Schools)
${brief.contingencyBackupSchools.map(s => `* **${s.schoolName} (${s.country})** - Tuition: ${s.tuitionLocal} - URL: ${s.officialUrl}`).join('\n')}

## Document Gap List
${brief.missingDocuments.map(d => `* ${d}`).join('\n')}

## Advisor Action Plan
${brief.advisorActionPlan.map((a, i) => `${i + 1}. ${a}`).join('\n')}

**Advisor Communication Script:**
> "${brief.advisorClientScript}"
`;
}
