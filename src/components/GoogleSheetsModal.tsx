import React, { useState } from 'react';
import { FileSpreadsheet, Copy, Check, Zap, Terminal, Sparkles, Server, CheckCircle2 } from 'lucide-react';
import type { ClientIntakeData } from '../types';

interface GoogleSheetsModalProps {
  onImportIntake: (intake: ClientIntakeData) => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({ onImportIntake }) => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [pastedJson, setPastedJson] = useState('');
  const [parseError, setParseError] = useState('');

  const appScriptCode = `/**
 * LaniEdu Google Form ("Path Selection") -> Strategy Agent Auto-Trigger
 * Paste this into Google Sheets: Extensions -> Apps Script
 */
function onFormSubmit(e) {
  var responses = e.namedValues;

  function getVal(key) {
    return responses[key] && responses[key].length > 0 ? responses[key][0] : '';
  }

  var rawBudget = getVal('What is your maximum budget for TUITION ONLY (excluding living expenses/Proof of Funds)?');
  var budgetAmount = 4000;
  if (rawBudget.indexOf('Under €4,000') !== -1) budgetAmount = 3500;
  else if (rawBudget.indexOf('€4,000 – €7,000') !== -1) budgetAmount = 5500;
  else if (rawBudget.indexOf('€7,000 – €12,000') !== -1) budgetAmount = 9000;
  else if (rawBudget.indexOf('Above €12,000') !== -1) budgetAmount = 15000;

  var docsRaw = getVal('Document Readiness Check (Select all documents you currently have available)');

  var payload = {
    applicantName: getVal('Full Name') || 'Google Form Applicant',
    phone: getVal('WhatsApp Phone Number (with country code)'),
    hasPersonalBudget: getVal('Do you have a personal/family budget to cover tuition?').indexOf('Yes') !== -1,
    isFullyFundedScholarshipRequested: getVal('Are you seeking a fully-funded scholarship?').indexOf('Yes') !== -1,
    assistanceType: getVal('How can LaniEdu best assist you today?').indexOf('Full Advisory') !== -1 ? 'full_advisory' : 'diy_route',
    highestQualification: parseQualification(getVal('Current Qualification Level')),
    targetProgramme: getVal('Target Course of Study') || 'Master Degree',
    previousBackground: getVal('Previous Course of Study / Background') || 'Not Specified',
    professionalBackground: getVal('professional background') || 'Not Specified',
    workExperienceYears: getVal('Years of Work Experience (If Applying for a Masters Degree)'),
    degreeLevelSought: parseDegreeLevel(getVal('Degree Level Sought')),
    tuitionBudgetAmount: budgetAmount,
    tuitionBudgetCurrency: 'EUR',
    budgetTierLabel: rawBudget,
    preferredDestinations: parseDestinations(getVal('Preferred Destinations (Select all you are open to)')),
    intakeTimeline: getVal('Target Intake Timeline'),
    visaRefusalHistory: getVal('Have you ever had a visa refusal for any country?'),
    advisoryPackageSelected: getVal('Which advisory package fits your needs?'),
    readinessTimeline: getVal('Are you ready to commence work upon payment of the 100% initial retainer within 1–2 weeks?'),
    scholarshipRetainerStatus: getVal('How can LaniEdu best assist you today?').indexOf('Full Advisory') !== -1 ? 'willing_100' : 'unwilling_refused',
    wantsRelocationGuidebook: getVal('Would you like to order the ₦15,000 / €10 Relocation Guidebook today?').indexOf('Yes') !== -1,
    documents: {
      passport6Months: docsRaw.indexOf('Valid International Passport') !== -1,
      officialTranscripts: docsRaw.indexOf('Academic Transcript') !== -1,
      degreeCertificate: docsRaw.indexOf('Official Degree Certificate') !== -1,
      updatedCv: docsRaw.indexOf('Current CV') !== -1,
      referenceLetters2: docsRaw.indexOf('Reference Letters') !== -1,
      motivationLetterSop: true,
      englishProficiency: docsRaw.indexOf('English Proficiency') !== -1,
      proofOfFunds: docsRaw.indexOf('Proof of Funds') !== -1
    }
  };

  // Live Vercel Webhook Endpoint
  var webhookUrl = "https://laniedu-strategy-agent.vercel.app/api/intake";
  
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(payload)
  };
  
  UrlFetchApp.fetch(webhookUrl, options);
}

function parseQualification(val) {
  if (val.indexOf('First Class / 2:1') !== -1) return 'bachelor_21';
  if (val.indexOf('2:2') !== -1) return 'bachelor_22';
  if (val.indexOf('3rd Class') !== -1) return 'bachelor_3rd';
  if (val.indexOf('HND') !== -1) return 'hnd_upper';
  if (val.indexOf('Master') !== -1) return 'master_degree';
  return 'bachelor_21';
}

function parseDegreeLevel(val) {
  if (val.indexOf('Post-Graduate') !== -1) return 'pgd';
  if (val.indexOf('Bachelor') !== -1) return 'bachelor';
  return 'master';
}

function parseDestinations(val) {
  var list = [];
  if (val.indexOf('France') !== -1) list.push('France');
  if (val.indexOf('Poland') !== -1) list.push('Poland');
  if (val.indexOf('Germany') !== -1 || val.indexOf('Italy') !== -1) list.push('Germany / Italy');
  if (val.indexOf('Hungary') !== -1) list.push('Hungary');
  if (val.indexOf('Malaysia') !== -1) list.push('Malaysia');
  if (val.indexOf('UK') !== -1 || val.indexOf('Canada') !== -1 || val.indexOf('USA') !== -1) list.push('UK / Canada / USA');
  return list.length > 0 ? list : ['Global'];
}
`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(appScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  const handleParsePastedData = () => {
    setParseError('');
    try {
      if (!pastedJson.trim()) {
        setParseError('Please paste JSON data or row payload.');
        return;
      }
      const data = JSON.parse(pastedJson);
      
      const intake: ClientIntakeData = {
        id: `import-${Date.now()}`,
        applicantName: data.applicantName || 'Imported Form Candidate',
        phone: data.phone || '',
        hasPersonalBudget: data.hasPersonalBudget ?? true,
        isFullyFundedScholarshipRequested: Boolean(data.isFullyFundedScholarshipRequested),
        assistanceType: data.assistanceType || 'full_advisory',
        highestQualification: data.highestQualification || 'bachelor_21',
        targetProgramme: data.targetProgramme || 'International Master',
        previousBackground: data.previousBackground || 'BSc Education Economics',
        professionalBackground: data.professionalBackground || 'Bank Teller for 3 years',
        workExperienceYears: data.workExperienceYears || '2 Years',
        degreeLevelSought: data.degreeLevelSought || 'master',
        tuitionBudgetAmount: Number(data.tuitionBudgetAmount) || 4000,
        tuitionBudgetCurrency: data.tuitionBudgetCurrency || 'EUR',
        budgetTierLabel: data.budgetTierLabel || 'Under €4,000 / ~₦6 Million per year',
        preferredDestinations: Array.isArray(data.preferredDestinations) ? data.preferredDestinations : ['France', 'Poland'],
        intakeTimeline: data.intakeTimeline || 'Spring / January 2027',
        visaRefusalHistory: data.visaRefusalHistory || 'No, zero refusals',
        advisoryPackageSelected: data.advisoryPackageSelected || 'Package B: Admission + Visa Pathway',
        readinessTimeline: data.readinessTimeline || 'Yes, ready within 30 days',
        scholarshipRetainerStatus: data.scholarshipRetainerStatus || 'willing_100',
        wantsRelocationGuidebook: Boolean(data.wantsRelocationGuidebook),
        documents: data.documents || {
          passport6Months: true,
          officialTranscripts: true,
          degreeCertificate: true,
          updatedCv: true,
          referenceLetters2: false,
          motivationLetterSop: true,
          englishProficiency: true,
          proofOfFunds: false
        },
        createdAt: new Date().toISOString()
      };

      onImportIntake(intake);
    } catch (err: any) {
      setParseError('Invalid JSON format. Please ensure valid JSON payload.');
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
            Google Form "Path Selection" & Vercel Integration
          </h2>
          <p className="text-xs text-slate-400">
            Mapped 1-to-1 to your live Google Form questions: Full Name, Budget, Qualification, Visa History & Advisory Package.
          </p>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5" /> Live Vercel Connected
        </span>
      </div>

      {/* Grid: 2 Setup Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Method 1: Google Apps Script Webhook */}
        <div className="glass-panel p-5 rounded-2xl space-y-4 flex flex-col justify-between border-indigo-500/30">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                Google Apps Script (1-Click Form Sync)
              </h3>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono">Real-time</span>
            </div>
            <p className="text-xs text-slate-300">
              Open your Google Form's linked Sheet ➔ Click <code className="text-indigo-400">Extensions &gt; Apps Script</code> ➔ Paste code below ➔ Add Trigger on form submit.
            </p>

            <div className="relative mt-3">
              <pre className="text-[10px] font-mono text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 max-h-52 overflow-y-auto">
                {appScriptCode}
              </pre>
              <button
                onClick={handleCopyScript}
                className="absolute top-2 right-2 flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-indigo-500 transition-all shadow-md"
              >
                {copiedScript ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copiedScript ? 'Copied Code!' : 'Copy Code'}
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-slate-900/90 p-3 border border-slate-800 text-[11px] text-slate-400">
            <strong>Live Vercel Webhook:</strong> Pre-configured with <code className="text-emerald-400">https://laniedu-strategy-agent.vercel.app/api/intake</code>.
          </div>
        </div>

        {/* Method 2: Manual Row / JSON Paste */}
        <div className="glass-panel p-5 rounded-2xl space-y-4 flex flex-col justify-between border-emerald-500/30">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Instant Response JSON Paste
              </h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">Test Input</span>
            </div>
            <p className="text-xs text-slate-300">
              Paste raw JSON or form row data to generate a strategy brief for your live Google Form responses.
            </p>

            <div className="mt-3">
              <textarea
                rows={7}
                value={pastedJson}
                onChange={e => setPastedJson(e.target.value)}
                placeholder={`{\n  "applicantName": "Adebayo Ogunlesi",\n  "highestQualification": "bachelor_21",\n  "tuitionBudgetAmount": 3500,\n  "budgetTierLabel": "Under €4,000 / ~₦6 Million per year",\n  "preferredDestinations": ["France", "Poland"],\n  "visaRefusalHistory": "No, zero refusals",\n  "advisoryPackageSelected": "Package B: Admission + Visa Pathway"\n}`}
                className="w-full rounded-xl glass-input p-3 text-xs font-mono"
              />
              {parseError && (
                <p className="mt-1 text-xs text-rose-400">{parseError}</p>
              )}
            </div>
          </div>

          <button
            onClick={handleParsePastedData}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
          >
            <Zap className="h-3.5 w-3.5" />
            Import & Compile Strategy Brief
          </button>
        </div>
      </div>

      {/* Deployment Status */}
      <div className="glass-panel p-5 rounded-2xl space-y-3 border-emerald-500/30">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Server className="h-4 w-4 text-emerald-400" />
          Vercel Live Production App
        </h3>
        <p className="text-xs text-slate-300">
          Your portal is live in production at <a href="https://laniedu-strategy-agent.vercel.app/" target="_blank" rel="noreferrer" className="text-indigo-400 font-mono underline">https://laniedu-strategy-agent.vercel.app/</a>. Any changes pushed to your GitHub main branch will automatically deploy within ~30 seconds!
        </p>
      </div>
    </div>
  );
};
