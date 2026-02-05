import React from 'react';
import { Hammer, Construction } from 'lucide-react';

const PlaceholderModule = ({ title, description }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#0B101B] text-slate-400 p-8 text-center">
      <div className="bg-slate-900/50 p-6 rounded-full mb-6 border border-slate-800">
        <Construction className="w-12 h-12 text-slate-600" />
      </div>
      <h2 className="text-2xl font-semibold text-slate-200 mb-2">{title}</h2>
      <p className="max-w-md mx-auto text-slate-500 mb-8">
        {description || "This module is currently under development. Check back soon for updates."}
      </p>
    </div>
  );
};

export default PlaceholderModule;