// types.ts
export interface MarketplaceItem {
  id: string;                           // business_id from database as string
  business_id?: number;                 // business_id from database as number
  name?: string;                        // name from database (used in Supabase integration)
  title: string;                        // rating from database (displayed as star rating)
  price: string;                        // randomly generated price (25,000 - 100,000 range)
  size: string | null;                  // user_ratings_total from database
  location: string;                     // zone information
  image: string | keyof typeof images;  // can be a remote URL or a key in the images mapping
  businessName: string;                 // name from database
  businessType: string;                 // business_type from database (e.g., barber)
  businessStatus?: string;              // business_status from database
  user_ratings_total?: string;          // total user ratings count
  zone_id?: string;                     // reference to Zones table
  popularity_score?: string;            // popularity metric from database
  latitude?: string;                    // latitude coordinates
  longitude?: string;                   // longitude coordinates
  rating?: number;                      // numerical rating value
  numReviews?: number;                  // number of reviews
  business_type?: string;               // alternative business type name
  favorites_count?: number;             // count of how many users have favorited this business
  originalData?: any;                   // original data from Supabase
}

// Mapping for dynamic image imports.
export const images = {
  "../assets/images/dummy1.png": require("../assets/images/dummy1.png"),
  "../assets/images/dummy2.png": require("../assets/images/dummy2.png"),
  "../assets/images/dummy3.png": require("../assets/images/dummy3.png"),
  "../assets/images/dummy4.png": require("../assets/images/dummy4.png"),
};

export const MARKETPLACES: MarketplaceItem[] = [
  {
    id: "1",
    title: "4.2",                    // Rating (displayed as star rating)
    price: "30,000 ريال / سنة",
    size: "تقييمات المستخدمين: 120",
    location: "منطقة 1",
    image: "../assets/images/dummy3.png",
    businessName: "صالون مقص بربر",
    businessType: "barber",
    businessStatus: "OPERATIONAL",
    user_ratings_total: "120",
    zone_id: "1",
    popularity_score: "350"
  },
  {
    id: "2",
    title: "3.9",                    // Rating (displayed as star rating)
    price: "32,000 ريال / سنة",
    size: "تقييمات المستخدمين: 85",
    location: "منطقة 2",
    image: "../assets/images/dummy2.png",
    businessName: "Nasir Hallaq",
    businessType: "barber",
    businessStatus: "OPERATIONAL",
    user_ratings_total: "85",
    zone_id: "2",
    popularity_score: "280"
  },
  {
    id: "3",
    title: "4.5",                    // Rating (displayed as star rating)
    price: "28,000 ريال / سنة",
    size: "تقييمات المستخدمين: 230",
    location: "منطقة 3",
    image: "../assets/images/dummy1.png",
    businessName: "Fawaz neighborhood market",
    businessType: "store",
    businessStatus: "OPERATIONAL",
    user_ratings_total: "230",
    zone_id: "3",
    popularity_score: "420"
  },
  {
    id: "4",
    title: "3.8",                    // Rating (displayed as star rating)
    price: "35,000 ريال / سنة",
    size: "تقييمات المستخدمين: 110",
    location: "منطقة 4",
    image: "../assets/images/dummy4.png",
    businessName: "Golden Scissors",
    businessType: "barber",
    businessStatus: "OPERATIONAL",
    user_ratings_total: "110",
    zone_id: "4",
    popularity_score: "300"
  },
  {
    id: "5",
    title: "4.1",                    // Rating (displayed as star rating)
    price: "42,000 ريال / سنة",
    size: "تقييمات المستخدمين: 95",
    location: "منطقة 2",
    image: "../assets/images/dummy3.png",
    businessName: "قهوة الرواق",
    businessType: "cafe",
    businessStatus: "OPERATIONAL",
    user_ratings_total: "95",
    zone_id: "2",
    popularity_score: "290"
  },
  {
    id: "6",
    title: "4.3",                    // Rating (displayed as star rating)
    price: "38,000 ريال / سنة",
    size: "تقييمات المستخدمين: 150",
    location: "منطقة 1",
    image: "../assets/images/dummy1.png",
    businessName: "مطعم الشام",
    businessType: "restaurant",
    businessStatus: "OPERATIONAL",
    user_ratings_total: "150",
    zone_id: "1",
    popularity_score: "380"
  },
  {
    id: "7",
    title: "3.7",                    // Rating (displayed as star rating)
    price: "29,000 ريال / سنة",
    size: "تقييمات المستخدمين: 75",
    location: "منطقة 3",
    image: "../assets/images/dummy2.png",
    businessName: "البقالة العائلية",
    businessType: "store",
    businessStatus: "OPERATIONAL",
    user_ratings_total: "75",
    zone_id: "3",
    popularity_score: "250"
  },
];
