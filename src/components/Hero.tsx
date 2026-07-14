import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Building, Sparkles, Landmark, LayoutGrid, ChevronsRight, ChevronDown } from 'lucide-react';
import { SearchFilters } from '../types';
import storeFront from '../assets/images/CP.png';

interface HeroProps {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
}

export default function Hero({ filters, setFilters }: HeroProps) {
  // Local temporary states for search dashboard before committing to global state
  const [activeTab, setActiveTab] = useState<'buy' | 'rent' | 'commercial' | 'plots'>('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [propType, setPropType] = useState<string>('all');
  const [bhkCount, setBhkCount] = useState<string>('all');
  const [budgetLimit, setBudgetLimit] = useState<string>('all');

  // Budget selections based on Category
  const getBudgetOptions = () => {
    if (activeTab === 'rent') {
      return [
        { label: 'Under ₹20,000 / mo', value: '20000' },
        { label: 'Under ₹40,000 / mo', value: '40000' },
        { label: 'Under ₹75,000 / mo', value: '75000' },
        { label: 'Under ₹1.5 Lakh / mo', value: '150000' },
      ];
    }
    return [
      { label: 'Under ₹45 Lakh', value: '4500000' },
      { label: 'Under ₹90 Lakh', value: '9000000' },
      { label: 'Under ₹1.5 Crore', value: '15000000' },
      { label: 'Under ₹3.0 Crore', value: '30000000' },
      { label: 'Under ₹5.0 Crore', value: '50000000' },
    ];
  };

  // Property types depending on active tabs
  const getPropertyTypeOptions = () => {
    if (activeTab === 'commercial') {
      return [
        { label: 'Commercial Office', value: 'Commercial Office' },
        { label: 'Retail Shop', value: 'Retail Shop' },
      ];
    }
    if (activeTab === 'plots') {
      return [
        { label: 'Residential Plot', value: 'Plot' },
      ];
    }
    return [
      { label: 'Apartments / Flats', value: 'Apartment' },
      { label: 'Independent Villas', value: 'Villa' },
      { label: 'Builder Floors', value: 'Independent House' },
    ];
  };

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setFilters(prev => {
      const updated: SearchFilters = {
        ...prev,
        category: activeTab,
        query: searchQuery,
        // Property types
        propertyType: propType === 'all' ? [] : [propType],
        // BHK configuration (only residential)
        bedrooms: bhkCount === 'all' ? [] : [Number(bhkCount)],
        // Budget bounds
        budgetMax: budgetLimit === 'all' 
          ? (activeTab === 'rent' ? 200000 : 50000000) 
          : Number(budgetLimit),
      };
      return updated;
    });

    // Scroll smoothly to properties section
    const propertiesSection = document.getElementById('properties');
    if (propertiesSection) {
      propertiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Trending Localities Shortcut Handler
  const handleTrendingSearch = (locality: string) => {
    setSearchQuery(locality);
    setFilters(prev => ({
      ...prev,
      category: 'buy',
      query: locality,
      propertyType: [],
      bedrooms: [],
      budgetMax: 50000000
    }));

    const propertiesSection = document.getElementById('properties');
    if (propertiesSection) {
      propertiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative bg-[#f4f1ed] pt-28 pb-36 overflow-hidden min-h-[95vh] flex items-center">
      {/* Immersive Background Image */}
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover opacity-85 scale-105 select-none"
          src={storeFront}
          alt="Camellia Properties Storefront"
          referrerPolicy="no-referrer"
        />
        {/* Soft, custom nature-infused dark-green/gold overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#17241a]/95 via-[#2c3d30]/80 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 flex flex-col justify-center">
        {/* Editorial Brand Header */}
        <div className="max-w-3xl mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 bg-amber-500/15 backdrop-blur-md px-4 py-1.5 rounded-full text-amber-300 font-semibold text-[10px] uppercase tracking-[0.25em] mb-5 border border-amber-500/30"
          >
            <Sparkles className="w-3.5 h-3.5" /> India's Luxury Real Estate Portal
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight tracking-tight"
          >
            Find Your Dream Space in <br/>
            <span className="font-serif italic text-[#c2b29c] font-normal">Mohali & Chandigarh</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm md:text-base text-[#a5b5a2] leading-relaxed max-w-xl font-medium"
          >
            LUXURY HOMES • ESTATES • COMMERCIAL. Trusted GMADA & RERA-approved properties curated with 15+ years of customer commitment.
          </motion.p>
        </div>

        {/* 99acres-Style Tabbed Search Console */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full max-w-4xl bg-white/95 backdrop-blur-lg rounded-3xl p-5 sm:p-7 shadow-2xl border border-white/20"
        >
          {/* Form Tabs */}
          <div className="flex gap-1.5 border-b border-[#e9e6e0] pb-4 mb-5 overflow-x-auto">
            {(['buy', 'rent', 'commercial', 'plots'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                  setPropType('all');
                  setBhkCount('all');
                  setBudgetLimit('all');
                }}
                className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-[#2c3d30] text-[#f4f1ed] shadow-md scale-102'
                    : 'text-[#4f574d] hover:bg-[#f4f1ed] hover:text-[#2c3d30]'
                }`}
              >
                {tab === 'buy' ? 'Buy residential' : tab === 'rent' ? 'Rent out' : tab}
              </button>
            ))}
          </div>

          {/* Search Fields Form */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
            
            {/* 1. Keyword search (Locality) */}
            <div className="md:col-span-4 space-y-1.5">
              <label className="text-[10px] text-[#788575] font-bold uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Locality / Project
              </label>
              <div className="relative">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Aerocity, Sector 82"
                  className="w-full bg-[#f4f1ed] border border-[#d1d6cf] rounded-xl pl-4 pr-10 py-3.5 text-xs text-[#2c3d30] font-semibold outline-none focus:ring-1 focus:ring-[#2c3d30] focus:border-[#2c3d30]"
                />
                <Search className="absolute right-3.5 top-3.5 text-[#788575] w-4.5 h-4.5 pointer-events-none" />
              </div>
            </div>

            {/* 2. Property Type Dropdown */}
            <div className="md:col-span-3 space-y-1.5">
              <label className="text-[10px] text-[#788575] font-bold uppercase tracking-wider flex items-center gap-1">
                <Building className="w-3.5 h-3.5" /> Property Type
              </label>
              <select
                value={propType}
                onChange={(e) => setPropType(e.target.value)}
                className="w-full bg-[#f4f1ed] border border-[#d1d6cf] rounded-xl px-4 py-3.5 text-xs text-[#2c3d30] font-semibold outline-none focus:ring-1 focus:ring-[#2c3d30]"
              >
                <option value="all">All Property Types</option>
                {getPropertyTypeOptions().map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* 3. BHK Configuration (only if residential buy/rent) */}
            {activeTab !== 'commercial' && activeTab !== 'plots' ? (
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] text-[#788575] font-bold uppercase tracking-wider flex items-center gap-1">
                  <LayoutGrid className="w-3.5 h-3.5" /> Bedrooms
                </label>
                <select
                  value={bhkCount}
                  onChange={(e) => setBhkCount(e.target.value)}
                  className="w-full bg-[#f4f1ed] border border-[#d1d6cf] rounded-xl px-4 py-3.5 text-xs text-[#2c3d30] font-semibold outline-none focus:ring-1 focus:ring-[#2c3d30]"
                >
                  <option value="all">All BHKs</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK+</option>
                </select>
              </div>
            ) : (
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] text-[#788575] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Landmark className="w-3.5 h-3.5" /> Status
                </label>
                <select
                  disabled
                  className="w-full bg-[#f4f1ed]/50 border border-[#d1d6cf] rounded-xl px-4 py-3.5 text-xs text-[#788575] font-semibold outline-none cursor-not-allowed"
                >
                  <option value="all">Immediate</option>
                </select>
              </div>
            )}

            {/* 4. Budget Range Dropdown */}
            <div className="md:col-span-3 space-y-1.5">
              <label className="text-[10px] text-[#788575] font-bold uppercase tracking-wider flex items-center gap-1">
                Budget limit
              </label>
              <select
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
                className="w-full bg-[#f4f1ed] border border-[#d1d6cf] rounded-xl px-4 py-3.5 text-xs text-[#2c3d30] font-semibold outline-none focus:ring-1 focus:ring-[#2c3d30]"
              >
                <option value="all">Maximum Budget</option>
                {getBudgetOptions().map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            
            {/* Submit Button */}
            <div className="md:col-span-12 pt-2 flex justify-end">
              <button
                type="submit"
                className="w-full md:w-auto px-10 py-4 bg-[#2c3d30] hover:bg-[#3d5442] text-[#f4f1ed] rounded-2xl text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 transition-all shadow-md hover:scale-[1.01]"
              >
                Search Listings <ChevronsRight className="w-4 h-4 animate-pulse" />
              </button>
            </div>
          </form>
        </motion.div>

        {/* Quick suggestions shortcut just like 99acres */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 flex flex-wrap items-center gap-2.5 text-xs text-[#a5b5a2] font-semibold"
        >
          <span className="uppercase tracking-wider text-[10px] font-bold text-white/70">Trending searches in Mohali:</span>
          {['Aerocity', 'Sector 82', 'Sector 115', 'VIP Road', 'Sector 66'].map((loc) => (
            <button
              key={loc}
              onClick={() => handleTrendingSearch(loc)}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all text-[11px] border border-white/10"
            >
              {loc}
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
