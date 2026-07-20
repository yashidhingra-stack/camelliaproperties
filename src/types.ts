export interface Property {
  id: string;
  title: string;
  description: string;
  price: number; // raw value in Rupees, e.g. 8500000 for 85 Lakhs
  priceFormatted: string; // e.g., "₹85 Lakh", "₹2.50 Cr"
  location: string; // specific area, e.g. "Aerocity"
  city: string; // e.g. "Mohali", "Chandigarh", "Zirakpur"
  area: string; // display area, e.g. "1,800 sq. ft."
  areaValue: number; // raw sq ft
  bedrooms: number | null; // BHK count
  bathrooms: number | null;
  propertyType: 'Apartment' | 'Villa' | 'Independent House' | 'Plot' | 'Commercial Office' | 'Retail Shop';
  category: 'buy' | 'rent' | 'commercial' | 'plots';
  image: string;
  images: string[];
  isVerified: boolean;
  isReraApproved: boolean;
  possessionStatus: 'Ready to Move' | 'Under Construction';
  brokerage: 'Zero Brokerage' | 'Standard Brokerage';
  amenities: string[];
  facing?: string;
  floor?: string;
  age?: string;
  postedBy: 'Owner' | 'Agent' | 'Builder';
  postedDate: string;
  agentName: string;
  agentPhone: string;
  agentImage: string;
}

export interface SearchFilters {
  category: 'all' | 'buy' | 'rent' | 'commercial' | 'plots';
  query: string;
  city: string;
  propertyType: string[];
  budgetMin: number;
  budgetMax: number;
  bedrooms: number[];
  possessionStatus: string[];
  amenities: string[];
  sortBy: 'relevance' | 'priceAsc' | 'priceDesc' | 'areaDesc';
}

export interface Inquiry {
  propertyId: string;
  propertyName: string;
  name: string;
  email: string;
  phone: string;
  userType: 'Buyer' | 'Agent' | 'Tenant';
  message: string;
}
