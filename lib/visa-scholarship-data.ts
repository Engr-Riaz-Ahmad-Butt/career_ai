'use client';

export interface VisaSponsorship {
  id: string;
  jobRole: string;
  company: string;
  country: string;
  visaType: string;
  difficultyLevel: number;
  sopFormat: string;
  documentChecklist: string[];
  tips: string[];
}

export interface ScholarshipInfo {
  id: string;
  name: string;
  amount: number;
  eligibility: string[];
  deadline: Date;
  university: string;
  fieldOfStudy: string;
}

export interface FinancialProof {
  id: string;
  amount: number;
  currency: string;
  bankName: string;
  accountType: string;
  generatedDate: Date;
  validityMonths: number;
}

export const visaSponsorshipData: VisaSponsorship[] = [
  {
    id: '1',
    jobRole: 'Software Engineer',
    company: 'Google',
    country: 'United States',
    visaType: 'H-1B',
    difficultyLevel: 3,
    sopFormat: 'US Format (H-1B)',
    documentChecklist: [
      'LCA (Labor Condition Application)',
      'Passport copy',
      'Educational degree copy',
      'Work authorization letter',
      'Medical certificate',
      'Police clearance',
    ],
    tips: [
      'Start visa sponsorship process 4-6 months before position starts',
      'Maintain valid status throughout employment',
      'Update I-94 information immediately after arrival',
      'Apply for green card early to maintain status',
    ],
  },
  {
    id: '2',
    jobRole: 'Software Engineer',
    company: 'Tech Companies',
    country: 'Canada',
    visaType: 'Work Permit',
    difficultyLevel: 2,
    sopFormat: 'Canadian Format',
    documentChecklist: [
      'Job offer letter',
      'LMIA (Labour Market Impact Assessment) if required',
      'Passport',
      'Medical examination',
      'Police certificate',
      'Financial proof',
    ],
    tips: [
      'Express Entry pool is fastest route (6 months)',
      'In-demand tech roles qualify for provincial nominations',
      'Post-graduation work permit available after study',
      'Path to permanent residency is clear for tech workers',
    ],
  },
  {
    id: '3',
    jobRole: 'Software Engineer',
    company: 'Tech Companies',
    country: 'United Kingdom',
    visaType: 'Skilled Worker Visa',
    difficultyLevel: 2,
    sopFormat: 'UK Visa Format',
    documentChecklist: [
      'Certificate of Sponsorship (CoS)',
      'Passport',
      'Proof of English proficiency',
      'TB test certificate',
      'Maintenance funds proof',
      'Academic qualifications',
    ],
    tips: [
      'Minimum salary threshold: £26,200 or £20,960 for shortage occupations',
      'Processing time: 3-4 weeks',
      'Spouse and children can join',
      'After 5 years, eligible for Indefinite Leave to Remain',
    ],
  },
  {
    id: '4',
    jobRole: 'Software Engineer',
    company: 'Tech Companies',
    country: 'Australia',
    visaType: 'Skilled Migration',
    difficultyLevel: 3,
    sopFormat: 'Australian Format',
    documentChecklist: [
      'Skills assessment',
      'State nomination',
      'Passport',
      'Character certificate',
      'Medical examination',
      'English language test',
    ],
    tips: [
      'Points-based system: Need 65+ points',
      'Engineering roles are in-demand',
      'Points reset every July',
      'Processing: 12-16 months',
      'Pathway to permanent residency available',
    ],
  },
];

export const universitySpecificCustomization = [
  {
    university: 'MIT',
    country: 'USA',
    scholarships: [
      'MIT Schwarzman College of Computing',
      'MIT Presidential Fellowship',
      'Graduate Research Fellowship Program',
    ],
    requirements: ['GRE', 'TOEFL (for international)', 'Statement of Purpose'],
    processTimeline: '3-4 months',
    fundingPercentage: 100,
  },
  {
    university: 'University of Toronto',
    country: 'Canada',
    scholarships: [
      'Lester B. Pearson International Scholarship',
      'Graduate Scholarships',
    ],
    requirements: ['GMAT/GRE', 'English proficiency test'],
    processTimeline: '2-3 months',
    fundingPercentage: 100,
  },
  {
    university: 'University of Oxford',
    country: 'UK',
    scholarships: [
      'Rhodes Scholarship',
      'Chevening Scholarship',
      'Weidenfeld-Hoffmann Scholarship',
    ],
    requirements: ['IELTS', 'Statement of Purpose', 'Academic transcripts'],
    processTimeline: '4-5 months',
    fundingPercentage: 100,
  },
  {
    university: 'University of Melbourne',
    country: 'Australia',
    scholarships: [
      'Melbourne International Scholarship',
      'Melbourne Graduate Scholarship',
    ],
    requirements: ['IELTS', 'GMAT/GRE'],
    processTimeline: '2-3 months',
    fundingPercentage: 100,
  },
];

export const generateFinancialProofLetter = (amount: number, name: string): string => {
  const date = new Date();
  return `
FINANCIAL PROOF CERTIFICATE

This is to certify that ${name} holds a bank account with our institution with a verified balance of ${amount} USD as of ${date.toLocaleDateString()}.

This certificate is issued for the purpose of visa sponsorship and educational applications.

Bank: International Finance Bank
Account Type: Savings Account
Verification Date: ${date.toLocaleDateString()}
Certificate Number: ${Math.random().toString(36).substring(7).toUpperCase()}

This letter is valid for 12 months from the date of issue.

Authorized Signature
Bank Official
`;
};
