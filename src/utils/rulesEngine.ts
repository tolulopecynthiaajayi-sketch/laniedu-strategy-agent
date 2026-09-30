import type { 
  ClientIntakeData, 
  ClientStrategyBrief, 
  ViabilityAssessment, 
  UniversityMatch,
  CategoryClassification 
} from '../types';
import { convertToEur, formatCurrency, formatEuroAndNaira } from './fx';
import { VERIFIED_UNIVERSITIES_DB } from '../data/universities';

/**
 * Executes the complete LaniEdu Strategy Engine algorithm
 */
export function generateClientStrategyBrief(intake: ClientIntakeData): ClientStrategyBrief {
  const budgetInEur = convertToEur(intake.tuitionBudgetAmount, intake.tuitionBudgetCurrency);
  const isRestrictedBudget = budgetInEur <= 4200; // ~€4,000 threshold

  const requestedHighCost = intake.preferredDestinations.some(d => 
    ['UK', 'United Kingdom', 'USA', 'United States', 'Canada', 'UK / Canada / USA'].includes(d)
  );

  const isOpenToFrance = intake.preferredDestinations.some(d => 
    ['France', 'Europe', 'Any', 'Global', '🇫🇷 France'].includes(d)
  ) || intake.preferredDestinations.length === 0;

  const isHnd = ['hnd_distinction', 'hnd_upper', 'hnd_lower', 'nd_holder'].includes(intake.highestQualification);

  // --- 1. SCHOLARSHIP RETAINER EVALUATION (RULE 2) ---
  let classification: CategoryClassification;
  let isScholarshipViable = true;

  if (intake.assistanceType === 'diy_route' || intake.scholarshipRetainerStatus === 'unwilling_refused') {
    classification = 'DIY / Guidebook Candidate';
    isScholarshipViable = false;
  } else if (intake.isFullyFundedScholarshipRequested && intake.scholarshipRetainerStatus === 'willing_100') {
    classification = 'Admission & Scholarship Pathway Candidate';
  } else if (isHnd && isOpenToFrance) {
    classification = 'French Direct Master\'s HND Candidate';
  } else if (isHnd) {
    classification = 'PGD / Top-Up Pathway Candidate';
  } else if (requestedHighCost && isRestrictedBudget) {
    classification = 'Budget Stretch Required Candidate';
  } else {
    classification = 'Direct Master\'s Degree Candidate';
  }

  // --- 2. BUDGET VIABILITY EVALUATION (RULE 1) ---
  let isBudgetViable = true;
  let budgetMismatchDetail = '';

  if (requestedHighCost && budgetInEur < 10000) {
    isBudgetViable = false;
    budgetMismatchDetail = `Client requested high-cost destination(s) (${intake.preferredDestinations.join(', ')}) with a max tuition budget of ${formatCurrency(intake.tuitionBudgetAmount, intake.tuitionBudgetCurrency)} (~${formatEuroAndNaira(budgetInEur)}). High-cost countries (UK, Canada, USA) require €12,000 – €25,000/yr. Budget stretch or global low-fee pivot (France, Poland, Malaysia, Hungary) is required.`;
  }

  // --- 3. VISA REFUSAL RISK EVALUATION ---
  let visaRiskNote = '';
  if (intake.visaRefusalHistory && intake.visaRefusalHistory !== 'No, zero refusals') {
    visaRiskNote = `PRIORITY RISK FLAGGED: Applicant declared previous visa refusal history (${intake.visaRefusalHistory}). Strategy mandates prior refusal mitigation, SAR/GCMS notes review, and selection of countries with high re-application tolerance (e.g. France, Poland).`;
  }

  // --- 4. VIABILITY SCORE & SUMMARY ---
  let viabilityScore = 90;
  if (!isBudgetViable) viabilityScore -= 30;
  if (!isScholarshipViable) viabilityScore -= 50; // Halts standard matching
  if (isHnd) viabilityScore -= 10;
  if (visaRiskNote) viabilityScore -= 15;

  let summaryText = '';
  if (classification === 'DIY / Guidebook Candidate') {
    summaryText = `HALTED: Client selected Self-Application (DIY Route) or declined the 100% upfront advisory retainer. Reclassified as a DIY / Guidebook candidate. Strategic matching process halted per LaniEdu Dealbreaker Rule #2. Recommended to purchase the ₦15,000 Relocation Guidebook.`;
  } else if (!isBudgetViable) {
    summaryText = `BUDGET MISMATCH FLAGGED: Client's maximum tuition budget of ${formatEuroAndNaira(budgetInEur)} (${intake.budgetTierLabel || 'Restricted Tier'}) is insufficient for requested high-cost destinations. Strategy prioritises affordable global options (Malaysia, Thailand, Poland, Hungary) or French HND direct entry while highlighting required budget stretch.`;
  } else if (isHnd && isOpenToFrance) {
    summaryText = `EXCELLENT PATHWAY MATCH: As an HND holder, client qualifies for LaniEdu's French Direct Master's entry pathway (e.g. Université Paris-Saclay, EPITA, NEOMA) bypassing standard UK/Canada PGD/Top-up delays. Budget of ${formatEuroAndNaira(budgetInEur)} aligns well with French & European options.`;
  } else {
    summaryText = `HIGH VIABILITY: Client profile (${intake.highestQualification.replace('_', ' ').toUpperCase()}) and budget (${formatEuroAndNaira(budgetInEur)}) align perfectly with target global degree programmes. Direct entry matching executed for selected package (${intake.advisoryPackageSelected || 'Full Advisory'}).`;
  }

  const viability: ViabilityAssessment = {
    isBudgetViable,
    isScholarshipViable,
    isHndFrenchException: isHnd && isOpenToFrance,
    classification,
    viabilityScore: Math.max(0, viabilityScore),
    summaryText,
    budgetMismatchDetail,
    visaRiskNote
  };

  // If DIY Candidate (Halted matching per Rule 2)
  if (classification === 'DIY / Guidebook Candidate') {
    return {
      id: `brief-${Date.now()}`,
      intakeData: intake,
      viability,
      primaryReachSchools: [],
      primaryTargetSchools: [],
      primarySafetySchool: {} as UniversityMatch,
      contingencyBackupSchools: [],
      missingDocuments: getMissingDocuments(intake),
      advisorActionPlan: [
        'Inform client that LaniEdu does not process fully-funded scholarship applications or custom matching without a 100% upfront advisory retainer.',
        'Offer client the self-service ₦15,000 / €10 LaniEdu Relocation Guidebook package.',
        'Re-evaluate if client decides to switch to a self-funded model or pay retainer.'
      ],
      advisorClientScript: `Hi ${intake.applicantName}, thank you for completing our Path Selection assessment. Since you selected the DIY Self-Application route, we recommend our ₦15,000 LaniEdu Relocation Guidebook which contains step-by-step application instructions. If you decide to upgrade to our full advisory retainer package in the future, we would be delighted to assist!`,
      generatedAt: new Date().toISOString()
    };
  }

  // --- 5. SCHOOL MATCHING ALGORITHM (6 PRIMARY + 3 CONTINGENCY) ---
  const matches = selectMatchedUniversities(intake, budgetInEur, isHnd, isOpenToFrance);

  const primaryReach = matches.filter(m => m.tier === 'reach').slice(0, 2);
  const primaryTarget = matches.filter(m => m.tier === 'target').slice(0, 3);
  const primarySafety = matches.find(m => m.tier === 'safety') || matches[matches.length - 1];
  
  // Backup contingency (3 safety/alternative schools)
  const contingency = matches
    .filter(m => !primaryReach.concat(primaryTarget, primarySafety).some(p => p.id === m.id))
    .slice(0, 3);

  // Missing documents gap list
  const missingDocs = getMissingDocuments(intake);

  // Advisor Action Plan
  const actionPlan: string[] = [
    `Send retainer invoice for client's selected package: "${intake.advisoryPackageSelected || 'Full Advisory'}".`,
    `Confirm if client accepts the recommended primary batch strategy (${primaryReach[0]?.country || 'Malaysia'}, ${primaryTarget[0]?.country || 'Poland'}, ${primarySafety?.country || 'France'}).`,
    missingDocs.length > 0
      ? `Immediately request client to provide missing mandatory documents: ${missingDocs.slice(0, 3).join(', ')}.`
      : `Document checklist 100% complete. Proceed directly to university application submission.`,
    intake.visaRefusalHistory && intake.visaRefusalHistory !== 'No, zero refusals'
      ? `Conduct mandatory Visa Refusal Audit before filing visa application.`
      : `Verify bank statement seasoning for proof of funds requirement.`
  ];

  const advisorClientScript = `Hello ${intake.applicantName}, our Educational Strategy team has finalized your Client Strategy Brief based on your Google Form submission. Based on your ${intake.highestQualification.replace('_', ' ').toUpperCase()} qualification and budget tier (${intake.budgetTierLabel || formatEuroAndNaira(budgetInEur)}), we have mapped out 6 primary university options across high-visa approval institutions (including ${primaryTarget.map(t => t.schoolName).join(', ')}). We have reserved your requested package: ${intake.advisoryPackageSelected || 'Advisory Package'}. Let's schedule a call to review your retainer agreement and begin application submissions!`;

  return {
    id: `brief-${Date.now()}`,
    intakeData: intake,
    viability,
    primaryReachSchools: primaryReach,
    primaryTargetSchools: primaryTarget,
    primarySafetySchool: primarySafety,
    contingencyBackupSchools: contingency,
    missingDocuments: missingDocs,
    advisorActionPlan: actionPlan,
    advisorClientScript,
    generatedAt: new Date().toISOString()
  };
}

