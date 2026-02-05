import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Linkedin, Twitter, Facebook, Instagram, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#020617] border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#BFFF00] to-emerald-600 flex items-center justify-center shadow-[0_0_15px_rgba(191,255,0,0.3)] overflow-hidden">
                 <img alt="Footer Logo Icon" className="w-full h-full object-cover" src="https://horizons-cdn.hostinger.com/80504870-35f5-4fc9-ba7f-f8bc12cf282f/petrolord-symbol-512-4kVUt.png" />
              </div>
              <span className="text-xl font-bold text-white">Petrolord <span className="font-normal text-slate-300">NextGen</span></span>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The NextGen component of the digital operating system for the modern energy enterprise. Ensuring safety, compliance, and efficiency across all operations.
            </p>
            
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-slate-500 hover:text-[#BFFF00] transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="text-slate-500 hover:text-[#BFFF00] transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-slate-500 hover:text-[#BFFF00] transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-slate-500 hover:text-[#BFFF00] transition-colors"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Column 2: Program */}
          <div className="lg:col-span-2 lg:col-start-6 space-y-6">
            <span className="text-white font-semibold text-base block mb-2">Program</span>
            <ul className="space-y-3">
              <li><Link to="/university-onboarding" className="text-sm text-slate-400 hover:text-[#BFFF00] transition-colors">Apply Now</Link></li>
              <li><a href="#process" className="text-sm text-slate-400 hover:text-[#BFFF00] transition-colors">How It Works</a></li>
              <li><a href="#requirements" className="text-sm text-slate-400 hover:text-[#BFFF00] transition-colors">Requirements</a></li>
              <li><Link to="/curriculum" className="text-sm text-slate-400 hover:text-[#BFFF00] transition-colors">Curriculum</Link></li> {/* Assuming this route exists */}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="lg:col-span-2 space-y-6">
            <span className="text-white font-semibold text-base block mb-2">Resources</span>
            <ul className="space-y-3">
              <li><Link to="/support" className="text-sm text-slate-400 hover:text-[#BFFF00] transition-colors">Student Support</Link></li> {/* Assuming this route exists */}
              <li><Link to="/ambassadors" className="text-sm text-slate-400 hover:text-[#BFFF00] transition-colors">Ambassadors</Link></li> {/* Assuming this route exists */}
              <li><Link to="/documentation" className="text-sm text-slate-400 hover:text-[#BFFF00] transition-colors">Documentation</Link></li> {/* Assuming this route exists */}
              <li><Link to="/community" className="text-sm text-slate-400 hover:text-[#BFFF00] transition-colors">Community</Link></li> {/* Assuming this route exists */}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="lg:col-span-3 space-y-6">
            <span className="text-white font-semibold text-base block mb-2">Contact Support</span>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#BFFF00] mt-0.5" />
                <a href="mailto:education@petrolord.com" className="text-sm text-slate-400 hover:text-[#BFFF00] transition-colors">
                  education@petrolord.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#BFFF00] mt-0.5 shrink-0" />
                <span className="text-sm text-slate-400 leading-relaxed">
                  8 The Providence Street,<br />
                  Lekki Phase 1, Lagos,<br />
                  Nigeria
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-xs text-slate-500 order-2 md:order-1">
            &copy; 2025 Lordsway Energy. All Rights Reserved.
          </span>
          <div className="flex items-center gap-6 order-1 md:order-2">
            <Link to="/privacy-policy" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link to="/academic-integrity" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Academic Integrity</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;