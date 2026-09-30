import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { intakeData, prompt, currentBrief } = req.body;
    
    if (!intakeData) {
      return res.status(400).json({ error: 'Missing intake data' });
    }

    const systemPrompt = `You are the LaniEdu Educational Strategy AI.
Your job is to generate a Client Strategy Brief matching a student's profile to real global universities.
You must return your response STRICTLY as a JSON object matching the ClientStrategyBrief interface.

Profile:
Name: ${intakeData.applicantName}
Budget: €${intakeData.tuitionBudgetAmount}/year
Degree Sought: ${intakeData.degreeLevelSought}
Target Programme: ${intakeData.targetProgramme}
Qualification: ${intakeData.highestQualification}

${prompt ? `THE ADVISOR HAS PROVIDED THIS FEEDBACK/REQUEST: "${prompt}"\nYou MUST follow this request when picking the universities and formulating the strategy.` : ''}

Generate 2 reach schools, 3 target schools, 1 safety school, and 3 contingency backup schools. Use real universities from anywhere in the world that fit the profile (especially honoring the advisor's request if provided). 
CRITICAL INSTRUCTION: You MUST ensure that the universities you select offer the exact degree level sought (${intakeData.degreeLevelSought} degree) in the applicant's Target Programme (${intakeData.targetProgramme}). Do NOT recommend a Master's degree if the applicant is seeking a Bachelor's degree, and vice versa. The programmeName must reflect the correct degree type (e.g., "BSc Economics" or "MSc Economics"). Provide realistic tuition fees in EUR.

Return only raw JSON matching this schema:
{
  "id": "brief-ai-generated",
  "viability": {
    "isBudgetViable": true,
    "isScholarshipViable": false,
    "isHndFrenchException": false,
    "classification": "Direct Master's Degree Candidate",
    "viabilityScore": 90,
    "summaryText": "...",
    "budgetMismatchDetail": "...",
    "visaRiskNote": "..."
  },
  "primaryReachSchools": [
    { "id": "1", "schoolName": "...", "country": "...", "programmeName": "...", "tier": "reach", "officialUrl": "...", "tuitionLocal": "...", "tuitionEuroApprox": 0, "tuitionNairaApprox": 0, "entryRequirements": "...", "justification": "...", "hndAcceptedDirectly": false, "verifiedAt": "2026-09-30 (AI Generated)", "isLiveVerified": false }
  ],
  "primaryTargetSchools": [], // 3 items
  "primarySafetySchool": {}, // 1 item
  "contingencyBackupSchools": [], // 3 items
  "missingDocuments": ["..."],
  "advisorActionPlan": ["..."],
  "advisorClientScript": "..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const generatedBrief = JSON.parse(response.text());
    generatedBrief.intakeData = intakeData;
    generatedBrief.generatedAt = new Date().toISOString();

    return res.status(200).json({ success: true, brief: generatedBrief });
  } catch (err) {
    console.error("AI Error:", err);
    return res.status(500).json({ success: false, error: String(err) });
  }
}
