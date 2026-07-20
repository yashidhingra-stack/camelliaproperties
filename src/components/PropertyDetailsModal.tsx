import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Bed, Bath, Compass, Calendar, User, Phone, Check, ShieldCheck, Calculator, Mail, MessageSquare, Landmark, ArrowRight, Star, Heart, Trash2, Edit3 } from 'lucide-react';
import { Property, Inquiry } from '../types';

interface PropertyDetailsModalProps {
  property: Property | null;
  onClose: () => void;
  onInquirySubmit: (inquiry: Inquiry) => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

export default function PropertyDetailsModal({ property, onClose, onInquirySubmit, onDelete, onEdit }: PropertyDetailsModalProps) {
  if (!property) return null;

  const isStudio = import.meta.env.DEV || (typeof window !== 'undefined' && (
    !window.location.hostname.includes('ais-pre')
  ));

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // EMI Calculator State
  const [downPaymentPct, setDownPaymentPct] = useState(20); // 20% by default
  const [interestRate, setInterestRate] = useState(8.5); // 8.5% typical in India
  const [tenureYears, setTenureYears] = useState(20); // 20 years default

  // Inquiry Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState<'Buyer' | 'Agent' | 'Tenant'>('Buyer');
  const [message, setMessage] = useState(`Hi, I am interested in "${property.title}" in ${property.location}, ${property.city}. Please share more details.`);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // EMI Math Calculations
  const propertyPrice = property.price;
  const downPaymentAmt = Math.round((propertyPrice * downPaymentPct) / 100);
  const loanAmount = propertyPrice - downPaymentAmt;
  
  const monthlyRate = (interestRate / 12) / 100;
  const totalMonths = tenureYears * 12;
  
  const monthlyEMI = loanAmount > 0 
    ? Math.round(
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      )
    : 0;
    
  const totalPayment = monthlyEMI * totalMonths;
  const totalInterest = totalPayment - loanAmount;

  // Formatting large Indian currency values
  const formatIndianCurrency = (num: number) => {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} Lakh`;
    }
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    
    onInquirySubmit({
      propertyId: property.id,
      propertyName: property.title,
      name,
      email,
      phone,
      userType,
      message
    });
    
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
    }, 5000);
  };

  const handlePhoneCopy = () => {
    navigator.clipboard.writeText(property.agentPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto" id="property-modal-root">
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
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="relative w-full max-w-5xl rounded-3xl bg-[#f4f1ed] text-[#2c3d30] shadow-2xl overflow-hidden border border-[#d1d6cf]"
          >
            {/* Header / Actions bar */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              {isStudio && onEdit && !showDeleteConfirm && (
                <button
                  onClick={() => {
                    onEdit();
                    onClose();
                  }}
                  className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full sm:rounded-xl sm:px-3 sm:py-1.5 shadow-md flex items-center gap-1 text-xs font-semibold transition-all"
                  title="Edit Listing (Studio Only)"
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
              )}
              {isStudio && onDelete && (
                showDeleteConfirm ? (
                  <div className="flex items-center gap-1 bg-[#2c3d30] border border-[#d1d6cf]/50 p-1 rounded-full sm:rounded-xl shadow-md transition-all">
                    <span className="text-[10px] font-bold text-red-400 px-2 hidden sm:inline">Delete?</span>
                    <button
                      onClick={() => {
                        onDelete();
                        onClose();
                      }}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full sm:rounded-lg text-[10px] font-bold transition-all"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-2.5 py-1 bg-[#f4f1ed] text-[#2c3d30] hover:bg-white rounded-full sm:rounded-lg text-[10px] font-bold transition-all"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full sm:rounded-xl sm:px-3 sm:py-1.5 shadow-md flex items-center gap-1 text-xs font-semibold transition-all"
                    title="Delete Listing (Studio Only)"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                )
              )}
              <button 
                onClick={() => setFavorite(!favorite)}
                className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
                  favorite ? 'bg-red-500 text-white' : 'bg-white/85 text-[#2c3d30] hover:bg-white'
                } shadow-md`}
                title={favorite ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
              </button>
              <button 
                onClick={onClose}
                className="p-2.5 rounded-full bg-white/85 backdrop-blur-md text-[#2c3d30] hover:bg-white shadow-md transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split layout: Upper gallery & Info, Lower EMI & Contact */}
            <div className="overflow-y-auto max-h-[90vh]">
              {/* Media Gallery Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 bg-neutral-900 h-[300px] sm:h-[400px] relative">
                {/* Main image */}
                <div className="lg:col-span-8 h-full relative">
                  <img 
                    src={property.images[activeImageIndex] || property.image} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Indicators */}
                  <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium">
                    {activeImageIndex + 1} of {property.images.length} photos
                  </div>
                </div>

