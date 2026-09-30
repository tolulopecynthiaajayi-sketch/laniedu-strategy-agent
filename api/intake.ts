import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateClientStrategyBrief } from '../src/utils/rulesEngine';
import type { ClientIntakeData } from '../src/types';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS so Google Apps Script & web clients can hit the endpoint cleanly
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'active',
      service: 'LaniEdu Educational Strategy Agent Webhook API',
      version: '2.4',
      endpoint: 'https://laniedu-strategy-agent.vercel.app/api/intake'
    });
  }

  if (req.method === 'POST') {
    try {
      const data = req.body || {};
      
      const intake: ClientIntakeData = {
        id: `intake-webhook-${Date.now()}`,
        applicantName: data.applicantName || 'Google Form Candidate',
        phone: data.phone || '',
        hasPersonalBudget: data.hasPersonalBudget ?? true,
        isFullyFundedScholarshipRequested: Boolean(data.isFullyFundedScholarshipRequested),
        assistanceType: data.assistanceType || 'full_advisory',
        highestQualification: data.highestQualification || 'bachelor_21',
        targetProgramme: data.targetProgramme || 'Master Degree',
        workExperienceYears: data.workExperienceYears || 'N/A',
        degreeLevelSought: data.degreeLevelSought || 'master',
        tuitionBudgetAmount: Number(data.tuitionBudgetAmount) || 4000,
        tuitionBudgetCurrency: data.tuitionBudgetCurrency || 'EUR',
        budgetTierLabel: data.budgetTierLabel || 'Under €4,000 / ~₦6 Million per year',
        preferredDestinations: Array.isArray(data.preferredDestinations) ? data.preferredDestinations : ['France', 'Poland'],
        intakeTimeline: data.intakeTimeline || 'Spring 2027',
        visaRefusalHistory: data.visaRefusalHistory || 'No, zero refusals',
        advisoryPackageSelected: data.advisoryPackageSelected || 'Full Advisory',
        readinessTimeline: data.readinessTimeline || 'Immediate',
        scholarshipRetainerStatus: data.scholarshipRetainerStatus || 'willing_100',
        wantsRelocationGuidebook: Boolean(data.wantsRelocationGuidebook),
        documents: data.documents || {
          passport6Months: true,
          officialTranscripts: true,
          degreeCertificate: true,
          updatedCv: true,
          referenceLetters2: true,
          motivationLetterSop: true,
          englishProficiency: true,
          proofOfFunds: true
        },
        createdAt: new Date().toISOString()
      };

      const brief = generateClientStrategyBrief(intake);

      return res.status(200).json({
        success: true,
        message: 'Client Strategy Brief compiled successfully',
        brief
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error?.message || 'Failed to compile Strategy Brief'
      });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
