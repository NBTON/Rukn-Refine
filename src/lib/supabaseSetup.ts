import { supabaseApi } from './supabase';

// For debugging and development purposes
export const SUPABASE_URL = 'https://vnvbjphwulwpdzfieyyo.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudmJqcGh3dWx3cGR6ZmlleXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NDA2ODcsImV4cCI6MjA2MTUxNjY4N30.qfTs0f4Y5dZIc4hlmitfhe0TOI1fFbdEAK1_9wxzTxY';

// Define the structure of a marketplace
export interface MarketplaceCreate {
  title: string;
  price: string;
  size: string;
  location: string;
  image: string;
}

// Initialize or setup Supabase tables
export const setupSupabase = async () => {
  try {
    console.log('Setting up Supabase connection and tables...');
    
    // Test basic connection
    const connected = await supabaseApi.testConnection();
    if (!connected) {
      throw new Error('Could not connect to Supabase');
    }
    
    // Check if Businesses table exists by trying to query it
    // If it doesn't exist, we'll get a 400 or 404 error
    const checkTableResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/Businesses?limit=1`,
      {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Business table check status:', checkTableResponse.status);
    
    // Check if table exists
    if (checkTableResponse.status === 404 || checkTableResponse.status === 400) {
      console.log('Businesses table might not exist, attempting to load mock data...');
      return false;
    }
    
    // Try to get at least one business to confirm we have data
    const businessData = await checkTableResponse.json();
    if (!businessData || businessData.length === 0) {
      console.log('No business data found in the table, attempting to load mock data...');
      return false;
    }
    
    console.log('Supabase setup completed successfully. Business data available.');
    return true;
  } catch (error) {
    console.error('Error setting up Supabase:', error);
    return false;
  }
};

// Import images type to ensure type safety
import { images } from '../components/types';

// Function to fetch mock data since the database may not be set up
export const getMockMarketplaces = () => {
  return [
    {
      id: '1',
      title: 'مناسب لفكرتك بنسبة 96%',
      price: '30,000 ريال / سنة',
      size: '400 متر مربع',
      location: 'الخبر, السعودية',
      image: "../assets/images/dummy3.png" as keyof typeof images,
    },
    {
      id: '2',
      title: 'مناسب لفكرتك بنسبة 97%',
      price: '30,000 ريال / سنة',
      size: '420 متر مربع',
      location: 'الدمام, السعودية',
      image: "../assets/images/dummy2.png" as keyof typeof images,
    },
    {
      id: '3',
      title: 'مناسب لفكرتك بنسبة 90%',
      price: '25,000 ريال / سنة',
      size: '380 متر مربع',
      location: 'الرياض, السعودية',
      image: "../assets/images/dummy1.png" as keyof typeof images,
    },
    {
      id: '4',
      title: 'مناسب لفكرتك بنسبة 90%',
      price: '25,000 ريال / سنة',
      size: '380 متر مربع',
      location: 'الرياض, السعودية',
      image: "../assets/images/dummy4.png" as keyof typeof images,
    },
    {
      id: '5',
      title: 'مناسب لفكرتك بنسبة 92%',
      price: '27,000 ريال / سنة',
      size: '350 متر مربع',
      location: 'جدة, السعودية',
      image: "../assets/images/dummy2.png" as keyof typeof images,
    },
    {
      id: '6',
      title: 'مناسب لفكرتك بنسبة 88%',
      price: '22,000 ريال / سنة',
      size: '320 متر مربع',
      location: 'الطائف, السعودية',
      image: "../assets/images/dummy1.png" as keyof typeof images,
    },
  ];
};
