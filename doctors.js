export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { specialty } = req.query;

  if (!specialty) {
    return res.status(400).json({ error: 'Specialty is required' });
  }

  try {
    const response = await fetch(
      `https://npiregistry.cms.hhs.gov/api/?version=2.1&taxonomy_description=${encodeURIComponent(specialty)}&limit=10&enumeration_type=NPI-1`,
      { headers: { 'Accept': 'application/json' } }
    );

    if (!response.ok) {
      throw new Error(`NPI API responded with ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    return res.status(500).json({ error: 'Failed to fetch doctors', details: err.message });
  }
}
