import { Home, Building, Plus, MapPin, Phone, MessageSquare, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import logo from '../assets/images/camellia_logo_1783325269686.jpg';

interface NavbarProps {
  onPostPropertyClick: () => void;
  favoritesCount: number;
  onFavoritesClick: () => void;
}

export default function Navbar({ onPostPropertyClick, favoritesCount, onFavoritesClick }: NavbarProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <div className="bg-[#2c3d30] text-white/90 py-2 px-4 text-[9px] sm:text-[10px] uppercase tracking-widest flex justify-center md:justify-between items-center z-50 relative">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> Ajay: +91 97655 00002</span>
            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> Romal: +91 95640 00003</span>
            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> Navneet: +91 73550 00078</span>
          </div>
          <div className="hidden md:block text-[#a5b5a2] font-semibold">LUXURY HOMES • ESTATES • COMMERCIAL</div>
        </div>
      </div>
      <nav className="sticky top-0 left-0 right-0 z-40 bg-[#f4f1ed]/95 backdrop-blur-md border-b border-[#d1d6cf] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo Brand container */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img 
              src={logo} 
              alt="Camellia Properties Logo" 
              className="h-16 sm:h-20 w-auto rounded-lg shadow-md object-cover transition-transform duration-300 hover:scale-[1.02]" 
              referrerPolicy="no-referrer" 
            />
          </div>

          {/* Navigation link elements */}
          <div className="hidden md:flex items-center space-x-7 text-[11px] uppercase tracking-[0.15em] font-semibold text-[#4f574d]">
            <button 
              onClick={() => scrollToSection('about')} 
              className="hover:text-[#2c3d30] hover:translate-y-[-1px] transition-all cursor-pointer"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('services')} 
              className="hover:text-[#2c3d30] hover:translate-y-[-1px] transition-all cursor-pointer"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('properties')} 
              className="hover:text-[#2c3d30] hover:translate-y-[-1px] transition-all cursor-pointer"
            >
              Properties
            </button>

            {/* Favorites Wishlist Indicator */}
            <button 
              onClick={onFavoritesClick}
              className="relative hover:text-[#2c3d30] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>Wishlist</span>
              {favoritesCount > 0 && (
                <span className="absolute -top-3.5 -right-3.5 bg-red-500 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce shadow-md">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Custom Post Property Button styled after 99acres (Free, yellow/glowing alert badge) */}
            <button
              onClick={onPostPropertyClick}
              className="relative inline-flex items-center gap-1.5 bg-[#2c3d30] hover:bg-[#3d5442] text-white px-5 py-3 rounded-xl transition-all cursor-pointer shadow-md text-[10px] tracking-wider uppercase font-bold"
            >
              <Plus className="w-4 h-4" />
              Post Property
              <span className="absolute -top-2.5 -right-2 bg-amber-500 text-[#2c3d30] text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wide border-2 border-[#f4f1ed] shadow-md animate-pulse">
                FREE
              </span>
            </button>

            <button 
              onClick={() => scrollToSection('contact')} 
              className="border border-[#2c3d30] hover:bg-[#2c3d30]/5 text-[#2c3d30] px-5 py-3 rounded-xl transition-all cursor-pointer text-[10px] tracking-wider uppercase font-bold"
            >
              Contact Agent
            </button>
          </div>

          {/* Mobile Hamburguer trigger for Post property / Support */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onPostPropertyClick}
              className="inline-flex items-center gap-1 bg-[#2c3d30] text-white px-4 py-2.5 rounded-xl text-[10px] tracking-wider uppercase font-extrabold shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Post Free
            </button>
          </div>
        </div>
      </div>
    </nav>
    </>
  );
}
