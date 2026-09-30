export type Qualification = 
  | 'bachelor_1st'
  | 'bachelor_21'
  | 'bachelor_22'
  | 'bachelor_3rd'
  | 'hnd_distinction'
  | 'hnd_upper'
  | 'hnd_lower'
  | 'nd_holder'
  | 'master_degree'
  | 'high_school';

export type RetainerStatus = 'willing_100' | 'unwilling_refused' | 'not_applicable';

export type CategoryClassification = 
  | 'Admission & Scholarship Pathway Candidate'
  | 'DIY / Guidebook Candidate'
  | 'Direct Master\'s Degree Candidate'
  | 'PGD / Top-Up Pathway Candidate'
  | 'French Direct Master\'s HND Candidate'
  | 'Budget Stretch Required Candidate';

export interface DocumentChecklist {
  passport6Months: boolean;
  officialTranscripts: boolean;
  degreeCertificate: boolean;
  updatedCv: boolean;
  referenceLetters2: boolean;
  motivationLetterSop: boolean;
  englishProficiency: boolean; // WAEC C6+ / IELTS / Duolingo
  proofOfFunds: boolean;
}

export interface ClientIntakeData {
  id: string;
  applicantName: string;
  phone: string;
  hasPersonalBudget: boolean;
  isFullyFundedScholarshipRequested: boolean;
  assistanceType: 'full_advisory' | 'diy_route';
  highestQualification: Qualification;
  targetProgramme: string; // Field of Study
  workExperienceYears?: string;
  degreeLevelSought: 'master' | 'pgd' | 'bachelor';
  tuitionBudgetAmount: number;
  tuitionBudgetCurrency: 'EUR' | 'NGN' | 'USD' | 'GBP';
  budgetTierLabel?: string; // e.g. "Under €4,000 / ~₦6M"
  preferredDestinations: string[];
  intakeTimeline?: string; // e.g. "Spring / January 2027"
  visaRefusalHistory?: string; // e.g. "No, zero refusals"
  advisoryPackageSelected?: string; // e.g. "Package C", "Strategy Only"
  readinessTimeline?: string; // e.g. "Immediate", "30 days"
  scholarshipRetainerStatus: RetainerStatus;
  wantsRelocationGuidebook?: boolean;
  documents: DocumentChecklist;
  notes?: string;
  createdAt: string;
}

export type SchoolTier = 'reach' | 'target' | 'safety' | 'contingency';

export interface UniversityMatch {
  id: string;
  schoolName: string;
  country: string;
  programmeName: string;
  tier: SchoolTier;
  officialUrl: string;
  tuitionLocal: string;
  tuitionEuroApprox: number;
  tuitionNairaApprox: number;
  entryRequirements: string;
  justification?: string;
  hndAcceptedDirectly?: boolean;
  verifiedAt: string;
  isLiveVerified: boolean;
}

export interface ViabilityAssessment {
  isBudgetViable: boolean;
  isScholarshipViable: boolean;
  isHndFrenchException: boolean;
  classification: CategoryClassification;
  viabilityScore: number; // 0 to 100
  summaryText: string;
  budgetMismatchDetail?: string;
  visaRiskNote?: string;
}

export interface ClientStrategyBrief {
  id: string;
  intakeData: ClientIntakeData;
  viability: ViabilityAssessment;
  primaryReachSchools: UniversityMatch[]; // 2 schools
  primaryTargetSchools: UniversityMatch[]; // 3 schools
  primarySafetySchool: UniversityMatch; // 1 school
  contingencyBackupSchools: UniversityMatch[]; // 3 schools
  missingDocuments: string[];
  advisorActionPlan: string[];
  advisorClientScript: string;
  generatedAt: string;
}
