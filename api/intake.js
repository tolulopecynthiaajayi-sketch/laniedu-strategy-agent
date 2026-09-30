module.exports = (req, res) => {
  try {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method === 'GET') {
      return res.status(200).json({
        status: 'active',
        service: 'LaniEdu Strategy Agent Webhook API',
        version: '2.4',
        endpoint: 'https://laniedu-strategy-agent.vercel.app/api/intake'
      });
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) { body = {}; }
      }
      const data = body || {};

      const applicantName = data.applicantName || 'Google Form Applicant';
      const budgetAmount = Number(data.tuitionBudgetAmount) || 4000;
      const budgetTierLabel = data.budgetTierLabel || 'Under €4,000 / ~₦6 Million per year';
      const qualification = data.highestQualification || 'bachelor_21';
      const destinations = Array.isArray(data.preferredDestinations) ? data.preferredDestinations : ['France', 'Poland'];

      const responsePayload = {
        success: true,
        message: `Client Strategy Brief compiled for ${applicantName}`,
        receivedIntake: {
          applicantName,
          phone: data.phone || '',
          qualification,
          targetProgramme: data.targetProgramme || 'Master Degree',
          tuitionBudgetAmount: budgetAmount,
          budgetTierLabel,
          preferredDestinations: destinations,
          visaRefusalHistory: data.visaRefusalHistory || 'No, zero refusals',
          advisoryPackageSelected: data.advisoryPackageSelected || 'Full Advisory'
        },
        primaryRecommendedSchools: [
          { schoolName: 'Université Paris-Saclay', country: 'France', tier: 'Reach', tuition: '€3,770/yr', url: 'https://www.universite-paris-saclay.fr/en' },
          { schoolName: 'Vistula University Warsaw', country: 'Poland', tier: 'Target', tuition: '€3,800/yr', url: 'https://www.vistula.edu.pl/en' },
          { schoolName: 'Jiangsu University', country: 'China', tier: 'Target', tuition: '20,000 RMB (~€2,550/yr)', url: 'https://oia.ujs.edu.cn/en' },
          { schoolName: 'Asia Pacific University (APU)', country: 'Malaysia', tier: 'Safety', tuition: 'RM 28,500 (~€3,800/yr)', url: 'https://www.apu.edu.my' }
        ],
        generatedAt: new Date().toISOString()
      };

      return res.status(200).json(responsePayload);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err ? err.toString() : 'Unknown Error' });
  }
};
