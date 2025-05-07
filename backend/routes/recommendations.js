const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// u0625u0639u062fu0627u062f Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://cycncelsoqthdpabozhk.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5Y25jZWxzb3F0aGRwYWJvemhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NDgxMTAsImV4cCI6MjA1ODMyNDExMH0.taUNLQcBAB9p3bRyF-kbHttGibDtFJzqKiXxVl_mAJ0';
const supabase = createClient(supabaseUrl, supabaseKey);

// u0627u0644u0623u0648u0632u0627u0646 u0627u0644u0645u0633u062au062eu062fu0645u0629 u0641u064a u062eu0648u0627u0631u0632u0645u064au0629 u0627u0644u062au0648u0635u064au0629
const WEIGHTS = {
  barber: { w_pop: 0.40, w_rat: 0.20, w_comp: 0.40 },
  gym: { w_pop: 0.30, w_rat: 0.40, w_comp: 0.30 },
  gas_station: { w_pop: 0.50, w_rat: 0.30, w_comp: 0.20 },
  laundry: { w_pop: 0.50, w_rat: 0.10, w_comp: 0.40 },
  pharmacy: { w_pop: 0.40, w_rat: 0.40, w_comp: 0.20 },
  supermarket: { w_pop: 0.60, w_rat: 0.20, w_comp: 0.20 }
};

// u062fu0627u0644u0629 u0627u0644u062cu0644u0628 u0645u0646 Supabase
async function fetchData() {
  try {
    const [{ data: businesses, error: errBusinesses },
           { data: zones, error: errZones },
           { data: competitors, error: errCompetitors }] = await Promise.all([
      supabase.from('Businesses').select('*'),
      supabase.from('Zones').select('*'),
      supabase.from('Competitors').select('*')
    ]);

    if (errBusinesses) throw errBusinesses;
    if (errZones) throw errZones;
    if (errCompetitors) throw errCompetitors;

    console.log(`${zones.length} zones fetched, of which ${zones.filter(z => z.number_of_businesses === 0).length} are empty`);

    return { businesses, zones, competitors };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// u062eu0648u0627u0631u0632u0645u064au0629 u0627u0644u062au0648u0635u064au0629 u0628u0627u0644u0645u0646u0627u0637u0642
const recommend_zones = (zones, competitors, businessType, k = 5) => {
  if (!WEIGHTS[businessType]) {
    throw new Error(`Unknown businessType: ${businessType}`);
  }

  const { w_pop, w_rat, w_comp } = WEIGHTS[businessType];

  const zoneScores = zones.map(zone => {
    const competitorData = competitors.find(c => c.zone_id === zone.zone_id && c.business_type === businessType) || { number_of_same_type_businesses: 0 };

    const zone_score = (
      w_pop * (zone.total_popularity_score || 0) +
      w_rat * (zone.total_user_ratings || 0) -
      w_comp * (competitorData.number_of_same_type_businesses || 0)
    );

    return {
      zone_id: zone.zone_id,
      zone_name: zone.zone_name || zone.name || `Zone ${zone.zone_id}`,
      zone_score,
      total_popularity_score: zone.total_popularity_score || 0,
      total_user_ratings: zone.total_user_ratings || 0,
      number_of_same_type_businesses: competitorData.number_of_same_type_businesses || 0,
      location: zone.location || { lat: zone.latitude, lng: zone.longitude }
    };
  });

  zoneScores.sort((a, b) => b.zone_score - a.zone_score);
  return zoneScores.slice(0, k);
};

// u0646u0642u0637u0629 u0646u0647u0627u064au0629 API u0644u0644u062au0648u0635u064au0627u062a
router.get('/recommendations/:businessType', async (req, res) => {
  try {
    const { businessType } = req.params;
    const count = parseInt(req.query.count) || 5;
    
    if (!WEIGHTS[businessType]) {
      return res.status(400).json({ 
        error: `Business type not supported. Available types: ${Object.keys(WEIGHTS).join(', ')}` 
      });
    }

    const { zones, competitors } = await fetchData();
    const recommendations = recommend_zones(zones, competitors, businessType, count);
    
    res.json({
      success: true,
      businessType,
      recommendations
    });
  } catch (error) {
    console.error('Error in recommendations endpoint:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    });
  }
});

// u0646u0642u0637u0629 u0646u0647u0627u064au0629 u0644u0627u0633u062au0631u062cu0627u0639 u0623u0646u0648u0627u0639 u0627u0644u0623u0639u0645u0627u0644 u0627u0644u0645u062fu0639u0648u0645u0629
router.get('/business-types', (req, res) => {
  res.json({
    success: true,
    types: Object.keys(WEIGHTS)
  });
});

// u0646u0642u0637u0629 u0646u0647u0627u064au0629 u0644u0644u062au062du0642u0642 u0645u0646 u0627u0644u0627u062au0635u0627u0644 u0628u0642u0627u0639u062fu0629 u0627u0644u0628u064au0627u0646u0627u062a
router.get('/status', async (req, res) => {
  try {
    const { count } = await supabase.from('Zones').select('*', { count: 'exact', head: true });
    
    res.json({
      success: true,
      message: 'Database connection successful',
      zones_count: count
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Database connection error' 
    });
  }
});

module.exports = router;
