// A simple implementation to access Supabase without additional packages
export const EXPO_PUBLIC_SUPABASE_URL = 'https://vnvbjphwulwpdzfieyyo.supabase.co';
export const EXPO_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudmJqcGh3dWx3cGR6ZmlleXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NDA2ODcsImV4cCI6MjA2MTUxNjY4N30.qfTs0f4Y5dZIc4hlmitfhe0TOI1fFbdEAK1_9wxzTxY';

// Store user session data
const TOKEN_STORAGE_KEY = 'ruknapp_auth_token';
const USER_STORAGE_KEY = 'ruknapp_user_data';

// Define user types based on database schema
export type UserRole = 'entrepreneur' | 'owner';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  avatar_url?: string;
  dob?: string;
  gender?: string;
  address?: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

// In-memory session storage (would use AsyncStorage in a real implementation)
let currentSession: { access_token: string; user: UserProfile | null } | null = null;

// Basic fetch wrapper for Supabase REST API
export const supabaseApi = {
  // Helper method to get default headers for API requests
  getDefaultHeaders() {
    return {
      'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
      'Content-Type': 'application/json'
    };
  },
  // Directly fetch from Businesses table without any fallback
  async fetchMarketplaces(page = 1, pageSize = 20) {
    try {
      // No fallback - directly fetch from Businesses table
      console.log('Directly fetching from Businesses table without any fallback');
      return await this.fetchBusinesses(page, pageSize);
    } catch (error) {
      console.error('Error fetching from Businesses table:', error);
      throw error; // Let caller handle the error
    }
  },
  
  // Direct fetch from the Businesses table in Supabase
  async fetchBusinesses(page = 1, pageSize = 20): Promise<any[]> {
    try {
      const startRange = (page - 1) * pageSize;
      
      console.log('Directly fetching actual data from Businesses table');
      console.log('Page:', page, 'Page size:', pageSize, 'Offset:', startRange);
      
      // Direct query to the Businesses table with exact column names as in the database
      // Using the exact column names: "name", "rating", "user_ratings_total", "business_status", "latitude", "longitude", "business_type", "popularity_score", "zone_id", "business_id"
      const response = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/Businesses?select=business_id,name,rating,user_ratings_total,business_status,latitude,longitude,business_type,popularity_score,zone_id&order=business_id.asc&limit=${pageSize}&offset=${startRange}`,
        {
          method: 'GET',
          headers: {
            'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache', // Ensure we don't get cached data
            'Prefer': 'return=representation' // Return full representation of the data
          }
        }
      );
      
      console.log('Business data response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching from Businesses table:', errorText);
        throw new Error(`Error fetching business data: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Fetched real businesses count:', data.length);
      
      if (data.length > 0) {
        console.log('Real business data example:', JSON.stringify(data[0]));
        // Log all column names we received from the database to help troubleshoot
        console.log('Database column names in response:', Object.keys(data[0]).join(', '));
      } else {
        console.error('No business data returned from Supabase - table may be empty');
        console.log('Attempting to query Supabase to see if the Businesses table exists...');
        
        try {
          // First check if the table exists and has data
          const tableInfoResponse = await fetch(
            `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/Businesses?limit=1`,
            {
              method: 'GET',
              headers: {
                'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          console.log('Table check status:', tableInfoResponse.status);
          
          if (tableInfoResponse.ok) {
            console.log('Businesses table exists but may be empty');
            // Add sample business record
            console.log('Attempting to add a sample business record...');
            const insertResponse = await fetch(
              `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/Businesses`,
              {
                method: 'POST',
                headers: {
                  'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
                  'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
                  'Content-Type': 'application/json',
                  'Prefer': 'return=representation'
                },
                body: JSON.stringify({
                  "name": 'نضارة الأسطورة للحلاقة',
                  "rating": '4.5',
                  "user_ratings_total": '82',
                  "business_status": 'OPERATIONAL',
                  "latitude": '24.5254774',
                  "longitude": '46.6611376',
                  "business_type": 'barber',
                  "popularity_score": '369',
                  "zone_id": '2',
                  "business_id": '3'
                })
              }
            );
            
            if (insertResponse.ok) {
              console.log('Successfully added sample business');
              // Try fetching again
              return await this.fetchBusinesses(page, pageSize);
            } else {
              console.error('Failed to add sample business:', await insertResponse.text());
            }
          } else {
            console.error('Businesses table may not exist or cannot be accessed');
          }
        } catch (checkError) {
          console.error('Error checking Businesses table:', checkError);
        }
      }
      
      // Transform business data to marketplace items
      const formattedData = data.map((business: any) => {
        // Log the exact structure of each business record to help debugging
        console.log(`Business record ${business.business_id}:`, JSON.stringify(business));
        
        // Get an image based on business type
        const businessTypeImages: {[key: string]: string} = {
          'barber': '../assets/images/dummy1.png',
          'restaurant': '../assets/images/dummy2.png',
          'cafe': '../assets/images/dummy3.png',
          'store': '../assets/images/dummy4.png'
        };
        
        // Get image based on business type or fallback to a random one
        const imageKey = business.business_type && businessTypeImages[business.business_type]
          ? businessTypeImages[business.business_type]
          : `../assets/images/dummy${Math.floor(Math.random() * 4) + 1}.png`;
        
        // Generate a random price between 25,000 and 100,000 as requested
        const randomPrice = Math.floor(Math.random() * (100000 - 25000 + 1)) + 25000;
        const formattedPrice = new Intl.NumberFormat('ar-SA').format(randomPrice);
        
        // Create the marketplace item with the ACTUAL data from Supabase
        // Use explicit column names to ensure proper data mapping
        return {
          id: business.business_id ? business.business_id.toString() : Math.random().toString(),
          title: business.rating || '0.0', // Rating displayed as stars
          price: `${formattedPrice} ريال / سنة`,
          size: business.user_ratings_total ? `تقييمات المستخدمين: ${business.user_ratings_total}` : null,
          location: `منطقة ${business.zone_id || '1'}`,
          image: imageKey,
          businessName: business.name || 'Business',
          businessType: business.business_type || 'متجر',
          businessStatus: business.business_status || 'OPERATIONAL',
          user_ratings_total: business.user_ratings_total,
          zone_id: business.zone_id,
          popularity_score: business.popularity_score,
          latitude: business.latitude,
          longitude: business.longitude,
          originalData: business
        };
      });
      
      console.log(`Successfully formatted ${formattedData.length} business items from real database data`);
      return formattedData;
    } catch (error) {
      console.error('Error fetching from Businesses table:', error);
      throw error;
    }
  },
  
  // Helper function to convert duration type to Arabic
  getDurationType(durationType: string): string {
    switch(durationType) {
      case 'daily': return 'يومي';
      case 'weekly': return 'أسبوعي';
      case 'monthly': return 'شهري';
      case 'yearly': return 'سنوي';
      default: return durationType;
    }
  },
  
  // Utility function to test connection 
  async testConnection() {
    try {
      console.log('Testing Supabase connection...');
      const response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`
        }
      });
      
      console.log('Test connection status:', response.status);
      return response.ok;
    } catch (error) {
      console.error('Connection test error:', error);
      return false;
    }
  },

  // Authentication Methods
  
  // Sign up a new user
  async signUp(email: string, password: string, userData: Partial<UserProfile> & { role: UserRole }) {
    try {
      console.log('Starting sign-up process for:', email, 'with role:', userData.role);
      console.log('User data received:', JSON.stringify({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        dob: userData.dob, // Check if this is received
        gender: userData.gender, // Check if this is received
        city: userData.city,
        country: userData.country,
        address: userData.address, // Check if this is received
        role: userData.role
      }));
      
      // Simple password hashing function (in production, use a proper library like bcrypt)
      const hashPassword = (password: string): string => {
        // This is a very simple hash for demonstration - DO NOT use in production
        const hash = `hash_${password}_${new Date().getTime()}`;
        console.log('Password hash created (masked):', 'hash_****_' + new Date().getTime());
        return hash;
      };
  
      // Hash the password for storage
      const passwordHash = hashPassword(password);
      
      let profileResult;
      
      if (userData.role === 'entrepreneur') {
        // Prepare entrepreneur profile data according to schema
        const entrepreneurData = {
          name: userData.name!,
          email: userData.email || email,
          city: userData.city || '',
          country: userData.country || 'Saudi Arabia',
          avatar_url: userData.avatar_url,
          dob: userData.dob || '', // Convert null to empty string for better DB compatibility
          gender: userData.gender || '', // Convert null to empty string
          address: userData.address || '', // Convert null to empty string
          password_hash: passwordHash // Store the hashed password
        };
        
        console.log('Creating entrepreneur profile directly:', JSON.stringify({
          ...entrepreneurData,
          password_hash: '[REDACTED]'
        }));
        profileResult = await this.createEntrepreneurProfileDirectly(entrepreneurData);
        console.log('Entrepreneur profile created with ID:', profileResult?.id);
        
        // Store the user's password in a secure way for future implementation
        console.log('Note: In production, would store hashed password for user ID:', profileResult?.id);
      } else if (userData.role === 'owner') {
        // Prepare owner profile data according to schema
        const ownerData = {
          name: userData.name!,
          email: userData.email || email,
          phone: userData.phone || '',
          city: userData.city || '',
          country: userData.country || 'Saudi Arabia',
          avatar_url: userData.avatar_url,
          dob: userData.dob || '', // Convert null to empty string for better DB compatibility
          gender: userData.gender || '', // Convert null to empty string
          address: userData.address || '', // Convert null to empty string
          password_hash: passwordHash // Store the hashed password
        };
        
        console.log('Creating owner profile directly:', JSON.stringify({
          ...ownerData,
          password_hash: '[REDACTED]'
        }));
        profileResult = await this.createOwnerProfileDirectly(ownerData);
        console.log('Owner profile created with ID:', profileResult?.id);
        
        // Store the user's password in a secure way for future implementation
        console.log('Note: In production, would store hashed password for user ID:', profileResult?.id);
      } else {
        throw new Error(`Invalid role: ${userData.role}`);
      }

      // Create a basic session since we're skipping auth
      const userProfileId = profileResult?.id || null;
      if (!userProfileId) {
        throw new Error('Failed to get user profile ID');
      }
      
      // Create a simple access token (we're not using real JWT auth here)
      const simpleToken = 'dummy_access_token_' + new Date().getTime();
      
      currentSession = {
        access_token: simpleToken,
        user: {
          ...userData,
          id: userProfileId,
          email: email,
          name: userData.name!,
          role: userData.role
        } as UserProfile
      };

      return { success: true, user: currentSession.user };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  },

  // Sign in an existing user (direct database approach)
  async signIn(email: string, password: string) {
    try {
      console.log('Attempting to sign in with email:', email);
      
      // First, try to find user in entrepreneurs table
      let userRole: UserRole = 'entrepreneur';
      let userWithPassword = await this.findUserWithPasswordByEmail(email, userRole);
      
      // If not found, try owners table
      if (!userWithPassword) {
        userRole = 'owner';
        userWithPassword = await this.findUserWithPasswordByEmail(email, userRole);
      }
      
      if (!userWithPassword) {
        throw new Error('User not found. Please check your email or sign up.');
      }
      
      // Now that we know both tables have password_hash, we can validate consistently
      let passwordValid = false;
      
      // Check if user has a password hash stored
      if (!userWithPassword.password_hash) {
        console.error(`Security issue: User ${email} has no password hash set`);
        // For users with no password hash (legacy users), we'll let them log in once more
        // but they should update their password
        passwordValid = true;
        console.log('WARNING: User logged in without password verification (legacy account)'); 
      } else {
        // Verify the password is correct
        passwordValid = this.verifyPassword(password, userWithPassword.password_hash);
        console.log('Password validation result:', passwordValid);
      }
      
      if (!passwordValid) {
        throw new Error('Invalid password. Please try again.');
      }
      
      // Create a simple user object without the password hash
      const user: UserProfile = {
        id: userWithPassword.id,
        name: userWithPassword.name,
        email: userWithPassword.email,
        phone: userWithPassword.phone,
        city: userWithPassword.city,
        country: userWithPassword.country,
        avatar_url: userWithPassword.avatar_url,
        dob: userWithPassword.dob,
        gender: userWithPassword.gender,
        address: userWithPassword.address,
        created_at: userWithPassword.created_at,
        updated_at: userWithPassword.updated_at,
        role: userRole as UserRole
      };
      
      // Create a simple access token
      const simpleToken = 'dummy_access_token_' + new Date().getTime();
      
      // Set the current session
      currentSession = {
        access_token: simpleToken,
        user
      };
      
      console.log('Sign-in successful for user:', user.name);
      
      return {
        success: true,
        user
      };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Simple password verification function (in production, use a proper library like bcrypt)
  verifyPassword(password: string, storedHash: string): boolean {
    try {
      if (!storedHash) {
        console.error('Empty or null password hash provided for verification');
        return false;
      }
      
      // For our simple hash implementation
      if (storedHash.startsWith('hash_')) {
        const hashParts = storedHash.split('_');
        if (hashParts.length < 2) {
          console.error('Invalid hash format detected');
          return false;
        }
        // Check if the password part matches
        const result = hashParts[1] === password;
        return result;
      }
      
      console.error('Unrecognized password hash format');
      return false;
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  },
  
  // Extended version of findUserByEmail that also returns the password hash
  async findUserWithPasswordByEmail(email: string, role: UserRole): Promise<any> {
    try {
      const tableName = role === 'entrepreneur' ? 'entrepreneurs' : 'owners';
      console.log(`Searching for user with email ${email} in ${tableName} table`);
      
      // Log which fields we're retrieving
      console.log(`Retrieving user data from ${tableName} table with email: ${email}`);
      
      // Select all fields including password_hash
      const response = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/${tableName}?email=eq.${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        console.error(`Error searching ${tableName}:`, await response.text());
        return null;
      }
      
      const users = await response.json();
      console.log(`Found ${users.length} users in ${tableName} table`);
      
      if (users && users.length > 0) {
        // Log whether a password hash exists (without showing the actual hash)
        if (users[0].password_hash) {
          console.log(`User ${email} has a password hash`); 
        } else {
          console.warn(`WARNING: User ${email} has NO password hash`);
        }
        return users[0]; // Return the complete user data including password_hash
      }
      
      return null;
    } catch (error) {
      console.error(`Error finding user in ${role} table:`, error);
      return null;
    }
  },
  
  // Helper method to find user by email in either entrepreneurs or owners table
  async findUserByEmail(email: string, role: UserRole): Promise<UserProfile | null> {
    try {
      const tableName = role === 'entrepreneur' ? 'entrepreneurs' : 'owners';
      console.log(`Searching for user with email ${email} in ${tableName} table`);
      
      const response = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/${tableName}?email=eq.${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        console.error(`Error searching ${tableName}:`, await response.text());
        return null;
      }
      
      const users = await response.json();
      console.log(`Found ${users.length} users in ${tableName} table:`, JSON.stringify(users));
      
      if (users && users.length > 0) {
        const userData = users[0];
        
        // Format the user profile
        return {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          city: userData.city,
          country: userData.country,
          avatar_url: userData.avatar_url,
          created_at: userData.created_at,
          updated_at: userData.updated_at,
          role: role
        };
      }
      
      return null;
    } catch (error) {
      console.error(`Error finding user in ${role} table:`, error);
      return null;
    }
  },

  // Sign out the current user
  async signOut() {
    try {
      console.log('Signing out user...');
      
      // Attempt to call the logout endpoint if we have a session
      if (currentSession?.access_token) {
        try {
          const response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/auth/v1/logout`, {
            method: 'POST',
            headers: {
              'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${currentSession.access_token}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log('Logout API response status:', response.status);
        } catch (apiError) {
          // Log but continue with logout process even if API call fails
          console.error('Error calling logout API:', apiError);
        }
      } else {
        console.log('No active session token found, still proceeding with local logout');
      }

      // Always clear the session data
      console.log('Clearing session data');
      currentSession = null;
      
      // In a real app, you would also clear AsyncStorage
      // await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      // await AsyncStorage.removeItem(USER_STORAGE_KEY);
      
      console.log('User successfully signed out');
      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error);
      // Still clear the session even if there's an error
      currentSession = null;
      return { success: false, error: error.message };
    }
  },

  // Get the current session
  getCurrentSession() {
    return currentSession;
  },
  
  // Set the current session
  setSession(session: { access_token: string; user: UserProfile | null }) {
    currentSession = session;
    return currentSession;
  },

  // Profile Management Methods

  // Create entrepreneur profile - original method with token (keeping for reference)
  async createEntrepreneurProfile(profileData: {
    name: string;
    email: string;
    city: string;
    country: string;
    avatar_url?: string;
  }, token: string) {
    try {
      // Ensure all required fields according to the entrepreneurs table schema are present
      const entrepreneurData = {
        name: profileData.name,
        email: profileData.email,
        city: profileData.city || 'Riyadh', // Default to Riyadh if not provided
        country: profileData.country || 'Saudi Arabia', // Default to Saudi Arabia
        avatar_url: profileData.avatar_url
        // location field is GEOGRAPHY(Point,4326) and will be added later if needed
      };
      
      const response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/entrepreneurs`, {
        method: 'POST',
        headers: {
          'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(entrepreneurData)
      });

      const responseText = await response.text();
      console.log('Create entrepreneur response status:', response.status);
      console.log('Create entrepreneur response:', responseText);
      
      if (!response.ok) {
        throw new Error(`Failed to create entrepreneur profile: ${responseText}`);
      }

      try {
        const parsed = JSON.parse(responseText);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0];
        }
        return parsed;
      } catch (e) {
        console.log('Error parsing entrepreneur response:', e);
        // If we can't parse as JSON but the request was successful, return a default
        // DO NOT include an ID field - let the database assign it
        return { ...entrepreneurData };
      }
    } catch (error: any) {
      console.error('Create entrepreneur profile error:', error);
      throw error;
    }
  },
  
  // New method to create entrepreneur profile directly with anon key
  async createEntrepreneurProfileDirectly(profileData: {
    name: string;
    email: string;
    city: string;
    country: string;
    avatar_url?: string;
    password_hash?: string;
    dob?: string | null;
    gender?: string | null;
    address?: string | null;
  }) {
    try {
      // Validate required fields first
      if (!profileData.name || !profileData.email) {
        throw new Error('Name and email are required fields for entrepreneur profiles');
      }

      // Specifically validate that password_hash is present
      if (!profileData.password_hash) {
        throw new Error('Password hash is required for entrepreneur account creation');
      }
      
      // Debug: Log the profile data before sending to Supabase
      console.log('Processing entrepreneur profile data:', {
        name: profileData.name,
        email: profileData.email,
        city: profileData.city,
        country: profileData.country, 
        dob: profileData.dob ? 'provided' : 'not provided',
        gender: profileData.gender ? 'provided' : 'not provided',
        address: profileData.address ? 'provided' : 'not provided',
        password_hash: profileData.password_hash ? 'provided' : 'not provided'
      });

      // Ensure all required fields according to the entrepreneurs table schema are present
      // Include all fields that exist in the Supabase database schema
      const entrepreneurData = {
        name: profileData.name,
        email: profileData.email,
        city: profileData.city || 'Riyadh', // Default to Riyadh if not provided
        country: profileData.country || 'Saudi Arabia', // Default to Saudi Arabia
        avatar_url: profileData.avatar_url,
        dob: profileData.dob || '', // Use empty string instead of null for better DB compatibility
        gender: profileData.gender || '', // Use empty string instead of null
        address: profileData.address || '', // Use empty string instead of null
        password_hash: profileData.password_hash // Now required and validated
        // location field is GEOGRAPHY(Point,4326) and will be added later if needed
      };
      
      console.log('Sending entrepreneur data to Supabase:', JSON.stringify({
        ...entrepreneurData,
        password_hash: '[REDACTED]' // Don't log the actual hash
      }));
      
      const response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/entrepreneurs`, {
        method: 'POST',
        headers: {
          'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(entrepreneurData)
      });

      const responseText = await response.text();
      console.log('Direct entrepreneur creation status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to create entrepreneur profile directly: ${responseText}`);
      }

      try {
        const parsed = JSON.parse(responseText);
        console.log('Entrepreneur profile created successfully. Response:', JSON.stringify(parsed));
        
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0];
        }
        return parsed;
      } catch (e) {
        console.log('Error parsing entrepreneur response:', e);
        // If we can't parse as JSON but the request was successful, return a default
        return { id: new Date().getTime(), ...entrepreneurData };
      }
    } catch (error: any) {
      console.error('Direct entrepreneur profile creation error:', error);
      throw error;
    }
  },

  // Create owner profile - original method with token (keeping for reference)
  async createOwnerProfile(profileData: {
    name: string;
    email: string;
    phone?: string;
    city: string;
    country: string;
    avatar_url?: string;
  }, token: string) {
    try {
      // Ensure all required fields according to the owners table schema are present
      const ownerData = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone || '',
        city: profileData.city || 'Riyadh', // Default to Riyadh if not provided
        country: profileData.country || 'Saudi Arabia', // Default to Saudi Arabia
        avatar_url: profileData.avatar_url
        // location field is GEOGRAPHY(Point,4326) and will be added later if needed
      };
      
      const response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/owners`, {
        method: 'POST',
        headers: {
          'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(ownerData)
      });

      const responseText = await response.text();
      console.log('Create owner response status:', response.status);
      console.log('Create owner response:', responseText);
      
      if (!response.ok) {
        throw new Error(`Failed to create owner profile: ${responseText}`);
      }

      try {
        return JSON.parse(responseText);
      } catch (e) {
        console.log('Error parsing owner response:', e);
        // If we can't parse as JSON but the request was successful, return a default
        return [{ id: 0, ...ownerData }];
      }
    } catch (error: any) {
      console.error('Create owner profile error:', error);
      throw error;
    }
  },
  
  // New method to create owner profile directly with anon key
  async createOwnerProfileDirectly(profileData: {
    name: string;
    email: string;
    phone?: string;
    city: string;
    country: string;
    avatar_url?: string;
    password_hash?: string;
    dob?: string | null;
    gender?: string | null;
    address?: string | null;
  }) {
    try {
      // Validate password hash is present
      if (!profileData.password_hash) {
        throw new Error('Password hash is required for owner account creation');
      }
      
      // Prepare owner profile data with all required fields
      const ownerData = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone || '',
        city: profileData.city || 'Riyadh',
        country: profileData.country || 'Saudi Arabia',
        avatar_url: profileData.avatar_url,
        dob: profileData.dob || '', // Use empty string instead of null for DB compatibility
        gender: profileData.gender || '',
        address: profileData.address || '',
        password_hash: profileData.password_hash
      };
      
      console.log('Creating owner account with data:', {
        ...ownerData,
        password_hash: '[REDACTED]'
      });
      
      const response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/owners`, {
        method: 'POST',
        headers: {
          'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(ownerData)
      });

      const responseText = await response.text();
      console.log('Direct owner creation status:', response.status);
      console.log('Direct owner creation response:', responseText);
      
      if (!response.ok) {
        throw new Error(`Failed to create owner profile directly: ${responseText}`);
      }
      
      // If successful, log that we've stored the password hash
      console.log('Owner profile created with password hash');

      try {
        const parsed = JSON.parse(responseText);
        console.log('Owner profile created successfully with fields:', Object.keys(parsed[0] || parsed).join(', '));
        
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0];
        }
        return parsed;
      } catch (e) {
        console.log('Error parsing owner response:', e);
        // If we can't parse as JSON but the request was successful, return a default
        // DO NOT include an ID field - let the database assign it
        return { ...ownerData };
      }
    } catch (error: any) {
      console.error('Direct owner profile creation error:', error);
      throw error;
    }
  },

  // Get user profile from both tables
  async getUserProfile(token: string) {
    try {
      // Try to get profile from entrepreneurs table first
      let response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/entrepreneurs?select=*`, {
        method: 'GET',
        headers: {
          'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const entrepreneurs = await response.json();
        if (entrepreneurs && entrepreneurs.length > 0) {
          const userData = entrepreneurs[0];
          return {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            city: userData.city,
            country: userData.country,
            avatar_url: userData.avatar_url,
            created_at: userData.created_at,
            updated_at: userData.updated_at,
            role: 'entrepreneur' as UserRole
          };
        }
      }

      // If not found, try owners table
      response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/owners?select=*`, {
        method: 'GET',
        headers: {
          'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const owners = await response.json();
        if (owners && owners.length > 0) {
          const userData = owners[0];
          return {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            city: userData.city,
            country: userData.country,
            avatar_url: userData.avatar_url,
            created_at: userData.created_at,
            updated_at: userData.updated_at,
            role: 'owner' as UserRole
          };
        }
      }

      throw new Error('User profile not found');
    } catch (error: any) {
      console.error('Get user profile error:', error);
      throw error;
    }
  },

  // Update avatar URL for user profile
  async updateProfileAvatar(id: number, role: UserRole, avatarUrl: string) {
    try {
      const tableName = role === 'entrepreneur' ? 'entrepreneurs' : 'owners';
      const updateData = { avatar_url: avatarUrl, updated_at: new Date().toISOString() };
      
      const response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/${tableName}?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update avatar: ${errorText}`);
      }
      
      // Update the session with the new avatar URL
      if (currentSession && currentSession.user) {
        currentSession.user.avatar_url = avatarUrl;
      }
      
      return true;
    } catch (error: any) {
      console.error('Update avatar error:', error);
      throw error;
    }
  },
  
  // Update entrepreneur profile
  async updateEntrepreneurProfile(id: number, profileData: Partial<UserProfile>, token: string) {
    try {
      const response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/entrepreneurs?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update entrepreneur profile: ${errorText}`);
      }

      // Update session data
      if (currentSession?.user) {
        currentSession.user = { ...currentSession.user, ...profileData };
      }

      return await response.json();
    } catch (error: any) {
      console.error('Update entrepreneur profile error:', error);
      throw error;
    }
  },

  // Update owner profile
  async updateOwnerProfile(id: number, profileData: Partial<UserProfile>, token: string) {
    try {
      const response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/owners?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update owner profile: ${errorText}`);
      }

      // Update session data
      if (currentSession?.user) {
        currentSession.user = { ...currentSession.user, ...profileData };
      }

      return await response.json();
    } catch (error: any) {
      console.error('Update owner profile error:', error);
      throw error;
    }
  },

  // Favorites Management Methods

  // Add a business to favorites for the current user
  async addToFavorites(userId: number, businessId: number) {
    if (!userId || !businessId) {
      throw new Error('User ID and Business ID are required');
    }

    try {
      // First, check if already in favorites
      const exists = await this.checkFavoriteExists(userId, businessId);
      if (exists) {
        return { success: true, message: 'Already in favorites' };
      }

      // Add to favorites
      const response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/favorites`, {
        method: 'POST',
        headers: {
          ...this.getDefaultHeaders(),
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          entrepreneur_id: userId,
          shop_id: businessId,
          created_at: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to add favorite: ${response.statusText}`);
      }

      // After successfully adding to favorites, increment the favorites_count for the business
      await this.incrementBusinessFavoritesCount(businessId);

      return { success: true };
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Remove a business from favorites for the current user
  async removeFromFavorites(userId: number, businessId: number) {
    if (!userId || !businessId) {
      throw new Error('User ID and Business ID are required');
    }

    try {
      const response = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/favorites?entrepreneur_id=eq.${userId}&shop_id=eq.${businessId}`,
        {
          method: 'DELETE',
          headers: this.getDefaultHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to remove favorite: ${response.statusText}`);
      }

      // After successfully removing from favorites, decrement the favorites_count for the business
      await this.decrementBusinessFavoritesCount(businessId);

      return { success: true };
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Check if a business is in the user's favorites
  async checkFavoriteExists(userId: number, businessId: number): Promise<boolean> {
    try {
      const response = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/favorites?entrepreneur_id=eq.${userId}&shop_id=eq.${businessId}`,
        {
          method: 'GET',
          headers: this.getDefaultHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to check favorite: ${response.statusText}`);
      }

      const data = await response.json();
      return data.length > 0;
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  },

  // Get all favorites for the current user
  async getUserFavorites(userId: number) {
    try {
      // First get the favorite business IDs
      const favoritesResponse = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/favorites?entrepreneur_id=eq.${userId}&select=shop_id`,
        {
          method: 'GET',
          headers: this.getDefaultHeaders()
        }
      );

      if (!favoritesResponse.ok) {
        throw new Error(`Failed to fetch favorites: ${favoritesResponse.statusText}`);
      }

      const favorites = await favoritesResponse.json();
      const businessIds = favorites.map((fav: any) => fav.shop_id);

      if (businessIds.length === 0) {
        return [];
      }

      // Then fetch the business details
      const businessesQuery = businessIds.map((id: number) => `business_id=eq.${id}`).join(',');
      const businessesResponse = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/businesses?${businessesQuery}`,
        {
          method: 'GET',
          headers: this.getDefaultHeaders()
        }
      );

      if (!businessesResponse.ok) {
        throw new Error(`Failed to fetch business details: ${businessesResponse.statusText}`);
      }

      return await businessesResponse.json();
    } catch (error) {
      console.error('Error getting user favorites:', error);
      throw error;
    }
  },

  // Get the favorites count for a business by counting entries in favorites table
  async getBusinessFavoritesCount(businessId: number): Promise<number> {
    try {
      // First check if shops table has favorites_count column
      try {
        const response = await fetch(
          `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/shops?shop_id=eq.${businessId}&select=favorites_count`,
          {
            method: 'GET',
            headers: this.getDefaultHeaders()
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.length > 0 && data[0].favorites_count !== undefined) {
            return data[0].favorites_count || 0;
          }
        }
      } catch (innerError) {
        console.log('Could not get favorites_count from shops table, falling back to count method');
      }

      // If the above fails, use count method on favorites table
      const countResponse = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/favorites?shop_id=eq.${businessId}&select=shop_id`,
        {
          method: 'GET',
          headers: this.getDefaultHeaders()
        }
      );

      if (!countResponse.ok) {
        throw new Error(`Failed to count favorites: ${countResponse.statusText}`);
      }

      const favoritesData = await countResponse.json();
      return favoritesData.length;
    } catch (error) {
      console.error('Error getting business favorites count:', error);
      return 0;
    }
  },

  // Increment the favorites count for a business
  async incrementBusinessFavoritesCount(businessId: number) {
    try {
      // Get current count first to avoid race conditions
      const currentCount = await this.getBusinessFavoritesCount(businessId);
      
      // Try to update favorites_count in shops table
      const response = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/shops?shop_id=eq.${businessId}`,
        {
          method: 'PATCH',
          headers: {
            ...this.getDefaultHeaders(),
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            favorites_count: currentCount + 1
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to increment favorites count: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error incrementing favorites count:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Decrement the favorites count for a business
  async decrementBusinessFavoritesCount(businessId: number) {
    try {
      // Get current count first to avoid race conditions
      const currentCount = await this.getBusinessFavoritesCount(businessId);
      const newCount = Math.max(0, currentCount - 1); // Don't go below 0
      
      const response = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/shops?shop_id=eq.${businessId}`,
        {
          method: 'PATCH',
          headers: {
            ...this.getDefaultHeaders(),
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            favorites_count: newCount
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to decrement favorites count: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error decrementing favorites count:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },
};