                {/* Sub-images / Sidebar thumbnails */}
                <div className="hidden lg:flex lg:col-span-4 flex-col gap-1 h-full overflow-y-auto bg-neutral-900 p-2">
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold p-1">Property Gallery</p>
                  <div className="grid grid-cols-2 gap-1.5 overflow-y-auto">
                    {property.images.map((img, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`h-24 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === activeImageIndex ? 'border-amber-500 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left & Center: Details & EMI */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Title & Pricing Block */}
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5 mb-3">
                      <span className="bg-[#2c3d30] text-[#f4f1ed] text-[10px] tracking-wider uppercase font-bold px-3 py-1 rounded-full">
                        {property.category === 'buy' ? 'For Sale' : property.category === 'rent' ? 'For Rent' : property.category === 'commercial' ? 'Commercial' : 'Plot/Land'}
                      </span>
                      {property.isVerified && (
                        <span className="bg-emerald-600 text-white text-[10px] tracking-wider uppercase font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <ShieldCheck className="w-3.5 h-3.5" /> Verified Listing
                        </span>
                      )}
                      {property.isReraApproved && (
                        <span className="bg-amber-700 text-white text-[10px] tracking-wider uppercase font-bold px-3 py-1 rounded-full">
                          RERA Approved
                        </span>
                      )}
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-light text-[#2c3d30] leading-tight mb-2">
                      {property.title}
                    </h1>

                    <div className="flex items-center gap-1.5 text-sm text-[#4f574d] mb-4">
                      <MapPin className="w-4 h-4 text-[#788575] flex-shrink-0" />
                      <span>{property.location}, {property.city}</span>
                    </div>

                    <div className="flex items-baseline gap-3 pt-3 border-t border-[#d1d6cf]">
                      <span className="text-3xl font-bold text-[#2c3d30]">{property.priceFormatted}</span>
                      <span className="text-xs text-[#788575] font-medium tracking-wide uppercase">
                        {property.category === 'rent' ? '/ Month' : `(₹${Math.round(property.price / property.areaValue).toLocaleString('en-IN')}/sq.ft)`}
                      </span>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="bg-white/70 backdrop-blur rounded-2xl p-5 border border-[#d1d6cf] grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-2 border-r border-[#d1d6cf]/50 last:border-0">
                      <p className="text-[10px] uppercase text-[#788575] tracking-widest mb-1">Super Area</p>
                      <p className="font-semibold text-sm text-[#2c3d30]">{property.area}</p>
                    </div>
                    <div className="text-center p-2 border-r border-[#d1d6cf]/50 last:border-0 sm:block hidden">
                      <p className="text-[10px] uppercase text-[#788575] tracking-widest mb-1">Configuration</p>
                      <p className="font-semibold text-sm text-[#2c3d30]">
                        {property.bedrooms ? `${property.bedrooms} BHK` : 'N/A'}
                      </p>
                    </div>
                    <div className="text-center p-2 border-r border-[#d1d6cf]/50 last:border-0">
                      <p className="text-[10px] uppercase text-[#788575] tracking-widest mb-1">Status</p>
                      <p className="font-semibold text-sm text-[#2c3d30]">{property.possessionStatus}</p>
                    </div>
                    <div className="text-center p-2 last:border-0">
                      <p className="text-[10px] uppercase text-[#788575] tracking-widest mb-1">Facing</p>
                      <p className="font-semibold text-sm text-[#2c3d30]">{property.facing || 'East'}</p>
                    </div>
                  </div>

                  {/* Property Description */}
                  <div>
                    <h2 className="text-lg font-semibold text-[#2c3d30] mb-3">About the Property</h2>
                    <p className="text-[#4f574d] text-sm leading-relaxed whitespace-pre-wrap">
                      {property.description}
                    </p>
                  </div>

                  {/* Specifications / Table */}
                  <div>
                    <h2 className="text-lg font-semibold text-[#2c3d30] mb-3">Key Details</h2>
                    <div className="bg-white/50 rounded-2xl border border-[#d1d6cf] overflow-hidden grid grid-cols-1 sm:grid-cols-2 text-sm">
                      <div className="flex justify-between p-4 border-b border-[#d1d6cf]/60 sm:border-r">
                        <span className="text-[#788575]">Property Type</span>
                        <span className="font-medium text-[#2c3d30]">{property.propertyType}</span>
                      </div>
                      <div className="flex justify-between p-4 border-b border-[#d1d6cf]/60">
                        <span className="text-[#788575]">Bathrooms</span>
                        <span className="font-medium text-[#2c3d30]">{property.bathrooms || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between p-4 border-b border-[#d1d6cf]/60 sm:border-r sm:border-b-0">
                        <span className="text-[#788575]">Floor Number</span>
                        <span className="font-medium text-[#2c3d30]">{property.floor || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between p-4 border-b border-[#d1d6cf]/60 sm:border-b-0">
                        <span className="text-[#788575]">Age of Property</span>
                        <span className="font-medium text-[#2c3d30]">{property.age || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between p-4 border-r border-[#d1d6cf]/60 sm:block hidden">
                        <span className="text-[#788575]">Brokerage</span>
                        <span className="font-medium text-[#2c3d30]">{property.brokerage}</span>
                      </div>
                      <div className="flex justify-between p-4 sm:block hidden">
                        <span className="text-[#788575]">Posted Date</span>
                        <span className="font-medium text-[#2c3d30]">{property.postedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h2 className="text-lg font-semibold text-[#2c3d30] mb-3">Amenities & Features</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2 bg-white/70 p-3 rounded-xl border border-[#d1d6cf] text-xs font-medium text-[#3a4f40]">
                          <div className="bg-[#2c3d30] text-white p-1 rounded-full">
                            <Check className="w-3 h-3" />
                          </div>
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 99acres-Style Home Loan EMI Calculator */}
                  {property.category !== 'rent' && (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#d1d6cf] shadow-sm space-y-6">
                      <div className="flex items-center gap-2 pb-4 border-b border-[#d1d6cf]">
                        <Landmark className="w-6 h-6 text-[#2c3d30]" />
                        <div>
                          <h2 className="text-xl font-light text-[#2c3d30]">Home Loan EMI Calculator</h2>
                          <p className="text-[10px] text-[#788575] uppercase tracking-wider">Plan your financial budget for this property</p>
                        </div>
                      </div>

                      {/* Math Summary Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-[#f4f1ed] p-4 rounded-2xl text-center border border-[#d1d6cf]/50">
                          <p className="text-[10px] uppercase text-[#788575] tracking-widest mb-1">Monthly EMI</p>
                          <p className="text-xl font-bold text-[#2c3d30]">₹{monthlyEMI.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="bg-[#f4f1ed] p-4 rounded-2xl text-center border border-[#d1d6cf]/50">
                          <p className="text-[10px] uppercase text-[#788575] tracking-widest mb-1">Loan Amount</p>
                          <p className="text-xl font-bold text-[#2c3d30]">{formatIndianCurrency(loanAmount)}</p>
                        </div>
                        <div className="bg-[#f4f1ed] p-4 rounded-2xl text-center border border-[#d1d6cf]/50">
                          <p className="text-[10px] uppercase text-[#788575] tracking-widest mb-1">Interest Payable</p>
                          <p className="text-xl font-bold text-[#2c3d30]">{formatIndianCurrency(totalInterest)}</p>
                        </div>
                      </div>

                      {/* Range Sliders */}
                      <div className="space-y-5">
                        {/* Down Payment Slider */}
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-2">
                            <span className="text-[#4f574d]">Down Payment ({downPaymentPct}%)</span>
                            <span className="text-[#2c3d30]">{formatIndianCurrency(downPaymentAmt)}</span>
                          </div>
                          <input 
                            type="range" 
                            min="10" 
                            max="80" 
                            value={downPaymentPct}
                            onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                            className="w-full accent-[#2c3d30] h-1.5 bg-[#e9e6e0] rounded-lg cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-[#788575] mt-1">
                            <span>Min 10% ({formatIndianCurrency(propertyPrice * 0.1)})</span>
                            <span>Max 80% ({formatIndianCurrency(propertyPrice * 0.8)})</span>
                          </div>
                        </div>

                        {/* Interest Rate Slider */}
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-2">
                            <span className="text-[#4f574d]">Interest Rate</span>
                            <span className="text-[#2c3d30]">{interestRate}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="6" 
                            max="15" 
                            step="0.1"
                            value={interestRate}
                            onChange={(e) => setInterestRate(Number(e.target.value))}
                            className="w-full accent-[#2c3d30] h-1.5 bg-[#e9e6e0] rounded-lg cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-[#788575] mt-1">
                            <span>6%</span>
                            <span>15%</span>
                          </div>
                        </div>

                        {/* Tenure Slider */}
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-2">
                            <span className="text-[#4f574d]">Loan Tenure</span>
                            <span className="text-[#2c3d30]">{tenureYears} Years</span>
                          </div>
                          <input 
                            type="range" 
                            min="5" 
                            max="30" 
                            value={tenureYears}
                            onChange={(e) => setTenureYears(Number(e.target.value))}
                            className="w-full accent-[#2c3d30] h-1.5 bg-[#e9e6e0] rounded-lg cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-[#788575] mt-1">
                            <span>5 Years</span>
                            <span>30 Years</span>
                          </div>
                        </div>
                      </div>

                      {/* Visual breakdown bars */}
                      <div className="pt-3">
                        <div className="flex text-xs font-semibold mb-1 justify-between">
                          <span>Principal amount ({formatIndianCurrency(loanAmount)})</span>
                          <span>Interest ({formatIndianCurrency(totalInterest)})</span>
                        </div>
                        <div className="h-3 w-full rounded-full overflow-hidden flex">
                          <div className="bg-[#2c3d30] h-full" style={{ width: `${(loanAmount / totalPayment) * 100}%` }} title="Principal" />
                          <div className="bg-[#c2b29c] h-full" style={{ width: `${(totalInterest / totalPayment) * 100}%` }} title="Interest" />
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-[10px] text-[#788575] font-semibold">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 bg-[#2c3d30] rounded-full" />
                            <span>Principal</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 bg-[#c2b29c] rounded-full" />
                            <span>Interest Payable</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Contact Builder/Broker Sidebar Card */}
                <div className="space-y-6 h-fit lg:sticky lg:top-24">
                  {/* Poster details */}
                  <div className="bg-white rounded-3xl p-6 border border-[#d1d6cf] shadow-sm">
                    <p className="text-[10px] uppercase tracking-wider text-[#788575] font-semibold mb-4">
                      Contact Owner / Agent
                    </p>
                    <div className="flex items-center gap-4 mb-6 pb-5 border-b border-[#d1d6cf]/60">
                      <img 
                        src={property.agentImage} 
                        alt={property.agentName} 
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#2c3d30]/20"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="font-bold text-[#2c3d30] text-base">{property.agentName}</h4>
                        <div className="flex items-center gap-1 text-xs text-[#788575] font-medium uppercase tracking-wide">
                          <span className="bg-[#2c3d30]/10 text-[#2c3d30] px-2 py-0.5 rounded-md font-semibold text-[10px]">
                            {property.postedBy}
                          </span>
                          <span>• Verified Agent</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <button 
                        onClick={handlePhoneCopy}
                        className={`w-full py-3.5 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border transition-all ${
                          copiedPhone 
                            ? 'bg-emerald-600 border-emerald-600 text-white' 
                            : 'bg-[#2c3d30] hover:bg-[#3d5442] border-[#2c3d30] text-white shadow-md'
                        }`}
                      >
                        <Phone className="w-4 h-4" />
                        {copiedPhone ? 'Phone Number Copied!' : 'Call Agent / Owner'}
                      </button>

                      <div className="text-center">
                        <span className="text-[11px] font-mono text-[#788575]">{property.agentPhone}</span>
                      </div>
                    </div>

                    {/* Quick message enquiry form */}
                    <form onSubmit={handleInquiry} className="space-y-4">
                      <p className="text-[11px] font-semibold text-[#4f574d] mb-1 text-center">Or, send direct message</p>
                      
                      <div>
                        <label className="sr-only">Your Name</label>
                        <input 
                          type="text" 
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name *"
                          className="w-full bg-[#f4f1ed] border border-[#d1d6cf] rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-[#2c3d30] focus:border-[#2c3d30] outline-none text-[#2c3d30]"
                        />
                      </div>

                      <div>
                        <label className="sr-only">Phone Number</label>
                        <input 
                          type="tel" 
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Phone Number *"
                          className="w-full bg-[#f4f1ed] border border-[#d1d6cf] rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-[#2c3d30] focus:border-[#2c3d30] outline-none text-[#2c3d30]"
                        />
                      </div>

                      <div>
                        <label className="sr-only">Email Address</label>
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email Address (Optional)"
                          className="w-full bg-[#f4f1ed] border border-[#d1d6cf] rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-[#2c3d30] focus:border-[#2c3d30] outline-none text-[#2c3d30]"
                        />
                      </div>

                      <div className="flex gap-2 text-[10px] font-semibold text-[#4f574d] justify-center py-1">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input 
                            type="radio" 
                            name="userType" 
                            checked={userType === 'Buyer'}
                            onChange={() => setUserType('Buyer')}
                            className="accent-[#2c3d30]"
                          />
                          <span>I'm a Buyer</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input 
                            type="radio" 
                            name="userType" 
                            checked={userType === 'Tenant'}
                            onChange={() => setUserType('Tenant')}
                            className="accent-[#2c3d30]"
                          />
                          <span>Tenant</span>
                        </label>
                      </div>

                      <div>
                        <label className="sr-only">Message</label>
                        <textarea 
                          rows={3}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Your message..."
                          className="w-full bg-[#f4f1ed] border border-[#d1d6cf] rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-[#2c3d30] focus:border-[#2c3d30] outline-none text-[#2c3d30] resize-none"
                        />
                      </div>

                      <button 
                        type="submit" 
                        className="w-full py-3 bg-white hover:bg-[#e9e6e0] border border-[#d1d6cf] text-[#2c3d30] rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
                      >
                        <Mail className="w-4 h-4" />
                        Send Email/SMS Inquiry
                      </button>

                      {isSubmitted && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-emerald-50 text-emerald-800 text-center rounded-xl text-[11px] font-medium border border-emerald-200"
                        >
                          🎉 Inquiry sent successfully! Our lead team & the listing builder will contact you via phone within 10 minutes.
                        </motion.div>
                      )}
                    </form>
                  </div>

                  {/* Trust Badge */}
                  <div className="bg-[#2c3d30] text-white p-5 rounded-3xl flex items-center gap-4 shadow-md">
                    <ShieldCheck className="w-10 h-10 text-amber-400 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-xs tracking-wider uppercase mb-1">RERA & Verification Trust</h5>
                      <p className="text-[10px] text-[#a5b5a2] leading-normal">
                        Every property on Camellia Properties undergoes our rigorous physical site audit & regulatory checks before being active.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