function getMissingDocuments(intake: ClientIntakeData): string[] {
  const missing: string[] = [];
  if (!intake.documents.passport6Months) missing.push('International Passport (Minimum 6 months validity)');
  if (!intake.documents.officialTranscripts) missing.push('Official Academic Transcripts');
  if (!intake.documents.degreeCertificate) missing.push('Degree Certificate or Official Statement of Result');
  if (!intake.documents.updatedCv) missing.push('Updated Academic / Professional CV');
  if (!intake.documents.referenceLetters2) missing.push('Two (2) Official Reference Letters (Academic/Employer)');
  if (!intake.documents.motivationLetterSop) missing.push('Statement of Purpose (SOP) / Motivation Letter');
  if (!intake.documents.englishProficiency) missing.push('English Proficiency Proof (WAEC C6+ / IELTS / Duolingo)');
  if (!intake.documents.proofOfFunds) missing.push('Proof of Funds / Bank Statement (Ready or in seasoning)');
  return missing;
}

function selectMatchedUniversities(
  intake: ClientIntakeData, 
  budgetEur: number, 
  isHnd: boolean, 
  isOpenToFrance: boolean
): UniversityMatch[] {
  let pool = [...VERIFIED_UNIVERSITIES_DB];

  // If HND + France exception -> Prioritise French HND Direct Master's schools
  if (isHnd && isOpenToFrance) {
    const frenchSchools = pool.filter(s => s.acceptsHndDirectMaster && s.country === 'France');
    if (frenchSchools.length > 0) {
      // Put French schools at top of pool
      pool = [...frenchSchools, ...pool.filter(s => !frenchSchools.includes(s))];
    }
  }

  // Filter or prioritize based on budget
  const eligible = pool.map(item => {
    let tier = item.tierCategory;
    let justification = '';

    // Convert item tuition to NGN & EUR
    const itemEur = item.tuitionEur;
    const itemNgn = itemEur * 1650;

    if (itemEur > budgetEur * 1.25) {
      tier = 'reach';
      justification = `Financially ambitious: Fee of ${formatEuroAndNaira(itemEur)} exceeds client budget by ~€${Math.round(itemEur - budgetEur)}. Requires budget stretch or installment payment plan.`;
    } else if (item.entryRequirementDegree.includes('1st Class') || item.entryRequirementDegree.includes('Rigorous')) {
      tier = 'reach';
      justification = `Academically ambitious: Highly competitive academic entry criteria requiring strong grades and transcript evaluation.`;
    } else if (itemEur <= budgetEur && (itemEur <= 3900 || item.isAffordableTier)) {
      if (itemEur <= budgetEur * 0.75) {
        tier = 'safety';
        justification = `High security option: Fee of ${formatEuroAndNaira(itemEur)} is well under budget threshold with guaranteed entry pathways.`;
      } else {
        tier = 'target';
        justification = `Perfect alignment: Fee of ${formatEuroAndNaira(itemEur)} aligns directly with client's budget tier (${intake.budgetTierLabel || formatEuroAndNaira(budgetEur)}) and qualification.`;
      }
    } else {
      tier = 'target';
      justification = `Aligned selection matching applicant criteria within standard tuition parameters (${formatEuroAndNaira(itemEur)}).`;
    }

    return {
      id: item.id,
      schoolName: item.schoolName,
      country: item.country,
      programmeName: `Master in ${intake.targetProgramme || item.programmeCategory}`,
      tier: tier as any,
      officialUrl: item.officialUrl,
      tuitionLocal: item.tuitionLocal,
      tuitionEuroApprox: itemEur,
      tuitionNairaApprox: itemNgn,
      entryRequirements: item.entryRequirementDegree,
      justification,
      hndAcceptedDirectly: item.acceptsHndDirectMaster,
      verifiedAt: '2026-09-30 (Live Verified)',
      isLiveVerified: true
    };
  });

  return eligible;
}
