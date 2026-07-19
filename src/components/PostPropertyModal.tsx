import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building, DollarSign, MapPin, List, Eye, Sparkles, Check, ChevronRight, ChevronLeft, ShieldAlert } from 'lucide-react';
import { Property } from '../types';

interface PostPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPropertyAdd: (property: Property) => void;
  propertyToEdit?: Property | null;
  onPropertyUpdate?: (property: Property) => void;
}

export default function PostPropertyModal({ isOpen, onClose, onPropertyAdd, propertyToEdit, onPropertyUpdate }: PostPropertyModalProps) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'buy' | 'rent' | 'commercial' | 'plots'>('buy');
  const [propertyType, setPropertyType] = useState<'Apartment' | 'Villa' | 'Independent House' | 'Plot' | 'Commercial Office' | 'Retail Shop'>('Apartment');
  const [city, setCity] = useState('Mohali');
  const [location, setLocation] = useState('');
  const [priceInLakhs, setPriceInLakhs] = useState(''); // input in lakhs/crores
  const [area, setArea] = useState('');
  const [areaUnit, setAreaUnit] = useState('sq. ft.');
  const [bedrooms, setBedrooms] = useState<number | 'N/A'>(3);
  const [bathrooms, setBathrooms] = useState<number | 'N/A'>(3);
  const [possessionStatus, setPossessionStatus] = useState<'Ready to Move' | 'Under Construction'>('Ready to Move');
  const [description, setDescription] = useState('');
  const [brokerage, setBrokerage] = useState<'Zero Brokerage' | 'Standard Brokerage'>('Zero Brokerage');
  const [facing, setFacing] = useState('East');
  const [floor, setFloor] = useState('2nd Floor');
  const [age, setAge] = useState('Brand New');
  
  // Amenities list
  const availableAmenities = [
    "Swimming Pool", "Gym", "Club House", "24x7 Security", 
    "Power Backup", "Covered Parking", "Intercom", "Children's Play Area"
  ];
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(["24x7 Security", "Power Backup", "Covered Parking"]);

  const [agentName, setAgentName] = useState('');
  const [agentPhone, setAgentPhone] = useState('');
  const [postedBy, setPostedBy] = useState<'Owner' | 'Agent' | 'Builder'>('Owner');

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  useEffect(() => {
    if (propertyToEdit) {
      setTitle(propertyToEdit.title);
      setCategory(propertyToEdit.category);
      setPropertyType(propertyToEdit.propertyType);
      setCity(propertyToEdit.city);
      setLocation(propertyToEdit.location);
      
      if (propertyToEdit.category === 'rent') {
        setPriceInLakhs(propertyToEdit.price.toString());
      } else {
        setPriceInLakhs((propertyToEdit.price / 100000).toString());
      }
      
      setArea(propertyToEdit.areaValue ? propertyToEdit.areaValue.toString() : '');
      
      if (propertyToEdit.area.includes('Sq. Yards')) {
        setAreaUnit('Sq. Yards');
      } else if (propertyToEdit.area.includes('Marla')) {
        setAreaUnit('Marla');
      } else {
        setAreaUnit('sq. ft.');
      }
      
      setBedrooms(propertyToEdit.bedrooms || 3);
      setBathrooms(propertyToEdit.bathrooms || 3);
      setPossessionStatus(propertyToEdit.possessionStatus);
      setDescription(propertyToEdit.description);
      setBrokerage(propertyToEdit.brokerage);
      setFacing(propertyToEdit.facing || 'East');
      setFloor(propertyToEdit.floor || '2nd Floor');
      setAge(propertyToEdit.age || 'Brand New');
      setSelectedAmenities(propertyToEdit.amenities);
      setAgentName(propertyToEdit.agentName);
      setAgentPhone(propertyToEdit.agentPhone);
      setPostedBy(propertyToEdit.postedBy);
      setUploadedImages(propertyToEdit.images || [propertyToEdit.image]);
    } else {
      setTitle('');
      setCategory('buy');
      setPropertyType('Apartment');
      setCity('Mohali');
      setLocation('');
      setPriceInLakhs('');
      setArea('');
      setAreaUnit('sq. ft.');
      setBedrooms(3);
      setBathrooms(3);
      setPossessionStatus('Ready to Move');
      setDescription('');
      setBrokerage('Zero Brokerage');
      setFacing('East');
      setFloor('2nd Floor');
      setAge('Brand New');
      setSelectedAmenities(["24x7 Security", "Power Backup", "Covered Parking"]);
      setAgentName('');
      setAgentPhone('');
      setPostedBy('Owner');
      setUploadedImages([]);
    }
  }, [propertyToEdit, isOpen]);

  // Handle Amenity Toggle
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity) 
        : [...prev, amenity]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Compress images before converting to base64
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max dimension 800px to keep base64 string size well under 1MB for Firestore
          const MAX_SIZE = 800;
          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with 0.6 quality
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          setUploadedImages(prev => [...prev, dataUrl]);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove: number) => {
    setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !location || !priceInLakhs || !area || !agentName || !agentPhone) {
      alert("Please fill in all required fields.");
      return;
    }

    // Convert price to raw Rupees
    const rawPrice = category === 'rent' ? Number(priceInLakhs) : Number(priceInLakhs) * 100000;
    
    // Formatting the price string
    let formattedPrice = '';
    const numericPrice = Number(priceInLakhs);
    if (category === 'rent') {
      formattedPrice = `₹${numericPrice.toLocaleString('en-IN')} / month`;
    } else {
      if (numericPrice >= 100) {
        formattedPrice = `₹${(numericPrice / 100).toFixed(2)} Cr`;
      } else {
        formattedPrice = `₹${numericPrice} Lakh`;
      }
    }

    // Predefined premium real estate placeholder images based on category/type
    let placeholderImage = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
    if (propertyType === 'Commercial Office' || propertyType === 'Retail Shop') {
      placeholderImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
    } else if (propertyType === 'Plot') {
      placeholderImage = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
    } else if (propertyType === 'Villa') {
      placeholderImage = 'https://images.unsplash.com/photo-1613490900233-141c5560d75d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
    } else if (category === 'rent') {
      placeholderImage = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
    }

    const newProperty: Property = {
      id: propertyToEdit ? propertyToEdit.id : `custom-prop-${Date.now()}`,
      title,
      description: description || `Premium ${propertyType} listing located at ${location}, ${city}. Carefully structured layout with exquisite natural lighting, high security, and high quality finishing. Contact agent for custom site visits.`,
      price: rawPrice,
      priceFormatted: formattedPrice,
      location,
      city,
      area: `${Number(area).toLocaleString('en-IN')} ${areaUnit}`,
      areaValue: Number(area),
      bedrooms: bedrooms === 'N/A' ? null : bedrooms,
      bathrooms: bathrooms === 'N/A' ? null : bathrooms,
      propertyType,
      category,
      image: uploadedImages.length > 0 ? uploadedImages[0] : placeholderImage,
      images: uploadedImages.length > 0 ? uploadedImages : [placeholderImage],
      isVerified: true, // Auto-verified for immediate user feedback
      isReraApproved: category === 'buy' && propertyType !== 'Plot',
      possessionStatus,
      brokerage,
      amenities: selectedAmenities,
      facing,
      floor,
      age,
      postedBy,
      postedDate: propertyToEdit ? propertyToEdit.postedDate : "Just now",
      agentName,
      agentPhone,
      agentImage: propertyToEdit ? propertyToEdit.agentImage : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    };

    if (propertyToEdit && onPropertyUpdate) {
      onPropertyUpdate(newProperty);
    } else {
      onPropertyAdd(newProperty);
    }
    setSuccess(true);
    
    setTimeout(() => {
      onClose();
      // Reset form
      setSuccess(false);
      setStep(1);
      setTitle('');
      setLocation('');
      setPriceInLakhs('');
      setArea('');
      setDescription('');
      setAgentName('');
      setAgentPhone('');
      setUploadedImages([]);
    }, 3000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto" id="post-property-root">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Wrapper */}
        <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative w-full max-w-2xl rounded-3xl bg-[#f4f1ed] text-[#2c3d30] shadow-2xl overflow-hidden border border-[#d1d6cf]"
          >
            {/* Header */}
            <div className="p-6 bg-[#2c3d30] text-[#f4f1ed] flex justify-between items-center">
              <div>
                <h2 className="text-xl font-light tracking-wide flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                  {propertyToEdit ? "Edit Your Property" : "Post Your Property"}{" "}
                  <span className="text-amber-400 font-bold uppercase text-xs bg-white/10 px-2 py-0.5 rounded-md">
                    {propertyToEdit ? "EDIT MODE" : "FREE"}
                  </span>
                </h2>
                <p className="text-[10px] text-[#a5b5a2] uppercase tracking-widest mt-1">
                  {propertyToEdit
                    ? "Modify listing details and specifications for your property"
                    : "Join 5 Lakh+ active owners & brokers listing on our platform"}
                </p>
              </div>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Progress Bar */}
            {!success && (
              <div className="bg-white border-b border-[#d1d6cf] px-6 py-4 flex justify-between items-center text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-[#2c3d30] text-[#f4f1ed]' : 'bg-[#e9e6e0] text-[#788575]'}`}>1</span>
                  <span className={step >= 1 ? 'text-[#2c3d30]' : 'text-[#788575]'}>Category & Locality</span>
                </div>
                <div className="h-0.5 w-10 bg-[#e9e6e0] flex-grow mx-4 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-[#2c3d30] text-[#f4f1ed]' : 'bg-[#e9e6e0] text-[#788575]'}`}>2</span>
                  <span className={step >= 2 ? 'text-[#2c3d30]' : 'text-[#788575]'}>Specifications</span>
                </div>
                <div className="h-0.5 w-10 bg-[#e9e6e0] flex-grow mx-4 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-[#2c3d30] text-[#f4f1ed]' : 'bg-[#e9e6e0] text-[#788575]'}`}>3</span>
                  <span className={step >= 3 ? 'text-[#2c3d30]' : 'text-[#788575]'}>Seller & Features</span>
                </div>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 sm:p-8">
              {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 space-y-4"
                >
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-sm">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-light text-[#2c3d30]">
                    {propertyToEdit ? "Property Updated Successfully!" : "Property Posted Successfully!"}
                  </h3>
                  <p className="text-sm text-[#4f574d] max-w-md mx-auto leading-relaxed">
                    {propertyToEdit
                      ? "Your property changes have been successfully saved. All visitors will see the updated information immediately."
                      : "Congratulations! Your listing is now verified and active in the search directory. Users can immediately view details, calculate EMIs, and contact you."}
                  </p>
                  <div className="inline-block py-1.5 px-4 bg-[#2c3d30] text-white rounded-full text-[10px] tracking-wider uppercase font-bold">
                    {propertyToEdit ? "Saving updates..." : "Redirecting to search index..."}
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* STEP 1: Basic Details, Category & Locality */}
                  {step === 1 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-5"
                    >
                      {/* Property Title */}
                      <div>
                        <label className="block text-xs font-bold text-[#4f574d] uppercase tracking-wider mb-2">Property Listing Title *</label>
                        <input 
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Spacious 3 BHK Builder Floor with modular kitchen"
                          className="w-full bg-white border border-[#d1d6cf] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#2c3d30] focus:border-[#2c3d30] outline-none text-[#2c3d30]"
                        />
                      </div>

                      {/* Category Option Selector */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(['buy', 'rent', 'commercial', 'plots'] as const).map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            className={`py-3 px-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                              category === cat 
                                ? 'bg-[#2c3d30] border-[#2c3d30] text-white shadow-sm' 
                                : 'bg-white border-[#d1d6cf] text-[#4f574d] hover:bg-[#e9e6e0]/30'
                            }`}
                          >
                            {cat === 'buy' ? 'Sell' : cat === 'rent' ? 'Rent out' : cat}
                          </button>
                        ))}
                      </div>

                      {/* Property Type Dropdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#4f574d] uppercase tracking-wider mb-2">Property Type *</label>
                          <select 
                            value={propertyType}
                            onChange={(e) => setPropertyType(e.target.value as any)}
                            className="w-full bg-white border border-[#d1d6cf] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#2c3d30] focus:border-[#2c3d30] outline-none text-[#2c3d30] h-[46px]"
                          >
                            <option value="Apartment">Apartment / Flat</option>
                            <option value="Villa">Independent Villa</option>
                            <option value="Independent House">Builder Floor / House</option>
                            <option value="Plot">Residential Plot</option>
                            <option value="Commercial Office">Commercial Office</option>
                            <option value="Retail Shop">Retail Shop</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#4f574d] uppercase tracking-wider mb-2">City *</label>
                          <select 
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full bg-white border border-[#d1d6cf] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#2c3d30] focus:border-[#2c3d30] outline-none text-[#2c3d30] h-[46px]"
                          >
                            <option value="Mohali">Mohali</option>
                            <option value="Chandigarh">Chandigarh</option>
                            <option value="Zirakpur">Zirakpur</option>
                            <option value="Panchkula">Panchkula</option>
                          </select>
                        </div>
                      </div>

                      {/* Locality Search Input */}
                      <div>
                        <label className="block text-xs font-bold text-[#4f574d] uppercase tracking-wider mb-2">Locality / Sector Name *</label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-3.5 text-[#788575] w-4 h-4" />
                          <input 
                            type="text"
                            required
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g. Aerocity, Sector 82, Sector 115"
                            className="w-full bg-white border border-[#d1d6cf] rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-1 focus:ring-[#2c3d30] focus:border-[#2c3d30] outline-none text-[#2c3d30]"
                          />
                        </div>
                      </div>

                      {/* Footer CTA */}
                      <div className="flex justify-end pt-4">
                        <button
                          type="button"
                          disabled={!title || !location}
                          onClick={nextStep}
                          className="px-6 py-3 bg-[#2c3d30] hover:bg-[#3d5442] text-white text-xs uppercase tracking-widest font-semibold rounded-full flex items-center gap-1.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Continue <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: Pricing, Area, Configuration */}
                  {step === 2 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-5"
                    >
                      {/* Price & Area Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#4f574d] uppercase tracking-wider mb-2">
                            {category === 'rent' ? 'Monthly Rent (in Rupees) *' : 'Expected Price (in Lakhs INR) *'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-3.5 text-xs font-bold text-[#788575]">₹</span>
                            <input 
                              type="number"
                              required
                              value={priceInLakhs}
                              onChange={(e) => setPriceInLakhs(e.target.value)}
                              placeholder={category === 'rent' ? 'e.g. 18000' : 'e.g. 85 (for 85 Lakhs)'}
                              className="w-full bg-white border border-[#d1d6cf] rounded-xl pl-8 pr-16 py-3 text-sm focus:ring-1 focus:ring-[#2c3d30] focus:border-[#2c3d30] outline-none text-[#2c3d30]"
                            />
                            <span className="absolute right-3.5 top-3.5 text-[10px] font-bold text-[#788575] uppercase tracking-wider">
                              {category === 'rent' ? 'Month' : 'Lakhs'}
                            </span>
                          </div>
                          {category !== 'rent' && priceInLakhs && (
                            <p className="text-[10px] text-amber-800 font-semibold mt-1">
                              Equivalent to: {Number(priceInLakhs) >= 100 ? `₹${(Number(priceInLakhs) / 100).toFixed(2)} Crore` : `₹${priceInLakhs} Lakhs`}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#4f574d] uppercase tracking-wider mb-2">Super Built-up Area *</label>
                          <div className="flex gap-2">
                            <input 
                              type="number"
                              required
                              value={area}
                              onChange={(e) => setArea(e.target.value)}
                              placeholder="e.g. 1800"
                              className="w-full bg-white border border-[#d1d6cf] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#2c3d30] focus:border-[#2c3d30] outline-none text-[#2c3d30]"
                            />
                            <select
                              value={areaUnit}
                              onChange={(e) => setAreaUnit(e.target.value)}
                              className="bg-white border border-[#d1d6cf] rounded-xl px-3 text-xs text-[#2c3d30] font-semibold"
                            >
                              <option value="sq. ft.">Sq. Ft.</option>
                              <option value="Sq. Yards">Sq. Yds</option>
                              <option value="Marla">Marla</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* BHK & Bathrooms Row */}
                      {propertyType !== 'Plot' && propertyType !== 'Commercial Office' && propertyType !== 'Retail Shop' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#4f574d] uppercase tracking-wider mb-2">BHK Configuration *</label>
                            <div className="flex gap-1 bg-white p-1 rounded-xl border border-[#d1d6cf]">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <button
                                  key={num}
                                  type="button"
                                  onClick={() => setBedrooms(num)}
                                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                                    bedrooms === num ? 'bg-[#2c3d30] text-white shadow-sm' : 'text-[#4f574d] hover:bg-[#e9e6e0]/30'
                                  }`}
                                >
                                  {num} BHK
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#4f574d] uppercase tracking-wider mb-2">Bathrooms *</label>
                            <div className="flex gap-1 bg-white p-1 rounded-xl border border-[#d1d6cf]">
                              {[1, 2, 3, 4].map((num) => (
                                <button
                                  key={num}
                                  type="button"
                                  onClick={() => setBathrooms(num)}
                                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                                    bathrooms === num ? 'bg-[#2c3d30] text-white shadow-sm' : 'text-[#4f574d] hover:bg-[#e9e6e0]/30'
                                  }`}
                                >
                                  {num}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Additional Details Grid */}
                      <div className="bg-white/40 p-4 rounded-2xl border border-[#d1d6cf] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="block font-bold text-[#4f574d] mb-1.5 uppercase tracking-wide">Facing</label>
                          <select 
                            value={facing}
                            onChange={(e) => setFacing(e.target.value)}
                            className="w-full bg-white border border-[#d1d6cf] rounded-lg p-2 outline-none text-[#2c3d30]"
                          >
                            <option value="East">East</option>
                            <option value="North">North</option>
                            <option value="North-East">North-East</option>
                            <option value="West">West</option>
                            <option value="South">South</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-bold text-[#4f574d] mb-1.5 uppercase tracking-wide">Floor</label>
                          <input 
                            type="text"
                            value={floor}
                            onChange={(e) => setFloor(e.target.value)}
                            placeholder="e.g. 2nd of 4 Floors"
                            className="w-full bg-white border border-[#d1d6cf] rounded-lg p-2 outline-none text-[#2c3d30]"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-[#4f574d] mb-1.5 uppercase tracking-wide">Age of Construction</label>
                          <select 
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full bg-white border border-[#d1d6cf] rounded-lg p-2 outline-none text-[#2c3d30]"
                          >
                            <option value="Brand New">Brand New</option>
                            <option value="0-1 Years">0-1 Years</option>
                            <option value="2-3 Years">2-3 Years</option>
                            <option value="5+ Years">5+ Years</option>
                          </select>
                        </div>
                      </div>

                      {/* Possession status & Brokerage */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#4f574d] uppercase tracking-wider mb-2">Possession Status</label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setPossessionStatus('Ready to Move')}
                              className={`flex-1 py-3 px-2 border rounded-xl text-xs font-semibold capitalize transition-all ${
                                possessionStatus === 'Ready to Move' 
                                  ? 'bg-[#2c3d30] border-[#2c3d30] text-white shadow-sm' 
                                  : 'bg-white border-[#d1d6cf] text-[#4f574d] hover:bg-[#e9e6e0]/30'
                              }`}
                            >
                              Ready to Move
                            </button>
                            <button
                              type="button"
                              onClick={() => setPossessionStatus('Under Construction')}
                              className={`flex-1 py-3 px-2 border rounded-xl text-xs font-semibold capitalize transition-all ${
                                possessionStatus === 'Under Construction' 
                                  ? 'bg-[#2c3d30] border-[#2c3d30] text-white shadow-sm' 
                                  : 'bg-white border-[#d1d6cf] text-[#4f574d] hover:bg-[#e9e6e0]/30'
                              }`}
                            >
                              Under Construction
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#4f574d] uppercase tracking-wider mb-2">Brokerage Offer</label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setBrokerage('Zero Brokerage')}
                              className={`flex-1 py-3 px-2 border rounded-xl text-xs font-semibold capitalize transition-all ${
                                brokerage === 'Zero Brokerage' 
                                  ? 'bg-[#2c3d30] border-[#2c3d30] text-white shadow-sm' 
                                  : 'bg-white border-[#d1d6cf] text-[#4f574d] hover:bg-[#e9e6e0]/30'
                              }`}
                            >
                              Zero Brokerage (0%)
                            </button>
                            <button
                              type="button"
                              onClick={() => setBrokerage('Standard Brokerage')}
                              className={`flex-1 py-3 px-2 border rounded-xl text-xs font-semibold capitalize transition-all ${
                                brokerage === 'Standard Brokerage' 
                                  ? 'bg-[#2c3d30] border-[#2c3d30] text-white shadow-sm' 
                                  : 'bg-white border-[#d1d6cf] text-[#4f574d] hover:bg-[#e9e6e0]/30'
                              }`}
                            >
                              Standard Commission
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Stepper controls */}
                      <div className="flex justify-between pt-4 border-t border-[#d1d6cf]/60">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="px-5 py-3 text-xs uppercase tracking-widest font-semibold text-[#2c3d30] border border-[#d1d6cf] rounded-full flex items-center gap-1 hover:bg-[#e9e6e0]/30 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" /> Back
                        </button>
                        <button
                          type="button"
                          disabled={!priceInLakhs || !area}
                          onClick={nextStep}
                          className="px-6 py-3 bg-[#2c3d30] hover:bg-[#3d5442] text-white text-xs uppercase tracking-widest font-semibold rounded-full flex items-center gap-1.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Continue <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: Amenities, Description, Contact info */}
                  {step === 3 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-5"
                    >
                      {/* Amenities checkboxes */}
                      <div>
                        <label className="block text-xs font-bold text-[#4f574d] uppercase tracking-wider mb-2">Available Amenities & Facilities</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {availableAmenities.map((amenity) => {
                            const isSelected = selectedAmenities.includes(amenity);
                            return (
                              <button
                                key={amenity}
                                type="button"
                                onClick={() => toggleAmenity(amenity)}
                                className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-[11px] font-semibold transition-all ${
                                  isSelected 
                                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm' 
                                    : 'bg-white border-[#d1d6cf] text-[#4f574d] hover:bg-[#e9e6e0]/20'
                                }`}
                              >
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                                  isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-[#d1d6cf]'
                                }`}>
                                  {isSelected && <Check className="w-2.5 h-2.5" />}
                                </div>
                                {amenity}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Property Description */}
                      <div>
                        <label className="block text-xs font-bold text-[#4f574d] uppercase tracking-wider mb-2">Property Description (Optional)</label>
                        <textarea 
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Provide elegant details about flooring, ventilation, society amenities, road width, nearby landmarks..."
                          className="w-full bg-white border border-[#d1d6cf] rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-[#2c3d30] focus:border-[#2c3d30] outline-none text-[#2c3d30] resize-none"
                        />
                      </div>

                      {/* Image Upload */}
                      <div>
                        <label className="block text-xs font-bold text-[#4f574d] uppercase tracking-wider mb-2">Property Images</label>
                        
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {uploadedImages.map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-[#d1d6cf]">
                              <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          
                          <label className="aspect-square rounded-xl border-2 border-dashed border-[#d1d6cf] flex flex-col items-center justify-center text-[#788575] cursor-pointer hover:bg-white hover:border-[#2c3d30] transition-colors">
                            <span className="text-2xl mb-1">+</span>
                            <span className="text-[10px] font-semibold uppercase">Add Photo</span>
                            <input 
                              type="file" 
                              multiple 
                              accept="image/*" 
                              onChange={handleImageUpload} 
                              className="hidden" 
                            />
                          </label>
                        </div>
                      </div>

                      {/* Contact & Advertiser block */}
                      <div className="bg-white p-5 rounded-2xl border border-[#d1d6cf] space-y-4">
                        <p className="text-[10px] uppercase text-[#788575] tracking-widest font-bold border-b border-[#d1d6cf]/50 pb-2">Advertiser Information</p>
                        
                        <div className="flex gap-2">
                          {([ 'Owner', 'Agent', 'Builder'] as const).map((by) => (
                            <button
                              key={by}
                              type="button"
                              onClick={() => setPostedBy(by)}
                              className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                                postedBy === by 
                                  ? 'bg-[#2c3d30] border-[#2c3d30] text-white shadow-sm' 
                                  : 'bg-[#f4f1ed] border-[#d1d6cf] text-[#4f574d]'
                              }`}
                            >
                              I'm the {by}
                            </button>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-[#4f574d] uppercase mb-1">Your Full Name *</label>
                            <input 
                              type="text"
                              required
                              value={agentName}
                              onChange={(e) => setAgentName(e.target.value)}
                              placeholder="Name"
                              className="w-full bg-[#f4f1ed] border border-[#d1d6cf] rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-[#2c3d30] outline-none text-[#2c3d30]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-[#4f574d] uppercase mb-1">Active Contact Number *</label>
                            <input 
                              type="tel"
                              required
                              value={agentPhone}
                              onChange={(e) => setAgentPhone(e.target.value)}
                              placeholder="Mobile"
                              className="w-full bg-[#f4f1ed] border border-[#d1d6cf] rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-[#2c3d30] outline-none text-[#2c3d30]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Regulatory/RERA warning */}
                      <div className="flex items-start gap-2 text-[10px] text-amber-800 bg-amber-50 p-3.5 rounded-xl border border-amber-200">
                        <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Verification Notice:</span> Under state housing guidelines, every listing requires verified credentials. Your listing will go live immediately under automated verification, and is subject to local GMADA / Mohali RERA audits.
                        </div>
                      </div>

                      {/* Stepper controls */}
                      <div className="flex justify-between pt-4 border-t border-[#d1d6cf]/60">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="px-5 py-3 text-xs uppercase tracking-widest font-semibold text-[#2c3d30] border border-[#d1d6cf] rounded-full flex items-center gap-1 hover:bg-[#e9e6e0]/30 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" /> Back
                        </button>
                        <button
                          type="submit"
                          disabled={!agentName || !agentPhone}
                          className="px-8 py-3 bg-[#2c3d30] hover:bg-[#3d5442] text-white text-xs uppercase tracking-widest font-semibold rounded-full flex items-center gap-1.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Publish Listing FREE <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
