export interface VerifiedUniversityDatabaseItem {
  id: string;
  schoolName: string;
  country: string;
  programmeCategory: string; // e.g. "Business / Management", "Computer Science / IT", "Healthcare / Medicine", "General Engineering", "Humanities"
  officialUrl: string;
  tuitionLocal: string;
  tuitionEur: number;
  entryRequirementDegree: string;
  acceptsHndDirectMaster: boolean;
  acceptsHndTopUpPgd: boolean;
  isAffordableTier: boolean; // under €4,000 / ~₦6.6M
  tierCategory: 'reach' | 'target' | 'safety';
}

export const VERIFIED_UNIVERSITIES_DB: VerifiedUniversityDatabaseItem[] = [
  // --- CHINA (Ultra-Affordable & High Tech / Engineering / Business) ---
  {
    id: 'cn-1',
    schoolName: 'Zhejiang University (ZJU) Hangzhou',
    country: 'China',
    programmeCategory: 'Computer Science / IT',
    officialUrl: 'https://www.zju.edu.cn/english/',
    tuitionLocal: '26,000 RMB (~3,300 EUR)',
    tuitionEur: 3300,
    entryRequirementDegree: 'Bachelor\'s 1st Class / High 2:1 in STEM. Top 50 global ranking.',
    acceptsHndDirectMaster: false,
    acceptsHndTopUpPgd: false,
    isAffordableTier: true,
    tierCategory: 'reach'
  },
  {
    id: 'cn-2',
    schoolName: 'Jiangsu University (JSU) Zhenjiang',
    country: 'China',
    programmeCategory: 'General Engineering',
    officialUrl: 'https://eng.ujs.edu.cn/',
    tuitionLocal: '20,000 RMB (~2,550 EUR)',
    tuitionEur: 2550,
    entryRequirementDegree: 'Bachelor\'s 2:2 or HND + 3 yrs technical experience. Provincial scholarship eligible.',
    acceptsHndDirectMaster: false,
    acceptsHndTopUpPgd: true,
    isAffordableTier: true,
    tierCategory: 'target'
  },
  {
    id: 'cn-3',
    schoolName: 'Nanjing University of Information Science & Technology (NUIST)',
    country: 'China',
    programmeCategory: 'Business / Management',
    officialUrl: 'https://en.nuist.edu.cn/',
    tuitionLocal: '18,000 RMB (~2,300 EUR)',
    tuitionEur: 2300,
    entryRequirementDegree: 'Bachelor\'s degree or HND with PGD. Guaranteed accommodation subsidy.',
    acceptsHndDirectMaster: false,
    acceptsHndTopUpPgd: true,
    isAffordableTier: true,
    tierCategory: 'safety'
  },

  // --- MALAYSIA ---
  {
    id: 'my-1',
    schoolName: 'Asia Pacific University of Technology & Innovation (APU)',
    country: 'Malaysia',
    programmeCategory: 'Computer Science / IT',
    officialUrl: 'https://www.apu.edu.my/',
    tuitionLocal: 'RM 28,500',
    tuitionEur: 3800,
    entryRequirementDegree: 'Bachelor\'s (min 2.5/4.0 CGPA) or HND + 5 yrs IT work experience for PGD bridge',
    acceptsHndDirectMaster: false,
    acceptsHndTopUpPgd: true,
    isAffordableTier: true,
    tierCategory: 'target'
  },
  {
    id: 'my-2',
    schoolName: 'Universiti Malaya (UM)',
    country: 'Malaysia',
    programmeCategory: 'General Engineering',
    officialUrl: 'https://study.um.edu.my/',
    tuitionLocal: 'RM 24,000',
    tuitionEur: 3300,
    entryRequirementDegree: 'Bachelor\'s 1st Class or 2:1 CGPA 3.0+. Highly competitive academic record.',
    acceptsHndDirectMaster: false,
    acceptsHndTopUpPgd: false,
    isAffordableTier: true,
    tierCategory: 'reach'
  },
  {
    id: 'my-3',
    schoolName: 'UCSI University Kuala Lumpur',
    country: 'Malaysia',
    programmeCategory: 'Business / Management',
    officialUrl: 'https://www.ucsiuniversity.edu.my/',
    tuitionLocal: 'RM 22,000',
    tuitionEur: 2950,
    entryRequirementDegree: 'Bachelor\'s 2:2 or HND with PGD / recognised Advanced Diploma.',
    acceptsHndDirectMaster: false,
    acceptsHndTopUpPgd: true,
    isAffordableTier: true,
    tierCategory: 'safety'
  },

  // --- POLAND ---
  {
    id: 'pl-1',
    schoolName: 'Vistula University Warsaw',
    country: 'Poland',
    programmeCategory: 'Business / Management',
    officialUrl: 'https://vistula.edu.pl/en',
    tuitionLocal: '3,800 EUR',
    tuitionEur: 3800,
    entryRequirementDegree: 'Bachelor\'s degree in any discipline. Guaranteed direct Master\'s entry.',
    acceptsHndDirectMaster: false,
    acceptsHndTopUpPgd: true,
    isAffordableTier: true,
    tierCategory: 'target'
  },
  {
    id: 'pl-2',
    schoolName: 'Warsaw University of Technology',
    country: 'Poland',
    programmeCategory: 'General Engineering',
    officialUrl: 'https://www.pw.edu.pl/engpw',
    tuitionLocal: '4,200 EUR',
    tuitionEur: 4200,
    entryRequirementDegree: 'B.Sc. Engineering (2:1 or 1st Class). Rigorous transcript assessment.',
    acceptsHndDirectMaster: false,
    acceptsHndTopUpPgd: false,
    isAffordableTier: true,
    tierCategory: 'reach'
  },
  {
    id: 'pl-3',
    schoolName: 'WSB Merito University Wroclaw',
    country: 'Poland',
    programmeCategory: 'Computer Science / IT',
    officialUrl: 'https://www.merito.pl/english',
    tuitionLocal: '2,900 EUR',
    tuitionEur: 2900,
    entryRequirementDegree: 'Bachelor\'s degree or HND + PGD completion. High visa approval rating.',
    acceptsHndDirectMaster: false,
    acceptsHndTopUpPgd: true,
    isAffordableTier: true,
    tierCategory: 'safety'
  },

  // --- HUNGARY ---
  {
    id: 'hu-1',
    schoolName: 'University of Debrecen',
    country: 'Hungary',
    programmeCategory: 'Healthcare / Medicine',
    officialUrl: 'https://edu.unideb.hu/',
    tuitionLocal: '3,900 USD (~3,600 EUR)',
    tuitionEur: 3600,
    entryRequirementDegree: 'B.Sc. in relevant health/science field (2:2 or higher). Entrance interview required.',
    acceptsHndDirectMaster: false,
    acceptsHndTopUpPgd: true,
    isAffordableTier: true,
    tierCategory: 'target'
  },
  {
    id: 'hu-2',
    schoolName: 'Eötvös Loránd University (ELTE) Budapest',
    country: 'Hungary',
    programmeCategory: 'Computer Science / IT',
    officialUrl: 'https://www.elte.hu/en/',
    tuitionLocal: '4,400 EUR',
    tuitionEur: 4400,
    entryRequirementDegree: 'Bachelor\'s 2:1 or 1st Class in STEM. Competitive coding interview.',
    acceptsHndDirectMaster: false,
    acceptsHndTopUpPgd: false,
    isAffordableTier: true,
    tierCategory: 'reach'
  },
  {
    id: 'hu-3',
    schoolName: 'University of Pécs',
    country: 'Hungary',
    programmeCategory: 'Business / Management',
    officialUrl: 'https://international.pte.hu/',
    tuitionLocal: '3,200 EUR',
    tuitionEur: 3200,
    entryRequirementDegree: 'Bachelor\'s degree (2:2 minimum) or HND + Top-Up diploma.',
    acceptsHndDirectMaster: false,
    acceptsHndTopUpPgd: true,
    isAffordableTier: true,
    tierCategory: 'safety'
  },

  // --- THAILAND ---
  {
    id: 'th-1',
    schoolName: 'Stamford International University Bangkok',
    country: 'Thailand',
    programmeCategory: 'Business / Management',
    officialUrl: 'https://www.stamford.edu/',
    tuitionLocal: '135,000 THB (~3,630 EUR)',
    tuitionEur: 3630,
    entryRequirementDegree: 'Bachelor\'s degree or HND with 2 yrs management work experience.',
    acceptsHndDirectMaster: false,
    acceptsHndTopUpPgd: true,
    isAffordableTier: true,
    tierCategory: 'target'
  },
  {
    id: 'th-2',
    schoolName: 'Mahidol University International College',
    country: 'Thailand',
    programmeCategory: 'Humanities',
    officialUrl: 'https://muic.mahidol.ac.th/eng/',
    tuitionLocal: '160,000 THB (~4,300 EUR)',
    tuitionEur: 4300,
    entryRequirementDegree: 'Bachelor\'s 1st / 2:1 CGPA 3.0+. Research proposal required.',
    acceptsHndDirectMaster: false,
    acceptsHndTopUpPgd: false,
    isAffordableTier: true,
    tierCategory: 'reach'
  },

  // --- FRANCE (HND SPECIAL DIRECT MASTER'S ROUTE) ---
  {
    id: 'fr-1',
    schoolName: 'Université Paris-Saclay (Master 1 / M2 Track)',
    country: 'France',
    programmeCategory: 'Computer Science / IT',
    officialUrl: 'https://www.universite-paris-saclay.fr/en',
    tuitionLocal: '3,770 EUR',
    tuitionEur: 3770,
    entryRequirementDegree: 'HND Upper/Distinction + portfolio OR Bachelor\'s 2:1. Evaluated via VAE/VAP direct equivalence process.',
    acceptsHndDirectMaster: true,
    acceptsHndTopUpPgd: true,
    isAffordableTier: true,
    tierCategory: 'reach'
  },
  {
    id: 'fr-2',
    schoolName: 'NEOMA Business School (MSc Programme)',
    country: 'France',
    programmeCategory: 'Business / Management',
    officialUrl: 'https://neoma-bs.com/',
    tuitionLocal: '14,000 EUR',
    tuitionEur: 14000,
    entryRequirementDegree: 'Direct Master\'s entry for HND holders with 3 years managerial experience or Bachelor\'s degree.',
    acceptsHndDirectMaster: true,
    acceptsHndTopUpPgd: true,
    isAffordableTier: false,
    tierCategory: 'target'
  },
  {
    id: 'fr-3',
    schoolName: 'EPITA Graduate School of Computer Science Paris',
    country: 'France',
    programmeCategory: 'Computer Science / IT',
    officialUrl: 'https://www.epita.fr/en/',
    tuitionLocal: '12,900 EUR',
    tuitionEur: 12900,
    entryRequirementDegree: 'Direct Master of Science entry for 3-year Diploma/HND in IT/Engineering.',
    acceptsHndDirectMaster: true,
    acceptsHndTopUpPgd: true,
    isAffordableTier: false,
    tierCategory: 'target'
  },
  {
    id: 'fr-4',
    schoolName: 'University of Lille (Public National Master)',
    country: 'France',
    programmeCategory: 'Humanities',
    officialUrl: 'https://www.univ-lille.fr/',
    tuitionLocal: '3,770 EUR',
    tuitionEur: 3770,
    entryRequirementDegree: 'Direct Master entry via French National Equivalency for HND holders with 2+ yrs work experience.',
    acceptsHndDirectMaster: true,
    acceptsHndTopUpPgd: true,
    isAffordableTier: true,
    tierCategory: 'safety'
  },

  // --- UNITED KINGDOM (High Budget / PGD / Top-Up) ---
  {
    id: 'uk-1',
    schoolName: 'Teesside University Middlesbrough',
    country: 'United Kingdom',
    programmeCategory: 'Business / Management',
    officialUrl: 'https://www.tees.ac.uk/',
    tuitionLocal: '15,000 GBP (~17,800 EUR)',
    tuitionEur: 17800,
    entryRequirementDegree: 'HND holders eligible for 1-year Top-Up (BSc/BA) or PGD leading to MSc. Bachelor\'s 2:2 for direct MSc.',
    acceptsHndDirectMaster: false,
    acceptsHndTopUpPgd: true,
    isAffordableTier: false,
    tierCategory: 'target'
  },
  {
    id: 'uk-2',
    schoolName: 'University of East London (UEL)',
    country: 'United Kingdom',
    programmeCategory: 'Computer Science / IT',
    officialUrl: 'https://www.uel.ac.uk/',
    tuitionLocal: '15,420 GBP (~18,300 EUR)',
    tuitionEur: 18300,
    entryRequirementDegree: 'Bachelor\'s 2:2 for direct MSc. HND requires 1-year Level 6 Top-Up degree first.',
    acceptsHndDirectMaster: false,
    acceptsHndTopUpPgd: true,
    isAffordableTier: false,
    tierCategory: 'safety'
  },

  // --- CANADA (PGD / College Pathway) ---
  {
    id: 'ca-1',
    schoolName: 'Conestoga College Institute of Technology',
    country: 'Canada',
    programmeCategory: 'Computer Science / IT',
    officialUrl: 'https://www.conestogac.on.ca/',
    tuitionLocal: '17,500 CAD (~11,800 EUR)',
    tuitionEur: 11800,
    entryRequirementDegree: '2-Year Post-Graduate Certificate (PGD). HND and Bachelor\'s 2:2 / 3rd class eligible.',
    acceptsHndDirectMaster: false,
    acceptsHndTopUpPgd: true,
    isAffordableTier: false,
    tierCategory: 'target'
  }
];
