import { Home, Instagram } from 'lucide-react';
import logo from '../assets/images/camellia_logo_1783325269686.jpg';

export default function Footer() {
  return (
    <footer className="bg-[#2c3d30] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <div className="flex items-center justify-center mb-6">
          <img src={logo} alt="Camellia Properties Logo" className="h-20 sm:h-24 w-auto rounded-xl shadow-lg object-cover border-2 border-white/20" referrerPolicy="no-referrer" />
        </div>
        <p className="text-xs text-[#788575] uppercase tracking-[0.2em] mb-4 max-w-md">
          LUXURY HOMES • ESTATES • COMMERCIAL
        </p>
        <div className="flex flex-col md:flex-row gap-4 mb-8 text-[11px] uppercase tracking-widest text-[#a5b5a2]">
          <span>Ajay Chawla: +91 97655 00002</span>
          <span className="hidden md:inline">•</span>
          <span>Romal Deep Singh: +91 95640 00003</span>
          <span className="hidden md:inline">•</span>
          <span>Navneet Chawla: +91 73550 00078</span>
        </div>
        <div className="flex gap-4 mb-10">
          <a href="https://instagram.com/camelliaproperties89" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#a5b5a2] hover:text-white transition-colors">
            <Instagram className="w-5 h-5" />
            <span>@camelliaproperties89</span>
          </a>
        </div>
        <div className="pt-8 w-full border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] uppercase tracking-widest text-[#78716c]">
            &copy; {new Date().getFullYear()} Camellia Properties. All rights reserved.
          </p>
          <div className="flex gap-6 text-[11px] uppercase tracking-widest text-[#78716c]">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
