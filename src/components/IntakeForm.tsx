import React, { useState } from 'react';
import type { ClientIntakeData, Qualification, RetainerStatus } from '../types';
import { User, GraduationCap, DollarSign, FileCheck, ArrowRight, Package } from 'lucide-react';

interface IntakeFormProps {
  onSubmit: (data: ClientIntakeData) => void;
}

export const IntakeForm: React.FC<IntakeFormProps> = ({ onSubmit }) => {
  const [applicantName, setApplicantName] = useState('');
  const [phone, setPhone] = useState('');
  const [hasPersonalBudget, setHasPersonalBudget] = useState(true);
  const [isFullyFundedRequested, setIsFullyFundedRequested] = useState(false);
  const [assistanceType, setAssistanceType] = useState<'full_advisory' | 'diy_route'>('full_advisory');
  const [highestQualification, setHighestQualification] = useState<Qualification>('bachelor_21');
  const [targetProgramme, setTargetProgramme] = useState('Cyber Security & Computer Science');
  const [workExperienceYears] = useState('2-4 Years');
  const [degreeLevelSought, setDegreeLevelSought] = useState<'master' | 'pgd' | 'bachelor'>('master');
  
  const [budgetTierLabel, setBudgetTierLabel] = useState('Under €4,000 / ~₦6 Million per year');
  const [tuitionBudgetAmount, setTuitionBudgetAmount] = useState<number>(3500);
  const [tuitionBudgetCurrency, setTuitionBudgetCurrency] = useState<'EUR' | 'NGN' | 'USD' | 'GBP'>('EUR');
  
  const [preferredDestinationsStr, setPreferredDestinationsStr] = useState('France, Poland, Malaysia');
  const [intakeTimeline, setIntakeTimeline] = useState('Spring / January 2027');
  const [visaRefusalHistory, setVisaRefusalHistory] = useState('No, zero refusals');
  const [advisoryPackageSelected, setAdvisoryPackageSelected] = useState('📦 Package B: Admission + Visa Pathway — ₦600,000 / €300');
  const [readinessTimeline, setReadinessTimeline] = useState('Yes, budget is ready & I want to start immediately');
  const [wantsRelocationGuidebook] = useState(false);

  // Documents checklist state
  const [docs, setDocs] = useState({
    passport6Months: true,
    officialTranscripts: true,
    degreeCertificate: true,
    updatedCv: true,
    referenceLetters2: true,
    motivationLetterSop: true,
    englishProficiency: true,
    proofOfFunds: true
  });

  const handleBudgetTierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setBudgetTierLabel(val);
    if (val.includes('Under €4,000')) {
      setTuitionBudgetAmount(3500);
      setTuitionBudgetCurrency('EUR');
    } else if (val.includes('€4,000 – €7,000')) {
      setTuitionBudgetAmount(5500);
      setTuitionBudgetCurrency('EUR');
    } else if (val.includes('€7,000 – €12,000')) {
      setTuitionBudgetAmount(9000);
      setTuitionBudgetCurrency('EUR');
    } else if (val.includes('Above €12,000')) {
      setTuitionBudgetAmount(15000);
      setTuitionBudgetCurrency('EUR');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const preferredDestinations = preferredDestinationsStr
      .split(',')
      .map(d => d.trim())
      .filter(Boolean);

    const scholarshipRetainerStatus: RetainerStatus = 
      assistanceType === 'full_advisory' ? 'willing_100' : 'unwilling_refused';

    const intake: ClientIntakeData = {
      id: `intake-${Date.now()}`,
      applicantName: applicantName.trim() || 'Form Applicant',
      phone: phone.trim(),
      hasPersonalBudget,
      isFullyFundedScholarshipRequested: isFullyFundedRequested,
      assistanceType,
      highestQualification,
      targetProgramme: targetProgramme.trim() || 'General Field',
      workExperienceYears,
      degreeLevelSought,
      tuitionBudgetAmount: Number(tuitionBudgetAmount) || 3500,
      tuitionBudgetCurrency,
      budgetTierLabel,
      preferredDestinations,
      intakeTimeline,
      visaRefusalHistory,
      advisoryPackageSelected,
      readinessTimeline,
      scholarshipRetainerStatus,
      wantsRelocationGuidebook,
      documents: docs,
      createdAt: new Date().toISOString()
    };

    onSubmit(intake);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="h-5 w-5 text-indigo-400" />
            Client Intake Processor (Google Form "Path Selection" Alignment)
          </h2>
          <p className="text-xs text-slate-400">
            Form fields aligned 1:1 with your live Google Form: Budget, Qualifications, Visa Refusals & Package Selection.
          </p>
        </div>
        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-mono text-indigo-300 border border-slate-700">
          Path Selection Schema
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Info & Assistance Choice */}
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-indigo-300 flex items-center gap-2">
            <User className="h-4 w-4" />
            1. Applicant Info & Assistance Preference
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={applicantName}
                onChange={e => setApplicantName(e.target.value)}
                placeholder="e.g. Babatunde Ogunleye"
                className="w-full rounded-xl glass-input px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp Phone Number *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+234 803 123 4567"
                className="w-full rounded-xl glass-input px-3.5 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-1">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">How can LaniEdu best assist you today? *</label>
              <select
                value={assistanceType}
                onChange={e => setAssistanceType(e.target.value as any)}
                className="w-full rounded-xl glass-input px-3.5 py-2 text-sm bg-slate-900"
              >
                <option value="full_advisory">Full Advisory Services (Done-For-You — Retainers from ₦400k / €200)</option>
                <option value="diy_route">Self-Application (DIY Route & Free Guidance)</option>
              </select>
            </div>

            <div className="flex items-center gap-4 pt-4 sm:pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPersonalBudget}
                  onChange={e => setHasPersonalBudget(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 text-indigo-600"
                />
                <span className="text-xs text-slate-300">Has Tuition Budget</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFullyFundedRequested}
                  onChange={e => setIsFullyFundedRequested(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 text-indigo-600"
                />
                <span className="text-xs text-slate-300">Seeking Fully-Funded Scholarship</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: Academic Qualification & Work Experience */}
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            2. Academic Qualifications & Target Field
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Current Qualification Level *</label>
              <select
                value={highestQualification}
                onChange={e => setHighestQualification(e.target.value as Qualification)}
                className="w-full rounded-xl glass-input px-3.5 py-2 text-sm bg-slate-900"
              >
                <option value="bachelor_21">Bachelor's Degree (First Class / 2:1)</option>
                <option value="bachelor_22">Bachelor's Degree (2:2)</option>
                <option value="bachelor_3rd">Bachelor's Degree (3rd Class)</option>
                <option value="hnd_upper">Higher National Diploma (HND)</option>
                <option value="master_degree">Master's Degree</option>
                <option value="high_school">WAEC / NECO / High School</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Field of Study / Target Programme *</label>
              <input
                type="text"
                required
                value={targetProgramme}
                onChange={e => setTargetProgramme(e.target.value)}
                placeholder="e.g. Cyber Security, Business Analytics"
                className="w-full rounded-xl glass-input px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Degree Level Sought *</label>
              <select
                value={degreeLevelSought}
                onChange={e => setDegreeLevelSought(e.target.value as any)}
                className="w-full rounded-xl glass-input px-3.5 py-2 text-sm bg-slate-900"
              >
                <option value="master">Master's Degree</option>
                <option value="pgd">Post-Graduate Diploma (PGD)</option>
                <option value="bachelor">Bachelor's Degree</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Financial Budget & Visa History */}
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-sky-300 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            3. Tuition Budget & Visa History
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Maximum Budget for TUITION ONLY *</label>
              <select
                value={budgetTierLabel}
                onChange={handleBudgetTierChange}
                className="w-full rounded-xl glass-input px-3.5 py-2 text-sm bg-slate-900 text-indigo-300 font-semibold"
              >
                <option value="Under €4,000 / ~₦6 Million per year">Under €4,000 / ~₦6 Million per year</option>
                <option value="€4,000 – €7,000 / ~₦6M – ₦10.5M per year">€4,000 – €7,000 / ~₦6M – ₦10.5M per year</option>
                <option value="€7,000 – €12,000 per year">€7,000 – €12,000 per year</option>
                <option value="Above €12,000 per year">Above €12,000 per year</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Visa Refusal History *</label>
              <select
                value={visaRefusalHistory}
                onChange={e => setVisaRefusalHistory(e.target.value)}
                className="w-full rounded-xl glass-input px-3.5 py-2 text-sm bg-slate-900"
              >
                <option value="No, zero refusals">No, zero refusals</option>
                <option value="Yes, Schengen / Europe">Yes, Schengen / Europe</option>
                <option value="Yes, UK or Canada">Yes, UK or Canada</option>
                <option value="Yes, USA">Yes, USA</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Preferred Destinations (Select all open to)</label>
              <input
                type="text"
                value={preferredDestinationsStr}
                onChange={e => setPreferredDestinationsStr(e.target.value)}
                placeholder="France, Poland, Germany, Malaysia, UK, Canada, USA"
                className="w-full rounded-xl glass-input px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Intake Timeline</label>
              <select
                value={intakeTimeline}
                onChange={e => setIntakeTimeline(e.target.value)}
                className="w-full rounded-xl glass-input px-3.5 py-2 text-sm bg-slate-900"
              >
                <option value="Spring / January 2027">Spring / January 2027</option>
                <option value="Late 2027 or Future">Late 2027 or Future</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Advisory Package & Readiness */}
        <div className="glass-panel rounded-2xl p-5 space-y-4 border-l-4 border-l-emerald-500">
          <h3 className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
            <Package className="h-4 w-4" />
            4. Service Package & Retainer Commitment
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Which advisory package fits your needs?</label>
              <select
                value={advisoryPackageSelected}
                onChange={e => setAdvisoryPackageSelected(e.target.value)}
                className="w-full rounded-xl glass-input px-3.5 py-2 text-xs bg-slate-900"
              >
                <option value="🏆 Package C: Complete Suite (Admission + Visa + Housing + Free Guidebook) — ₦750,000 / €375">
                  🏆 Package C: Complete Suite (₦750,000 / €375)
                </option>
                <option value="📦 Package B: Admission + Visa Pathway (School + Visa + Free Guidebook) — ₦600,000 / €300">
                  📦 Package B: Admission + Visa (₦600,000 / €300)
                </option>
                <option value="📦 Package A: Admission + Housing Suite (School + Housing + Free Guidebook) — ₦550,000 / €275">
                  📦 Package A: Admission + Housing (₦550,000 / €275)
                </option>
                <option value="🎓 University Admission Strategy Only — ₦400,000 / €200">
                  🎓 Admission Strategy Only (₦400,000 / €200)
                </option>
                <option value="🛂 Visa Application Advisory Only — ₦250,000 / €125">
                  🛂 Visa Advisory Only (₦250,000 / €125)
                </option>
                <option value="🏡 Student Housing Placement Only — ₦200,000 / €100">
                  🏡 Student Housing Placement (₦200,000 / €100)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Ready to commence work upon 100% initial retainer?</label>
              <select
                value={readinessTimeline}
                onChange={e => setReadinessTimeline(e.target.value)}
                className="w-full rounded-xl glass-input px-3.5 py-2 text-xs bg-slate-900"
              >
                <option value="Yes, budget is ready & I want to start immediately">Yes, ready & start immediately</option>
                <option value="Yes, ready within 30 days">Yes, ready within 30 days</option>
                <option value="Just researching for the future">Just researching for future</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 5: Document Readiness Checklist */}
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-emerald-400" />
            5. Document Readiness Checklist
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={docs.passport6Months}
                onChange={e => setDocs({ ...docs, passport6Months: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 text-indigo-600"
              />
              <span>Valid International Passport (6+ months validity)</span>
            </label>

            <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={docs.degreeCertificate}
                onChange={e => setDocs({ ...docs, degreeCertificate: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 text-indigo-600"
              />
              <span>Official Degree Certificate / Statement of Result</span>
            </label>

            <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={docs.officialTranscripts}
                onChange={e => setDocs({ ...docs, officialTranscripts: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 text-indigo-600"
              />
              <span>Academic Transcript (Official or Copy)</span>
            </label>

            <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={docs.updatedCv}
                onChange={e => setDocs({ ...docs, updatedCv: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 text-indigo-600"
              />
              <span>Current CV / Resume</span>
            </label>

            <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={docs.referenceLetters2}
                onChange={e => setDocs({ ...docs, referenceLetters2: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 text-indigo-600"
              />
              <span>Reference Letters (1-2)</span>
            </label>

            <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={docs.englishProficiency}
                onChange={e => setDocs({ ...docs, englishProficiency: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 text-indigo-600"
              />
              <span>English Proficiency Proof (WAEC/IELTS/Duolingo)</span>
            </label>

            <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer sm:col-span-2">
              <input
                type="checkbox"
                checked={docs.proofOfFunds}
                onChange={e => setDocs({ ...docs, proofOfFunds: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 text-indigo-600"
              />
              <span>Proof of Funds / Bank Statement (Ready or in seasoning)</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Execute Strategic Live Search & Compile Brief
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
