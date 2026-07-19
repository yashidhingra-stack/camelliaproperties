import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ShieldCheck, Heart, Grid, List, SlidersHorizontal, ArrowUpDown, X, Sparkles, Filter, PhoneCall, RefreshCw, Layers, Check, Trash2, Edit3 } from 'lucide-react';
import { Property, SearchFilters } from '../types';

interface PropertiesProps {
  properties: Property[];
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  onPropertyClick: (property: Property) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  onDeleteProperty: (id: string) => void;
  onEditProperty: (property: Property) => void;
  onPostPropertyClick?: () => void;
}

export default function Properties({ 
  properties, 
  filters, 
  setFilters, 
  onPropertyClick, 
  favorites, 
  toggleFavorite, 
  onDeleteProperty, 
  onEditProperty,
  onPostPropertyClick 
}: PropertiesProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Available property types & budgets for sidebar
  const propertyTypes = ['Apartment', 'Villa', 'Independent House', 'Plot', 'Commercial Office', 'Retail Shop'];
  
  // Available Amenities to filter
  const amenitiesOptions = ["Swimming Pool", "Gym", "Club House", "24x7 Security", "Power Backup", "Covered Parking", "Intercom", "Children's Play Area"];

  // Category change helper
  const handleCategoryChange = (cat: 'buy' | 'rent' | 'commercial' | 'plots') => {
    setFilters(prev => ({
      ...prev,
      category: cat,
      // Reset some incompatible filters
      propertyType: cat === 'plots' ? ['Plot'] : cat === 'commercial' ? ['Commercial Office', 'Retail Shop'] : prev.propertyType,
      bedrooms: cat === 'commercial' || cat === 'plots' ? [] : prev.bedrooms
    }));
  };

  // Toggle Property Type
  const handlePropertyTypeToggle = (type: string) => {
    setFilters(prev => {
      const exists = prev.propertyType.includes(type);
      return {
        ...prev,
        propertyType: exists 
          ? prev.propertyType.filter(t => t !== type) 
          : [...prev.propertyType, type]
      };
    });
  };

  // Toggle BHK Configuration
  const handleBhkToggle = (bhk: number) => {
    setFilters(prev => {
      const exists = prev.bedrooms.includes(bhk);
      return {
        ...prev,
        bedrooms: exists 
          ? prev.bedrooms.filter(b => b !== bhk) 
          : [...prev.bedrooms, bhk]
      };
    });
  };

  // Toggle Amenity
  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists 
          ? prev.amenities.filter(a => a !== amenity) 
          : [...prev.amenities, amenity]
      };
    });
  };

  // Reset Filters
  const resetFilters = () => {
    setFilters({
      category: 'buy',
      query: '',
      city: 'all',
      propertyType: [],
      budgetMin: 0,
      budgetMax: 50000000,
      bedrooms: [],
      possessionStatus: [],
      amenities: [],
      sortBy: 'relevance'
    });
  };

  // Process and Filter listings dynamically
  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      // 1. Category Filter
      if (prop.category !== filters.category) return false;

      // 2. Text Search Query (locality, title, city)
      if (filters.query) {
        const queryLower = filters.query.toLowerCase();
        const matchesTitle = prop.title.toLowerCase().includes(queryLower);
        const matchesLocality = prop.location.toLowerCase().includes(queryLower);
        const matchesCity = prop.city.toLowerCase().includes(queryLower);
        const matchesDesc = prop.description.toLowerCase().includes(queryLower);
        if (!matchesTitle && !matchesLocality && !matchesCity && !matchesDesc) return false;
      }

      // 3. City Filter
      if (filters.city !== 'all' && prop.city.toLowerCase() !== filters.city.toLowerCase()) return false;

      // 4. Property Type Filter
      if (filters.propertyType.length > 0 && !filters.propertyType.includes(prop.propertyType)) return false;

      // 5. Budget Filter
      const isMaxBudget = filters.budgetMax === (filters.category === 'rent' ? 200000 : 50000000);
      if (prop.price < filters.budgetMin || (!isMaxBudget && prop.price > filters.budgetMax)) return false;

      // 6. BHK Configuration Filter (For residential only)
      if (filters.category !== 'commercial' && filters.category !== 'plots') {
        if (filters.bedrooms.length > 0) {
          if (!prop.bedrooms || !filters.bedrooms.includes(prop.bedrooms)) return false;
        }
      }

      // 7. Amenities Filter
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => prop.amenities.includes(amenity));
        if (!hasAllAmenities) return false;
      }

      return true;
    }).sort((a, b) => {
      // Sorting Logic
      if (filters.sortBy === 'priceAsc') return a.price - b.price;
      if (filters.sortBy === 'priceDesc') return b.price - a.price;
      if (filters.sortBy === 'areaDesc') return b.areaValue - a.areaValue;
      return 0; // Default/Relevance (unordered)
    });
  }, [properties, filters]);

  // Format price helper
  const formatIndianCurrency = (num: number) => {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} Lakh`;
    }
    return `₹${num.toLocaleString('en-IN')}`;
  };

  return (
    <section id="properties" className="py-24 bg-[#f4f1ed]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Tab Selector & Portal Title */}
        <div className="text-center mb-12">
          <span className="text-xs text-[#788575] uppercase tracking-[0.25em] font-semibold mb-2 block">
            Integrated Real Estate Portal
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-[#2c3d30] tracking-tight mb-8">
            Explore <span className="font-serif italic">Verified Properties</span>
          </h2>

          {/* Quick tab filters like 99acres */}
          <div className="inline-flex p-1 bg-white border border-[#d1d6cf] rounded-2xl shadow-sm max-w-full overflow-x-auto">
            {(['buy', 'rent', 'commercial', 'plots'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-6 py-3 rounded-xl text-xs uppercase tracking-wider font-bold transition-all duration-300 whitespace-nowrap ${
                  filters.category === cat
                    ? 'bg-[#2c3d30] text-[#f4f1ed] shadow-md'
                    : 'text-[#4f574d] hover:text-[#2c3d30]'
                }`}
              >
                {cat === 'buy' ? 'Buy residential' : cat === 'rent' ? 'Rent residential' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Outer Grid: Filter Sidebar + Listings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 1. Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#d1d6cf] shadow-sm sticky top-24 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-[#d1d6cf]/60">
                <h3 className="font-bold text-sm uppercase tracking-wider text-[#2c3d30] flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#788575]" /> Filter Options
                </h3>
                <button 
                  onClick={resetFilters}
                  className="text-[10px] text-amber-800 hover:text-amber-950 font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Clear All
                </button>
              </div>

              {/* Text Search Input inside sidebar */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#788575] tracking-widest mb-2">Keyword / Locality</label>
                <input 
                  type="text"
                  value={filters.query}
                  onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                  placeholder="e.g. Sector 82, Falcon"
                  className="w-full bg-[#f4f1ed] border border-[#d1d6cf] rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-[#2c3d30] outline-none text-[#2c3d30]"
                />
              </div>

              {/* City Filter Selection */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#788575] tracking-widest mb-2">City Jurisdiction</label>
                <select
                  value={filters.city}
                  onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full bg-[#f4f1ed] border border-[#d1d6cf] rounded-xl p-2.5 text-xs text-[#2c3d30] font-semibold outline-none"
                >
                  <option value="all">All Tri-City Locations</option>
                  <option value="Mohali">Mohali</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Zirakpur">Zirakpur</option>
                </select>
              </div>

              {/* BHK configuration (only if not commercial/plots) */}
              {filters.category !== 'commercial' && filters.category !== 'plots' && (
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#788575] tracking-widest mb-2">No. of Bedrooms</label>
                  <div className="grid grid-cols-4 gap-1">
                    {[1, 2, 3, 4].map((bhk) => {
                      const isSelected = filters.bedrooms.includes(bhk);
                      return (
                        <button
                          key={bhk}
                          type="button"
                          onClick={() => handleBhkToggle(bhk)}
                          className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                            isSelected 
                              ? 'bg-[#2c3d30] border-[#2c3d30] text-white' 
                              : 'bg-white border-[#d1d6cf] text-[#4f574d] hover:bg-[#e9e6e0]/30'
                          }`}
                        >
                          {bhk}B
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Property Type checklist */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#788575] tracking-widest mb-2">Property Type</label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {propertyTypes.map((type) => {
                    const isSelected = filters.propertyType.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handlePropertyTypeToggle(type)}
                        className={`w-full text-left py-2 px-3 rounded-lg text-xs font-medium border flex items-center justify-between transition-all ${
                          isSelected 
                            ? 'bg-[#2c3d30]/5 border-[#2c3d30] text-[#2c3d30]' 
                            : 'bg-white border-[#d1d6cf]/60 text-[#4f574d] hover:bg-[#e9e6e0]/20'
                        }`}
                      >
                        <span>{type}</span>
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                          isSelected ? 'bg-[#2c3d30] border-[#2c3d30] text-white' : 'border-[#d1d6cf]'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Budget Slider/Selector */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#788575] tracking-widest mb-2">
                  Budget Maximum: <span className="font-bold text-[#2c3d30]">{formatIndianCurrency(filters.budgetMax)}</span>
                </label>
                <input 
                  type="range" 
                  min={filters.category === 'rent' ? 5000 : 2000000} 
                  max={filters.category === 'rent' ? 200000 : 50000000} 
                  step={filters.category === 'rent' ? 2000 : 1000000}
                  value={filters.budgetMax}
                  onChange={(e) => setFilters(prev => ({ ...prev, budgetMax: Number(e.target.value) }))}
                  className="w-full accent-[#2c3d30] h-1.5 bg-[#e9e6e0] rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-[#788575] mt-1 font-semibold">
                  <span>{filters.category === 'rent' ? '₹5K' : '₹20 Lakh'}</span>
                  <span>{filters.category === 'rent' ? '₹2 Lakh' : '₹5 Crore+'}</span>
                </div>
              </div>

              {/* Amenities checkboxes */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#788575] tracking-widest mb-2">Amenities</label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {amenitiesOptions.map((amenity) => {
                    const isSelected = filters.amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => handleAmenityToggle(amenity)}
                        className={`w-full text-left py-2 px-3 rounded-lg text-xs font-medium border flex items-center justify-between transition-all ${
                          isSelected 
                            ? 'bg-[#2c3d30]/5 border-[#2c3d30] text-[#2c3d30]' 
                            : 'bg-white border-[#d1d6cf]/60 text-[#4f574d] hover:bg-[#e9e6e0]/20'
                        }`}
                      >
                        <span>{amenity}</span>
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                          isSelected ? 'bg-[#2c3d30] border-[#2c3d30] text-white' : 'border-[#d1d6cf]'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* 2. Listings Column */}
          <div className="col-span-1 lg:col-span-9 space-y-6">
            
            {/* Control Bar: Listings Counter, View mode, Sort by */}
            <div className="bg-white rounded-2xl px-6 py-4 border border-[#d1d6cf] shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-xs text-[#4f574d] font-semibold">
                Showing <span className="text-[#2c3d30] font-bold text-sm">{filteredProperties.length}</span> verified properties matches
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                {/* Mobile Filter Trigger */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-4 py-2 border border-[#d1d6cf] rounded-xl text-xs font-semibold text-[#2c3d30] hover:bg-[#e9e6e0]/30 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-[#788575]" />
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                    className="bg-[#f4f1ed] border border-[#d1d6cf] rounded-xl px-3 py-2 text-xs text-[#2c3d30] font-semibold outline-none"
                  >
                    <option value="relevance">Sort: Recommended</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                    <option value="areaDesc">Area: Large to Small</option>
                  </select>
                </div>

                {/* Grid / List switcher */}
                <div className="hidden sm:flex bg-[#f4f1ed] p-1 border border-[#d1d6cf] rounded-xl">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#2c3d30] text-white' : 'text-[#4f574d] hover:bg-[#d1d6cf]/30'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#2c3d30] text-white' : 'text-[#4f574d] hover:bg-[#d1d6cf]/30'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Properties Grid/List Display */}
            <AnimatePresence mode="popLayout">
              {properties.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-white rounded-3xl p-16 text-center border border-[#d1d6cf] shadow-sm space-y-5"
                >
                  <div className="w-20 h-20 bg-[#2c3d30]/5 text-[#2c3d30] rounded-full flex items-center justify-center mx-auto text-4xl">
                    🏡
                  </div>
                  <h4 className="text-2xl font-light text-[#2c3d30]">Your Property Inventory is Empty</h4>
                  <p className="text-sm text-[#788575] max-w-md mx-auto leading-relaxed">
                    You have cleared all default demo listings. You can now build and display your custom real estate portfolio manually.
                  </p>
                  {onPostPropertyClick && (
                    <button 
                      onClick={onPostPropertyClick}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-[#2c3d30] hover:bg-[#3d5442] text-white text-xs uppercase tracking-widest font-bold rounded-full shadow-md transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      Post Your First Property
                    </button>
                  )}
                </motion.div>
              ) : filteredProperties.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-white rounded-3xl p-12 text-center border border-[#d1d6cf] shadow-sm space-y-4"
                >
                  <div className="w-16 h-16 bg-[#2c3d30]/5 text-[#2c3d30] rounded-full flex items-center justify-center mx-auto text-3xl">
                    🔍
                  </div>
                  <h4 className="text-xl font-light text-[#2c3d30]">No properties match your criteria</h4>
                  <p className="text-sm text-[#788575] max-w-md mx-auto leading-relaxed">
                    Try softening your filters, adjusting the budget limit slider, or searching for other localities in Chandigarh, Mohali, or Zirakpur.
                  </p>
                  <button 
                    onClick={resetFilters}
                    className="px-6 py-2.5 bg-[#2c3d30] hover:bg-[#3d5442] text-white text-xs uppercase tracking-wider font-bold rounded-full shadow-sm transition-colors"
                  >
                    Reset All Filters
                  </button>
                </motion.div>
              ) : (
                <div className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                    : "space-y-4"
                }>
                  {filteredProperties.map((property, idx) => {
                    const isFav = favorites.includes(property.id);
                    return (
                      <motion.div
                        key={property.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        onClick={() => onPropertyClick(property)}
                        className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group border border-[#d1d6cf] cursor-pointer ${
                          viewMode === 'list' ? 'flex flex-col md:flex-row h-auto md:h-64' : 'flex flex-col'
                        }`}
                      >
                        {/* Property Media block */}
                        <div className={`relative overflow-hidden bg-neutral-100 ${
                          viewMode === 'list' ? 'w-full md:w-1/3 h-56 md:h-full flex-shrink-0' : 'h-52 w-full'
                        }`}>
                          <img 
                            src={property.image} 
                            alt={property.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-750"
                            referrerPolicy="no-referrer"
                          />
                          
                          {/* Badges Overlay */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                            <span className="bg-white/95 backdrop-blur text-[#2c3d30] text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                              {property.propertyType}
                            </span>
                            {property.isVerified && (
                              <span className="bg-emerald-600/95 text-white text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-0.5 shadow-sm">
                                <ShieldCheck className="w-3 h-3" /> Verified
                              </span>
                            )}
                          </div>

                          {/* Favorite + Edit + Delete buttons */}
                          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(property.id);
                              }}
                              className={`p-2 rounded-full backdrop-blur-md shadow-md transition-all ${
                                isFav ? 'bg-red-500 text-white' : 'bg-white/90 text-[#2c3d30] hover:bg-white'
                              }`}
                              title="Add to Wishlist"
                            >
                              <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                            </button>

                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditProperty(property);
                              }}
                              className="p-2 rounded-full bg-white/90 text-[#2c3d30] hover:bg-[#2c3d30] hover:text-white backdrop-blur-md shadow-md transition-all"
                              title="Edit Property"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const confirmed = window.confirm(`Delete "${property.title}"? This cannot be undone.`);
                                if (confirmed) {
                                  onDeleteProperty(property.id);
                                }
                              }}
                              className="p-2 rounded-full bg-white/90 text-red-600 hover:bg-red-600 hover:text-white backdrop-blur-md shadow-md transition-all"
                              title="Delete Property"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {/* Quick indicators */}
                          <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur text-white text-[10px] px-2 py-0.5 rounded-md">
                            {property.possessionStatus}
                          </div>
                        </div>

                        {/* Property Details block */}
                        <div className="p-5 flex flex-col justify-between flex-grow">
                          <div className="space-y-1.5">
                            {/* Location & City */}
                            <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#788575]">
                              <MapPin className="w-3 h-3 text-[#2c3d30] flex-shrink-0" />
                              <span>{property.location}, {property.city}</span>
                            </div>

                            {/* Title */}
                            <h3 className="text-base font-bold text-[#2c3d30] line-clamp-2 leading-snug group-hover:text-[#3a4f40] transition-colors">
                              {property.title}
                            </h3>

                            {/* Amenities Tag Line (Short list) */}
                            <div className="flex flex-wrap gap-1 pt-1.5">
                              {property.amenities.slice(0, 3).map((a, i) => (
                                <span key={i} className="text-[9px] bg-[#f4f1ed] border border-[#d1d6cf]/50 text-[#4f574d] px-2 py-0.5 rounded-md font-medium">
                                  {a}
                                </span>
                              ))}
                              {property.amenities.length > 3 && (
                                <span className="text-[9px] text-[#788575] font-semibold self-center">+{property.amenities.length - 3} more</span>
                              )}
                            </div>
                          </div>

                          {/* Pricing and Area block */}
                          <div className="pt-4 border-t border-[#d1d6cf]/50 mt-4 flex items-center justify-between gap-2">
                            <div>
                              <p className="text-[10px] text-[#788575] uppercase tracking-wider font-semibold">Super Area</p>
                              <p className="font-bold text-xs text-[#2c3d30]">{property.area}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-[#788575] uppercase tracking-wider font-semibold">Price</p>
                              <p className="text-lg font-bold text-[#2c3d30]">{property.priceFormatted}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 3. Mobile Filters Drawer (Overlay) */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />

            {/* Sidebar drawer panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute inset-y-0 right-0 max-w-xs w-full bg-[#f4f1ed] text-[#2c3d30] shadow-2xl p-6 overflow-y-auto space-y-6 border-l border-[#d1d6cf]"
            >
              <div className="flex justify-between items-center pb-4 border-b border-[#d1d6cf]">
                <h3 className="font-bold text-base uppercase tracking-wider text-[#2c3d30] flex items-center gap-1.5">
                  <Filter className="w-5 h-5 text-[#788575]" /> Filter Listings
                </h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1 rounded-full hover:bg-neutral-200 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Text Search Input */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#788575] tracking-widest mb-2">Search Locality/Project</label>
                <input 
                  type="text"
                  value={filters.query}
                  onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                  placeholder="e.g. Sector 82"
                  className="w-full bg-white border border-[#d1d6cf] rounded-xl px-4 py-2.5 text-xs outline-none text-[#2c3d30]"
                />
              </div>

              {/* City select */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#788575] tracking-widest mb-2">City Jurisdiction</label>
                <select
                  value={filters.city}
                  onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full bg-white border border-[#d1d6cf] rounded-xl p-2.5 text-xs outline-none"
                >
                  <option value="all">All Tri-City</option>
                  <option value="Mohali">Mohali</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Zirakpur">Zirakpur</option>
                </select>
              </div>

              {/* BHK configuration */}
              {filters.category !== 'commercial' && filters.category !== 'plots' && (
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#788575] tracking-widest mb-2">Configuration</label>
                  <div className="grid grid-cols-4 gap-1">
                    {[1, 2, 3, 4].map((bhk) => {
                      const isSelected = filters.bedrooms.includes(bhk);
                      return (
                        <button
                          key={bhk}
                          type="button"
                          onClick={() => handleBhkToggle(bhk)}
                          className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                            isSelected 
                              ? 'bg-[#2c3d30] border-[#2c3d30] text-white' 
                              : 'bg-white border-[#d1d6cf] text-[#4f574d]'
                          }`}
                        >
                          {bhk}B
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Property Type checklists */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#788575] tracking-widest mb-2">Property Type</label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {propertyTypes.map((type) => {
                    const isSelected = filters.propertyType.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handlePropertyTypeToggle(type)}
                        className={`w-full text-left py-2 px-3 rounded-lg text-xs font-medium border flex items-center justify-between transition-all ${
                          isSelected ? 'bg-[#2c3d30] border-[#2c3d30] text-white' : 'bg-white border-[#d1d6cf]/60 text-[#4f574d]'
                        }`}
                      >
                        <span>{type}</span>
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                          isSelected ? 'bg-[#2c3d30] text-white border-white' : 'border-[#d1d6cf]'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Budget slider */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#788575] tracking-widest mb-2">
                  Budget Maximum: <span className="font-bold text-[#2c3d30]">{formatIndianCurrency(filters.budgetMax)}</span>
                </label>
                <input 
                  type="range" 
                  min={filters.category === 'rent' ? 5000 : 2000000} 
                  max={filters.category === 'rent' ? 200000 : 50000000} 
                  step={filters.category === 'rent' ? 2000 : 1000000}
                  value={filters.budgetMax}
                  onChange={(e) => setFilters(prev => ({ ...prev, budgetMax: Number(e.target.value) }))}
                  className="w-full accent-[#2c3d30] h-1.5 bg-[#e9e6e0] rounded-lg cursor-pointer"
                />
              </div>

              {/* Reset CTA */}
              <button
                type="button"
                onClick={() => {
                  resetFilters();
                  setMobileFiltersOpen(false);
                }}
                className="w-full py-3 border border-[#2c3d30] text-[#2c3d30] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-100 transition-colors"
              >
                Reset All Filters
              </button>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 bg-[#2c3d30] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md"
              >
                Apply Filters ({filteredProperties.length})
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}