// In-memory store for recent Google Form submissions (up to 50 briefs)
let recentSubmissions = [];

export default function handler(req, res) {
  try {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method === 'GET') {
      // If web app asks for list of submissions
      return res.status(200).json({
        status: 'active',
        service: 'LaniEdu Strategy Agent Webhook API',
        version: '2.4',
        endpoint: 'https://laniedu-strategy-agent.vercel.app/api/intake',
        count: recentSubmissions.length,
        recentSubmissions
      });
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {
          body = {};
        }
      }
      const data = body || {};

      const applicantName = data.applicantName || 'Google Form Applicant';
      const budgetAmount = Number(data.tuitionBudgetAmount) || 4000;
      const budgetTierLabel = data.budgetTierLabel || 'Under €4,000 / ~₦6 Million per year';
      const qualification = data.highestQualification || 'bachelor_21';
      const destinations = Array.isArray(data.preferredDestinations) ? data.preferredDestinations : ['France', 'Poland'];

      const generatedBrief = {
        id: `brief-form-${Date.now()}`,
        ...data,
        generatedAt: new Date().toISOString()
      };

      // Push to recent submissions array
      recentSubmissions.unshift(generatedBrief);
      if (recentSubmissions.length > 50) {
        recentSubmissions = recentSubmissions.slice(0, 50);
      }

      return res.status(200).json({
        success: true,
        message: `Client Strategy Brief compiled for ${applicantName}`,
        brief: generatedBrief
      });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
}
