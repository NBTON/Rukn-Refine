const app = require('../server');
let server;
let baseUrl;

const zones = [
  { zone_id: 1, zone_name: 'Zone 1', total_popularity_score: 5, total_user_ratings: 5 },
  { zone_id: 2, zone_name: 'Zone 2', total_popularity_score: 1, total_user_ratings: 1 }
];
const competitors = [
  { zone_id: 1, business_type: 'barber', number_of_same_type_businesses: 1 },
  { zone_id: 2, business_type: 'barber', number_of_same_type_businesses: 3 }
];

jest.mock('@supabase/supabase-js', () => {
  const dataMap = {
    Businesses: [],
    Zones: zones,
    Competitors: competitors
  };
  return {
    createClient: jest.fn(() => ({
      from: jest.fn((table) => ({
        select: jest.fn(() => Promise.resolve({ data: dataMap[table], error: null }))
      }))
    }))
  };
});

describe('GET /api/recommendations', () => {
  beforeAll(done => {
    server = app.listen(0, () => {
      const { port } = server.address();
      baseUrl = `http://localhost:${port}`;
      done();
    });
  });

  afterAll(() => {
    server.close();
  });

  it('returns sorted recommendations', async () => {
    const res = await fetch(`${baseUrl}/api/recommendations/barber?count=2`);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.recommendations[0].zone_id).toBe(1);
  });
});
